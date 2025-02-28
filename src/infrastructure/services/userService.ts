import * as bcrypt from "bcrypt";
import { Resend } from "resend";
import { supabase } from "../../../supabase/supabaseClient";
import { db } from "../base_de_donne/db";
import { utilisateur, adresse, pharmacien, pharmacie, otpCodes } from "../base_de_donne/schema";
import { eq, and } from "drizzle-orm";

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export class UserService {
  static async register(
    utilisateurData: any,
    adresseData: any,
    pharmacienData: any,
    pharmacieData: any
  ) {
    try {
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(utilisateurData.password, 10);

      // Register user in Supabase (Supabase hashes the password internally)
      const { data: user, error: userError } = await supabase.auth.signUp({
        email: utilisateurData.email,
        password: utilisateurData.password, // Supabase uses this directly
      });

      if (userError) throw new Error(userError.message);

      // Insert user into the database with hashed password and image
      const newUser = await db
        .insert(utilisateur)
        .values({
          ...utilisateurData,
          password: hashedPassword, // Store hashed password in your table
          image: utilisateurData.image || null, // Ensure image is included
          supabase_user_id: user.user?.id,
        })
        .returning({ id: utilisateur.id });

      adresseData.utilisateur_id = newUser[0].id;
      const newAdresse = await db
        .insert(adresse)
        .values(adresseData)
        .returning({ id: adresse.id });

      pharmacienData.utilisateur_id = newUser[0].id;
      const newPharmacien = await db
        .insert(pharmacien)
        .values(pharmacienData)
        .returning({ utilisateur_id: pharmacien.utilisateur_id });

      pharmacieData.pharmacien_id = newPharmacien[0].utilisateur_id;
      pharmacieData.adresse_id = newAdresse[0].id;
      const newPharmacie = await db
        .insert(pharmacie)
        .values(pharmacieData)
        .returning({ id: pharmacie.id });

      return {
        user: newUser[0],
        adresse: newAdresse[0],
        pharmacien: newPharmacien[0],
        pharmacie: newPharmacie[0],
        message: "User registered successfully. Please check your email to confirm your registration.",
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  static async login(email: string, password: string) {
    try {
      const { data: session, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw new Error(error.message);

      if (session?.user?.email_confirmed_at) {
        return { session, message: "User logged in successfully." };
      } else {
        return { message: "Please confirm your email before logging in." };
      }
    } catch (error) {
      throw new Error(`Login failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  static async getUser(userId: number) {
    try {
      const user = await db.query.utilisateur.findFirst({
        where: eq(utilisateur.id, userId),
      });

      if (!user) throw new Error("User not found.");

      return user;
    } catch (error) {
      throw new Error(`Failed to get user: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  static async validateUser(userId: number) {
    try {
      const updated = await db
        .update(pharmacien)
        .set({ etat: true })
        .where(eq(pharmacien.utilisateur_id, userId))
        .returning({ utilisateur_id: pharmacien.utilisateur_id, etat: pharmacien.etat });

      if (!updated.length) throw new Error("User not found or already validated.");

      return { message: "User validated successfully.", pharmacien: updated[0] };
    } catch (error) {
      throw new Error(`Failed to validate user: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  static async getAllUsers() {
    try {
      const users = await db.query.utilisateur.findMany({});
      return users;
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  static async editProfile(
    userId: number,
    utilisateurData: Partial<any>,
    adresseData?: Partial<any>,
    pharmacienData?: Partial<any>,
    pharmacieData?: Partial<any>
  ) {
    try {
      const updatedUser = await db
        .update(utilisateur)
        .set({ ...utilisateurData })
        .where(eq(utilisateur.id, userId))
        .returning({ id: utilisateur.id });

      let updatedAdresse = null;
      if (adresseData) {
        updatedAdresse = await db
          .update(adresse)
          .set({ ...adresseData })
          .where(eq(adresse.utilisateur_id, userId))
          .returning({ id: adresse.id });
      }

      let updatedPharmacien = null;
      if (pharmacienData) {
        updatedPharmacien = await db
          .update(pharmacien)
          .set({ ...pharmacienData })
          .where(eq(pharmacien.utilisateur_id, userId))
          .returning({ utilisateur_id: pharmacien.utilisateur_id });
      }

      let updatedPharmacie = null;
      if (pharmacieData) {
        updatedPharmacie = await db
          .update(pharmacie)
          .set({ ...pharmacieData })
          .where(eq(pharmacie.pharmacien_id, userId))
          .returning({ id: pharmacie.id });
      }

      return {
        user: updatedUser[0],
        adresse: updatedAdresse ? updatedAdresse[0] : null,
        pharmacien: updatedPharmacien ? updatedPharmacien[0] : null,
        pharmacie: updatedPharmacie ? updatedPharmacie[0] : null,
        message: "Profile updated successfully.",
      };
    } catch (error) {
      throw new Error(`Failed to update profile: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  static async generateResetOtp(email: string) {
    try {
      const user = await db.query.utilisateur.findFirst({
        where: eq(utilisateur.email, email),
      });
      if (!user) throw new Error("User with this email does not exist.");

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

      await db.insert(otpCodes).values({
        utilisateur_id: user.id,
        otp,
        expires_at: expiresAt,
      });

      const { error } = await resend.emails.send({
        from: "onboarding@resend.dev", 
        to: email,
        subject: "Password Reset OTP",
        html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
      });

      if (error) throw new Error(`Resend email failed: ${error.message}`);

      return { message: "OTP sent to your email.", userId: user.id };
    } catch (error) {
      throw new Error(`Failed to generate OTP: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  static async resetPassword(userId: number, otp: string, newPassword: string) {
    try {
      const otpRecord = await db.query.otpCodes.findFirst({
        where: and(eq(otpCodes.utilisateur_id, userId), eq(otpCodes.otp, otp)),
        orderBy: (otpCodes, { desc }) => [desc(otpCodes.created_at)],
      });
  
      if (!otpRecord) {
        // Check for any OTP records for this user and increment attempts
        const latestOtp = await db.query.otpCodes.findFirst({
          where: eq(otpCodes.utilisateur_id, userId),
          orderBy: (otpCodes, { desc }) => [desc(otpCodes.created_at)],
        });
  
        if (latestOtp) {
          const newAttempts = (latestOtp.attempts || 0) + 1;
          await db
            .update(otpCodes)
            .set({ attempts: newAttempts })
            .where(eq(otpCodes.id, latestOtp.id));
  
          if (newAttempts >= 3) {
            await db.delete(otpCodes).where(eq(otpCodes.id, latestOtp.id));
            throw new Error(
              "Too many incorrect attempts. The OTP has been invalidated. Please request a new one."
            );
          }
        }
  
        throw new Error(
          "The OTP you entered is incorrect. Please double-check the code or request a new one."
        );
      }
  
      if (new Date() > otpRecord.expires_at) {
        await db.delete(otpCodes).where(eq(otpCodes.id, otpRecord.id));
        throw new Error("Your OTP has expired. Please request a new one to continue.");
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      const updatedUser = await db
        .update(utilisateur)
        .set({ password: hashedPassword })
        .where(eq(utilisateur.id, userId))
        .returning({ supabase_user_id: utilisateur.supabase_user_id });
  
      if (!updatedUser[0]?.supabase_user_id) throw new Error("Supabase user ID not found.");
  
      const { error } = await supabase.auth.admin.updateUserById(updatedUser[0].supabase_user_id, {
        password: newPassword,
      });
      if (error) throw new Error(`Supabase Auth update failed: ${error.message}`);
  
      await db.delete(otpCodes).where(eq(otpCodes.id, otpRecord.id));
  
      return { message: "Password reset successfully." };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to reset password: Unknown error"
      );
    }
    
   }
   static async deleteAccount(userId: number) {
    try {
      // Fetch the user to get the supabase_user_id
      const user = await db.query.utilisateur.findFirst({
        where: eq(utilisateur.id, userId),
      });
      if (!user) throw new Error("User not found.");

      // Delete related data from your tables
      // Note: otpCodes will cascade delete due to onDelete: "cascade"
      await db.delete(pharmacie).where(eq(pharmacie.pharmacien_id, userId));
      await db.delete(pharmacien).where(eq(pharmacien.utilisateur_id, userId));
      await db.delete(adresse).where(eq(adresse.utilisateur_id, userId));
      await db.delete(utilisateur).where(eq(utilisateur.id, userId));

      // Delete the user from Supabase Auth
      if (user.supabase_user_id) {
        const { error } = await supabase.auth.admin.deleteUser(user.supabase_user_id);
        if (error) throw new Error(`Supabase Auth deletion failed: ${error.message}`);
      }

      return { message: "Account deleted successfully." };
    } catch (error) {
      throw new Error(`Failed to delete account: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
   
}
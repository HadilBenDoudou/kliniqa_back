// src/services/UserService.ts
import * as bcrypt from "bcrypt";
import { supabase } from "../../../supabase/supabaseClient";
import { db } from "../base_de_donne/db";
import { utilisateur, adresse, pharmacien, pharmacie,otpCodes } from "../base_de_donne/schema";
import { eq, and } from "drizzle-orm";
export class UserService {
  static async register(utilisateurData: any, adresseData: any, pharmacienData: any, pharmacieData: any) {
    try {
      // Register user in Supabase
      const { data: user, error: userError } = await supabase.auth.signUp({
        email: utilisateurData.email,
        password: utilisateurData.password,
      });

      if (userError) throw new Error(userError.message);

      // Insert user into the database
      const newUser = await db.insert(utilisateur).values({
        ...utilisateurData,
        supabase_user_id: user.user?.id,
      }).returning({ id: utilisateur.id });

      // Insert related data (address, pharmacist, pharmacy)
      adresseData.utilisateur_id = newUser[0].id;
      const newAdresse = await db.insert(adresse).values(adresseData).returning({ id: adresse.id });

      pharmacienData.utilisateur_id = newUser[0].id;
      const newPharmacien = await db.insert(pharmacien).values(pharmacienData).returning({ utilisateur_id: pharmacien.utilisateur_id });

      pharmacieData.pharmacien_id = newPharmacien[0].utilisateur_id;
      pharmacieData.adresse_id = newAdresse[0].id;
      const newPharmacie = await db.insert(pharmacie).values(pharmacieData).returning({ id: pharmacie.id });

      return {
        user: newUser[0],
        adresse: newAdresse[0],
        pharmacien: newPharmacien[0],
        pharmacie: newPharmacie[0],
        message: 'User registered successfully. Please check your email to confirm your registration.',
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async login(email: string, password: string) {
    try {
      const { data: session, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw new Error(error.message);

      if (session?.user?.email_confirmed_at) {
        return { session, message: 'User logged in successfully.' };
      } else {
        return { message: 'Please confirm your email before logging in.' };
      }
    } catch (error) {
      throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  // Get user by ID, including related adresse, pharmacien, and pharmacie
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

  // Validate user (admin updates `etat` to true)
  static async validateUser(userId: number) {
    try {
      const updated = await db.update(pharmacien)
        .set({ etat: true })
        .where(eq(pharmacien.utilisateur_id, userId))
        .returning({ utilisateur_id: pharmacien.utilisateur_id, etat: pharmacien.etat });

      if (!updated.length) throw new Error("User not found or already validated.");

      return { message: "User validated successfully.", pharmacien: updated[0] };
    } catch (error) {
      throw new Error(`Failed to validate user: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  // Get all users, including related adresse, pharmacien, and pharmacie
  static async getAllUsers() {
    try {
      const users = await db.query.utilisateur.findMany({

      });

      return users;
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
   // Edit profile so the user can update their account
   static async editProfile(
    userId: number,
    utilisateurData: Partial<any>,
    adresseData?: Partial<any>,
    pharmacienData?: Partial<any>,
    pharmacieData?: Partial<any>
  ) {
    try {
      // Update main user data
      const updatedUser = await db.update(utilisateur)
        .set({ ...utilisateurData })
        .where(eq(utilisateur.id, userId))
        .returning({ id: utilisateur.id });

      // Update address data if provided
      let updatedAdresse = null;
      if (adresseData) {
        updatedAdresse = await db.update(adresse)
          .set({ ...adresseData })
          .where(eq(adresse.utilisateur_id, userId))
          .returning({ id: adresse.id });
      }

      // Update pharmacist data if provided
      let updatedPharmacien = null;
      if (pharmacienData) {
        updatedPharmacien = await db.update(pharmacien)
          .set({ ...pharmacienData })
          .where(eq(pharmacien.utilisateur_id, userId))
          .returning({ utilisateur_id: pharmacien.utilisateur_id });
      }

      // Update pharmacy data if provided (assuming pharmacie.pharmacien_id === userId)
      let updatedPharmacie = null;
      if (pharmacieData) {
        updatedPharmacie = await db.update(pharmacie)
          .set({ ...pharmacieData })
          .where(eq(pharmacie.pharmacien_id, userId))
          .returning({ id: pharmacie.id });
      }

      return {
        user: updatedUser[0],
        adresse: updatedAdresse ? updatedAdresse[0] : null,
        pharmacien: updatedPharmacien ? updatedPharmacien[0] : null,
        pharmacie: updatedPharmacie ? updatedPharmacie[0] : null,
        message: 'Profile updated successfully.',
      };
    } catch (error) {
      throw new Error(`Failed to update profile: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

// Request OTP for password reset
static async requestPasswordReset(email: string) {
  try {
    // Check if user exists
    const user = await db
      .select()
      .from(utilisateur)
      .where(eq(utilisateur.email, email))
      .limit(1);

    if (!user.length) {
      throw new Error("User not found.");
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration

    // Store OTP in otpCodes table
    await db.insert(otpCodes).values({
      utilisateur_id: user[0].id,
      otp,
      expires_at: expiresAt,
    });

    // Send OTP via Supabase email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3001/password-reset-success', // Replace with your redirect URL
    });

    if (error) {
      throw new Error("Failed to send OTP email.");
    }

    return { message: "OTP sent to your email." };
  } catch (error) {
    throw new Error(`Password reset request failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Verify OTP and reset password
static async resetPassword(email: string, otp: string, newPassword: string) {
  try {
    // Find user
    const user = await db
      .select()
      .from(utilisateur)
      .where(eq(utilisateur.email, email))
      .limit(1);

    if (!user.length) {
      throw new Error("User not found.");
    }

    // Verify OTP
    const otpRecord = await db
      .select()
      .from(otpCodes)
      .where(and(eq(otpCodes.utilisateur_id, user[0].id), eq(otpCodes.otp, otp)))
      .limit(1);

    if (!otpRecord.length) {
      throw new Error("Invalid OTP.");
    }

    const now = new Date();
    if (otpRecord[0].expires_at < now) {
      throw new Error("OTP has expired.");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in utilisateur table
    await db
      .update(utilisateur)
      .set({ password: hashedPassword, updated_at: new Date() })
      .where(eq(utilisateur.id, user[0].id));

    // Delete used OTP
    await db.delete(otpCodes).where(eq(otpCodes.id, otpRecord[0].id));

    // Update Supabase auth password (if using Supabase auth)
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error("Failed to update Supabase auth password.");
    }

    return { message: "Password reset successfully." };
  } catch (error) {
    throw new Error(`Password reset failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}}
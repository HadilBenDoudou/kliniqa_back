// src/services/UserService.ts
import { supabase } from "../../../supabase/supabaseClient";
import { db } from "../base_de_donne/db";
import { utilisateur, adresse, pharmacien, pharmacie } from "../base_de_donne/schema";

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
}

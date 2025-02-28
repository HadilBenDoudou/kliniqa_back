// middleware/authMiddleware.ts
import type{ Context, Next } from "hono";
import { supabase } from "../../supabase/supabaseClient";
import { db } from "../infrastructure/base_de_donne/db"; // Neon DB
import { utilisateur } from "../infrastructure/base_de_donne/schema"; // Import utilisateur schema
import { eq } from "drizzle-orm";

// Define Supabase User type (from auth.users)
interface SupabaseUser {
  id: string; 
  email: string;
}

// Define Neon User type (from utilisateur table in Neon)
interface NeonUser {
  id: number; 
  supabase_user_id: string | null; 
  nom: string;
  prenom: string;
  telephone: string;
  image: string | null;
  role: string; 
  created_at: Date | null;
  updated_at: Date | null;
  email: string; 
}

// Extend Hono's ContextVariableMap with NeonUser (since we use Neon data in controllers)
declare module "hono" {
  interface ContextVariableMap {
    authenticatedUser: NeonUser;
  }
}

export const authMiddleware = async (c: Context, next: Next) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return c.json({ success: false, error: "Missing authentication token" }, 401);
  }

  try {
    // Validate token with Supabase
    const { data, error } = await supabase.auth.getUser(token);
    console.log("Supabase User:", data, "Error:", error);
    if (error || !data.user) {
      return c.json({ success: false, error: "Invalid or expired token" }, 401);
    }

    // Get Supabase user data
    const supabaseUser: SupabaseUser = {
      id: data.user.id,
      email: data.user.email || "",
    };

    // Query Neon utilisateur table using Supabase ID
    const neonUserData = await db
      .select()
      .from(utilisateur)
      .where(eq(utilisateur.supabase_user_id, supabaseUser.id))
      .limit(1);

    console.log("Neon Utilisateur Data:", neonUserData);

    if (!neonUserData || neonUserData.length === 0) {
      return c.json({ success: false, error: "Utilisateur introuvable" }, 401);
    }

    // Merge Supabase and Neon data, using Neon’s id (number) as the primary ID for authenticatedUser
    const neonUser: NeonUser = {
      ...neonUserData[0],
      email: supabaseUser.email, // Ensure email consistency
      supabase_user_id: neonUserData[0].supabase_user_id || "", // Ensure supabase_user_id is a string
    };

    // Check if the user is a pharmacist using the role from utilisateur
    if (neonUser.role !== "pharmacien") {
      return c.json(
        { success: false, error: "Seuls les pharmaciens peuvent accéder à cette ressource" },
        403
      );
    }

    // Set the authenticated user in the context with Neon’s data
    c.set("authenticatedUser", neonUser);
    await next();
  } catch (error) {
    console.error("Erreur dans le middleware d'authentification:", error);
    return c.json(
      { success: false, error: "Erreur d'authentification interne" },
      500
    );
  }
};
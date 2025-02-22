import { drizzle } from "drizzle-orm/neon-http";  // Utilisation du driver Neon
import { neon } from "@neondatabase/serverless";  // Connexion au serveur Neon
import * as schema from "./schema";  // Import de votre schéma
// Aucune importation de `pg` nécessaire ici car vous utilisez `neon-http` pour Neon

// Connexion à la base de données Neon avec la chaîne d'URL d'environnement
const sql = neon(process.env.DATABASE_URL!);

// Initialisation de Drizzle ORM avec le client Neon et le schéma
export const db = drizzle(sql, { schema });

import { pgTable, serial, varchar, bigint, boolean, timestamp, integer, doublePrecision, jsonb } from "drizzle-orm/pg-core";

// Table Utilisateur
export const utilisateur = pgTable("utilisateur", {
  id: serial("id").primaryKey(),
  supabase_user_id: varchar("supabase_user_id", { length: 255 }).unique(), 
  nom: varchar("nom", { length: 255 }).notNull(),
  prenom: varchar("prenom", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  telephone: varchar("telephone", { length: 20 }).notNull(),
  image: varchar("image", { length: 500 }),
  role: varchar("role", { length: 50 }).notNull(), 
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at"),
});

// Table Adresse
export const adresse = pgTable("adresse", {
  id: serial("id").primaryKey(),
  num_street: varchar("num_street", { length: 50 }).notNull(),
  street: varchar("street", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  postal_code: varchar("postal_code", { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  longitude: varchar("longitude", { length: 50 }),
  latitude: varchar("latitude", { length: 50 }),
  utilisateur_id: bigint("utilisateur_id", { mode: "number" })
    .references(() => utilisateur.id, { onDelete: "cascade" }) 
    .unique()
    .notNull(),
});

// Table Pharmacien
export const pharmacien = pgTable("pharmacien", {
  utilisateur_id: bigint("utilisateur_id", { mode: "number" })
    .references(() => utilisateur.id, { onDelete: "cascade" })
    .primaryKey()
    .notNull(),
  cartePro: varchar("cartePro", { length: 255 }).notNull(),
  diplome: varchar("diplome", { length: 255 }).notNull(),
  assurancePro: varchar("assurancePro", { length: 255 }),
  etat: boolean("etat").default(false),
});

// Table Pharmacie
export const pharmacie = pgTable("pharmacie", {
  id: serial("id").primaryKey(),
  nom: varchar("nom", { length: 255 }).notNull(),
  docPermis: varchar("docPermis", { length: 500 }).notNull(),
  docAutorisation: varchar("docAutorisation", { length: 500 }).notNull(),
  adresse_id: bigint("adresse_id", { mode: "number" })
    .references(() => adresse.id, { onDelete: "cascade" })
    .notNull(),
  pharmacien_id: bigint("pharmacien_id", { mode: "number" })
    .references(() => pharmacien.utilisateur_id, { onDelete: "cascade" })
    .notNull(),
});

// Table OTP Codes
export const otpCodes = pgTable("otp_codes", {
  id: serial("id").primaryKey(),
  utilisateur_id: bigint("utilisateur_id", { mode: "number" })
    .references(() => utilisateur.id, { onDelete: "cascade" }) 
    .notNull(),
  attempts: integer("attempts").default(0),
  otp: varchar("otp", { length: 6 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  expires_at: timestamp("expires_at").notNull(),
});

// Table Categorie (updated to reference pharmacien)
export const categorie = pgTable("categorie", {
  id_categorie: serial("id_categorie").primaryKey(),
  nom: varchar("nom", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  utilisateur_id: integer("utilisateur_id")
    .references(() => pharmacien.utilisateur_id, { onDelete: "cascade" }) // Changed to pharmacien
    .notNull(),
});

// Table SubCategorie (updated to reference pharmacien)
export const subCategorie = pgTable("sub_categorie", {
  id_sub_categorie: serial("id_sub_categorie").primaryKey(),
  nom: varchar("nom", { length: 255 }).notNull(),
  parent_id: integer("parent_id")
    .references(() => categorie.id_categorie, { onDelete: "cascade" })
    .notNull(),
  utilisateur_id: integer("utilisateur_id")
    .references(() => pharmacien.utilisateur_id, { onDelete: "cascade" }) // Changed to pharmacien
    .notNull(),
});

// Table Produit (updated to reference pharmacien)
export const produit = pgTable("produit", {
  id: serial("id").primaryKey(),
  nom: varchar("nom", { length: 255 }).notNull(),
  ref: varchar("ref", { length: 255 }),
  desc: varchar("desc", { length: 255 }),
  stock: bigint("stock", { mode: "number" }),
  prix: doublePrecision("prix"),
  image: varchar("image", { length: 500 }),
  id_categorie: bigint("id_categorie", { mode: "number" })
    .references(() => categorie.id_categorie, { onDelete: "cascade" })
    .notNull(),
  utilisateur_id: bigint("utilisateur_id", { mode: "number" })
    .references(() => pharmacien.utilisateur_id, { onDelete: "cascade" }) // Changed to pharmacien
    .notNull(),
});

// Table DetailProduit (updated to reference pharmacien)
export const detailProduit = pgTable("detail_produit", {
  id_detail: serial("id_detail").primaryKey(),
  id_produit: bigint("id_produit", { mode: "number" })
    .references(() => produit.id, { onDelete: "cascade" })
    .notNull(),
  id_categorie: bigint("id_categorie", { mode: "number" })
    .references(() => categorie.id_categorie, { onDelete: "cascade" })
    .notNull(),
  categorie_specific_attributes: jsonb("categorie_specific_attributes"),
  utilisateur_id: bigint("utilisateur_id", { mode: "number" })
    .references(() => pharmacien.utilisateur_id, { onDelete: "cascade" }) // Changed to pharmacien
    .notNull(),
});
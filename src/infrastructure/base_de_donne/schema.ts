import { pgTable, serial, varchar, bigint, boolean, timestamp } from "drizzle-orm/pg-core";

// Table Utilisateur
export const utilisateur = pgTable("utilisateur", {
  id: serial("id").primaryKey(),
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
    .references(() => utilisateur.id)
    .unique()
    .notNull(),
});

// Table Pharmacien
export const pharmacien = pgTable("pharmacien", {
  utilisateur_id: bigint("utilisateur_id", { mode: "number" })
    .references(() => utilisateur.id)
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
    .references(() => adresse.id)
    .notNull(),
  pharmacien_id: bigint("pharmacien_id", { mode: "number" })
    .references(() => pharmacien.utilisateur_id)
    .notNull(),
});

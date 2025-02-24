import { z } from "zod";

export const passwordSchema = z.string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .regex(/[A-Z]/, "Doit contenir une majuscule")
  .regex(/[a-z]/, "Doit contenir une minuscule")
  .regex(/\d/, "Doit contenir un chiffre")
  .regex(/[\W_]/, "Doit contenir un caractère spécial");

export const adresseSchema = z.object({
  num_street: z.string().min(1, "Numéro de rue requis"),
  street: z.string().min(1, "Nom de rue requis"),
  city: z.string().min(1, "Ville requise"),
  postal_code: z.string().min(1, "Code postal requis"),
  country: z.string().min(1, "Pays requis"),
  longitude: z.string().optional(),
  latitude: z.string().optional(),
});

export const pharmacienSchema = z.object({
  utilisateur_id: z.number().optional(), // Rendu optionnel car généré après inscription
  cartePro: z.string().min(5, "Carte professionnelle requise"),
  diplome: z.string().min(5, "Diplôme requis"),
  assurancePro: z.string().optional(),
});

export const pharmacieValidator = z.object({
  nom: z.string().min(2, "Le nom de la pharmacie doit contenir au moins 2 caractères"),
  docPermis: z.string().min(5, "Le document du permis est requis"),
  docAutorisation: z.string().min(5, "Le document d'autorisation est requis"),
  adresse_id: z.number().optional(), // Rendu optionnel car généré après l'insertion de l'adresse
  pharmacien_id: z.number().optional(), // Rendu optionnel car généré après l'insertion du pharmacien
});

export const signupSchema = z.object({
  utilisateur: z.object({
    email: z.string().email({ message: "Email invalide" }).min(1),
    password: passwordSchema,
    nom: z.string().min(2),
    prenom: z.string().min(2),
    telephone: z.string().regex(/^\d+$/, "Numéro invalide").min(8).max(15),
    image: z.string().optional(),
    role: z.enum(["utilisateur", "pharmacien"]),
  }),
  adresse: adresseSchema.optional(),
  pharmacien: pharmacienSchema.optional(),
  pharmacie: pharmacieValidator.optional(),
});

export const signInSchema = z.object({
  email: z.string().email().min(1),
  password: passwordSchema,
});
// Schema for password reset request
export const resetRequestSchema = z.object({
  email: z.string().email(),
});

// Schema for password reset verification
export const resetVerifySchema = z.object({
  userId: z.number(),
  otp: z.string().length(6),
  newPassword: passwordSchema,
});
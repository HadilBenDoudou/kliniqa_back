import { z } from "zod";

// validators/ProduitValidator.ts

// validators/ProduitValidator.ts

export const productSchema = z.object({
  nom: z.string().min(3, "Le nom du produit doit comporter au moins 3 caractères"),
  ref: z.string().optional(),
  desc: z.string().optional(),
  prix: z.number().positive("Le prix doit être un nombre positif").optional(),
  stock: z.number().int().nonnegative("Le stock doit être un entier non négatif").optional(),
  id_categorie: z.number().int().positive("L'ID de la catégorie doit être un entier positif"),
  image: z.string().url("URL de l'image invalide").optional(),
});
// validators/ProduitValidator.ts
export const productDetailSchema = z.object({
    id_produit: z.number().int().positive("ID produit requis"),
    id_categorie: z.number().int().positive("ID catégorie requis"),
    categorie_specific_attributes: z.record(z.any()),
  });

// validators/ProduitValidator.ts
export const categorySchema = z.object({
    nom: z.string().min(3, "Le nom doit comporter au moins 3 caractères"),
    description: z.string().optional(),
    // No utilisateur_id here; it’s set by middleware
  });
  
  export const subCategorySchema = z.object({
    nom: z.string().min(3, "Le nom doit comporter au moins 3 caractères"),
    parent_id: z.number().int().positive("ID parent requis"),
    // No utilisateur_id here; it’s set by middleware
  });

export type ProductSchemaType = z.infer<typeof productSchema>;
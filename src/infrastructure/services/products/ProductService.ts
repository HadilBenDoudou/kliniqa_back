import { db } from "../../base_de_donne/db";
import { produit } from "../../base_de_donne/schema";

export type ProductData = {
  nom: string;
  ref?: string;
  desc?: string;
  stock?: number;
  prix?: number;
  image?: string;
  id_categorie: number;
  utilisateur_id: number;
};

export const addProduct = async (productData: ProductData) => {
  try {
    const [newProduct] = await db.insert(produit).values(productData).returning();
    return newProduct;
  } catch (error) {
    throw new Error(`Error adding product: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

import { db } from "../../base_de_donne/db";
import { detailProduit } from "../../base_de_donne/schema";

export const addProductDetail = async (detailData: {
  id_produit: number;
  id_categorie: number;
  categorie_specific_attributes: Record<string, any>;
  utilisateur_id: number;
}) => {
  try {
    const [newDetail] = await db.insert(detailProduit).values(detailData).returning();
    return newDetail;
  } catch (error) {
    throw new Error(`Error adding product detail: ${error instanceof Error ? error.message : 'Unknown error'}}`);
  }
};

import { addProductDetail } from "../../../infrastructure/services/products/detailService";

export const createProductDetail = async (detailData: {
  id_produit: number;
  id_categorie: number;
  categorie_specific_attributes: Record<string, any>;
  utilisateur_id: number;
}) => {
  if (!detailData.id_produit || !detailData.id_categorie || !detailData.utilisateur_id) {
    throw new Error("Missing required fields: id_produit, id_categorie, utilisateur_id");
  }

  return await addProductDetail(detailData);
};

import { addProduct } from "../../../infrastructure/services/products/ProductService";
import type { ProductData } from "../../../infrastructure/services/products/ProductService";
export const createProduct = async (productData: ProductData) => {
  if (!productData.nom || !productData.id_categorie || !productData.utilisateur_id) {
    throw new Error("Missing required fields: nom, id_categorie, utilisateur_id");
  }

  return addProduct(productData);
};

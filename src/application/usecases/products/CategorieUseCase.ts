import { addCategory, addSubCategory } from "../../../infrastructure/services/products/categorieService";

export const createCategory = async (categoryData: {
  nom: string;
  description?: string;
  utilisateur_id: number;
}) => {
  if (!categoryData.nom || !categoryData.utilisateur_id) {
    throw new Error("Missing required fields: nom, utilisateur_id");
  }

  return await addCategory(categoryData);
};

export const createSubCategory = async (subCategoryData: {
  nom: string;
  parent_id: number;
  utilisateur_id: number;
}) => {
  if (!subCategoryData.nom || !subCategoryData.parent_id || !subCategoryData.utilisateur_id) {
    throw new Error("Missing required fields: nom, parent_id, utilisateur_id");
  }

  return await addSubCategory(subCategoryData);
};

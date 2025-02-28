import { db } from "../../base_de_donne/db";
import { categorie, subCategorie } from "../../base_de_donne/schema";

export const addCategory = async (categoryData: {
  nom: string;
  description?: string;
  utilisateur_id: number;
}) => {
  try {
    const [newCategory] = await db.insert(categorie).values(categoryData).returning();
    return newCategory;
  } catch (error) {
    throw new Error(`Error adding category: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const addSubCategory = async (subCategoryData: {
  nom: string;
  parent_id: number;
  utilisateur_id: number;
}) => {
  try {
    const [newSubCategory] = await db.insert(subCategorie).values(subCategoryData).returning();
    return newSubCategory;
  } catch (error) {
    throw new Error(`Error adding sub-category:${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

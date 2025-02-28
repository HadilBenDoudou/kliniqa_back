// controllers/categoryController.ts
import { Hono } from "hono";
import { createCategory, createSubCategory } from "../../application/usecases/products/CategorieUseCase";
import { authMiddleware } from "../../middleware/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import { categorySchema, subCategorySchema } from "../../validators/ProduitValidator";

const categoryController = new Hono();

// Protected Route to Create a Category
categoryController.post(
  "/categories",
  authMiddleware,
  zValidator("json", categorySchema),
  async (c) => {
    try {
      const user = c.get("authenticatedUser");
      if (!user?.id) {
        return c.json({ success: false, error: "Utilisateur non authentifié" }, 401);
      }

      if (user.role !== "pharmacien") {
        return c.json(
          { success: false, error: "Seuls les pharmaciens peuvent créer des catégories" },
          403
        );
      }

      const body = await c.req.valid("json");
      const categoryData = { ...body, utilisateur_id: user.id }; // user.id is now a number from Neon’s utilisateur.id
      const newCategory = await createCategory(categoryData);
      return c.json({ success: true, data: newCategory }, 201);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      console.error("Erreur lors de la création de la catégorie:", error);
      return c.json({ success: false, error: errorMessage }, 400);
    }
  }
);

// Protected Route to Create a Subcategory
categoryController.post(
  "/subcategories",
  authMiddleware,
  zValidator("json", subCategorySchema),
  async (c) => {
    try {
      const user = c.get("authenticatedUser");
      if (!user?.id) {
        return c.json({ success: false, error: "Utilisateur non authentifié" }, 401);
      }

      if (user.role !== "pharmacien") {
        return c.json(
          { success: false, error: "Seuls les pharmaciens peuvent créer des sous-catégories" },
          403
        );
      }

      const body = await c.req.valid("json");
      const subCategoryData = { ...body, utilisateur_id: user.id }; // user.id is now a number from Neon’s utilisateur.id
      const newSubCategory = await createSubCategory(subCategoryData);
      return c.json({ success: true, data: newSubCategory }, 201);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      console.error("Erreur lors de la création de la sous-catégorie:", error);
      return c.json({ success: false, error: errorMessage }, 400);
    }
  }
);

export default categoryController;
// controllers/productRouter.ts
import { Hono } from "hono";
import { createProduct } from "../../application/usecases/products/ProductsUseCase";
import { authMiddleware } from "../../middleware/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import { productSchema } from "../../validators/ProduitValidator";

const productRouter = new Hono();

// Protected Route to Create a Product
productRouter.post(
    "/products",
    authMiddleware,
    zValidator("json", productSchema),
    async (c) => {
      try {
        const user = c.get("authenticatedUser");
        if (!user?.id) {
          return c.json({ success: false, error: "Utilisateur non authentifié" }, 401);
        }
  
        if (user.role !== "pharmacien") {
          return c.json(
            { success: false, error: "Seuls les pharmaciens peuvent créer des produits" },
            403
          );
        }
  
        const body = await c.req.valid("json");
        const productData = { ...body, utilisateur_id: user.id }; // user.id is now a number
        const result = await createProduct(productData);
        return c.json({ success: true, data: result }, 201);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
        console.error("Erreur lors de la création du produit:", error);
        return c.json({ success: false, error: errorMessage }, 400);
      }
    }
  );

export default productRouter;
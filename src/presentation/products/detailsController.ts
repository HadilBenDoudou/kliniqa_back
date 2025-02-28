// controllers/detailController.ts
import { Hono } from "hono";
import { createProductDetail } from "../../application/usecases/products/detailProduitUseCase";
import { authMiddleware } from "../../middleware/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import { productDetailSchema } from "../../validators/ProduitValidator";

const detailController = new Hono();

// Protected Route to Create Product Detail
detailController.post(
  "/product-details",
  authMiddleware,
  zValidator("json", productDetailSchema),
  async (c) => {
    try {
      const user = c.get("authenticatedUser");
      if (!user?.id) {
        return c.json({ success: false, error: "Utilisateur non authentifié" }, 401);
      }

      if (user.role !== "pharmacien") {
        return c.json(
          { success: false, error: "Seuls les pharmaciens peuvent créer des détails de produit" },
          403
        );
      }

      const body = await c.req.valid("json");
      const detailData = { ...body, utilisateur_id: user.id }; // user.id is now a number from Neon’s utilisateur.id
      const newDetail = await createProductDetail(detailData);
      return c.json({ success: true, data: newDetail }, 201);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      console.error("Erreur lors de la création du détail produit:", error);
      return c.json({ success: false, error: errorMessage }, 400);
    }
  }
);

export default detailController;
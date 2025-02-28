ALTER TABLE "categorie" DROP CONSTRAINT "categorie_utilisateur_id_utilisateur_id_fk";
--> statement-breakpoint
ALTER TABLE "detail_produit" DROP CONSTRAINT "detail_produit_utilisateur_id_utilisateur_id_fk";
--> statement-breakpoint
ALTER TABLE "produit" DROP CONSTRAINT "produit_utilisateur_id_utilisateur_id_fk";
--> statement-breakpoint
ALTER TABLE "sub_categorie" DROP CONSTRAINT "sub_categorie_utilisateur_id_utilisateur_id_fk";
--> statement-breakpoint
ALTER TABLE "categorie" ADD CONSTRAINT "categorie_utilisateur_id_pharmacien_utilisateur_id_fk" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."pharmacien"("utilisateur_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detail_produit" ADD CONSTRAINT "detail_produit_utilisateur_id_pharmacien_utilisateur_id_fk" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."pharmacien"("utilisateur_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "produit" ADD CONSTRAINT "produit_utilisateur_id_pharmacien_utilisateur_id_fk" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."pharmacien"("utilisateur_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_categorie" ADD CONSTRAINT "sub_categorie_utilisateur_id_pharmacien_utilisateur_id_fk" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."pharmacien"("utilisateur_id") ON DELETE cascade ON UPDATE no action;
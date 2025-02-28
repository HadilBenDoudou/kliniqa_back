CREATE TABLE "categorie" (
	"id_categorie" serial PRIMARY KEY NOT NULL,
	"nom" varchar(255) NOT NULL,
	"description" varchar(255),
	"utilisateur_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "detail_produit" (
	"id_detail" serial PRIMARY KEY NOT NULL,
	"id_produit" bigint NOT NULL,
	"id_categorie" bigint NOT NULL,
	"categorie_specific_attributes" jsonb,
	"utilisateur_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "produit" (
	"id" serial PRIMARY KEY NOT NULL,
	"nom" varchar(255) NOT NULL,
	"ref" varchar(255),
	"desc" varchar(255),
	"stock" bigint,
	"prix" double precision,
	"image" varchar(500),
	"id_categorie" bigint NOT NULL,
	"utilisateur_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sub_categorie" (
	"id_sub_categorie" serial PRIMARY KEY NOT NULL,
	"nom" varchar(255) NOT NULL,
	"parent_id" integer NOT NULL,
	"utilisateur_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "adresse" DROP CONSTRAINT "adresse_utilisateur_id_utilisateur_id_fk";
--> statement-breakpoint
ALTER TABLE "pharmacie" DROP CONSTRAINT "pharmacie_adresse_id_adresse_id_fk";
--> statement-breakpoint
ALTER TABLE "pharmacie" DROP CONSTRAINT "pharmacie_pharmacien_id_pharmacien_utilisateur_id_fk";
--> statement-breakpoint
ALTER TABLE "pharmacien" DROP CONSTRAINT "pharmacien_utilisateur_id_utilisateur_id_fk";
--> statement-breakpoint
ALTER TABLE "categorie" ADD CONSTRAINT "categorie_utilisateur_id_utilisateur_id_fk" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."utilisateur"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detail_produit" ADD CONSTRAINT "detail_produit_id_produit_produit_id_fk" FOREIGN KEY ("id_produit") REFERENCES "public"."produit"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detail_produit" ADD CONSTRAINT "detail_produit_id_categorie_categorie_id_categorie_fk" FOREIGN KEY ("id_categorie") REFERENCES "public"."categorie"("id_categorie") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detail_produit" ADD CONSTRAINT "detail_produit_utilisateur_id_utilisateur_id_fk" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."utilisateur"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "produit" ADD CONSTRAINT "produit_id_categorie_categorie_id_categorie_fk" FOREIGN KEY ("id_categorie") REFERENCES "public"."categorie"("id_categorie") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "produit" ADD CONSTRAINT "produit_utilisateur_id_utilisateur_id_fk" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."utilisateur"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_categorie" ADD CONSTRAINT "sub_categorie_parent_id_categorie_id_categorie_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categorie"("id_categorie") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_categorie" ADD CONSTRAINT "sub_categorie_utilisateur_id_utilisateur_id_fk" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."utilisateur"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adresse" ADD CONSTRAINT "adresse_utilisateur_id_utilisateur_id_fk" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."utilisateur"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pharmacie" ADD CONSTRAINT "pharmacie_adresse_id_adresse_id_fk" FOREIGN KEY ("adresse_id") REFERENCES "public"."adresse"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pharmacie" ADD CONSTRAINT "pharmacie_pharmacien_id_pharmacien_utilisateur_id_fk" FOREIGN KEY ("pharmacien_id") REFERENCES "public"."pharmacien"("utilisateur_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pharmacien" ADD CONSTRAINT "pharmacien_utilisateur_id_utilisateur_id_fk" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."utilisateur"("id") ON DELETE cascade ON UPDATE no action;
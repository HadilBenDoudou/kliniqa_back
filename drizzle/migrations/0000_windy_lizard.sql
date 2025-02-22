CREATE TABLE "adresse" (
	"id" serial PRIMARY KEY NOT NULL,
	"num_street" varchar(50) NOT NULL,
	"street" varchar(255) NOT NULL,
	"city" varchar(100) NOT NULL,
	"postal_code" varchar(20) NOT NULL,
	"country" varchar(100) NOT NULL,
	"longitude" varchar(50),
	"latitude" varchar(50),
	"utilisateur_id" bigint NOT NULL,
	CONSTRAINT "adresse_utilisateur_id_unique" UNIQUE("utilisateur_id")
);
--> statement-breakpoint
CREATE TABLE "pharmacie" (
	"id" serial PRIMARY KEY NOT NULL,
	"nom" varchar(255) NOT NULL,
	"docPermis" varchar(500) NOT NULL,
	"docAutorisation" varchar(500) NOT NULL,
	"adresse_id" bigint NOT NULL,
	"pharmacien_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pharmacien" (
	"utilisateur_id" bigint PRIMARY KEY NOT NULL,
	"cartePro" varchar(255) NOT NULL,
	"diplome" varchar(255) NOT NULL,
	"assurancePro" varchar(255),
	"etat" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "utilisateur" (
	"id" serial PRIMARY KEY NOT NULL,
	"nom" varchar(255) NOT NULL,
	"prenom" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"telephone" varchar(20) NOT NULL,
	"image" varchar(500),
	"role" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "utilisateur_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "adresse" ADD CONSTRAINT "adresse_utilisateur_id_utilisateur_id_fk" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."utilisateur"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pharmacie" ADD CONSTRAINT "pharmacie_adresse_id_adresse_id_fk" FOREIGN KEY ("adresse_id") REFERENCES "public"."adresse"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pharmacie" ADD CONSTRAINT "pharmacie_pharmacien_id_pharmacien_utilisateur_id_fk" FOREIGN KEY ("pharmacien_id") REFERENCES "public"."pharmacien"("utilisateur_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pharmacien" ADD CONSTRAINT "pharmacien_utilisateur_id_utilisateur_id_fk" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."utilisateur"("id") ON DELETE no action ON UPDATE no action;
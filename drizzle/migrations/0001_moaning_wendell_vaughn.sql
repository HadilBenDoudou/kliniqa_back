CREATE TABLE "otp_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"utilisateur_id" bigint NOT NULL,
	"otp" varchar(6) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "otp_codes" ADD CONSTRAINT "otp_codes_utilisateur_id_utilisateur_id_fk" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."utilisateur"("id") ON DELETE cascade ON UPDATE no action;
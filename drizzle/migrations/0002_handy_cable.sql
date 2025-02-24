ALTER TABLE "utilisateur" ADD COLUMN "supabase_user_id" varchar(255);--> statement-breakpoint
ALTER TABLE "utilisateur" ADD CONSTRAINT "utilisateur_supabase_user_id_unique" UNIQUE("supabase_user_id");
import { defineConfig } from "drizzle-kit";


export default defineConfig({
    dialect: "postgresql",
    schema: "./src/infrastructure/base_de_donne/schema.ts",
    out: "./drizzle/migrations",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    verbose: true,
    strict: true,
});
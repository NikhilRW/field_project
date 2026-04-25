import { defineConfig } from "drizzle-kit";
import "dotenv/config";
console.log(process.env.DATABASE_URL)
export default defineConfig({
  schema: "./src/config/databaseSetup.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});

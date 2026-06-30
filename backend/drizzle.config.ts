import { defineConfig } from "drizzle-kit";
import "dotenv/config";
import fs from "fs";

export default defineConfig({
  schema: "./src/config/databaseSetup.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    ssl: {
      rejectUnauthorized: false,
      ca: fs.readFileSync(`./personal/ca.pem`).toString(),
    },
  },
  verbose: true,
  strict: true,
});

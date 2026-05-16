ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "oauth_provider" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "oauth_id" text;

CREATE UNIQUE INDEX IF NOT EXISTS "users_oauth_provider_id_unique"
  ON "users" ("oauth_provider", "oauth_id");

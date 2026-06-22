import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { relations } from "drizzle-orm";
import "dotenv/config";
import {
  pgEnum,
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  boolean,
  numeric,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

export const userRoleEnum = pgEnum("user_role", ["Admin", "User"]);
export const beneficiaryCategoryEnum = pgEnum("beneficiary_category", [
  "Elderly",
  "Children",
  "Youth",
  "PWD",
  "Mothers",
]);
export type BeneficiaryCategory =
  (typeof beneficiaryCategoryEnum.enumValues)[number];

export const genderEnum = pgEnum("gender", ["Male", "Female", "Other"]);

export const healthStatusEnum = pgEnum("health_status", [
  "Good",
  "Moderate",
  "Critical",
]);
export const activityStatusEnum = pgEnum("activity_status", [
  "Upcoming",
  "Completed",
  "Ongoing",
]);
export const donationTypeEnum = pgEnum("donation_type", [
  "incoming",
  "outgoing",
]);
export const donationCategoryEnum = pgEnum("donation_category", [
  "money",
  "books",
  "clothes",
  "other_items",
]);
export const donationVerificationStatusEnum = pgEnum(
  "donation_verification_status",
  ["unverified", "verified", "rejected"],
);
export const donationPaymentStatusEnum = pgEnum("donation_payment_status", [
  "not_applicable",
  "pending",
  "paid",
  "failed",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash"),
    role: userRoleEnum("role").notNull(),
    isBlocked: boolean("is_blocked").notNull().default(false),
    isEmailVerified: boolean("is_email_verified").notNull().default(false),
    refreshTokenHash: text("refresh_token_hash"),
    oauthProvider: text("oauth_provider"),
    oauthId: text("oauth_id"),
    expoPushToken: text("expo_push_token"),
    phone: text("phone"),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    emailUniqueIdx: uniqueIndex("users_email_unique").on(table.email),
    oauthProviderIdUniqueIdx: uniqueIndex("users_oauth_provider_id_unique").on(
      table.oauthProvider,
      table.oauthId,
    ),
  }),
);

export const emailVerificationTokens = pgTable(
  "email_verification_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("email_verification_tokens_user_id_idx").on(table.userId),
  }),
);
// TODO: use non deprecated version of pgTable.
export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("password_reset_tokens_user_id_idx").on(table.userId),
  }),
);

export const refreshTokens = pgTable(
  "refresh_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    tokenHash: text("token_hash").notNull(),
    deviceName: text("device_name"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("refresh_tokens_user_id_idx").on(table.userId),
    tokenHashIdx: index("refresh_tokens_token_hash_idx").on(table.tokenHash),
  }),
);

export const draftDonations = pgTable(
  "draft_donations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    donorId: uuid("donor_id").references(() => users.id, {
      onDelete: "set null",
    }),
    category: donationCategoryEnum("category").notNull(),
    purpose: text("purpose"),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    donorIdx: index("draft_donations_donor_idx").on(table.donorId),
  }),
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    data: text("data"),
    readAt: timestamp("read_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("notifications_user_id_idx").on(table.userId),
    readAtIdx: index("notifications_read_at_idx").on(table.readAt),
  }),
);

export const beneficiaries = pgTable(
  "beneficiaries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    age: integer("age").notNull(),
    gender: genderEnum("gender").notNull().default("Other"),
    category: beneficiaryCategoryEnum("category").notNull(),
    healthStatus: healthStatusEnum("health_status").notNull(),
    address: text("address").notNull(),
    initials: text("initials").notNull(),
    color: text("color").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    categoryIdx: index("beneficiaries_category_idx").on(table.category),
  }),
);

export const activities = pgTable(
  "activities",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    date: timestamp("date", { withTimezone: true, mode: "date" }).notNull(),
    status: activityStatusEnum("status").notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    statusIdx: index("activities_status_idx").on(table.status),
    dateIdx: index("activities_date_idx").on(table.date),
  }),
);

export const donations = pgTable(
  "donations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    donorId: uuid("donor_id").references(() => users.id, {
      onDelete: "set null",
    }),
    donorName: text("donor_name").notNull(),
    purpose: text("purpose").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    type: donationTypeEnum("type").notNull(),
    category: donationCategoryEnum("category").notNull().default("money"),
    verificationStatus: donationVerificationStatusEnum("verification_status")
      .notNull()
      .default("verified"),
    paymentStatus: donationPaymentStatusEnum("payment_status")
      .notNull()
      .default("not_applicable"),
    imageUrl: text("image_url"),
    isDonated: boolean("is_donated").notNull().default(false),
    paymentVerifiedAt: timestamp("payment_verified_at", {
      withTimezone: true,
      mode: "date",
    }),
    date: timestamp("date", { withTimezone: true, mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    donorIdx: index("donations_donor_idx").on(table.donorId),
    typeIdx: index("donations_type_idx").on(table.type),
    categoryIdx: index("donations_category_idx").on(table.category),
    verificationStatusIdx: index("donations_verification_status_idx").on(
      table.verificationStatus,
    ),
    paymentStatusIdx: index("donations_payment_status_idx").on(
      table.paymentStatus,
    ),
    dateIdx: index("donations_date_idx").on(table.date),
  }),
);

export const monthlyDonations = pgTable(
  "monthly_donations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    month: text("month").notNull(),
    monthIndex: integer("month_index").notNull(),
    received: numeric("received", { precision: 12, scale: 2 }).notNull(),
    spent: numeric("spent", { precision: 12, scale: 2 }).notNull(),
  },
  (table) => ({
    monthIndexIdx: index("monthly_donations_month_index_idx").on(
      table.monthIndex,
    ),
  }),
);

export const surveys = pgTable(
  "surveys",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    date: timestamp("date", { withTimezone: true, mode: "date" }).notNull(),
    location: text("location").notNull(),
    note: text("note").notNull(),
    beneficiariesCovered: integer("beneficiaries_covered").notNull(),
    imageUrl: text("image_url").notNull(),
    geoTag: text("geo_tag").notNull(),
    createdByUserId: uuid("created_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    dateIdx: index("surveys_date_idx").on(table.date),
    createdByIdx: index("surveys_created_by_idx").on(table.createdByUserId),
  }),
);

export const usersRelations = relations(users, ({ one, many }) => ({
  donations: many(donations),
  surveysCreated: many(surveys),
}));

export const activitiesRelations = relations(activities, () => ({}));

export const donationsRelations = relations(donations, ({ one }) => ({
  donor: one(users, {
    fields: [donations.donorId],
    references: [users.id],
  }),
}));

export const surveysRelations = relations(surveys, ({ one }) => ({
  createdBy: one(users, {
    fields: [surveys.createdByUserId],
    references: [users.id],
  }),
}));

export const schema = {
  users,
  beneficiaries,
  activities,
  donations,
  monthlyDonations,
  surveys,
  emailVerificationTokens,
  passwordResetTokens,
  refreshTokens,
  draftDonations,
  notifications,
};

export const pool = new Pool({
  connectionString: databaseUrl,
});

export const db = drizzle(pool, {
  schema,
});
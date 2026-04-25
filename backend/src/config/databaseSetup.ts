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

export const userRoleEnum = pgEnum("user_role", [
  "Admin",
  "Volunteer",
  "Donor",
]);
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
  ["unverified", "verified"],
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
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull(),
    isEmailVerified: boolean("is_email_verified").notNull().default(false),
    refreshTokenHash: text("refresh_token_hash"),
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

export const volunteerProfiles = pgTable(
  "volunteer_profiles",
  {
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .primaryKey(),
    roleTitle: text("role_title").notNull(),
    skill: text("skill").notNull(),
    available: boolean("available").notNull().default(true),
    initials: text("initials").notNull(),
    color: text("color").notNull(),
  },
  (table) => ({
    userIdIdx: index("volunteer_profiles_user_id_idx").on(table.userId),
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
    volunteersCount: integer("volunteers_count").notNull().default(0),
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

export const activityVolunteers = pgTable(
  "activity_volunteers",
  {
    activityId: uuid("activity_id")
      .references(() => activities.id, { onDelete: "cascade" })
      .notNull(),
    volunteerId: uuid("volunteer_id")
      .references(() => volunteerProfiles.userId, { onDelete: "cascade" })
      .notNull(),
    assignedAt: timestamp("assigned_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.activityId, table.volunteerId] }),
    activityIdx: index("activity_volunteers_activity_idx").on(table.activityId),
    volunteerIdx: index("activity_volunteers_volunteer_idx").on(
      table.volunteerId,
    ),
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
    verificationStatus: donationVerificationStatusEnum(
      "verification_status",
    )
      .notNull()
      .default("verified"),
    paymentStatus: donationPaymentStatusEnum("payment_status")
      .notNull()
      .default("not_applicable"),
    imageUrl: text("image_url"),
    razorpayOrderId: text("razorpay_order_id"),
    razorpayPaymentId: text("razorpay_payment_id"),
    razorpaySignature: text("razorpay_signature"),
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
    razorpayOrderIdx: uniqueIndex("donations_razorpay_order_id_unique").on(
      table.razorpayOrderId,
    ),
    razorpayPaymentIdx: index("donations_razorpay_payment_id_idx").on(
      table.razorpayPaymentId,
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
  volunteerProfile: one(volunteerProfiles, {
    fields: [users.id],
    references: [volunteerProfiles.userId],
  }),
  donations: many(donations),
  surveysCreated: many(surveys),
  activityAssignments: many(activityVolunteers),
}));

export const volunteerProfilesRelations = relations(
  volunteerProfiles,
  ({ one, many }) => ({
    user: one(users, {
      fields: [volunteerProfiles.userId],
      references: [users.id],
    }),
    activityAssignments: many(activityVolunteers),
  }),
);

export const activitiesRelations = relations(activities, ({ many }) => ({
  assignments: many(activityVolunteers),
}));

export const activityVolunteersRelations = relations(
  activityVolunteers,
  ({ one }) => ({
    activity: one(activities, {
      fields: [activityVolunteers.activityId],
      references: [activities.id],
    }),
    volunteerProfile: one(volunteerProfiles, {
      fields: [activityVolunteers.volunteerId],
      references: [volunteerProfiles.userId],
    }),
  }),
);

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
  volunteerProfiles,
  beneficiaries,
  activities,
  activityVolunteers,
  donations,
  monthlyDonations,
  surveys,
  emailVerificationTokens,
  passwordResetTokens,
  notifications,
};

export const pool = new Pool({
  connectionString: databaseUrl,
});

export const db = drizzle(pool, { schema });

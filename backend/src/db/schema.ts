import { relations } from "drizzle-orm";
import {
  date,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  genderEnum,
  membershipStatusEnum,
  notificationTypeEnum,
  onboardingStatusEnum,
  roleEnum,
} from "./enum";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: roleEnum("role").notNull().default("MEMBER"),
  gymId: uuid("gym_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ one }) => ({
  gym: one(gyms, { fields: [users.gymId], references: [gyms.id] }),
  member: one(members, { fields: [users.id], references: [members.userId] }),
}));

export const gyms = pgTable("gyms", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id),
  location: text("location"),
  images: jsonb("images").$type<string[]>().default([]),
  onboardingStatus: onboardingStatusEnum("onboarding_status")
    .notNull()
    .default("PENDING_DETAILS"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const gymsRelations = relations(gyms, ({ one, many }) => ({
  owner: one(users, { fields: [gyms.ownerId], references: [users.id] }),
  members: many(members),
  trainers: many(trainers),
  membershipPlans: many(membershipPlans),
  notifications: many(notifications),
}));

export const members = pgTable("members", {
  id: uuid("id").defaultRandom().primaryKey(),
  gymId: uuid("gym_id")
    .notNull()
    .references(() => gyms.id),
  userId: uuid("user_id").references(() => users.id), // nullable — set only if member has login access
  trainerId: uuid("trainer_id").references(() => trainers.id), // nullable — assigned later
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  emergencyContact: varchar("emergency_contact", { length: 20 }),
  dateOfBirth: date("date_of_birth"),
  profilePhotoUrl: text("profile_photo_url"),
  joinDate: date("join_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const membersRelations = relations(members, ({ one, many }) => ({
  gym: one(gyms, { fields: [members.gymId], references: [gyms.id] }),
  user: one(users, { fields: [members.userId], references: [users.id] }),
  trainer: one(trainers, {
    fields: [members.trainerId],
    references: [trainers.id],
  }),
  memberships: many(memberships),
  payments: many(payments),
}));

export const trainers = pgTable("trainers", {
  id: uuid("id").defaultRandom().primaryKey(),
  gymId: uuid("gym_id")
    .notNull()
    .references(() => gyms.id),
  name: varchar("name", { length: 255 }).notNull(),
  gender: genderEnum("gender").notNull(),
  profileImage: text("profile_image_url"),
  specialization: varchar("specialization", { length: 255 }),
  experienceYears: integer("experience_years").default(0),
  pricing: numeric("pricing", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const trainersRelations = relations(trainers, ({ one, many }) => ({
  gym: one(gyms, { fields: [trainers.gymId], references: [gyms.id] }),
  members: many(members),
}));

export const membershipPlans = pgTable("membership_plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  gymId: uuid("gym_id")
    .notNull()
    .references(() => gyms.id),
  name: varchar("name", { length: 100 }).notNull(), // e.g. "1 Month", "1 Year"
  durationDays: integer("duration_days").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const membershipPlansRelations = relations(
  membershipPlans,
  ({ one, many }) => ({
    gym: one(gyms, { fields: [membershipPlans.gymId], references: [gyms.id] }),
    memberships: many(memberships),
  }),
);

export const memberships = pgTable("memberships", {
  id: uuid("id").defaultRandom().primaryKey(),
  memberId: uuid("member_id")
    .notNull()
    .references(() => members.id),
  planId: uuid("plan_id")
    .notNull()
    .references(() => membershipPlans.id),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  status: membershipStatusEnum("status").notNull().default("ACTIVE"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const membershipsRelations = relations(memberships, ({ one }) => ({
  member: one(members, {
    fields: [memberships.memberId],
    references: [members.id],
  }),
  plan: one(membershipPlans, {
    fields: [memberships.planId],
    references: [membershipPlans.id],
  }),
}));

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  gymId: uuid("gym_id")
    .notNull()
    .references(() => gyms.id),
  memberId: uuid("member_id")
    .notNull()
    .references(() => members.id),
  membershipId: uuid("membership_id").references(() => memberships.id), // nullable — some payments may not tie to a specific membership cycle
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  paidAt: timestamp("paid_at").defaultNow().notNull(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  gym: one(gyms, { fields: [payments.gymId], references: [gyms.id] }),
  member: one(members, {
    fields: [payments.memberId],
    references: [members.id],
  }),
  membership: one(memberships, {
    fields: [payments.membershipId],
    references: [memberships.id],
  }),
}));

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  gymId: uuid("gym_id")
    .notNull()
    .references(() => gyms.id),
  memberId: uuid("member_id").references(() => members.id), // nullable — null means broadcast to whole gym
  type: notificationTypeEnum("type").notNull(),
  message: text("message").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  gym: one(gyms, { fields: [notifications.gymId], references: [gyms.id] }),
  member: one(members, {
    fields: [notifications.memberId],
    references: [members.id],
  }),
}));

//export ts types automatically
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

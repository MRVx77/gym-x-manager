import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["SUPER_ADMIN", "GYM_OWNER", "MEMBER"]);

export const onboardingStatusEnum = pgEnum("onboarding_status", [
  "PENDING_DETAILS",
  "ACTIVE",
]);

export const membershipStatusEnum = pgEnum("membership_status", [
  "ACTIVE",
  "EXPIRED",
  "CANCELLED",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "EXPIRY_REMINDER",
  "HOLIDAY",
  "OFFER",
  "EVENT",
  "MAINTENANCE",
]);

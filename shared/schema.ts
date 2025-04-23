import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Clients table
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  status: text("status").default("active"),
  avatarBg: text("avatar_bg"),
  avatarColor: text("avatar_color"),
  notes: text("notes"),
  lastMeeting: timestamp("last_meeting"),
  contacts: jsonb("contacts").default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// Meeting types table
export const meetingTypes = pgTable("meeting_types", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  value: text("value").notNull().unique(),
});

// Meetings table
export const meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id),
  title: text("title").notNull(),
  type: text("type").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: text("location").notNull(),
  status: text("status").default("scheduled"),
  participants: jsonb("participants").default([]),
  agenda: text("agenda"),
  notes: text("notes"),
  followUpStatus: text("follow_up_status").default("none"),
  followUpDays: integer("follow_up_days"),
  syncedWithCrm: boolean("synced_with_crm").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// CRM Integrations table
export const crmIntegrations = pgTable("crm_integrations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // salesforce, microsoft, google, etc.
  status: text("status").default("disconnected"),
  config: jsonb("config").default({}),
  lastSync: timestamp("last_sync"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  lastMeeting: true,
  createdAt: true,
});

export const insertMeetingTypeSchema = createInsertSchema(meetingTypes).omit({
  id: true,
});

export const insertMeetingSchema = createInsertSchema(meetings).omit({
  id: true,
  createdAt: true,
  followUpDays: true,
  syncedWithCrm: true,
});

export const insertCrmIntegrationSchema = createInsertSchema(crmIntegrations).omit({
  id: true,
  lastSync: true,
  createdAt: true,
});

// Types
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type MeetingType = typeof meetingTypes.$inferSelect;
export type InsertMeetingType = z.infer<typeof insertMeetingTypeSchema>;

export type Meeting = typeof meetings.$inferSelect & {
  client: Client;
};
export type InsertMeeting = z.infer<typeof insertMeetingSchema>;

export type CrmIntegration = typeof crmIntegrations.$inferSelect;
export type InsertCrmIntegration = z.infer<typeof insertCrmIntegrationSchema>;

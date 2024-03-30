import { serial, text, timestamp, pgTable, pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["incomplete", "inprogress", "completed"]);

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  task: text("task").notNull(),
  status: statusEnum("status"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

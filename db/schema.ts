import { index, jsonb, pgTable, serial, text, timestamp, uuid, boolean, integer } from "drizzle-orm/pg-core";

/** Enquiries captured before the WhatsApp hand-off. */
export const leads = pgTable(
  "leads",
  {
    id: serial("id").primaryKey(),
    type: text("type").notNull(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    carSlug: text("car_slug"),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    status: text("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("leads_type_idx").on(table.type),
    index("leads_status_idx").on(table.status),
    index("leads_created_at_idx").on(table.createdAt),
  ],
);

/** Vehicle inventory. */
export const cars = pgTable(
  "cars",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    year: integer("year").notNull(),
    price: integer("price").notNull(),
    priceLabel: text("price_label").notNull(),
    mileage: text("mileage").notNull(),
    transmission: text("transmission").notNull(),
    fuel: text("fuel").notNull(),
    condition: text("condition").notNull(),
    location: text("location").notNull(),
    colour: text("colour").notNull(),
    description: text("description").notNull(),
    alt: text("alt").notNull(),
    imageNote: text("image_note"),
    featured: boolean("featured").notNull().default(false),
    status: text("status").notNull().default("available"),
    images: jsonb("images").$type<string[]>().notNull(),
    features: jsonb("features").$type<string[]>().notNull(),
    addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("cars_status_idx").on(table.status),
    index("cars_featured_idx").on(table.featured),
    index("cars_added_at_idx").on(table.addedAt),
  ],
);

/** Admin users for Auth.js (credentials sign-in). */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type CarRecord = typeof cars.$inferSelect;
export type NewCar = typeof cars.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

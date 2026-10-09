import { and, desc, eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";
import type { Car } from "@/types";

type Db = NeonHttpDatabase<typeof schema>;
export type CarRecord = typeof schema.cars.$inferSelect;
export type CarValues = typeof schema.cars.$inferInsert;

/** DB row → the `Car` shape the public components already expect. */
export function toCar(row: CarRecord): Car {
  return {
    slug: row.slug,
    name: row.name,
    year: row.year,
    price: row.price,
    priceLabel: row.priceLabel,
    mileage: row.mileage,
    transmission: row.transmission,
    fuel: row.fuel,
    condition: row.condition,
    location: row.location,
    colour: row.colour,
    image: row.images[0] ?? "",
    images: row.images,
    alt: row.alt,
    imageNote: row.imageNote ?? undefined,
    features: row.features,
    description: row.description,
    featured: row.featured,
    addedAt: row.addedAt.toISOString(),
  };
}

export async function listCars(db: Db, options: { featured?: boolean; status?: string; limit?: number } = {}): Promise<Car[]> {
  const conditions = [];
  if (options.featured) conditions.push(eq(schema.cars.featured, true));
  if (options.status) conditions.push(eq(schema.cars.status, options.status));

  const rows = await db
    .select()
    .from(schema.cars)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(schema.cars.addedAt))
    .limit(options.limit ?? 100);
  return rows.map(toCar);
}

export async function listCarRows(db: Db) {
  return db.select().from(schema.cars).orderBy(desc(schema.cars.addedAt));
}

export async function getCarBySlug(db: Db, slug: string): Promise<Car | undefined> {
  const [row] = await db.select().from(schema.cars).where(eq(schema.cars.slug, slug)).limit(1);
  return row ? toCar(row) : undefined;
}

export async function getCarRow(db: Db, slug: string): Promise<CarRecord | undefined> {
  const [row] = await db.select().from(schema.cars).where(eq(schema.cars.slug, slug)).limit(1);
  return row;
}

export async function createCar(db: Db, values: CarValues) {
  await db.insert(schema.cars).values(values);
}

export async function updateCar(db: Db, originalSlug: string, values: CarValues) {
  await db.update(schema.cars).set({ ...values, updatedAt: new Date() }).where(eq(schema.cars.slug, originalSlug));
}

export async function deleteCar(db: Db, slug: string) {
  await db.delete(schema.cars).where(eq(schema.cars.slug, slug));
}

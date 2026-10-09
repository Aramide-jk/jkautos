import { and, count, desc, eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";
import { toLeadRow, type LeadInput, type LeadStatus } from "@/lib/leads/schema";

type Db = NeonHttpDatabase<typeof schema>;

export type ListLeadOptions = { type?: string; status?: LeadStatus; limit?: number };

export async function createLead(db: Db, input: LeadInput) {
  const [created] = await db.insert(schema.leads).values(toLeadRow(input)).returning();
  return created;
}

export async function listLeads(db: Db, options: ListLeadOptions = {}) {
  const conditions = [];
  if (options.type) conditions.push(eq(schema.leads.type, options.type));
  if (options.status) conditions.push(eq(schema.leads.status, options.status));

  return db
    .select()
    .from(schema.leads)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(schema.leads.createdAt))
    .limit(options.limit ?? 100);
}

export async function getLead(db: Db, id: number) {
  const [row] = await db.select().from(schema.leads).where(eq(schema.leads.id, id)).limit(1);
  return row;
}

export async function updateLeadStatus(db: Db, id: number, status: LeadStatus) {
  await db.update(schema.leads).set({ status }).where(eq(schema.leads.id, id));
}

export async function leadStatusCounts(db: Db) {
  return db
    .select({ status: schema.leads.status, total: count() })
    .from(schema.leads)
    .groupBy(schema.leads.status);
}

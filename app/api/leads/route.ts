import { getDb } from "@/db";
import { leadSchema } from "@/lib/leads/schema";
import { createLead } from "@/lib/services/leads";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  try {
    const lead = await createLead(getDb(), parsed.data);
    return Response.json({ ok: true, id: lead.id }, { status: 201 });
  } catch {
    return Response.json({ ok: false, error: "Unable to save your enquiry." }, { status: 500 });
  }
}

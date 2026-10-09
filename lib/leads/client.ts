import type { LeadInput } from "@/lib/leads/schema";

/** Persist a lead before the WhatsApp hand-off. Never throws. */
export async function submitLead(input: LeadInput): Promise<boolean> {
  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      keepalive: true,
    });
    return response.ok;
  } catch {
    return false;
  }
}

import { z } from "zod";

export const LEAD_TYPES = ["contact", "request", "inspection", "sell"] as const;
export const LEAD_STATUSES = ["new", "contacted", "won", "lost"] as const;

export type LeadType = (typeof LEAD_TYPES)[number];
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const leadStatusSchema = z.enum(LEAD_STATUSES);

const name = z.string().trim().min(1, "Please enter your name.");
const phone = z
  .string()
  .trim()
  .min(1, "Please enter your phone number.")
  .regex(/^[+\d][\d\s()-]{7,}$/, "Enter a valid phone number.");
const required = (label: string) => z.string().trim().min(1, `${label} is required.`);
const optionalText = z.string().trim().optional().default("");

export const contactLeadSchema = z.object({
  type: z.literal("contact"),
  name,
  phone,
  message: required("Message"),
});

export const requestLeadSchema = z.object({
  type: z.literal("request"),
  name,
  phone,
  carMake: required("Car make"),
  carModel: required("Car model"),
  preferredYear: required("Preferred year"),
  budget: required("Budget"),
  preferredColor: required("Preferred colour"),
  condition: required("Condition"),
  location: required("Location"),
  additionalRequirements: optionalText,
});

export const sellLeadSchema = z.object({
  type: z.literal("sell"),
  name,
  phone,
  location: required("Location"),
  make: required("Make"),
  model: required("Model"),
  year: required("Year"),
  trim: optionalText,
  mileage: required("Mileage"),
  askingPrice: required("Asking price"),
  condition: required("Condition"),
  registrationStatus: optionalText,
  description: optionalText,
  photoCount: z.number().int().nonnegative().optional().default(0),
});

export const inspectionLeadSchema = z.object({
  type: z.literal("inspection"),
  name,
  phone,
  carSlug: required("Car"),
  carName: required("Car"),
  date: required("Preferred date"),
  time: required("Preferred time"),
  location: required("Location"),
  note: optionalText,
});

export const leadSchema = z.discriminatedUnion("type", [
  contactLeadSchema,
  requestLeadSchema,
  sellLeadSchema,
  inspectionLeadSchema,
]);

export type LeadInput = z.infer<typeof leadSchema>;

export type LeadRow = {
  type: LeadType;
  name: string;
  phone: string;
  carSlug: string | null;
  payload: Record<string, unknown>;
};

/** Pure mapping from validated input to the shared DB columns + JSON payload. */
export function toLeadRow(input: LeadInput): LeadRow {
  const { type, name: leadName, phone: leadPhone, ...rest } = input;
  const carSlug = "carSlug" in input ? input.carSlug : null;
  return { type, name: leadName, phone: leadPhone, carSlug, payload: rest };
}

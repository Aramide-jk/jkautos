import { z } from "zod";

export const CAR_STATUSES = ["available", "reserved", "sold"] as const;

export const carInputSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens."),
  name: z.string().trim().min(1, "Name is required."),
  year: z.coerce.number().int().min(1950).max(2100),
  priceLabel: z.string().trim().min(1, "Price is required."),
  mileage: z.string().trim().min(1, "Mileage is required."),
  transmission: z.string().trim().min(1),
  fuel: z.string().trim().min(1),
  condition: z.string().trim().min(1),
  location: z.string().trim().min(1),
  colour: z.string().trim().min(1),
  description: z.string().trim().min(1),
  alt: z.string().trim().min(1, "Image alt text is required."),
  imageNote: z.string().trim().optional().default(""),
  featured: z.boolean().default(false),
  status: z.enum(CAR_STATUSES).default("available"),
  images: z.array(z.string().trim().min(1)).default([]),
  features: z.array(z.string().trim().min(1)).default([]),
});

export type CarInput = z.infer<typeof carInputSchema>;

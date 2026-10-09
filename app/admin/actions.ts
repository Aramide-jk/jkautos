"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { signOut } from "@/auth";
import { getDb } from "@/db";
import { carInputSchema } from "@/lib/cars/schema";
import { leadStatusSchema } from "@/lib/leads/schema";
import { createCar, deleteCar, updateCar, type CarValues } from "@/lib/services/cars";
import { updateLeadStatus } from "@/lib/services/leads";

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateLeadStatusAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const parsed = leadStatusSchema.safeParse(formData.get("status"));
  if (!Number.isInteger(id) || id <= 0 || !parsed.success) return;

  await updateLeadStatus(getDb(), id, parsed.data);
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

function parseCarForm(formData: FormData) {
  let images: string[] = [];
  try {
    const parsed = JSON.parse(String(formData.get("images") ?? "[]"));
    if (Array.isArray(parsed)) images = parsed.filter((value): value is string => typeof value === "string");
  } catch {
    images = [];
  }

  const features = String(formData.get("features") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const priceLabel = String(formData.get("priceLabel") ?? "").trim();

  return carInputSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    year: formData.get("year"),
    priceLabel,
    mileage: formData.get("mileage"),
    transmission: formData.get("transmission"),
    fuel: formData.get("fuel"),
    condition: formData.get("condition"),
    location: formData.get("location"),
    colour: formData.get("colour"),
    description: formData.get("description"),
    alt: formData.get("alt"),
    imageNote: formData.get("imageNote") ?? "",
    featured: formData.get("featured") === "on",
    status: formData.get("status"),
    images,
    features,
  });
}

export async function saveCarAction(formData: FormData) {
  const parsed = parseCarForm(formData);
  if (!parsed.success) return;

  const price = Number(parsed.data.priceLabel.replace(/[^\d]/g, "")) || 0;
  const values: CarValues = {
    ...parsed.data,
    imageNote: parsed.data.imageNote || null,
    price,
    updatedAt: new Date(),
  };

  const originalSlug = String(formData.get("originalSlug") ?? "");
  if (originalSlug) {
    await updateCar(getDb(), originalSlug, values);
  } else {
    await createCar(getDb(), values);
  }

  revalidatePath("/admin/cars");
  revalidatePath("/cars");
  revalidatePath("/");
  redirect("/admin/cars");
}

export async function deleteCarAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  if (!slug) return;

  await deleteCar(getDb(), slug);
  revalidatePath("/admin/cars");
  revalidatePath("/cars");
  revalidatePath("/");
  redirect("/admin/cars");
}

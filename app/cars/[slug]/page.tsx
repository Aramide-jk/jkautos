import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CarDetails } from "@/components/cars/CarDetails";
import { getDb } from "@/db";
import { getCarBySlug, listCars } from "@/lib/services/cars";

export const dynamic = "force-dynamic";

type CarPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: CarPageProps): Promise<Metadata> {
  const car = await getCarBySlug(getDb(), (await params).slug);
  if (!car) return { title: "Car not found" };
  return {
    title: car.name,
    description: `${car.name} available in ${car.location} for ${car.priceLabel}. Book an inspection with JK_AUTOS.`,
    openGraph: { title: `${car.name} | JK_AUTOS`, description: `${car.priceLabel} · ${car.location}`, images: [car.image] },
  };
}

export default async function CarPage({ params }: CarPageProps) {
  const { slug } = await params;
  const car = await getCarBySlug(getDb(), slug);
  if (!car) notFound();

  const all = await listCars(getDb());
  const relatedCars = all.filter((item) => item.slug !== car.slug).slice(0, 2);

  return <CarDetails car={car} relatedCars={relatedCars} />;
}

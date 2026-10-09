import type { Metadata } from "next";

import { CarsCatalogue } from "@/components/cars/CarsCatalogue";
import { getDb } from "@/db";
import { listCars } from "@/lib/services/cars";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Available Cars",
  description: "Browse quality vehicles available through JK_AUTOS in Kaduna, Nigeria.",
};

type CarsPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const raw = await searchParams;
  const initialQuery = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, Array.isArray(value) ? value[0] ?? "" : value ?? ""]),
  );
  const cars = await listCars(getDb());
  return <CarsCatalogue cars={cars} initialQuery={initialQuery} />;
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BookInspectionForm } from "@/components/forms/BookInspectionForm";
import { getDb } from "@/db";
import { getCarBySlug } from "@/lib/services/cars";

export const dynamic = "force-dynamic";

type InspectionPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: InspectionPageProps): Promise<Metadata> {
  const car = await getCarBySlug(getDb(), (await params).slug);
  return { title: car ? `Book an Inspection — ${car.name}` : "Car not found" };
}

export default async function BookInspectionPage({ params }: InspectionPageProps) {
  const { slug } = await params;
  const car = await getCarBySlug(getDb(), slug);
  if (!car) notFound();

  return (
    <main id="main-content">
      <BookInspectionForm car={car} />
      <div className="container" style={{ paddingBottom: "var(--space-7)", textAlign: "center" }}>
        <Link href={`/cars/${car.slug}`}>← Return to {car.name}</Link>
      </div>
    </main>
  );
}

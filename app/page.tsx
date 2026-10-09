import { HomePage } from "@/components/home/HomePage";
import { getDb } from "@/db";
import { listCars } from "@/lib/services/cars";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featuredCars = await listCars(getDb(), { featured: true });
  return <HomePage featuredCars={featuredCars} />;
}

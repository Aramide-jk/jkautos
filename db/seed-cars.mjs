import { neon } from "@neondatabase/serverless";

import cars from "../data/cars.json" with { type: "json" };

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Set DATABASE_URL, then run again.");
  process.exit(1);
}

const sql = neon(url);
let count = 0;

for (const car of cars) {
  await sql`
    insert into cars (slug, name, year, price, price_label, mileage, transmission, fuel, condition, location, colour, description, alt, image_note, featured, status, images, features, added_at)
    values (
      ${car.slug}, ${car.name}, ${car.year}, ${car.price}, ${car.priceLabel}, ${car.mileage}, ${car.transmission},
      ${car.fuel}, ${car.condition}, ${car.location}, ${car.colour}, ${car.description}, ${car.alt},
      ${car.imageNote ?? null}, ${car.featured}, 'available',
      ${JSON.stringify(car.images)}::jsonb, ${JSON.stringify(car.features)}::jsonb, ${car.addedAt}
    )
    on conflict (slug) do update set
      name = excluded.name, year = excluded.year, price = excluded.price, price_label = excluded.price_label,
      mileage = excluded.mileage, transmission = excluded.transmission, fuel = excluded.fuel,
      condition = excluded.condition, location = excluded.location, colour = excluded.colour,
      description = excluded.description, alt = excluded.alt, image_note = excluded.image_note,
      featured = excluded.featured, images = excluded.images, features = excluded.features, updated_at = now()
  `;
  count += 1;
}

console.log(`Seeded ${count} cars.`);

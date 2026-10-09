import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL;
const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD ?? "";

if (!url || !email || !password) {
  console.error("Set DATABASE_URL, ADMIN_EMAIL and ADMIN_PASSWORD, then run again.");
  process.exit(1);
}

const sql = neon(url);
const hash = await bcrypt.hash(password, 10);

await sql`
  insert into users (email, name, password_hash, role)
  values (${email}, ${email}, ${hash}, 'admin')
  on conflict (email) do update set password_hash = excluded.password_hash
`;

console.log(`Admin user ready: ${email}`);

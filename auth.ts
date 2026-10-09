import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { getDb } from "@/db";
import { users } from "@/db/schema";

import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const email = String(raw?.email ?? "").trim().toLowerCase();
        const password = String(raw?.password ?? "");
        if (!email || !password) return null;

        const db = getDb();
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (!user) return null;
        if (!(await bcrypt.compare(password, user.passwordHash))) return null;

        return { id: user.id, email: user.email, name: user.name ?? user.email };
      },
    }),
  ],
});

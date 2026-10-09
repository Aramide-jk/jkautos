import type { NextAuthConfig } from "next-auth";

/** Edge-safe base config (no Node-only imports) used by middleware. */
export const authConfig = {
  pages: { signIn: "/sign-in" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      if (!pathname.startsWith("/admin")) return true;
      return Boolean(auth?.user);
    },
  },
} satisfies NextAuthConfig;

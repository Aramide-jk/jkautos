# JK_AUTOS

Automotive brokerage site for Kaduna, Nigeria — **Buy Smart. Drive Safe.**

A single **Next.js (App Router) full-stack app** (pages + API + auth) deployed on **Vercel**.

## Stack

- **Next.js 16** (App Router) · React 19 · TypeScript
- **Postgres (Neon)** via **Drizzle ORM** — `db/`
- **Vercel Blob** for images — `lib/storage.ts`
- **Auth.js v5** for the `/admin` area — `auth.ts`, `auth.config.ts`, `proxy.ts`

## Getting started

```sh
npm install
cp .env.example .env.local   # fill in the values below
npm run dev                  # http://localhost:3000
```

### Environment

| Variable | Where |
| --- | --- |
| `DATABASE_URL` | Neon (Vercel Marketplace integration injects it) |
| `AUTH_SECRET` | `npx auth secret` |
| `BLOB_READ_WRITE_TOKEN` | Vercel → Storage → Blob |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | only for seeding the first admin |

### Database

```sh
npm run db:generate      # generate migrations from db/schema.ts
npm run db:migrate       # apply migrations
npm run db:seed-admin    # create the first admin from ADMIN_EMAIL/ADMIN_PASSWORD
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Next dev server (port 3000) |
| `npm run build` / `npm run start` | Production build / serve |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Typecheck |
| `npm run db:*` | Drizzle generate / migrate / push; `db:seed-admin`, `db:seed-cars` |

## Structure

- `app/` — routes (public marketing pages, `admin/`, `sign-in`, `api/auth`)
- `components/` — features (`cars`, `home`, `forms`, `info`, `layout`, `admin`) and vendored `ui/`
- `data/cars.json` — inventory seed fixture (loaded into Postgres by `npm run db:seed-cars`)
- `lib/` — site config, WhatsApp, validation, storage
- `db/` — Drizzle schema + Neon client; `drizzle/` — migrations

## Deploy

Push to a Vercel project, add the env vars and a Neon integration + Blob store, then run `npm run db:migrate` and `npm run db:seed-admin` once.

> Inventory and enquiries are stored in Postgres; seed the catalogue with `npm run db:seed-cars`.

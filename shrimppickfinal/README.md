# AquaNation SHOP

AquaNation SHOP is a Next.js App Router ecommerce app for ornamental aquarium fish, plants, and aquatic supplies with Supabase Auth, Database, Storage, and Realtime chat.

## v0 Upload

Upload the project files or zip to v0. The app includes your Supabase project URL and anon-key fallback in `lib/supabaseEnv.ts` so it can run immediately in v0 previews.

For a production Vercel deployment, add these environment variables in Project Settings:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nvgpowuzwqltzzlrzpez.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Local Development

```bash
npm install
npm run dev
```

## Supabase Setup

Run `supabase/schema.sql` in the Supabase SQL Editor. After creating your first account, make that account an admin:

```sql
update public.users
set is_admin = true
where email = 'your-email@example.com';
```

Storage buckets used by the app:

```text
items
receipts
reviews
```

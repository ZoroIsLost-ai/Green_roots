# प्रतिक्रिया फॉर्म — विभाग → जिला → नगर

A single-page Next.js 15 app that collects responses through a 3-level
dependent dropdown (विभाग → जिला → नगर), followed by a Name / Phone /
Location form, storing everything in Supabase. Includes a single-admin
dashboard to search, filter, paginate, export, and delete records.

## Tech stack

Next.js 15 (App Router) · React · TypeScript · Tailwind CSS ·
React Hook Form + Zod · Supabase · deployable on Vercel

## Project structure

```
app/
  page.tsx                 # public form (3 dropdowns + contact fields)
  layout.tsx                # root layout, Inter font, toaster
  admin/
    page.tsx                 # admin login
    dashboard/page.tsx        # protected admin dashboard
  api/
    hierarchy/route.ts        # serves data/hierarchy.json at runtime
    submit/route.ts            # validates + inserts a response
    admin/login/route.ts        # verifies credentials, sets session cookie
    admin/logout/route.ts        # clears session cookie
    admin/records/route.ts        # list w/ search, filter, pagination
    admin/records/[id]/route.ts    # delete a record
    admin/export/route.ts           # CSV export
components/          # DropdownField, InputField, SubmitButton, FormCard,
                      # AdminLogin, AdminTable, Navbar, Footer,
                      # LoadingSpinner, ToastNotification
hooks/useHierarchy.ts # fetches + derives dropdown options
lib/                  # supabase clients, auth (signed cookie), validation, utils
data/hierarchy.json   # the dropdown data — edit this, not the code
supabase/schema.sql   # table + RLS policy
middleware.ts         # protects /admin/dashboard and admin API routes
```

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run `supabase/schema.sql`. This creates the
   `responses` table and a row-level-security policy that only allows
   the public `anon` key to `INSERT` — all reads/updates/deletes go
   through the server using the service role key.
3. Copy your **Project URL**, **anon public key**, and
   **service_role key** from Project Settings → API.

## 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

ADMIN_USERNAME=
ADMIN_PASSWORD=

SESSION_SECRET=
```

Generate `SESSION_SECRET` with:

```bash
openssl rand -hex 32
```

`SUPABASE_SERVICE_ROLE_KEY` and `SESSION_SECRET` are server-only
secrets — never expose them with a `NEXT_PUBLIC_` prefix.

## 3. Edit the dropdown data

Open `data/hierarchy.json`. It's a plain nested object:

```json
{
  "विभाग 1": {
    "जिला 1.1": ["नगर 1.1.1", "नगर 1.1.2"],
    "जिला 1.2": ["नगर 1.2.1"]
  }
}
```

The included file ships with 8 विभाग, 4–8 जिला each, and ~12–15 नगर
each, using placeholder names (`विभाग 1`, `जिला 1.1`, `नगर 1.1.1`, …) —
replace them with your real names. The app reads this file from disk
on every request via `/api/hierarchy`, so updates take effect on the
next request without a code change or rebuild.

## 4. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the form and
`http://localhost:3000/admin` for the admin login.

## 5. Deploy to Vercel

1. Push this project to a Git repository.
2. Import it in [Vercel](https://vercel.com/new).
3. Add the same environment variables from step 2 in the Vercel
   project settings (Production, Preview, and Development as needed).
4. Deploy.

No build-time configuration is required beyond the environment
variables — `next build` / `next start` work out of the box.

## Admin panel

- `/admin` — login form. Credentials come from `ADMIN_USERNAME` /
  `ADMIN_PASSWORD`; there is no sign-up flow, by design (single admin).
- `/admin/dashboard` — protected by `middleware.ts`, which checks for
  a valid signed session cookie before allowing access. The cookie is
  HTTP-only, signed with `SESSION_SECRET`, and expires after 8 hours.
- Dashboard features: search across name/phone/location/नगर, filter
  by विभाग/जिला via the API, pagination (20 rows/page), CSV export
  (UTF-8 with BOM so Devanagari opens correctly in Excel), delete a
  record, and logout. Records are sorted newest-first.

## Notes on security

- The public form never talks to Supabase directly — it posts to
  `/api/submit`, which re-validates the payload server-side (client
  validation is a UX convenience, not the source of truth) and writes
  with the service role key.
- The admin API routes also use the service role key, and are only
  reachable once `middleware.ts` confirms a valid session cookie.
- Row Level Security on `responses` grants `INSERT` to `anon` only —
  there is intentionally no `anon` read/update/delete policy.

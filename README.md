# Laine

Calm yarn stash, projects, personal Guide, and invite-only Circles for serious knitters & crocheters.

**$9/month** Maker plan · Free core tools · PWA

## Stack
- Next.js App Router + TypeScript + Tailwind
- Local-first storage (works offline)
- Optional Supabase auth + cloud
- Lemon Squeezy / Dodo for $9 billing

## Run locally
```bash
npm install
npm run dev
```

## Deploy (your only job)
1. Push this repo to GitHub
2. Import on [Vercel](https://vercel.com)
3. Add env vars from `YOU-ONLY-ADD-THESE.md`
4. Run `supabase/schema.sql` in Supabase SQL editor
5. Open the URL on your phone → Add to Home Screen

## Product map
| Path | Feature |
|------|---------|
| `/` | Landing |
| `/stash` | Yarn inventory + search |
| `/projects` | WIPs + mark finished |
| `/guide` | Personalised Laine Guide |
| `/circles` | Invite-only rooms |
| `/pricing` | Free vs $9 |
| `/login` `/signup` | Auth shells |

## Design
Quiet luxury: ivory `#F9F7F4`, sage `#4A5D4E`, soft motion, reduced-motion safe.

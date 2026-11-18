# Car Market Intelligence Dashboard

React + TypeScript + Vite + Tailwind. Greek UI for used-car dealers and buyers. It talks to `CarReportsApi` (repo `CarScrapers`).

## Screens

Two sections in the header, plus the account menu (settings, sign out):

| Route | What it shows |
|---|---|
| `/opportunities?view=all` | **Όλες**: every scored listing, best discount vs the market first; suspiciously cheap ones are flagged and listed last. |
| `/opportunities?view=new` | **Νέες**: just published, ranked by net resale margin with *your* costs; filter "just fell below the fair price". |
| `/opportunities?view=negotiation` | **Διαπραγμάτευση**: sellers who already dropped the price (signal none/low/medium/high), with opening offer, target and savings. Two presets: *ripe* (long listed, still dear) and *all with a price drop*. |
| `/opportunities?view=flip` | **Ιδιώτης → Έμπορος**: private sellers asking less than dealers for similar cars. `&by=model` reads it per model (median to median). |
| `/brief/:listingId` | **Φάκελος** of one listing: fair price and range, price history chart, what to offer, risk flags, how reliable the estimate is, comparables. Opened from any row. |
| `/valuation` | **Αποτίμηση**: what a car is worth (model + year, mileage, optional fuel and engine size). |
| `/settings` | Password and two-factor authentication (MFA). |
| `/terms`, `/privacy` | Public legal pages. |

Old addresses (`/vfmdashboard`, `/negotiation`, `/competition`, `/fair-market-price`) redirect to the new ones.
All lists are filtered, sorted and paged **by the server**; filters apply with the button, not on every keystroke.
The estimates come from *asking* prices: differences below ~10% are market noise (tooltips and notes say so).

## Structure

```
src/
  api/          one axios client (client.ts: token + single-flight refresh), auth.ts, reports.ts, session.ts
  hooks/        useApi: load on key change, ignore late answers, Greek error text
  utils/        format.ts (money, %, km, dates), labels.ts (fuel, seller, confidence, signal)
  types/        what the API sends
  components/
    ui/         the design system: Button/LinkButton, Panel/StatTile, Field/TextInput/Select/Checkbox,
                Notice/Badge/Loading/Empty, Tabs, Pagination, DataTable (table on desktop, cards on phones)
    layout/     Header (nav + account menu), Footer, Page (one width/padding for every screen)
    opportunities/  filter form, query builder, columns, cells, list (state per view), per-model table
    brief/ valuation/  parts of those screens
  pages/        one file per route (lazy loaded)
```

## Run

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # type-check + production build
pnpm lint
```

The API address defaults to the deployed one; override with `VITE_API_BASE_URL`.
**Never commit `.env` files**: every `VITE_*` variable is shipped to the browser.

## Conventions

* **Use the ui kit** (`components/ui`) instead of writing button/card/input classes again; a new look is changed in one place.
* **One table**: add columns to `components/opportunities/columns.tsx`, not a new table. The column `key` is the server sort key.
* **All user-visible text is Greek.** Never show `err.message` (axios messages are English) or a raw API code: map codes to
  Greek in `components/brief/briefTexts.ts` / `utils/labels.ts`, with a Greek fallback for unknown codes. Numbers go through `utils/format.ts`.
* Navigation uses real links (`NavLink`/`Link`), so keyboard and middle-click work.
* The session (token, refresh token, email) is saved by `session.save` at login; a 401 triggers one shared refresh, and a failed refresh clears the session (the app shows the login screen).
* Always update this README when behaviour changes.

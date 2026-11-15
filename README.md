# Car Market Intelligence Dashboard

React + TypeScript + Vite + Tailwind + AG Grid. Greek UI for used-car dealers. It talks to `CarReportsApi`
(repo `CarScrapers`).

## Pages

| Route | What it shows |
|---|---|
| `/vfmdashboard` | Opportunities ranked by "% cheaper than the market price expected for this exact car", with expected price, savings in EUR, confidence and a warning for suspiciously cheap listings. |
| `/brief/:listingId` | "Φάκελος" of one listing (button in the leaderboard): fair price and range, days on the market, price history, what to offer (opening / target / walk-away) with the reasons, risk flags, comparable listings. Texts for the API's reason/flag codes live in `components/brief/briefTexts.ts`. |
| `/negotiation` | Listings whose sellers already dropped the price. |
| `/competition` | Private sellers vs dealers. |
| `/fair-market-price` | Price range for a car (model + mileage, optional fuel/cc) from the same price model as the score. |
| `/settings` | Account and MFA. |

The score is an estimate from *asking* prices: differences below ~10% are market noise (the UI says so in a tooltip).

## Run

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # type-check + production build
pnpm lint
```

Set the API address in the environment used by `src/api/apiClient.ts`.
**Never commit `.env` files**: every `VITE_*` variable is shipped to the browser.

## Conventions

* One component per file; shared UI pieces live next to their feature (`components/sourcing/ScoreBadge.tsx`).
* Navigation uses real links (`NavLink`), so keyboard and middle-click work.
* Always update this README when behaviour changes.

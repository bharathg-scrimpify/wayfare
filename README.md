# Wayfare

Frontend-only client prototype for a smart trip creation and organisation platform.
Source of truth for behaviour: `docs/Product_Document.xlsx`.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build
```

Needs internet for photos (Unsplash and Flickr keyword fallbacks) and the map (OpenStreetMap tiles). Everything has a graceful gradient fallback.

## What is in it

| Route | Screen |
|---|---|
| `/` | Home, three ways in |
| `/create` | Create a trip: search, multi-stop route, who, occasion, dates |
| `/trip/import` | Bring everything in: reel, file, text, screenshot, then confirm |
| `/trip` | Trip home: readiness ring, next step, bookings, wishlist, gaps |
| `/trip/itinerary` | Day by day, Fixed / Flexible / Wishlist, move with clash check |
| `/trip/discover` | Tinder-style swipe (drag, buttons, arrow keys) |
| `/trip/wishlist` | Strong fit / possible fit / saved for later |
| `/trip/group` | Invite, voting, batched activity |
| `/trip/concierge` | Flights, stays, visa, private, build for me, booking flow |
| `/trip/nearby` | What is around me (phone frame) |
| `/trip/final` | Final trip check |
| `/trip/dna` | Travel DNA |
| `/admin` | Backend team view |

Use the **Demo tour** button in the header to walk the story in order.

## How the prototype is wired

- `src/store/trip.tsx` is the single state store. **Gaps are computed live** from the itinerary (transfer, return flight, visa, booking, free time, tight timing, packed day, walking for parents). Every change re-runs them, so fixing something really removes the gap.
- `src/data/mock.ts` holds all mock data (trip, catalog, requests, people).
- `src/lib/images.ts` is the only place images are defined. Swap in licensed photos here.
- Design tokens live in `src/index.css`.

## Skills used (in `.claude/skills`)

- `taste-skill`, `soft-skill`, `output-skill` from github.com/Leonxlnx/taste-skill
- `ui-ux-pro-max` from github.com/nextlevelbuilder/ui-ux-pro-max-skill

`CLAUDE.md` tells Claude Code the design direction and the PRD rules to respect.

## Known limits (be upfront with the client)

- All data is mock. Link and file "reading", payments, concierge replies and notifications are simulated.
- Itinerary moves use a Move sheet with a clash check, not free drag-and-drop between days.
- Photos are fetched from the internet and not curated. Replace before a final demo.
- Single bundle (~800 KB). Fine for a demo, code-split before production.

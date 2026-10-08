# Wayfare: client prototype

A smart trip creation and organisation platform. Travellers bring everything they have researched and booked (reels, links, PDFs, confirmations) into one place and Wayfare turns it into one organised, practical itinerary, before, during and after planning.

Source of truth for product behaviour: `docs/Product_Document.xlsx` (the PRD). Read it before adding features.

## Goal of this repo
A frontend-only, mock-data prototype that makes a client fall in love. Every interaction must work with local state. No backend.

## Skills in this project (`.claude/skills`)
- `taste-skill`: anti-slop rules. Obey the pre-flight check (no em-dashes in UI copy, one accent, one radius system, Phosphor icons, real images, no AI-purple, motion must be motivated, reduced-motion honoured).
- `soft-skill`, `output-skill`: premium polish and full, untruncated output.
- `ui-ux-pro-max`: run `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain ux|style|typography|color|icons` for guidance; `--design-system` for a full recommendation.

Note: taste-skill is written for landing pages. For product screens apply its anti-slop, typography, colour, motion and a11y rules, not its landing-page layout rules.

## Design direction
- Airbnb-inspired: white canvas, huge rounded photography, one confident coral accent (`--color-brand`), friendly geometric sans (Figtree), generous whitespace, soft tinted shadows, pill controls, bottom tab bar on mobile.
- Tinder-inspired swipe: spring physics, rotation proportional to drag, LIKE/NOPE stamps fading in, velocity-based fling, card stack scaling behind.
- Shape rule: cards and images `rounded-3xl` (24px), controls and chips `rounded-full`, inputs `rounded-2xl`. No other radii.
- Item types: Fixed (ink, lock), Flexible (grey, arrows), Wishlist (brand tint, heart).
- Dials: DESIGN_VARIANCE 6, MOTION_INTENSITY 7, VISUAL_DENSITY 4.

## Product rules from the PRD (do not break)
- Curated: 3 to 5 suggestions max, never endless lists. Never suggest restaurants.
- Swipe right goes to Wishlist, never straight to the itinerary. Traveller decides.
- Confirmed bookings are Fixed. Changing one shows a warning.
- Every change re-checks the itinerary. Gap detection is always on and every gap has an action.
- Notifications are batched. Show "Since you last checked".
- Learn from behaviour, do not interrogate with questionnaires.
- Phygital: AI plus a human concierge team.

## Commands
- `npm run dev` start
- `npm run build` typecheck and build

## Images
All images go through `src/lib/images.ts`. Photos load from the internet with a gradient fallback. Replace with licensed, curated photos before a final demo.

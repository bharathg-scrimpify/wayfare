# Wayfare color direction

Decision document for the client demo. Fonts, layout, radii, photography, and motion stay as they are. Only the accent changes.

**Try first: Cove.** Replace three lines in `src/index.css`. Primary buttons, the logo, the headline accent, wishlist tints, the progress ring, and the mobile tab all follow those lines.

---

## The decision

Wayfare looks like Airbnb because the accent is in the same family as Airbnb Rausch, and it is painted on the same jobs: the main button, the heart, the active tab, the notification dot.

| | Hue | Saturation | Value | White text contrast |
|---|---|---|---|---|
| Wayfare today `#e31c5f` | 340° | 88% | 89% | 4.57:1 |
| Airbnb Rausch `#FF385C` | 349° | 78% | 100% | same hot-pink family |

Nine degrees apart. Both are a shout. A traveller who is holding reels, PDFs, and half-booked flights does not need a shout. They need the feeling that someone competent has already looked at the mess.

Cove is a deep sea blue, quiet enough to sit behind the photography and far enough from Airbnb, Booking.com navy, Apple system blue, and the green we already use for "this worked."

```css
--color-brand: #1A6278;
--color-brand-dark: #12485C;
--color-brand-soft: #E7F2F6;
```

White label on the button is **6.86:1**. Hover is **9.97:1**. Brand text on the soft wash is **6.02:1**. All clear WCAG AA for normal text (4.5:1).

---

## How to try it

Open `src/index.css`. Inside the `@theme` block, replace only these three lines:

```css
--color-brand: #1A6278;
--color-brand-dark: #12485C;
--color-brand-soft: #E7F2F6;
```

Leave ink, canvas, surface, line, ok, and warn alone. Leave Figtree alone. Reload the dev server.

Walk these screens, in this order, before deciding:

1. Home. The words "One trip." and the Start a trip button.
2. Discover. Wishlist wash, and the pass button (it will turn sea-colored; see the leak note below).
3. Itinerary. Wishlist and must-do chips next to amber warnings.
4. Trip home. Readiness ring and notification count.
5. Group. "Since you last checked" panel.
6. Phone width. The active bottom tab.

If Cove feels too blue in the room, paste Harbour. If the client wants the most serious, least "travel brand" option, paste North. All three are drop-in replacements of the same three lines.

---

## Why this color, for this product

Wayfare is not a marketplace and not a mood board. People arrive with research already done. The product turns that pile into one plan, then keeps checking it: missing transfer, tight timing, visa, a parent who cannot walk that far. A human concierge sits behind the AI. The emotional job is relief, then quiet confidence, then a small pleasure when a day finally fits.

That job sets the color rules:

- **Photography is the saturated color.** London, Istanbul, the Alps already fill the screen. The interface should hold them, the way Apple lets the product shot carry the color and Netflix lets the poster carry it. A hot accent fights the photo.
- **One accent, and it means the product.** Meta's useful lesson is semantic color: one color for action, a different color for success, a different color for caution. Today the pink is the button and also the high-severity gap. The same color says "tap me" and "something is wrong."
- **Lower the temperature.** Pink at 88% saturation raises arousal. Planning a trip with a group, a late landing, and an unconfirmed stay is already aroused. A deep, low-value blue settles the screen without going grey.
- **Stay off the famous travel blues.** Booking.com is `#003580`. A bright sky blue reads as an airline. Cove sits at hue 194°, value 47%. It is water at dusk, not a boarding pass.

What each reference contributed, and what was left behind:

| Reference | Taken | Left behind |
|---|---|---|
| Apple | White canvas, ink for structure, one accent used with restraint, secondary action stays an outline | System blue `#0071E3`. It would look like a default iOS app. |
| Netflix | Discipline. Color belongs to the content. Chrome stays quiet. | Red. Entertainment red is arousal, and it sits next door to the pink we are leaving. |
| Meta | Action, success, and warning are three different colors. Buttons are predictable. | Facebook blue and the Instagram gradient. Both are someone else's product. |

Dials for this pass stay where the product already set them: variance 6, motion 7, density 4. This is a recolor, not a redesign.

---

## Three palettes

All three keep the current neutrals and the current state colors.

Neutrals, unchanged:

| Token | Hex | Job |
|---|---|---|
| `--color-canvas` | `#ffffff` | Page |
| `--color-surface` | `#f7f7f7` | Quiet fills, chips at rest |
| `--color-line` | `#ebebeb` | Hairlines |
| `--color-ink` | `#222222` | Text, dark buttons, Fixed badge, selected chips |
| `--color-ink-2` | `#5f5f5f` | Body secondary. 6.39:1 on white |
| `--color-ink-3` | `#8a8a8a` | Meta labels. 3.45:1 on white, below AA for small text. Separate from this palette decision. |

State colors, unchanged:

| Token | Hex | Job |
|---|---|---|
| `--color-ok` / `--color-ok-soft` | `#0f8a5f` / `#e8f6ef` | Booked, no clash, interested, strong fit. Hue 159°. |
| `--color-warn` / `--color-warn-soft` | `#b45309` / `#fff4e0` | Confirmed booking about to change, requested, possible fit. Hue 26°. |

### 1. Cove, try this

Deep sea. Hue 194°. About 35° away from success green, so a booked check and a primary button do not blur together. Saturation 78%, under the 80% ceiling we use so accents stay expensive rather than neon.

| Token | Hex | White text | On the soft wash |
|---|---|---|---|
| `--color-brand` | `#1A6278` | 6.86:1 | 6.02:1 |
| `--color-brand-dark` | `#12485C` | 9.97:1 | 8.75:1 |
| `--color-brand-soft` | `#E7F2F6` | wash only | |

```css
--color-brand: #1A6278;
--color-brand-dark: #12485C;
--color-brand-soft: #E7F2F6;
```

Button shadow, once the leaks below are pointed at the token: `rgb(26 98 120 / 0.45)`.

Feeling in the demo: the trip is being held. The photos stay warm. The button is calm and clearly tappable.

### 2. Harbour, if Cove feels cold

Mineral teal. Hue 186°, saturation 74%. Softer, a little closer to the sea-glass end. It is 27° from success green, so checks and buttons are related but still separable. Choose this if the client says Cove feels corporate.

| Token | Hex | White text | On the soft wash |
|---|---|---|---|
| `--color-brand` | `#1F6F78` | 5.83:1 | 5.13:1 |
| `--color-brand-dark` | `#16555C` | 8.44:1 | 7.43:1 |
| `--color-brand-soft` | `#E6F3F4` | wash only | |

```css
--color-brand: #1F6F78;
--color-brand-dark: #16555C;
--color-brand-soft: #E6F3F4;
```

Shadow RGB: `31 111 120`.

### 3. North, if the client wants maximum trust

Dusk blue. Hue 218°, saturation 65%. The quietest of the three, closest to an Apple product accent without copying Apple blue. Clearest split from success green (58°). It does sit nearer the bright "you are here" map dot (`#2563eb`, hue 221°), which is a location marker and should stay brighter than the brand.

| Token | Hex | White text | On the soft wash |
|---|---|---|---|
| `--color-brand` | `#2C4A7C` | 8.83:1 | 7.86:1 |
| `--color-brand-dark` | `#1E3560` | 12.12:1 | 10.78:1 |
| `--color-brand-soft` | `#EEF2F8` | wash only | |

```css
--color-brand: #2C4A7C;
--color-brand-dark: #1E3560;
--color-brand-soft: #EEF2F8;
```

Shadow RGB: `44 74 124`.

---

## How the colors work together

The layout already has the right button system. The palette should respect it.

| Control | Fill | Label | Where you see it |
|---|---|---|---|
| Primary | brand | white | Start a trip, the one forward action |
| Primary hover | brand-dark | white | |
| Outline | white, ink border | ink | The second action. "Open my London trip" |
| Dark | ink | white | Selected chips, done, a committed choice |
| Ghost / soft | surface | ink | Low emphasis |
| Wishlist | brand-soft | brand-dark | Heart, must-go, must-do |
| Fixed | ink | white | A confirmed booking. Stays ink. A lock should feel final, not branded. |
| Flexible | surface, line border | ink | Movable. Stays grey. |
| Success | ok on ok-soft | | Booked, no time clash, strong group fit |
| Caution | warn on warn-soft | | Changing a fixed booking, requested, possible fit |

Primary is the only filled color button. Outline and ink do the rest. That pairing is what stops a recolor from still feeling like a themed marketplace: Airbnb paints the action pink; here the action is one deep color and every other control is ink or white.

Item types stay on their current logic. Wishlist is the only one that wears the brand, because it is still a feeling, not a commitment. Fixed stays ink. Flexible stays grey.

---

## Research behind the choice

### What the product is asking the color to do

Read from the product rules and the screens, not from a travel-category template.

- People start from three places: nothing, a pile of research, or tickets already booked. The first screen has to feel capable in all three.
- Swipe right saves to the wishlist. It does not drop a place into the itinerary. The heart is interest, not a booking. It should not look like a Tinder like or an Airbnb save.
- Confirmed bookings are fixed. Changing one warns you. That warning is amber on purpose. It must survive any brand change.
- Every edit rechecks the plan. Gaps are always on, and every gap has an action. Urgency needs its own color. It should not borrow the brand.
- Notifications are a batch: "Since you last checked." That panel is a soft wash, not an alarm badge. The wash can be brand-soft. The badge count can be brand. A high-severity gap should not be the same fill.
- The concierge is a person plus the system. The color should feel like a calm desk, not a campaign.

### What the skill search returned, and what was set aside

The design-system search for a calm trip planner returned an adventure palette: orange `#EA580C` on a cream page `#FFF7ED`, with teal as a secondary, plus a serif heading font. That match is for a destination marketing site. It is the wrong job.

Set aside, with the reason:

| Direction | Why it stays off this demo |
|---|---|
| Adventure orange + cream | Expedia and Kayak already own warm booking buttons. Cream pages are the default "premium travel" look, and they fight the white canvas we are keeping. |
| Sky blue `#0EA5E9` | Airline and tourism templates. Bright, high value, shouts over photography. |
| Booking navy `#003580` | The client will name it in the first minute. |
| Apple blue `#0071E3` | Reads as an unstyled system control. Contrast on white is only 4.70:1, tight for a 15px button label. |
| Lavender / AI purple | Meditation apps and generic AI products. Wayfare is practical, not mystical. |
| Netflix red `#E50914` | Same arousal as the current pink. White text is 4.79:1, technically passing, emotionally wrong. |
| Terracotta or clay | Warm boutique-hotel default. Not soothing on a tool people use while anxious. Current warning amber already holds the warm slot. |
| Olive green | Collides with `--color-ok`. Success and brand would become one color. |
| Raspberry or fig | Still the Airbnb family. A darker pink is still a pink. |

Real-estate "trust teal" (`#0F766E`) was the closest useful hit in the color library. Cove is that idea, shifted bluer so it does not sit on top of the success green, and deepened so it does not glow like a medical or crypto UI.

Typography search was ignored on purpose. Figtree stays.

### Contrast method

Ratios are WCAG relative luminance, white `#ffffff` against the fill, and the dark brand against the soft wash. Button labels are 15px semibold, so the bar is 4.5:1, not the 3:1 large-text bar. The current pink passes at 4.57:1, which is legal and still harsh. Cove passes with room.

---

## Where color lives, and how one edit reaches the site

**The configuration file is `src/index.css`, the `@theme` block at the top.**

Tailwind v4 reads `--color-brand` and generates the utilities the components already use: `bg-brand`, `text-brand`, `border-brand`, `bg-brand-soft`, `text-brand-dark`, `hover:bg-brand-dark`. The logo and the readiness ring read `var(--color-brand)` directly. There is no second theme file, no Tailwind config color map, and no per-page palette.

Change those three custom properties and every utility that names them updates. That covers the primary button fill, headline accent, logo, progress ring, active phone tab, notification count, wishlist and must-do chips, selected occasion cards, nearby note, group update panel, and DNA bars.

Do not add a new `tailwind.config` color object. This project is on the v4 `@theme` path. A second map would drift.

### What does not follow the token today

These are hardcoded to the current pink, or to a raw RGB of it. A three-line swap will leave them pink. For a client demo that is the main surprise to expect.

| Place | What stays stuck | Should it follow the brand? |
|---|---|---|
| `src/components/ui.tsx` primary button shadow, `rgb(227 28 95 / 0.7)` | Pink glow under the button | Yes |
| `src/pages/Import.tsx` splash shadow, same RGB | Pink glow on the import mark | Yes |
| `src/index.css` `.scanline` box-shadow, `rgb(227 28 95 / .5)` | Pink glow on the scan line. The line itself already uses `var(--color-brand)`. | Yes |
| `src/pages/Discover.tsx` taste-count flash, `#e31c5f` | Pink flash when a signal increments | Yes |
| `src/pages/Final.tsx` confetti, first color `#e31c5f` | One pink piece of confetti | Yes, as one piece among several |
| `src/data/mock.ts` Arpit's avatar `#e31c5f` | A person's color | No. Leave it. A person should not wear the product color. After the swap, Arpit staying rose is useful. |

### Colors that are coupled to brand and should be split later

These use `bg-brand` or `text-brand` today, so they will change with the swap. That is correct for some of them and wrong for others.

- **Pass control on Discover** uses `text-brand`. After the swap, "not interested" becomes the same sea as the logo. The PASS stamp itself is a separate hardcoded `#ff4d7e`, so the stamp stays hot pink while the button turns Cove. For the demo, mention it if someone notices. The lasting fix is a decline color of its own, not the brand token.
- **High-severity gaps** use `bg-brand` (`src/components/Shell.tsx`). A calm brand makes an urgent gap look like decoration. Medium gaps are hardcoded `#d97706` and low gaps `#0f8a5f`. The lasting fix is a `--color-danger` token for high gaps only. Do not point danger at the brand.
- **Swipe stamps** stay special on purpose: SAVE `#2dd68b`, PASS `#ff4d7e`, MUST GO `#60a5fa`. They are the physical card language, louder than the chrome. Do not retoken them into brand or the three gestures collapse into one color.
- **Map "you are here"** is `#2563eb`. It means location, not brand. Leave it.
- **WhatsApp green** `#25D366` is the WhatsApp mark. Leave it.
- **Toasts** use bright `#4ade80`, `#fbbf24`, `#93c5fd` on an ink pill. They are status icons on a dark surface, separate from the page palette.

### The shape that makes one edit truly global

The three hex values are enough for fills and text. Shadows break the promise because they repeat the pink as raw RGB.

When we wire it, the shadows should be derived, not copied:

```css
box-shadow: 0 8px 20px -8px color-mix(in srgb, var(--color-brand) 45%, transparent);
```

`color-mix` reads `--color-brand`, so a future palette change does not require hunting RGB values. No second config file. No JavaScript theme object. Components keep using `bg-brand` and `text-brand`.

A danger token, added beside the others only when we do that pass:

```css
--color-danger: #9F2D2D;
--color-danger-soft: #F8EAEA;
```

High gaps and the pass action would use that. Primary buttons would not. White on `#9F2D2D` is strong enough for a small dot and for text. It stays clear of brand, ok, and warn.

Until that pass, the practical rule is: **edit the three brand lines in `src/index.css` to try a palette. Expect the button glow, the import glow, the scanline glow, the taste-count flash, and one confetti color to lag behind.**

---

## What I would send

Put Cove on for the demo. Tell the client the layout is intentionally familiar and the color is the product's own: a deep sea, with ink for anything already booked, green for anything confirmed, amber when a confirmed booking is about to move.

If they flinch at blue, switch to Harbour in the same three lines while they watch. If they want it quieter still, switch to North. Do not offer orange, purple, or a second pink.

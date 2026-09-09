# Home promo/ad banners — backend API contract

The Home page renders one or more dynamic advertisement cards
(`src/components/PromoBannerCard.tsx`), driven entirely by the backend and auto-rotating when
there's more than one. Nothing about them is hardcoded in the app — the backend controls how many
exist, whether each is shown, its order, and all of its content.

Banners live under a `slot` (a placement key — currently only `"home"` is used, but the model
supports adding more placements later without a schema change). Within a slot there can be any
number of banners, each with its own `order`.

## Public endpoint (Home page)

```
GET /api/v1/promo-banner/home
```

No auth required. Returns only banners with `show: true`, sorted by `order` (ascending, then
`createdAt`).

### Response shape

```json
{
  "banners": [
    {
      "id": "66f...",
      "slot": "home",
      "order": 0,
      "show": true,
      "title": "Download the Cricket Score Counter app",
      "subTitle": "Now with live ball-by-ball scoring",
      "description": "Track every match from your pocket — free on iOS and Android.",
      "imageUrl": "https://cdn.example.com/banners/app-promo.png",
      "bannerUrl": "https://cdn.example.com/banners/app-promo-bg.jpg",
      "buttonText": "Get the app",
      "ctaUrl": "https://play.google.com/store/apps/details?id=com.cricketscorecounter.mobile",
      "buttonText1": "Learn more",
      "buttonLink1": "/about",
      "openInNewTab": true
    }
  ]
}
```

Wrapping in `{ "data": { "banners": [...] } }`, or returning a bare array, is also accepted.

| Field          | Type    | Notes                                                                 |
|----------------|---------|------------------------------------------------------------------------|
| `id`           | string  | Mongo document id. Needed for admin update/delete calls.              |
| `slot`         | string  | Placement key, e.g. `"home"`.                                         |
| `order`        | number  | Display/rotation order, ascending. Lower shows first.                 |
| `show`         | boolean | Master on/off switch for this one banner.                             |
| `title`        | string  | Headline text.                                                        |
| `subTitle`     | string  | Optional secondary line under the title.                              |
| `description`  | string  | Optional longer copy, clamped to 3 lines in the card.                 |
| `imageUrl`     | string  | Publicly reachable image URL, shown inline in the card.               |
| `bannerUrl`    | string  | Optional full-width background image behind the whole card (separate from `imageUrl`). Same `/`-prefix / absolute-URL rule. |
| `buttonText`   | string  | Primary button label. Button only renders if this and `ctaUrl` are set. |
| `ctaUrl`       | string  | Primary button destination. A `/`-prefixed path is an in-app route; anything else opens externally. |
| `buttonText1`  | string  | Optional secondary button label.                                      |
| `buttonLink1`  | string  | Optional secondary button destination. Same `/`-prefix rule as `ctaUrl`. |
| `openInNewTab` | boolean | Applies to external links (both buttons). Defaults to `true`.         |

`buttonText1`/`buttonLink1` are a pair — the backend rejects a save where exactly one of them is
set. Both empty means no second button renders.

The client also accepts a range of alternate field names per banner in case the backend lands with
different naming (e.g. `sub_title`, `button_text_1`, `button_link_1`, `ctaUrl1`, `visible` for
`show`) — see `normalize()` in `src/services/PromoBannerService.ts`.

## Admin endpoints

All require a logged-in user whose email is on the backend's admin allowlist (`ADMIN_EMAILS` env
var, comma-separated).

```
GET /api/v1/promo-banner/home/admin
Authorization: Bearer <admin JWT>
```
Returns every banner in the slot (shown and hidden), sorted by `order`. Same response shape as the
public endpoint.

```
POST /api/v1/promo-banner/home
Authorization: Bearer <admin JWT>
Content-Type: application/json
```
Creates a new banner in the slot. Body accepts any of the fields above (except `id`/`slot`, which
are set by the route). `order` defaults to "last" if omitted. Returns the created banner.

```
PUT /api/v1/promo-banner/home/:id
Authorization: Bearer <admin JWT>
Content-Type: application/json
```
Updates one existing banner by id. Body accepts any subset of fields — only what you send is
changed. 404s if the id doesn't exist in this slot. Returns the updated banner.

```
DELETE /api/v1/promo-banner/home/:id
Authorization: Bearer <admin JWT>
```
Deletes one banner by id. 404s if it doesn't exist in this slot.

## Admin UI

Logged in as the admin account, open **profile menu → Home Banners** (`/admin/promo-banner`) to
manage banners with a list + form UI instead of calling the API directly — same access check as
the existing Analytics page. It lists every banner (shown and hidden) with quick edit/delete, and
a dialog form for create/edit. On the frontend, Title, Image URL, Button text, and Button link are
required to save a banner; Sub-title, Description, and the second button are optional.

## Validation

The backend rejects a bad request with `400` and a `message` before writing anything:

- Any field sent with the wrong type (e.g. `"show": "yes"` instead of a boolean, or `"order":
  "1"` instead of a number).
- `ctaUrl`, `imageUrl`, `bannerUrl`, or `buttonLink1` set to something that isn't empty, doesn't
  start with `/`, and isn't an absolute `http://`/`https://` URL.
- Exactly one of `buttonText1`/`buttonLink1` set (must be both or neither).
- `show: true` when the resulting banner (after merging this request onto whatever's already
  saved) would still have no `title` and no `imageUrl` — an admin can't accidentally publish an
  empty card.

The admin form surfaces these as inline warnings before saving where it can, and shows the
server's error message if a save is rejected anyway.

Example — create a banner with a primary and secondary button:

```bash
curl -X POST https://api.cricket-score-counter.com/api/v1/promo-banner/home \
  -H "Authorization: Bearer <admin JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "show": true,
    "order": 0,
    "title": "Download the Cricket Score Counter app",
    "subTitle": "Now with live ball-by-ball scoring",
    "description": "Track every match from your pocket.",
    "imageUrl": "https://cdn.example.com/banners/app-promo.png",
    "buttonText": "Get the app",
    "ctaUrl": "https://play.google.com/store/apps/details?id=com.cricketscorecounter.mobile",
    "buttonText1": "Learn more",
    "buttonLink1": "/about",
    "openInNewTab": true
  }'
```

## Analytics tracking

Every impression and click on the live banner is tracked two ways, automatically -- no
per-banner setup required:

- **GA4** (via `dataLayer`/`gtag`, same pipeline as the rest of the app's `data-ga-click`
  buttons): a `promo_banner_view` event fires once per banner each time it scrolls into view
  (at least 50% visible), and a `click` event fires on either button, both carrying
  `bannerId`/`slot`/`bannerTitle`/position detail as extra event params (see
  `data-ga-meta-*` attributes and `trackGAEvent` in `useGAClickTracking.ts`).
- **Our own analytics backend**: `PROMO_BANNER_VIEW` and `PROMO_BANNER_CLICK` events (see
  `AnalyticsService.trackPromoBannerView` / `trackPromoBannerClick`), each with
  `metadata: { bannerId, slot, title, ... }`. Clicks additionally carry `ctaKind`
  (`"primary"` or `"secondary"`), `buttonText`, and the destination `url`. These show up on
  the admin **Analytics** dashboard (`/admin/analytics`) as "Ad banner views" / "Ad banner
  clicks" totals (today / 7-day / 30-day, and in the 14-day table) and a "Most clicked ad
  banners" list.

Auto-rotation pauses while the card has hover or keyboard focus, and is skipped entirely for
visitors with reduced-motion enabled -- neither of those affects tracking, which is driven by
actual visibility, not the rotation timer.

## Failure behavior

If the endpoint 404s, errors, or hasn't been built yet, the card section simply doesn't render —
it never breaks the Home page. The client polls every 5 minutes while the Home page is open, so
adding, editing, reordering, or hiding banners from the backend reaches visitors without a client
release or page reload. With more than one visible banner, the card auto-rotates through them
every 6 seconds and shows dot indicators.

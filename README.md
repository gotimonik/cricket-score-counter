# Cricket Score Counter

Cricket Score Counter is a React + TypeScript web app to create, join, and track live cricket matches with ball-by-ball scoring, match sharing, and saved match history.

## Features

- Create and score live matches (`/create-game`, `/v1/create-game`)
- Join and view live matches by game ID (`/join-game/:gameId`, `/v1/join-game/:gameId`)
- Match history view (`/match-history/:historyId`, `/v1/match-history/:historyId`)
- App preferences:
  - Version switch (`old` / `v1`)
  - Theme selection (Ocean, Forest, Sunset, Sky, Copper, Midnight, Rose, Emerald)
  - Font size (Small / Medium / Large)
  - Reduce Motion
  - Compact Mode
- Player scorecard and roster-based scoring flows
- GA event/page tracking hooks
- SEO support (`MetaHelmet`, `robots.txt`, `sitemap.xml`)

## Tech Stack

- React 18
- TypeScript
- Material UI (MUI)
- React Router
- i18next (multi-language support)
- socket.io-client (live updates)
- react-helmet (SEO metadata)

## Project Structure

```text
src/
  components/      # Main screens and shared UI (Home, AppBar, ScoreDisplay, etc.)
  modals/          # Match/scoring modal flows
  hooks/           # Analytics/navigation hooks
  services/        # Match and websocket services
  utils/           # Preferences, routes, constants, completed matches
  css/             # Global theming/compact/reduced-motion styles
  types/           # App and analytics types
public/
  index.html
  robots.txt
  sitemap.xml
  manifest.json
  logo.png
```

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+

## Environment Variables

Create a `.env` file in project root:

```env
REACT_APP_WEBSOCKET_API_URL=wss://api.cricket-score-counter.com
```

Optional:

- `REACT_APP_SITE_URL` (used for canonical/meta URL base, defaults to `https://www.cricket-score-counter.com`)

## Scripts

```bash
npm install
npm start      # local development
npm run build  # production build
npm test       # test runner (if tests are added)
```

## Routing

Public app routes are available in both base and `v1` versions:

- `/`, `/v1/`
- `/create-game`, `/v1/create-game`
- `/join-game`, `/v1/join-game`
- `/join-game/:gameId`, `/v1/join-game/:gameId`
- `/match-history/:historyId`, `/v1/match-history/:historyId`
- `/privacy-policy`, `/v1/privacy-policy`
- `/disclaimer`, `/v1/disclaimer`

## Theming and Preferences

Theme and UI preferences are stored in `localStorage` and applied through CSS variables and HTML data attributes.

Key files:

- `src/utils/appPreferences.ts`
- `src/components/AppPreferencesDialog.tsx`
- `src/css/global.css`

## SEO Notes

- Sitemap: `public/sitemap.xml`
- Robots: `public/robots.txt`
- Canonical + OG/Twitter + schema metadata: `src/components/MetaHelmet.tsx`

After URL/route changes, update sitemap and re-submit in Google Search Console.

## Deployment

This app builds static assets with CRA (`react-scripts build`) into `build/`.

Deploy the `build/` directory to your static hosting platform of choice (Netlify, Vercel, S3+CloudFront, etc.), and ensure:

- HTTPS + preferred host redirect (`www` vs non-`www`) is consistent
- SPA route fallback serves `index.html`
- `robots.txt` and `sitemap.xml` are publicly accessible

## Notes for Contributors

- Keep UI theme-safe by using CSS variables:
  - `--app-accent-start`
  - `--app-accent-end`
  - `--app-accent-text`
  - `--app-font-scale`
- Prefer `rg` for search when working locally.
- Run `npm run build` before finalizing UI or routing changes.

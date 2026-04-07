# Powerlifting Program Web App — Design Spec
**Date:** 2026-04-06

## Overview

A mobile-first web app for displaying and logging a powerlifting training program backed by Google Sheets. Two users each have their own Google Spreadsheet (their program). The app reads the program and writes logged weights and actual RPEs back to the sheet in real time.

---

## Stack & Deployment

- **Framework:** Next.js 14 (App Router)
- **Deployment:** Vercel
- **Data source:** Google Sheets API via service account (server-side only)
- **No database** — Google Sheets is the single source of truth

---

## Authentication

PIN-based. Two users, each with a 4-digit PIN. Entering a PIN sets a session cookie server-side. No username picker — the app identifies the user from the PIN alone.

| User    | PIN  |
|---------|------|
| Victor  | 1738 |
| Anthony | 0009 |

PINs and sheet IDs are stored in Vercel environment variables, never in the codebase:

```
USER_1_NAME=Victor
USER_1_PIN=1738
USER_1_SHEET_ID=<Victor's Google Sheet ID>

USER_2_NAME=Anthony
USER_2_PIN=0009
USER_2_SHEET_ID=<Anthony's Google Sheet ID>

GOOGLE_SERVICE_ACCOUNT_JSON='{...}'
```

---

## Google Sheets Integration

**Connection method:** Service account. Each spreadsheet is shared with the service account email. All API calls happen in Next.js API routes — credentials never reach the browser.

**API routes:**

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth` | POST | Verify PIN, set session cookie |
| `/api/weeks` | GET | List sheet tabs (Week 1, Week 2…) |
| `/api/session` | GET | Fetch day block (`?week=1&day=2`) |
| `/api/session` | PATCH | Write a single cell (weight or actual RPE) |

---

## Sheet Structure & Parsing

Each spreadsheet follows this structure (one tab per week):

- **Rows 1–2:** Week label and date — skipped
- **Day blocks:** Detected when column A starts with `"Day "`. Each day header row contains column labels in B–G. Days are separated by empty rows.
- **Accessories section:** Within a day block, a row where column A equals `"Accessories"` splits main lifts from accessories.

**Column mapping:**

| Col | Field | Editable |
|-----|-------|----------|
| A | Exercise name | No |
| B | Sets | No |
| C | Weight Used | Yes |
| D | Prescribed reps | No |
| E | Prescribed RPE (or RIR for accessories) | No |
| F | Actual RPE | Yes (hidden for accessories) |
| G | Notes | No |

**Editable fields:** Weight Used (col C) and Actual RPE (col F) only.

**Write-back:** On field blur/Enter, the app calculates the exact cell address (e.g. `C14`) and PATCHes that cell via the Sheets API. A brief green flash confirms a successful save.

---

## Navigation

Manual week/day selection — no auto-advance or remembered position.

1. User selects a week (all weeks available, past weeks visually dimmed)
2. User selects a day (Day 1–4 shown with their titles)
3. Session view opens

---

## Screens

### 1. PIN Screen (`/`)
- Full-screen centered layout
- App name at top
- Numpad-style PIN entry
- Identifies user from PIN automatically

### 2. Week/Day Selector (`/select`)
- Week cards in a grid (Week 1, Week 2…)
- Tap a week → Day 1–4 appear below with their titles
- Tap a day → navigate to session view
- Past weeks dimmed but accessible

### 3. Session View (`/session/[week]/[day]`)
- **Header:** Red gradient, "Week X · Day Y" + day title (e.g. "Primary Squat + Bench")
- **Main lifts section:** Exercise cards showing name, sets×reps, prescribed RPE. Weight Used and Actual RPE are tappable inline fields. Blur or Enter triggers a PATCH and shows a green save flash.
- **Accessories section:** Same card style, shows RIR instead of RPE, no Actual RPE field.
- **Back button:** Returns to week/day selector

---

## Visual Style

**Bold Sport** aesthetic: deep navy background (`#1a1a2e`), red gradient accent (`#e63946` → `#c1121f`), high-contrast white text, bold uppercase labels. Mobile-first, touch-friendly tap targets.

---

## Out of Scope

- Push notifications or reminders
- Progress charts or analytics
- Offline support
- Adding or editing exercises (sheet is the source of truth for program structure)
- Notes field editing (read-only in app)

# CredGeek

Voice-first, gamified companion that helps women with no credit history learn money basics, climb a six-rung path to their **own** credit file, and re-check every three months that their documents are not being misused. Cloudinary carries all media: lesson audio, images and voice answers.

Design doc and flow map: the "Credit Ladder: flow map and gamification design" doc.

## Run it in 2 minutes

```bash
npm install
cp .env.example .env          # default is CLOUDINARY_MOCK=1: runs fully offline
npm run audio:warm            # pre-generates lesson audio (mock tone) and caches it
npm start                     # http://localhost:3000
npm test                      # 24 tests
```

Go live on Cloudinary (mandatory in production):

```bash
# .env
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
CLOUDINARY_MOCK=0
npm run cloudinary:check      # live smoke test of every Cloudinary path we use; must print all PASS
npm run assets:upload         # placeholder art (also auto-seeded at boot)
TTS_PROVIDER=sarvam STT_PROVIDER=sarvam SARVAM_API_KEY=...   # real Hindi/English voice
npm run audio:warm            # pay for TTS once per string, then never again
```

`NODE_ENV=production` refuses to boot with `CLOUDINARY_MOCK=1`, with missing Cloudinary credentials, or with a `JWT_SECRET` under 32 chars.

## Architecture

```
 PWA (vanilla JS, no build)                         Express API (Node 22)
 ┌────────────────────────┐   JSON    ┌───────────────────────────────────────────────┐
 │ Hook · Lessons · Games │──────────▶│ routes/api.js  (zod-validated, JWT, rate-limit)│
 │ Ladder · Tree · Safety │           │   │            │             │                 │
 │ 🔊 player  🎤 recorder │           │   ▼            ▼             ▼                 │
 └───────┬──────────▲─────┘           │ engine/      content/     cloudinary/          │
         │          │ mp3, images     │  behaviour   lessons      store.js  (interface)│
         │          │ (CDN, cached    │  gamification games       audio.js  (TTS cache)│
         │          │  by SW)         │  voiceIntent  misc        voice.js  (STT flow) │
         │          │                 │               speakables  images.js seed.js    │
         │   ┌──────┴───────┐         │      SQLite (node:sqlite)  providers/speech.js │
         └──▶│  Cloudinary  │◀────────┤      users · progress · tts_cache · assets     │
  signed     │  CDN + store │ upload  └──────────────┬────────────────────────────────┘
  upload     └──────────────┘ /sign/destroy          │ Sarvam (or BHASHINI) TTS / STT
```

Rule of thumb: **only `src/cloudinary/store.js` imports the Cloudinary SDK.** Everything else uses its interface, so tests run offline and the live behaviour is verified by `cloudinary:check`.

## Cloudinary design (what is done and why)

| Need | Approach | Why it is cheap/safe |
|---|---|---|
| Lesson and question audio | `ensureAudio()`: SQLite cache, then Cloudinary Admin lookup, then TTS, then upload as `resource_type: video`, public ID `credit-ladder/tts/{lang}/{sha256(text,lang,voice)}`, `overwrite:false`, `eager_async` 48k mp3 derivative | Each string is synthesized once, ever. Single-flight map: 50 learners opening a new lesson cause one TTS call. Delivery URL uses the same transformation as the eager build, so the first listener hits a warm CDN copy. |
| Only known text becomes audio | `GET /api/audio/:id` accepts ids from `content/speakables.js`, never free text | TTS bill cannot be abused. |
| Pre-warm | `npm run audio:warm` (3 concurrent) | Nobody waits on synthesis during a demo. |
| Images (lessons, rungs, badges) | `imageSet()`: `f_auto,q_auto,c_limit`, widths 160/320/480/720 as `srcset` | Small bytes on cheap phones and slow networks. Art lives at `credit-ladder/img/{kind}/{name}`; overwrite to replace. |
| Voice answers (most sensitive data) | Server signs params; browser uploads **directly** to Cloudinary with `type: authenticated` into `credit-ladder/voice/{userId}/…`; server verifies ownership, size, duration, then reads via a **120-second signed private download URL**, sends to STT, then **destroys the asset** (also in `finally` on any error) | No public URL ever exists. Audio lives seconds. Our server never proxies the upload. |
| Safety nets | `sweepVoice` every 15 min removes anything older than `VOICE_MAX_AGE_MIN` (DB rows and orphans found by prefix); `DELETE /api/me` runs `delete_resources_by_prefix` for that user | Abandoned recordings and "delete my data" are both covered. |
| Webhook | `POST /api/webhooks/cloudinary`: raw body, SDK signature check, 2-hour timestamp window; records bytes/duration/format so transcription skips an Admin API call | Admin API rate limits are not a bottleneck at scale. |
| Signed upload | All sent params are signed (`public_id, type, tags, allowed_formats, timestamp`); API secret never leaves the server (asserted in a test) | Browser cannot upload to someone else's folder or another type. |
| Offline shell | Service worker caches Cloudinary mp3/images (not `Range` requests, never `/api`) | Lessons replay with no data. |

Not stored anywhere: Aadhaar, PAN, phone, email, or document images. The safety check-up sends her to official sites and records only `familiar` / `unfamiliar` per step.

## Mapping to the flow map

| Flow-map stage | Code |
|---|---|
| 1 Hook | `content/misc.js hook`, `GET /api/hook`, `POST /api/me/hook` |
| 2 Daily journey, night question | `routes/api.js` lessons, `GET/POST /api/night` (one optional tap a day) |
| 3 Behaviour engine | `engine/behaviour.js`: pace, voice/text mode, next step, risk reroute. Rules, no LLM |
| Credit ladder 0-5 | `engine/gamification.js ladderState/completeRung`, gates in `content/misc.js rungs` |
| Games | Kirana Basket, Spot the Trap, Story Choices (`content/games.js`, scored server-side); Score Tree (`/api/tree`); Document Detective (`/api/safety`); Night Question |
| Safety check-up | `/api/safety` quarterly; unfamiliar answers return 181 / 15100 / bureau-dispute steps |
| Voice both ways | 🔊 `/api/audio/:id` (Cloudinary mp3); 🎤 `/api/voice/*` (Cloudinary then STT then intent match) |

## Gamified Experience & UI Design System

Built strictly to the **"Credit Ladder: flow map and gamification design"** specification:

- **Interactive Snakes & Ladders Credit Board**:
  - Stepping stones connecting 6 rungs from Rung 0 (Own Account & Number) to Rung 5 (Graduate to Unsecured Card).
  - **Golden Accent on Rung 2**: Highlights the secured card milestone where her official credit file begins.
  - **Ladders**: Good financial habits (auto-paying bills, keeping FD untouched, paying in full).
  - **Snakes**: Real-life financial traps (missed payment date, maxing out limit, sharing OTP) with what-if recovery scenarios.
- **Kirana Basket Mini-Game**:
  - Interactive grocery shop teaching *Needs vs. Wants* with a dynamic ₹1,000 monthly budget meter.
  - Real-time category tags (Needs, Wants, and Gullak Savings Pot) with spoken rupee prices.
  - End-of-game celebration modal with Gullak coin rewards and actionable takeaways.
- **Spot the Trap Swipe Shield**:
  - Card deck evaluating predatory digital lending apps against official RBI regulations.
  - Interactive Safe vs. Trap judgment with instantaneous feedback and Trap Spotter badges.
- **Score Tree (Patience Visualizer)**:
  - Concentric growth ring visualization where rings represent on-time payment months.
  - **Compassionate Pause Rule**: Missed months pause the tree under a protective canopy—**it never resets, dies, or punishes**.
  - **6-Month Fast-Forward Simulator**: 1-click test button to demo 6 on-time payment months and tree blooming.
- **Document Detective (Quarterly Safety Check-Up)**:
  - Guided checks for UIDAI Aadhaar authentication history, Sanchar Saathi (TAFCOP) registered SIMs, and free annual CIBIL reports.
  - Unfamiliar items open a dedicated protection drawer with 1-tap direct dial buttons for **Women Helpline (181)** and **NALSA Free Legal Aid (15100)**.
- **Discreet Privacy Mode**:
  - 1-tap camouflage converts the entire app into a benign household grocery shopping list.
  - Protected with a 3-tap secret unlock to return to the dashboard.
- **Web Audio SFX & Particle Engine**:
  - In-browser synthesized audio cues (coin dings, fanfare chords, warning buzzers) with zero network latency.
  - Full-screen confetti particle celebration on milestones and game completions.

## API summary

`POST /api/auth/register|login` · `GET /api/me` · `PATCH /api/me` · `DELETE /api/me` · `GET /api/hook` · `POST /api/me/hook` · `GET /api/journey/next` · `GET /api/lessons[/:id]` · `POST /api/lessons/:id/complete` · `GET /api/audio/:id` · `GET|POST /api/games/{kirana,trap,story}` · `GET|POST /api/night` · `GET /api/ladder` · `POST /api/ladder/:n/complete` · `POST /api/tree` · `GET /api/safety` · `POST /api/safety/:step` · `POST /api/voice/sign` · `POST /api/voice/transcribe` · `POST /api/webhooks/cloudinary` · `GET /api/health`

## Security and privacy

- Nickname + PIN only (scrypt hash, timing-safe compare), 30-day JWT, per-route rate limits, strict CSP (Google Fonts and `res.cloudinary.com` allowed).
- Ownership checks on every voice asset: signed by us, for that user, inside that user's folder.
- Neutral name and icon; no push notifications. Instant 1-tap Discreet Privacy Mode masks the app as a grocery list.

## Verified vs not verified

- Verified here: 24 automated tests (API, game scoring, gating, audio cache and single-flight, voice flow, sweep, webhook, config guards, **real Cloudinary SDK URL building, signing and webhook verification**), and full browser validation across mobile viewports.
- **To verify live on Cloudinary:** Run `npm run cloudinary:check` with live credentials; it tests upload, eager derivatives, authenticated assets, and signed private downloads.

## Demo script (3 minutes)

1. **Quick Login**: Open `http://localhost:3000` and tap **"Priya (Rung 2 Demo)"** for 1-click sample login.
2. **Snakes & Ladders Board**: Tap **"Ladder"** on the bottom dock. Tap **Rung 2** to inspect the golden accent and FD backing. Tap green ladders and red snakes to test what-if scenarios.
3. **Kirana Basket**: Tap **"Games"** > **"Play Basket"**. Add groceries and Gullak savings under ₹1,000 to win coins and trigger confetti.
4. **Spot the Trap**: Tap **"Play Trap Shield"** and swipe through suspicious loan offers to earn the Trap Spotter badge.
5. **Score Tree**: Tap **"Tree"**. Click **"Simulate 6 On-Time Months"** to watch the concentric rings bloom and unlock Rung 4.
6. **Safety Check-Up**: Tap **"Safety"**. Click **"Something looks unfamiliar"** to reveal the emergency help drawer with 1-tap call buttons for **181** and **15100**.
7. **Discreet Mode**: Tap the mask icon (**"Discreet"**) in the top header to camouflage the app as a grocery list, then triple-tap **"Unlock App"** to return.
8. **Settings**: Open Settings and click **"Delete All My Data"** to verify complete account purging.

# 50th Birthday Celebration — Digital Invitation

A premium, mobile-first digital invitation with RSVP, live birthday wishes,
countdown timer, and Google Maps / Calendar / Sheets integration.

Everything below is written so you can deploy this **without writing any
code** — just copy/paste and click through the steps.

---

## What's in this project

```
birthday-invitation/
├── index.html                    → the page structure
├── style.css                     → all visual styling
├── script.js                     → config + all interactive behavior
├── assets/
│   ├── images/                   → put celebrant.jpg (or similar) here
│   ├── videos/                   → optional
│   └── music/                    → put invitation-music.mp3 here
├── google-apps-script/
│   └── Code.gs                   → RSVP backend (paste into Apps Script)
└── README.md                     → this file
```

You do **not** need a server, database, or paid hosting. GitHub Pages hosts
the static site for free, and Google Sheets + Apps Script act as the free
RSVP database and API.

---

## Part 1 — Set up the Google Sheet (2 minutes)

1. Go to [sheets.google.com](https://sheets.google.com) and create a new
   blank spreadsheet. Name it something like **"50th Birthday RSVPs"**.
2. Rename the first tab (bottom-left) to exactly: `RSVP`
3. In row 1, add these headers exactly, one per column (A–E):

   | A | B | C | D | E |
   |---|---|---|---|---|
   | Timestamp | Full Name | Attendance | Number of Guests | Wishes / Message |

   (You can actually skip this — `Code.gs` will create the header row
   automatically the first time it runs if the sheet is empty. But it's
   good to have it there so the sheet is readable immediately.)

---

## Part 2 — Deploy the Apps Script backend (5 minutes)

1. In your Google Sheet, click **Extensions → Apps Script**.
2. Delete any starter code in the editor, then paste in the entire
   contents of `google-apps-script/Code.gs` from this project.
3. Click the **Save** icon (or `Ctrl/Cmd + S`).
4. Click **Deploy → New deployment**.
5. Click the gear icon next to "Select type" and choose **Web app**.
6. Fill in:
   - **Description:** `RSVP API v1` (anything you like)
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`

   > "Anyone" is required so the public invitation page can submit RSVPs
   > and read wishes without asking guests to log in. Your Sheet itself
   > stays private — only the specific fields `Code.gs` chooses to return
   > (name + message, for wishes) are ever exposed.

7. Click **Deploy**. Google will ask you to **authorize** the script —
   this is Google's own permission prompt (not something I can do for
   you). Click through:
   - "Authorize access" → choose your Google account
   - You may see an "unverified app" warning since this is your own
     private script — click **Advanced → Go to (project name) (unsafe)**
     → **Allow**. This is expected for personal scripts you haven't
     submitted for Google's app review; it's safe because it's your own
     code running under your own account.
8. Copy the **Web app URL** shown after deployment. It looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

Keep this tab open — you'll paste that URL in the next step.

**To update the script later:** edit `Code.gs` in the Apps Script editor,
then **Deploy → Manage deployments → (pencil/edit icon) → New version →
Deploy**. Editing the code alone does not update the live URL until you
deploy a new version.

---

## Part 3 — Connect the website to your Sheet (1 minute)

1. Open `script.js` in this project.
2. Find this line near the top, inside `EVENT_CONFIG`:
   ```js
   appsScriptUrl: "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE",
   ```
3. Replace the placeholder with the Web app URL you copied in Part 2:
   ```js
   appsScriptUrl: "https://script.google.com/macros/s/AKfycb.../exec",
   ```
4. Save the file.

That's it — RSVP submissions and the live wishes feed are now connected.

---

## Part 4 — Add your media (optional but recommended)

Drop your files into these folders using these exact names (or update the
paths in `index.html` / `script.js` if you'd rather use different names):

- `assets/images/celebrant.jpg` — the birthday person's photo used in the
  "Guest of Honour" section. If this file is missing, the site
  automatically shows an elegant placeholder instead of a broken image —
  nothing breaks.
- `assets/music/invitation-music.mp3` — background music, started only
  after the guest taps **Open Invitation** (browsers block audio autoplay
  before a user interacts with the page, so this is expected behavior,
  not a bug).

**Before uploading, compress your media:**
- Images: resize to roughly 1200px on the long edge and use
  [squoosh.app](https://squoosh.app) to export as WebP or compressed JPEG
  (aim for under 300KB each).
- Music: an MP3 at 128kbps is plenty for background music and keeps the
  file small (aim for under 3–4MB for a 2–3 minute track).

---

## Part 5 — Deploy to GitHub Pages (5 minutes)

I don't have access to your GitHub account, so this part needs to be done
from your side — it's quick:

1. Go to [github.com/new](https://github.com/new) and create a new
   repository (e.g. `birthday-invitation`). Public or private both work
   with GitHub Pages (private repos need GitHub Pro/Team/Enterprise for
   Pages, so **public** is simplest for a free account).
2. Upload all files from this project into the repository, keeping the
   same folder structure (`index.html` at the root, `assets/` folder,
   etc.). You can do this via:
   - **Drag and drop** on the GitHub web UI ("Add file → Upload files"), or
   - **Git command line:**
     ```bash
     git init
     git add .
     git commit -m "Initial invitation site"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/birthday-invitation.git
     git push -u origin main
     ```
3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a
   branch**.
5. Under **Branch**, choose `main` and folder `/ (root)`, then **Save**.
6. Wait 1–2 minutes. Your site will be live at:
   `https://YOUR_USERNAME.github.io/birthday-invitation/`

GitHub will show the live URL at the top of the Pages settings once it's
ready.

---

## Maintenance — changing things later

Almost everything lives in **one place**: the `EVENT_CONFIG` object at the
top of `script.js`. Open that file, edit the values, save, and re-upload
(or `git push`) — no other file needs to change for these:

| To change... | Edit in `script.js` |
|---|---|
| Birthday person's name | `birthdayPerson` |
| Date | `date` and `dateDisplay` |
| Start / end time | `startTime`, `endTime` |
| Venue name | `venue` |
| Venue address | `address` |
| Bank account details | `bankAccount` |
| Gift delivery address | `giftAddress` |
| RSVP backend URL | `appsScriptUrl` |

**Photos / videos:** replace the files in `assets/images/` or
`assets/videos/` using the same filenames, or update the `src` paths in
`index.html` if you use different filenames.

**Music:** replace `assets/music/invitation-music.mp3` with a new file of
the same name, or update the `<source>` path in `index.html`.

**Google Sheet / RSVP data:** just open your Google Sheet directly any
time to view, export (File → Download → CSV/Excel), sort, or back up
responses. No website changes needed.

**Apps Script changes:** edit `Code.gs` in the Apps Script editor, then
redeploy a new version (see Part 2's note on updating).

---

## Requirements checklist

- [x] Opening cover with animation and "Open Invitation" CTA
- [x] Birthday person name fully configurable via `EVENT_CONFIG.birthdayPerson`
- [x] Date: 5 September 2026 / Time: 18:00 WIB
- [x] Live countdown (days/hours/minutes/seconds), Asia/Jakarta timezone-correct, updates every second, replaced by a completion message after the event
- [x] Venue name + full address displayed
- [x] "View Location" button opens Google Maps via a search URL built from the address
- [x] "Save the Date" button opens Google Calendar pre-filled with title, date, time, venue, address, and description
- [x] RSVP form: full name, attendance, guest count (auto-disabled/zeroed on "Not Attending"), message
- [x] RSVP submissions sync to Google Sheets, new row per submission, timestamp auto-recorded
- [x] Success message shown after submission
- [x] Birthday wishes load from the Sheet and display newest-first in elegant cards, without exposing attendance/guest count
- [x] Gift section titled "Wanna give us some gifts?" with copyable bank account number and delivery address
- [x] Floating music button, autoplay-safe (starts only after a user gesture)
- [x] Mobile-first responsive layout, no horizontal scroll, touch-friendly controls
- [x] Subtle fade/reveal animations; `prefers-reduced-motion` respected
- [x] Semantic HTML, labeled form fields, visible focus states, alt text, good contrast
- [x] Input validation and sanitization on both client and server (Apps Script) sides
- [x] No credentials exposed in frontend code
- [x] Deployable on GitHub Pages with no paid hosting

## What still needs your action

These require your own accounts/authentication — I can't do them for you:

1. **Create the Google Sheet + deploy Apps Script** (Parts 1–2 above) and
   paste the resulting URL into `script.js`.
2. **Create the GitHub repository and enable Pages** (Part 5 above).
3. **Add your real photo, video, and music files** to `assets/`.
4. **Replace the placeholder values** in `EVENT_CONFIG` — birthday
   person's real name, bank account, and gift address — since these were
   left as `XXX` per the brief.

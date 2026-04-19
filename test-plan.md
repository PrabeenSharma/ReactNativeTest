# Test Plan: QR Scan → Notification Settings → Dashboard + PC/Web QR upload

PR: https://github.com/PrabeenSharma/ReactNativeTest/pull/1
Branch: `devin/1776428519-qr-notification-settings`

## What changed (user-visible)
1. After a successful QR scan (camera on native, **file upload on web/PC**), the user now goes to a new **Notification Settings** screen to pick **Yes** or **No** before reaching the Dashboard.
2. The scanned slug + notification preference are persisted with AsyncStorage (localStorage on web).
3. On subsequent app launches, if a slug is saved, Home auto-redirects straight to the Dashboard (no re-scan needed).
4. The Scanner page now supports **browsing a QR image from a PC** on web via a hidden `<input type="file" accept="image/*" />`.
5. Dashboard has a **Scan Another QR** button that clears the saved slug and opens the scanner.

## Where changes live (evidence)
- `app/scanner.tsx` (web upload branch + shared `decodeQrAndRoute` helper; `Platform.OS === 'web'` gating)
- `app/notification-settings.tsx` (new Yes/No screen that persists and routes to `/dashboard`)
- `app/index.tsx` (on-mount check of saved slug → `router.replace('/dashboard', { slug })`)
- `app/dashboard.tsx` (falls back to saved slug from storage; **Scan Another QR** clears storage)
- `utils/storage.ts` (AsyncStorage helpers)

## Environment
- Running `npm run web` locally at `http://localhost:8081` (Expo Web).
- Test assets (generated via `qrencode`):
  - `/tmp/qr_trip7hge34.png` — encodes `slug=trip7hge34` (a real slug that returns data from the WP API — the same one used in `components/Header.tsx`).
  - `/tmp/qr_invalid.png` — encodes `slug=this-slug-does-not-exist-xyz` (expected to return no data → Dashboard "Invalid QR Code" state).

---

## Primary end-to-end test: PC QR upload → Notification Settings → Dashboard

**Precondition**: Fresh browser / localStorage cleared (no saved slug).

1. Navigate to `http://localhost:8081/`.
   - **Expected**: Welcome screen visible with text **"Welcome to Red Planel Resort"** and visible **scanner** link and **Dashboard** link. No automatic redirect away from `/`.
   - **Adversarial check**: If the home-screen storage check is broken, the app might either (a) redirect even without a saved slug, or (b) get stuck on the loading spinner. Either is a fail.

2. Click the **scanner** link.
   - **Expected**: URL becomes `/scanner`. Page shows the title **"Scan Ticket"** and a **"Browse QR Image"** button (note: on web the label is "Browse QR Image", not "Upload QR Image"). A web-only hint text "Upload a QR code image from your computer to scan it." is visible. The camera view must NOT be rendered on web.
   - **Adversarial check**: If the `Platform.OS === 'web'` gating is broken, we'd see either a camera permission error, a broken `expo-camera` UI, or the button label "Upload QR Image". Any of those is a fail.

3. Click **Browse QR Image**. The OS file chooser opens. Select `/tmp/qr_trip7hge34.png` and confirm.
   - **Expected**: Button label briefly changes to **"Scanning..."** while the QR decode API call is in flight. A 200x200 preview of the uploaded QR image appears.
   - **Adversarial check**: If the web file picker isn't wired up, nothing will happen on click (or the click does nothing). If the FormData-with-File path is broken, the API will return no result and we'll see an **alert "No QR found in image"** → fail.

4. After the API returns, verify navigation.
   - **Expected**: URL becomes `/notification-settings?slug=trip7hge34`. Page shows title **"Notification Settings"**, body text **"Would you like to receive notifications from the app?"**, two buttons **Yes** and **No**, and a **Continue** button that is disabled (greyed out) until one option is selected.
   - **Adversarial check**: If routing is broken we'd land on `/dashboard` directly (old behavior) → fail. If the Continue button is enabled before selection, that's a fail.

5. Click **Yes**. The Yes option becomes filled (cyan background). Click **Continue**.
   - **Expected**: Button text briefly shows **"Saving..."**. URL then becomes `/dashboard?slug=trip7hge34`. Dashboard page loads and shows the WP-fetched content: at minimum a non-empty **title**, and lines for **"Mission Name:"**, **"Mission Status:"**, **"Ship Speed:"**, **"Launch Date:"**. A **Scan Another QR** button is present at the bottom.
   - **Adversarial check**: If Continue is wired wrong, we either stay on the same page or navigate but lose the `slug` → dashboard shows "Invalid QR Code". Either is a fail.

## Persistence test: relaunch goes straight to Dashboard

6. Hard-refresh the browser (Ctrl+Shift+R) while on any page. Then manually navigate to `http://localhost:8081/`.
   - **Expected**: The Home screen briefly shows a loading spinner, then the URL automatically becomes `/dashboard?slug=trip7hge34` and the same Dashboard content loads. The "Welcome to Red Planel Resort" page must NOT remain visible.
   - **Adversarial check**: If the persistence is broken (or `getScannedSlug` returns nothing because it was never saved), the app will stay on the Welcome screen. That would be a direct fail of the "next time don't re-scan" requirement.

## Clear-state test: Scan Another QR resets the flow

7. On the Dashboard, click **Scan Another QR**.
   - **Expected**: URL becomes `/scanner`; scanner page is shown.

8. Navigate manually back to `http://localhost:8081/` (or refresh at `/`).
   - **Expected**: Home screen "Welcome to Red Planel Resort" appears and **no automatic redirect** to `/dashboard` happens (because storage was cleared).
   - **Adversarial check**: If "Scan Another QR" doesn't actually clear storage, step 8 would still redirect to `/dashboard` → fail.

## Pass/fail summary contract
- All 8 steps must match the "Expected" line. Any deviation = failure for that assertion and will be reported.

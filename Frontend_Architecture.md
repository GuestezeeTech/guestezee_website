# GuestEzee Website — Code Architecture

**Path:** `guestezee_website/guestezee_website`
**Stack:** Static HTML/CSS/vanilla JS. No framework, no build tooling, no `package.json`.
**Purpose:** Public marketing website for GuestEzee (hotel-management SaaS).

## 1. Directory Structure

```
guestezee_website/
├── index.html                  (home / landing page)
├── about-us.html                (company / about page)
├── videos.html                  (product video gallery)
├── privacy-policy.html
├── terms-conditions.html
├── assets/                      ← ACTIVE code, used by every page
│   ├── css/common.css           (single shared stylesheet, 662 lines)
│   ├── js/common.js             (single shared script, 192 lines)
│   ├── images/                  (logos, illustrations, brochure PDF, social icons)
│   ├── svg-top.html             (decorative header SVG, inlined into index.html)
│   └── svg-bottom.html          (decorative footer SVG, inlined into index.html)
├── css/                         ← LEGACY, not referenced by any HTML page
│   ├── style.css
│   └── responsive.css
└── js/
    └── main.js                  ← LEGACY, not referenced by any HTML page
```

`css/style.css`, `css/responsive.css`, and `js/main.js` are dead code — an earlier version of the site superseded by `assets/css/common.css` + `assets/js/common.js`. Recommend removing them or marking them historical.

## 2. Pages

| Page | Content |
|---|---|
| `index.html` | Hero, "Addressing Hotel Pain Points", features, FAQ, enquiry modal — largest page, includes JSON-LD structured data |
| `about-us.html` | Company overview, "AI & Analytics" feature block |
| `videos.html` | Product demo video gallery (YouTube embeds/thumbnails) |
| `privacy-policy.html` | Legal — static |
| `terms-conditions.html` | Legal — static |

## 3. JavaScript (`assets/js/common.js`)

Plain vanilla JS, no jQuery/framework, shared across all 5 pages:
- `toggleSidebar()` — mobile nav
- `openEnquiryModal()` / `closeEnquiryModal()` / `closeModalOutside()`
- `changeRooms()` — room-counter stepper in the enquiry form
- `topFunction()` — back-to-top scroll handler
- `toLogin()` — redirects to `https://guestezee.com/hotel-registration`
- `downloadBrochure()` — fetches and force-downloads the PDF brochure via Blob
- `showAlert()`, `isValidEmail()`, `isValidPhone()` — validation/UI helpers
- `submitEnquiryForm()` — validates and submits the enquiry form via `XMLHttpRequest`

Each page also has a small inline `<script>` block for page-specific wiring (e.g. `toggleFaq()` on `index.html`) plus JSON-LD SEO metadata.

## 4. CSS

- `assets/css/common.css` — single hand-written stylesheet, no CSS framework (no Bootstrap).
- Font Awesome 4.7.0 loaded via CDN (`cdnjs.cloudflare.com`) for icons.

## 5. API Integration

Single backend endpoint, hardcoded in JS (no environment config):

- **`https://www.guestezee.com:8008/email/send`** — used for enquiry-form submission (`templateCode: "Hotel_Enquiry"`) and an automatic confirmation email back to the customer (`templateCode: "Enquiry_Reply"`). Payload includes `domain_name`, hardcoded `user_id: 17`, and nested `customer`/`enquiry` objects.

No other REST/GraphQL calls, no analytics/tracking scripts, no `.env`/config files found.

## 6. Third-Party Dependencies

- Font Awesome 4.7.0 (CDN) — the only external library.
- No jQuery, no Bootstrap, no build pipeline (no `package.json`, webpack, gulp, etc.).

## 7. Housekeeping Notes

- Leftover legacy `css/`, `js/main.js` files at project root are unused dead code — candidates for removal in a future cleanup pass.
- No environment separation (dev/staging/prod) — the API endpoint and constants (e.g. `user_id: 17`) are hardcoded directly in `common.js`.

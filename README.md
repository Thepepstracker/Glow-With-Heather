# Glow With Heather — glowwithheather.com

The hub site for Heather: peptide education for women 40+. Multi-page static site — semantic HTML5, one shared CSS file with design tokens, and vanilla JS. No build step.

## How to upload

This is a plain static site. Upload the entire repository contents to the root of your web host (or connect the repo to Netlify — a `netlify.toml` is included). Folder structure produces clean URLs (`/codes/index.html` serves at `/codes`).

## ⚠️ Before launch — three things you MUST do

### 1. Paste your email platform form action (`ESP_FORM_ACTION`)
The signup forms are wired to a placeholder. When you pick your email platform (ConvertKit/Kit, Flodesk, Beehiiv, or Mailchimp all work), update **`/js/main.js`**:

- Find the constant **`ESP_FORM_ACTION`** near the top of `/js/main.js` and set it to your form's POST endpoint.
- Confirm the hidden field name your platform expects for tags. The forms send a hidden input named **`tag`** — if your platform uses a different field name (e.g. `fields[tag]`), update the form markup or map it in `main.js`.
- The tag values already passed are: `glow-beauty`, `glow-energy`, `glow-metabolic`, `glow-longevity`, `beginner`, `experienced`, `codes-alerts`, `general`.
- **Do not** point the signup form at a `mailto:` — the Beginner's Guide needs automated delivery. (The consultation/creator-circle *contact* buttons use mailto on purpose; that's fine.)

The form action appears in the HTML as `action="ESP_FORM_ACTION"`. The single source of truth is the JS constant in `/js/main.js`; it rewrites the form on load.

### 2. Swap the sample testimonials (FTC requirement)
The three testimonials on the **homepage** and **/community** are tagged `[sample — replace with real member quote]`. Published testimonials must come from real customers. With 340+ Glow Lab members, collect three real quotes (with permission) from Skool or TikTok comments and replace the sample text. Remove the `[sample…]` tags when you do.

### 3. Tap-test the Favorites Amazon links
On **/favorites**, each card has a `data-fav` label matching the product name. The Amazon link mapping is **assumed** — tap each card on your phone and confirm it lands on the right product before launch. Fix any mismatched `href` in `/favorites/index.html`.

## Site map

```
/                      Homepage (intent router)
/codes                 Vendor discount codes (the TikTok Live page)
/quiz                  The Glow Quiz → personalized plan + email capture
/serums                Glow Protocols showcase (buys link to glowprotocols.com)
/calculators           Tools index
  /calculators/reconstitution, /tdee, /bmi
/peptides              Peptide Dictionary index + 12 entries
/community             Glow Lab Inner Circle (Skool)
/consultation          $97 wellness consultation
/creator-circle        Creator application
/favorites             Amazon picks
/disclosure /privacy /terms
/404.html
robots.txt  llms.txt  sitemap.xml
```

## Shared assets

- **`/css/styles.css`** — all design tokens (lavender/plum/lilac/ink/gold/live-red), components, mobile-first, `prefers-reduced-motion` respected.
- **`/js/main.js`** — live-aware chip + countdown (uses `America/New_York`), sticky mobile bar, exit-intent popup, email-form handling + `ESP_FORM_ACTION`.
- **`/js/quiz.js`** — the Glow Quiz logic, segment mapping, and results (injects a tagged email capture).
- **`/js/calculators.js`** — reconstitution, TDEE (Mifflin-St Jeor), BMI.

## Notes

- Assets in `mftp_zip_2026_06_10_19_28_48/` are the **old single-page site** kept for reference (and Heather's headshot `heather.jpg`). They are not part of the live site and can be deleted once you're happy with the rebuild.
- A `favicon.ico` is referenced sitewide — add one to the root if not already present.
- Compliance: serum copy is appearance-based cosmetic only; research compounds are educational with no dosing; FTC/affiliate disclosures appear on /codes and /favorites; the educational disclaimer is in every footer.

See **PHASE2.md** for post-launch features (Glow Concierge chatbot, live deals feed, TikTok → blog pipeline).

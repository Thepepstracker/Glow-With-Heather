# PHASE 2 — Post-Launch Roadmap

These three features are specced now and built after launch. They build on the existing static site without requiring a framework rewrite.

## 1. Glow Concierge chatbot

A small serverless function (Cloudflare Worker or Netlify Function) that proxies the Anthropic API so the API key never touches the browser.

- **System prompt** loaded with the peptide dictionary content + the vendor/code JSON so answers stay on-brand and current.
- **Guardrails:** educational only; never gives medical advice or prescription dosing; always offers a relevant page link (a dictionary entry, /codes, /quiz, etc.); declines anything outside scope.
- **UI:** a floating widget, bottom-right, that respects `prefers-reduced-motion` and matches the lavender design tokens.
- **Privacy:** no storage of user messages beyond the request; rate-limited at the edge.

## 2. Live deals feed

Make "Tonight's best deal" update itself.

- The homepage and /codes fetch a **JSON feed from Pep Tracker** (`pepstracker.com`) listing current vendors, codes and offers.
- The pinned "Featured Tonight" card and the /codes grid render from that feed, with the current hard-coded data as a fallback if the feed is unavailable.
- Cache the feed at the edge (e.g. 10-15 min) to keep it fast.

## 3. TikTok → blog pipeline

Turn nightly lives into evergreen, search-friendly content.

- Pull each video's **transcript**, generate a short post, and publish it under **`/glow-notes/[slug]`**.
- Each post gets **Article + BreadcrumbList JSON-LD**, a 40-60 word answer block, and links back to the relevant dictionary entries, calculators and codes.
- A simple index at `/glow-notes` lists posts newest-first; add them to `sitemap.xml`.

---

### Suggested order
1. Live deals feed (highest leverage, lowest complexity — keeps /codes accurate).
2. Glow Concierge chatbot (drives engagement + captures intent).
3. TikTok → blog pipeline (compounding SEO/GEO over time).

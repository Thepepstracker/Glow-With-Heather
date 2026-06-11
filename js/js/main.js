/* ============================================================
   Glow With Heather — main.js
   Header live-chip + countdown, mobile bottom bar show/hide,
   copy-to-clipboard code chips, exit-intent popup, fade-up,
   and email form tag passing. Vanilla JS, no dependencies.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Live-aware chip + countdown (America/New_York) ---------- */
  // Heather goes live nightly 8:00 PM ET; live window treated as 8:00-9:30 PM ET.
  function nyParts(date) {
    var fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York", hour12: false,
      hour: "2-digit", minute: "2-digit", weekday: "short"
    });
    var parts = fmt.formatToParts(date);
    var out = {};
    parts.forEach(function (p) { out[p.type] = p.value; });
    return { hour: parseInt(out.hour, 10) % 24, minute: parseInt(out.minute, 10) };
  }

  function updateLiveChips() {
    var chips = document.querySelectorAll("[data-live-chip]");
    if (!chips.length) return;
    var now = new Date();
    var p = nyParts(now);
    var mins = p.hour * 60 + p.minute;
    var start = 20 * 60;        // 8:00 PM
    var end = 21 * 60 + 30;     // 9:30 PM
    var isLive = mins >= start && mins < end;
    chips.forEach(function (chip) {
      var label = chip.querySelector("[data-live-label]");
      if (isLive) {
        chip.classList.add("is-live");
        if (label) label.textContent = "LIVE on TikTok now \u2192";
        chip.setAttribute("href", "https://www.tiktok.com/@glow_with.heather");
      } else {
        chip.classList.remove("is-live");
        // minutes until next 8 PM ET
        var until = start - mins;
        if (until <= 0) until += 24 * 60;
        var h = Math.floor(until / 60), m = until % 60;
        if (label) label.textContent = "\uD83D\uDD34 Live tonight 8PM ET \u00B7 " + h + "h " + m + "m";
        chip.setAttribute("href", "https://www.tiktok.com/@glow_with.heather");
      }
    });
  }
  updateLiveChips();
  setInterval(updateLiveChips, 30000);

  /* ---------- Sticky mobile bottom bar: hide on scroll down ---------- */
  var bar = document.querySelector(".mobile-bar");
  if (bar) {
    var lastY = window.scrollY;
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y > lastY && y > 80) bar.classList.add("hidden");
      else bar.classList.remove("hidden");
      lastY = y;
    }, { passive: true });
  }

  /* ---------- Copy-to-clipboard code chips ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var code = chip.getAttribute("data-copy");
      var state = chip.querySelector(".copy-state");
      var done = function () {
        chip.classList.add("copied");
        if (state) state.textContent = "Copied \u2713";
        setTimeout(function () {
          chip.classList.remove("copied");
          if (state) state.textContent = "Tap to copy";
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(done).catch(fallback);
      } else { fallback(); }
      function fallback() {
        var t = document.createElement("textarea");
        t.value = code; document.body.appendChild(t); t.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(t); done();
      }
    });
  });

  /* ---------- Filter chips (/codes) ---------- */
  var filterWrap = document.querySelector("[data-filters]");
  if (filterWrap) {
    filterWrap.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-chip");
      if (!btn) return;
      filterWrap.querySelectorAll(".filter-chip").forEach(function (c) { c.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.getAttribute("data-filter");
      document.querySelectorAll("[data-vendor]").forEach(function (card) {
        var tags = card.getAttribute("data-tags") || "";
        card.style.display = (f === "all" || tags.indexOf(f) !== -1) ? "" : "none";
      });
    });
  }

  /* ---------- Email forms: tag passing + placeholder guard ---------- */
  // ESP_FORM_ACTION is intentionally a placeholder. See README.md for where to paste
  // the real form action + hidden tag field name once the email platform is chosen.
  var ESP_FORM_ACTION = "ESP_FORM_ACTION"; // <-- REPLACE in production (see README)
  document.querySelectorAll("form[data-email-form]").forEach(function (form) {
    if (ESP_FORM_ACTION === "ESP_FORM_ACTION") {
      form.setAttribute("data-placeholder", "true");
    }
    form.addEventListener("submit", function (e) {
      if (ESP_FORM_ACTION === "ESP_FORM_ACTION") {
        e.preventDefault();
        var note = form.querySelector(".form-note");
        if (!note) {
          note = document.createElement("p");
          note.className = "form-note microcopy";
          form.appendChild(note);
        }
        note.textContent = "\u2728 Almost there \u2014 connect your email platform (see README) to go live.";
      }
      // When wired, the hidden input[name=tag] already carries the segment tag.
    });
  });

  /* ---------- Exit-intent popup (once per session) ---------- */
  var popup = document.querySelector(".exit-popup");
  if (popup && !sessionStorage.getItem("gwh_exit_shown")) {
    var fire = function () {
      if (sessionStorage.getItem("gwh_exit_shown")) return;
      sessionStorage.setItem("gwh_exit_shown", "1");
      popup.classList.add("open");
    };
    document.addEventListener("mouseout", function (e) {
      if (!e.relatedTarget && e.clientY <= 0) fire();
    });
    var lastTouchY = 0, fastUp = false;
    window.addEventListener("touchstart", function (e) { lastTouchY = e.touches[0].clientY; }, { passive: true });
    window.addEventListener("touchmove", function (e) {
      var dy = e.touches[0].clientY - lastTouchY;
      if (dy > 60 && window.scrollY < 200) fire();
      lastTouchY = e.touches[0].clientY;
    }, { passive: true });
    popup.addEventListener("click", function (e) {
      if (e.target === popup || e.target.closest(".exit-close")) popup.classList.remove("open");
    });
  }

  /* ---------- Fade-up on scroll ---------- */
  var faders = document.querySelectorAll(".fade-up");
  if (faders.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    faders.forEach(function (f) { io.observe(f); });
  } else {
    faders.forEach(function (f) { f.classList.add("in"); });
  }
})();

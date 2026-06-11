/* ============================================================
   Glow With Heather — quiz.js  (The Glow Quiz)
   Pure client-side. One question per screen, progress bar,
   ~60 seconds. Maps answers to a segment that drives the
   results page AND the hidden email tag.
   ============================================================ */
(function () {
  "use strict";
  var root = document.getElementById("glow-quiz");
  if (!root) return;

  var QUESTIONS = [
    { q: "What's your #1 goal right now?", key: "q1",
      a: [
        { t: "Firmer, glowing skin", v: "a" },
        { t: "Fuller-looking hair", v: "b" },
        { t: "More energy, less brain fog", v: "c" },
        { t: "Weight & metabolism support", v: "d" },
        { t: "Healthy aging & longevity", v: "e" }
      ] },
    { q: "How familiar are you with peptides?", key: "q2",
      a: [
        { t: "Total beginner", v: "a" },
        { t: "Researched, haven't started", v: "b" },
        { t: "Just started", v: "c" },
        { t: "Experienced", v: "d" }
      ] },
    { q: "Age range", key: "q3",
      a: [ { t: "35\u201344", v: "1" }, { t: "45\u201354", v: "2" }, { t: "55\u201364", v: "3" }, { t: "65+", v: "4" } ] },
    { q: "Biggest skin concern", key: "q4",
      a: [ { t: "Fine lines", v: "a" }, { t: "Firmness", v: "b" }, { t: "Dryness & dullness", v: "c" }, { t: "Even tone", v: "d" } ] },
    { q: "How do you like to learn?", key: "q5",
      a: [
        { t: "Watching lives", v: "lives" },
        { t: "Reading guides", v: "guides" },
        { t: "Community support", v: "community" },
        { t: "1-on-1 guidance", v: "oneonone" }
      ] }
  ];

  var answers = {};
  var step = 0;

  function segment() {
    var q1 = answers.q1, q2 = answers.q2;
    var seg = "general";
    if (q1 === "a" || q1 === "b") seg = "glow-beauty";
    else if (q1 === "c") seg = "glow-energy";
    else if (q1 === "d") seg = "glow-metabolic";
    else if (q1 === "e") seg = "glow-longevity";
    var level = (q2 === "a" || q2 === "b") ? "beginner" : "experienced";
    return { seg: seg, level: level };
  }

  var PLANS = {
    "glow-beauty": {
      head: "Heather's plan for firmer, glowing skin \u2728",
      learn: [ { t: "GHK-Cu", u: "/peptides/ghk-cu/" }, { t: "SNAP-8", u: "/peptides/snap-8/" } ],
      tool: { t: "Shop the quiz-matched serum", u: "/serums/" }
    },
    "glow-energy": {
      head: "Heather's plan for more energy & focus \u2728",
      learn: [ { t: "NAD+", u: "/peptides/nad/" }, { t: "MOTS-c", u: "/peptides/mots-c/" } ],
      tool: { t: "Explore the Peptide Dictionary", u: "/peptides/" }
    },
    "glow-metabolic": {
      head: "Heather's plan for metabolism support \u2728",
      learn: [ { t: "GLP-1 (educational overview)", u: "/peptides/glp-1-agonists/" }, { t: "MOTS-c", u: "/peptides/mots-c/" } ],
      tool: { t: "Use the TDEE Calculator", u: "/calculators/tdee/" }
    },
    "glow-longevity": {
      head: "Heather's plan for healthy aging \u2728",
      learn: [ { t: "Epitalon", u: "/peptides/epitalon/" }, { t: "NAD+", u: "/peptides/nad/" } ],
      tool: { t: "Explore the Peptide Dictionary", u: "/peptides/" }
    },
    "general": {
      head: "Your Glow Plan \u2728",
      learn: [ { t: "Start with the Peptide Dictionary", u: "/peptides/" } ],
      tool: { t: "Free tools & calculators", u: "/calculators/" }
    }
  };

  function nextStep(s) {
    if (s.level === "lives") {}
    var by = answers.q5;
    if (by === "lives") return { t: "Follow Heather live on TikTok", u: "https://www.tiktok.com/@glow_with.heather" };
    if (by === "community") return { t: "Join the Glow Lab Inner Circle", u: "https://www.skool.com/glow-lab-inner-circle-2611" };
    if (by === "oneonone") return { t: "Book a $97 consultation", u: "/consultation/" };
    return { t: "Get the free Beginner's Guide by email", u: "#quiz-email" };
  }

  function render() {
    if (step >= QUESTIONS.length) return renderResults();
    var item = QUESTIONS[step];
    var pct = Math.round((step / QUESTIONS.length) * 100);
    var html = '<div class="quiz-progress"><span style="width:' + pct + '%"></span></div>';
    html += '<p class="muted">Question ' + (step + 1) + ' of ' + QUESTIONS.length + '</p>';
    html += '<h2>' + item.q + '</h2>';
    item.a.forEach(function (opt) {
      html += '<button class="quiz-option" type="button" data-v="' + opt.v + '">' + opt.t + '</button>';
    });
    root.innerHTML = html;
    root.querySelectorAll(".quiz-option").forEach(function (btn) {
      btn.addEventListener("click", function () {
        answers[item.key] = btn.getAttribute("data-v");
        step++;
        render();
        root.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function renderResults() {
    var sl = segment();
    var plan = PLANS[sl.seg] || PLANS.general;
    var ns = nextStep(sl);
    var beginnerExtra = sl.level === "beginner"
      ? '<p class="muted">New to peptides? Your free <strong>Beginner\u2019s Guide to Peptides</strong> is included when you email yourself this plan.</p>'
      : '<p class="muted">Experienced? Compare live vendor prices on <a href="https://pepstracker.com">Pep Tracker</a> and grab tonight\u2019s <a href="/codes/">codes</a>.</p>';

    var learnCards = plan.learn.map(function (l) {
      return '<a class="row-link" href="' + l.u + '">' + l.t + ' <span>\u2192</span></a>';
    }).join("");

    var html = '<div class="quiz-result-glow"><h1>' + plan.head + '</h1>' +
      '<p class="answer-block">Here\u2019s your personalized Glow Plan. Start by learning the basics, use the matched tool, then take your next step \u2014 and email it to yourself so you don\u2019t lose it.</p>' +
      '<div class="grid grid-3">' +
        '<div class="card"><h3>Learn</h3>' + learnCards + '</div>' +
        '<div class="card"><h3>Tool</h3><a class="btn btn-ghost btn-block" href="' + plan.tool.u + '">' + plan.tool.t + '</a></div>' +
        '<div class="card"><h3>Next step</h3><a class="btn btn-primary btn-block" href="' + ns.u + '">' + ns.t + '</a></div>' +
      '</div>' + beginnerExtra + '</div>';

    html += '<div class="email-capture fade-up in" id="quiz-email" style="margin-top:24px">' +
      '<h3>\uD83D\uDCE7 Email me my Glow Plan + the free guide</h3>' +
      '<form class="email-form" data-email-form action="ESP_FORM_ACTION" method="post">' +
        '<input type="hidden" name="tag" value="' + sl.seg + ',' + sl.level + '">' +
        '<input type="email" name="email" placeholder="you@email.com" required aria-label="Email address">' +
        '<button class="btn btn-gold" type="submit">Get Glowing \u2728</button>' +
        '<p class="microcopy">No spam, ever.</p>' +
      '</form></div>';

    root.innerHTML = html;
  }

  render();
})();

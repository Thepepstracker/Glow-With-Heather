/* ============================================================
   Glow With Heather — calculators.js
   Reconstitution, TDEE (Mifflin-St Jeor), BMI.
   Educational tools only \u2014 not medical advice.
   ============================================================ */
(function () {
  "use strict";
  function $(id) { return document.getElementById(id); }
  function num(v) { var n = parseFloat(v); return isFinite(n) ? n : NaN; }
  function round(n, d) { var f = Math.pow(10, d); return Math.round(n * f) / f; }

  /* ---------- Reconstitution ----------
     concentration (mg/mL) = vial(mg) / water(mL)
     draw volume (mL) = dose(mg) / concentration
     U-100 units = mL * 100
     doses per vial = vial(mg) / dose(mg)
     Verify: 250mcg dose, 10mg vial, 3mL water -> 3.33 mg/mL, 0.075 mL, 7.5 units, 40 doses */
  var recon = $("calc-recon");
  if (recon) {
    recon.addEventListener("submit", function (e) {
      e.preventDefault();
      var doseVal = num($("recon-dose").value);
      var doseUnit = $("recon-dose-unit").value; // "mcg" or "mg"
      var vial = num($("recon-vial").value);     // mg
      var water = num($("recon-water").value);   // mL
      var out = $("recon-out");
      if (isNaN(doseVal) || isNaN(vial) || isNaN(water) || water <= 0 || vial <= 0 || doseVal <= 0) {
        out.innerHTML = '<p class="muted">Enter dose, vial strength, and water (all greater than zero).</p>';
        out.hidden = false; return;
      }
      var doseMg = doseUnit === "mcg" ? doseVal / 1000 : doseVal;
      var conc = vial / water;            // mg/mL
      var drawMl = doseMg / conc;         // mL
      var units = drawMl * 100;           // U-100
      var dosesPerVial = vial / doseMg;
      var fillPct = Math.min(100, (units / 100) * 100);
      out.innerHTML =
        '<dl>' +
          '<dt>Concentration</dt><dd>' + round(conc, 2) + ' mg/mL</dd>' +
          '<dt>Draw volume</dt><dd>' + round(drawMl, 3) + ' mL</dd>' +
          '<dt>Insulin syringe (U-100)</dt><dd>' + round(units, 1) + ' units</dd>' +
          '<dt>Doses per vial</dt><dd>' + Math.floor(dosesPerVial) + '</dd>' +
        '</dl>' +
        '<div class="syringe" aria-hidden="true"><span style="width:' + fillPct + '%"></span></div>' +
        '<p class="microcopy">Syringe fill shown relative to a 100-unit (1 mL) insulin syringe.</p>';
      out.hidden = false;
    });
  }

  /* ---------- TDEE (Mifflin-St Jeor) ----------
     female: 10W + 6.25H - 5A - 161 ; male: + 5
     activity: 1.2 / 1.375 / 1.55 / 1.725 / 1.9 */
  var tdee = $("calc-tdee");
  if (tdee) {
    tdee.addEventListener("submit", function (e) {
      e.preventDefault();
      var sex = $("tdee-sex").value;
      var unit = $("tdee-unit").value; // metric | imperial
      var w = num($("tdee-weight").value);
      var h = num($("tdee-height").value);
      var a = num($("tdee-age").value);
      var act = num($("tdee-activity").value);
      var out = $("tdee-out");
      if ([w, h, a, act].some(isNaN)) {
        out.innerHTML = '<p class="muted">Please fill in all fields.</p>'; out.hidden = false; return;
      }
      var kg = w, cm = h;
      if (unit === "imperial") { kg = w * 0.45359237; cm = h * 2.54; }
      var bmr = 10 * kg + 6.25 * cm - 5 * a + (sex === "male" ? 5 : -161);
      var maint = bmr * act;
      out.innerHTML =
        '<dl>' +
          '<dt>BMR</dt><dd>' + Math.round(bmr) + ' kcal/day</dd>' +
          '<dt>Maintenance</dt><dd>' + Math.round(maint) + ' kcal/day</dd>' +
          '<dt>Gentle cut (\u2212500)</dt><dd>' + Math.round(maint - 500) + ' kcal/day</dd>' +
          '<dt>Lean gain (+300)</dt><dd>' + Math.round(maint + 300) + ' kcal/day</dd>' +
        '</dl>';
      out.hidden = false;
    });
    // Unit toggle relabels inputs
    var tu = $("tdee-unit");
    if (tu) tu.addEventListener("change", function () {
      var imp = tu.value === "imperial";
      $("tdee-weight-label").textContent = imp ? "Weight (lb)" : "Weight (kg)";
      $("tdee-height-label").textContent = imp ? "Height (in)" : "Height (cm)";
    });
  }

  /* ---------- BMI ----------
     kg/m^2, category, healthy-weight range for height */
  var bmi = $("calc-bmi");
  if (bmi) {
    bmi.addEventListener("submit", function (e) {
      e.preventDefault();
      var unit = $("bmi-unit").value;
      var w = num($("bmi-weight").value);
      var h = num($("bmi-height").value);
      var out = $("bmi-out");
      if (isNaN(w) || isNaN(h) || h <= 0) { out.innerHTML = '<p class="muted">Please enter weight and height.</p>'; out.hidden = false; return; }
      var kg = w, m = h / 100;
      if (unit === "imperial") { kg = w * 0.45359237; m = h * 0.0254; }
      var val = kg / (m * m);
      var cat = val < 18.5 ? "Underweight" : val < 25 ? "Healthy weight" : val < 30 ? "Overweight" : "Obesity range";
      var lo = 18.5 * m * m, hi = 24.9 * m * m;
      if (unit === "imperial") { lo /= 0.45359237; hi /= 0.45359237; }
      var uw = unit === "imperial" ? "lb" : "kg";
      out.innerHTML =
        '<dl>' +
          '<dt>Your BMI</dt><dd>' + round(val, 1) + '</dd>' +
          '<dt>Category</dt><dd>' + cat + '</dd>' +
          '<dt>Healthy-weight range for your height</dt><dd>' + round(lo, 1) + '\u2013' + round(hi, 1) + ' ' + uw + '</dd>' +
        '</dl>' +
        '<p class="microcopy">BMI is a general screening number, not a diagnosis or a measure of health.</p>';
      out.hidden = false;
    });
    var bu = $("bmi-unit");
    if (bu) bu.addEventListener("change", function () {
      var imp = bu.value === "imperial";
      $("bmi-weight-label").textContent = imp ? "Weight (lb)" : "Weight (kg)";
      $("bmi-height-label").textContent = imp ? "Height (in)" : "Height (cm)";
    });
  }
})();

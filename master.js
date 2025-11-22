/* master.js - universal test script
   Requirements:
   - Each page must define window.correctAnswers (object) before loading this file.
   - Optional: define window.TEST_TIME (seconds) to override default time.
   - Pages can keep button onclick="submitTest()" as-is.
*/
(function () {
  "use strict";

  // Configurable defaults
  var DEFAULT_TIME = 1200; // seconds

  // Internal state
  var timerInterval = null;
  var timeLeft = (typeof window.TEST_TIME === "number") ? window.TEST_TIME : DEFAULT_TIME;

  // Utility to get the label element corresponding to an input
  function resolveLabelForInput(opt) {
    // Prefer the sibling .option-label (existing structure), fallback to container or parent
    if (opt.nextElementSibling && opt.nextElementSibling.classList &&
        opt.nextElementSibling.classList.contains('option-label')) {
      return opt.nextElementSibling;
    }
    var container = opt.closest && opt.closest('.option-container');
    if (container) {
      var span = container.querySelector('.option-label');
      if (span) return span;
      return container;
    }
    return opt.parentElement || opt;
  }

  // Timer
  function startTimer() {
    var timerEl = document.getElementById("timer");
    if (!timerEl) {
      // create timer if missing
      timerEl = document.createElement("div");
      timerEl.id = "timer";
      document.body.appendChild(timerEl);
    }
    // if page provided a TEST_TIME override, use it
    timeLeft = (typeof window.TEST_TIME === "number") ? window.TEST_TIME : timeLeft;

    timerInterval = setInterval(function () {
      var m = Math.floor(timeLeft / 60);
      var s = timeLeft % 60;
      timerEl.textContent = "Time Left: " + m.toString().padStart(2, '0') + ":" + s.toString().padStart(2, '0');
      timerEl.style.color = timeLeft <= 600 ? "red" : "green";
      if (timeLeft-- <= 0) {
        clearInterval(timerInterval);
        try { alert("Time's up!"); } catch (e) { /* ignore */ }
        window.submitTest && window.submitTest();
      }
    }, 1000);
  }

  // Fullscreen handling
  function enterFullscreen() {
    var el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen && el.msRequestFullscreen();
  }
  function exitFullscreen() {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen && document.msExitFullscreen();
  }

  // Hide common Blogger controls (best-effort)
  function hideBloggerControls() {
    [
      "header", "footer", "nav", "aside",
      ".sidebar", ".header", ".footer"
    ].forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.style.display = "none";
      });
    });
  }

  // Deselectable radio behavior: clicking same option toggles it off
  function enableDeselectableOptions() {
    document.querySelectorAll('.option-container').forEach(function (container) {
      var input = container.querySelector('input[type="radio"]');
      if (!input) return;
      container.addEventListener('click', function (e) {
        // If clicked directly on input, allow default
        if (input.checked) {
          input.checked = false;
          // Prevent double toggling that browsers sometimes do
          e.preventDefault && e.preventDefault();
        } else {
          input.checked = true;
        }
      });
    });
  }

  // Submit function — exported to window so onclick handlers on pages keep working
  window.submitTest = function submitTest() {
    if (!window.correctAnswers || typeof window.correctAnswers !== 'object') {
      console.warn("submitTest: window.correctAnswers is not defined. Ensure each page defines it before loading master.js.");
      try { alert("Configuration error: correct answers not provided on this page."); } catch (e) {}
      return;
    }

    if (!confirm("Are you sure you want to submit the test?")) return;

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    exitFullscreen();

    var correctAnswers = window.correctAnswers;
    var score = 0;
    var total = Object.keys(correctAnswers).length;
    var attempted = 0;

    for (var q in correctAnswers) {
      if (!Object.prototype.hasOwnProperty.call(correctAnswers, q)) continue;
      var options = document.querySelectorAll('input[name="' + q + '"]');
      var selected = false;

      options.forEach(function (opt) {
        var label = resolveLabelForInput(opt);
        // reset per-option visual state
        if (label && label.style) {
          label.style.backgroundColor = "";
          label.style.borderColor = "";
        }

        // Mark correct option visually
        if (opt.value === correctAnswers[q]) {
          if (label && label.style) {
            label.style.backgroundColor = "green";
            label.style.borderColor = "#008000";
          }
        }

        if (opt.checked) {
          selected = true;
          if (opt.value !== correctAnswers[q]) {
            if (label && label.style) {
              label.style.backgroundColor = "red";
              label.style.borderColor = "#ff0000";
            }
          }
        }
      });

      if (selected) {
        attempted++;
        var sel = document.querySelector('input[name="' + q + '"]:checked');
        if (sel && sel.value === correctAnswers[q]) score++;
      }
    }

    var unattempted = total - attempted;
    var wrong = attempted - score;
    var percentage = total > 0 ? ((score / total) * 100).toFixed(2) : "0.00";

    // Update summary displays if present
    var scoreCircle = document.getElementById("score-circle");
    if (scoreCircle) scoreCircle.innerText = (score * 5) - wrong + " / " + (total * 5);

    var attemptedCircle = document.getElementById("attempted-circle");
    if (attemptedCircle) attemptedCircle.innerText = attempted + " / " + total;

    var accuracyCircle = document.getElementById("accuracy-circle");
    if (accuracyCircle) accuracyCircle.innerText = percentage + "%";

    var percentileCircle = document.getElementById("percentile-circle");
    if (percentileCircle) percentileCircle.innerText = percentage;

    var rankCircle = document.getElementById("rank-circle");
    if (rankCircle) rankCircle.innerText = (parseFloat(percentage) > 50 ? "12 / 100" : "54 / 100");

    var resultEl = document.getElementById("result");
    if (resultEl) {
      resultEl.innerHTML =
        "<b>Total Questions:</b> " + total + "<br>" +
        "<b>Attempted:</b> " + attempted + "<br>" +
        "<b>Unattempted:</b> " + unattempted + "<br>" +
        "<b>Correct:</b> " + score + "<br>" +
        "<b>Wrong:</b> " + wrong + "<br>" +
        "<b>Percentage:</b> " + percentage + "%";
    }
  };

  // Disable right-click
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  // Auto-submit on tab switch (visibilitychange)
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      try { alert("You left the test. Submitting now."); } catch (e) {}
      window.submitTest && window.submitTest();
      try { window.location.href = "about:blank"; } catch (e) {}
    }
  });

  // Initialize on DOMContentLoaded
  document.addEventListener("DOMContentLoaded", function () {
    try {
      enableDeselectableOptions();
      enterFullscreen();
      hideBloggerControls();
      startTimer();
    } catch (e) {
      console.error("master.js initialization error:", e);
    }
  });

})();

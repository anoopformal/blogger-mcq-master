
// ------------------ TIMER SCRIPT ------------------
var timeLeft = 1200; // 20 minutes
var timerInterval;

function startTimer() {
  timerInterval = setInterval(function () {
    var minutes = Math.floor(timeLeft / 60);
    var seconds = timeLeft % 60;

    var timerEl = document.getElementById("timer");
    if (timeLeft <= 600) {
      timerEl.style.color = "red";
    } else {
      timerEl.style.color = "green";
    }

    timerEl.innerText =
      "Time Left: " +
      (minutes < 10 ? "0" + minutes : minutes) + ":" +
      (seconds < 10 ? "0" + seconds : seconds);

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("Time's up!");
    }

    timeLeft--;
  }, 1000);
}

// Show timer on scroll
window.addEventListener("scroll", function () {
  var timer = document.getElementById("timer");
  if (window.scrollY > 0) {
    timer.style.display = "block";
  }
});

// On page load
window.onload = function () {
  startTimer();
  enterFullscreen();
  hideBloggerControls();
};


// ------------------ SUBMIT TEST FUNCTION ------------------
function submitTest() {
  if (!confirm("Are you sure you want to submit the test?")) return;

  exitFullscreen();
  clearInterval(timerInterval);

  let score = 0;
  let total = Object.keys(correctAnswers).length;
  let attempted = 0;

  for (var q in correctAnswers) {
    let options = document.querySelectorAll(`input[name="${q}"]`);
    let selected = false;

    options.forEach(option => {
      let label = option.nextElementSibling;

      // Reset
      label.style.backgroundColor = "";
      label.style.borderColor = "";

      if (option.checked) {
        selected = true;
      }

      // Correct answer
      if (option.value === correctAnswers[q]) {
        label.style.backgroundColor = "green";
        label.style.borderColor = "#008000";
      }

      // Wrong selected
      if (option.checked && option.value !== correctAnswers[q]) {
        label.style.backgroundColor = "red";
        label.style.borderColor = "#ff0000";
      }
    });

    if (selected) {
      attempted++;
      let selectedOption = document.querySelector(`input[name="${q}"]:checked`);
      if (selectedOption && selectedOption.value === correctAnswers[q]) {
        score++;
      }
    }
  }

  let unattempted = total - attempted;
  let wrong = attempted - score;
  let percentage = ((score / total) * 100).toFixed(2);

  // Update UI
  document.getElementById("score-circle").innerText = (score * 5) - wrong + " / " + (total * 5);
  document.getElementById("attempted-circle").innerText = attempted + " / " + total;
  document.getElementById("accuracy-circle").innerText = percentage + "%";

  // Dummy percentile/rank
  document.getElementById("percentile-circle").innerText = percentage;
  document.getElementById("rank-circle").innerText = (percentage > 50 ? "12 / 100" : "54 / 100");

  document.getElementById("result").innerHTML =
    "<b>Total Questions:</b> " + total + "<br>" +
    "<b>Attempted Questions:</b> " + attempted + "<br>" +
    "<b>Unattempted Questions:</b> " + unattempted + "<br>" +
    "<b>Correct Answers:</b> " + score + "<br>" +
    "<b>Wrong Answers:</b> " + wrong + "<br>" +
    "<b>Percentage:</b> " + percentage + "%";
}


// ------------------ RADIO DESELECT SCRIPT ------------------
document.addEventListener("DOMContentLoaded", function () {
  const optionContainers = document.querySelectorAll('.option-container');

  optionContainers.forEach(container => {
    const input = container.querySelector('input[type="radio"]');

    container.addEventListener('click', function (e) {
      if (input.checked) {
        input.checked = false;
        e.stopPropagation();
        e.preventDefault();
      } else {
        input.checked = true;
      }
    });
  });
});


// ------------------ FULLSCREEN FUNCTIONS ------------------
function enterFullscreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) elem.requestFullscreen();
  else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
  else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
}

function exitFullscreen() {
  if (document.exitFullscreen) document.exitFullscreen();
  else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  else if (document.msExitFullscreen) document.msExitFullscreen();
}


// ------------------ DISABLE RIGHT-CLICK ------------------
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});


// ------------------ TAB SWITCH DETECTION ------------------
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    alert("You left the test. Submitting now.");
    submitTest();
    window.location.href = "about:blank";
  }
});


// ------------------ HIDE BLOGGER DEFAULT ELEMENTS ------------------
function hideBloggerControls() {
  const elementsToHide = [
    "header", "footer", "nav", "aside",
    ".sidebar", ".header", ".footer"
  ];
  elementsToHide.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.style.display = "none");
  });
}

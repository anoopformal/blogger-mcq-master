<script type="text/javascript">
// Existing timer and test submission logic
var correctAnswers = {
q1: "c",
  q2: "b",
  q3: "b",
  q4: "b",
  q5: "d",
  q6: "d",
  q7: "c",
  q8: "d",
  q9: "c",
  q10: "b",
q11: "b",
q12: "d",
q13: "a",
q14: "b",
q15: "c",
q16: "c",
q17: "b",
q18: "c",
q19: "a",
q20: "c"




};

<!-- TIMER SCRIPT -->
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

  // Start the timer when the page loads
  window.onload = function () {
    startTimer();
  };

function submitTest() {
  alert("Are you sure to final Submit?");
 clearInterval(timerInterval);
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

      // Reset styles
      label.style.backgroundColor = "";
      label.style.borderColor = "";

      if (option.checked) {
        selected = true;
      }

      // Highlight correct answer
      if (option.value === correctAnswers[q]) {
        label.style.backgroundColor = "green";
        label.style.borderColor = "#008000";
      }

      // Highlight wrong selected answer
      if (option.checked && option.value !== correctAnswers[q]) {
        label.style.backgroundColor = "red";
        label.style.borderColor = "	ff0000";
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
  // Update performance summary UI
 document.getElementById("score-circle").innerText = (score*5)-wrong + " / " + total*5;
  document.getElementById("attempted-circle").innerText = attempted + " / " + total;
  document.getElementById("accuracy-circle").innerText = percentage+ "%";

 // Dummy values for percentile & rank (customize as needed)
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

//window.onload = startTimer;
  window.onload = function () {
  startTimer();
  enterFullscreen();
 // hideBloggerControls();
};
//setTimeout(() => {
 // window.open('', '_self').close(); // Try to close tab
 // window.location.href = "about:blank"; // Fallback
//}, 2000);

</script>

<!-- New script for deselecting radio buttons -->
<script>
document.addEventListener("DOMContentLoaded", function () {
  const optionContainers = document.querySelectorAll('.option-container');

  optionContainers.forEach(container => {
    const input = container.querySelector('input[type="radio"]');
    const label = container.querySelector('.option-label');

    container.addEventListener('click', function (e) {
      // Allow deselect if already selected
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
  
  
  // Enter fullscreen mode on load
function enterFullscreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}

// Exit fullscreen on submit
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

// Disable right-click
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

// Detect tab switch (user changes tab or minimizes)
// document.addEventListener("visibilitychange", function () {
//   if (document.hidden) {
//     alert("You left the test. Submitting now.");
//     submitTest();
//     window.location.href = "about:blank";
//   }
// });
  
  function hideBloggerControls() {
  const elementsToHide = ["header", "footer", "nav", "aside", ".sidebar", ".header", ".footer"];
  elementsToHide.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.style.display = "none");
  });
}


</script>

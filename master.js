/* ================== CONFIG ================== */
let examDuration = 600; // total seconds
let negativeMark = -0.25;
let tabWarningMessage = "Tab switch detected! Stay on the test screen.";
/* ============================================= */

document.addEventListener("contextmenu", (e) => e.preventDefault());

let switchedTabCount = 0;
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    switchedTabCount++;
    alert(tabWarningMessage);
  }
 });

function goFullScreen() {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }
}

/* Shuffle Utility */
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function shuffleOptions(question) {
  let opts = Array.from(question.querySelectorAll(".option-container"));
  shuffleArray(opts);
  opts.forEach(o => question.appendChild(o));
}

/* START TEST */
function startTest() {
  goFullScreen();

  let qArea = document.getElementById("questions-area");
  let questions = Array.from(document.querySelectorAll(".question-box"));

  // Shuffle questions
  shuffleArray(questions);
  questions.forEach(q => qArea.appendChild(q));

  // Shuffle the options of each question
  questions.forEach(q => shuffleOptions(q));

  startTimer();
}

/* TIMER */
function startTimer() {
  let timerElem = document.getElementById("timer");
  let timeLeft = examDuration;

  let t = setInterval(() => {
    let min = Math.floor(timeLeft / 60);
    let sec = timeLeft % 60;

    timerElem.innerHTML = `Time Left: ${min}:${sec < 10 ? "0" : ""}${sec}`;

    if (timeLeft <= 0) {
      clearInterval(t);
      timerElem.innerHTML = "Time Over!";
      submitTest();
    }
    timeLeft--;
  }, 1000);
}

/* SUBMIT TEST */
function submitTest() {
  let questions = document.querySelectorAll(".question-box");
  let score = 0, correct = 0, wrong = 0;

  questions.forEach((q, index) => {

    let correctAns = q.dataset.answer;
    let selected = q.querySelector("input:checked");

    // Disable options
    q.querySelectorAll("input").forEach(inp => inp.disabled = true);

    if (selected) {
      if (selected.value === correctAns) {
        score += 1;
        correct++;

        // Mark correct visually
        selected.closest(".option-container").classList.add("correct-answer");

      } else {
        score += negativeMark;
        wrong++;

        // Mark selected wrong
        selected.closest(".option-container").classList.add("wrong-answer");

        // Mark correct option
        q.querySelector(`input[value="${correctAns}"]`)
          .closest(".option-container")
          .classList.add("correct-answer");
      }
    } else {
      // No attempt → show correct answer only
      q.querySelector(`input[value="${correctAns}"]`)
        .closest(".option-container")
        .classList.add("correct-answer");
    }

  });

  let percent = ((score / questions.length) * 100).toFixed(2);

  // RESULT AREA
  let res = document.getElementById("result-box");
  res.innerHTML = `
    <h3>Detailed Results</h3>

    <div class="result-summary">
      <div class="result-pill">Correct: ${correct}</div>
      <div class="result-pill">Wrong: ${wrong}</div>
      <div class="result-pill">Score: ${score.toFixed(2)}</div>
      <div class="result-pill">Percent: ${percent}%</div>
      <div class="result-pill">Tab Switches: ${switchedTabCount}</div>
    </div>

    <div class="percent-wrap">
      <div class="percent-bar">
        <div class="percent-fill" id="percentFill"></div>
      </div>
    </div>

    <div class="negative-note">Negative marking applied: ${negativeMark} per wrong answer</div>
  `;

  // animate percent bar
  setTimeout(() => {
    document.getElementById("percentFill").style.width = percent + "%";
  }, 150);
}

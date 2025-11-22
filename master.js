/* ================== CONFIG ================== */
let examDuration = 600;
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

/* FULLSCREEN */
function goFullScreen() {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }
}
function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

/* Shuffle */
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

  shuffleArray(questions);
  questions.forEach(q => qArea.appendChild(q));

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
  exitFullScreen(); // auto exit on submit

  let questions = document.querySelectorAll(".question-box");
  let score = 0, correct = 0, wrong = 0;

  let tableRows = ""; // for summary table

  questions.forEach((q, index) => {
    let qNum = index + 1;
    let correctAns = q.dataset.answer;
    let selected = q.querySelector("input:checked");

    q.querySelectorAll("input").forEach(inp => inp.disabled = true);

    let yourAns = selected ? selected.value : "-";

    // row result
    let resultText = "";

    if (selected) {
      if (selected.value === correctAns) {
        score += 1;
        correct++;
        resultText = "Correct";

        selected.closest(".option-container").classList.add("correct-answer");
      } else {
        score += negativeMark;
        wrong++;
        resultText = "Wrong";

        selected.closest(".option-container").classList.add("wrong-answer");
        q.querySelector(`input[value="${correctAns}"]`)
          .closest(".option-container").classList.add("correct-answer");
      }
    } else {
      resultText = "Not Attempted";
      q.querySelector(`input[value="${correctAns}"]`)
        .closest(".option-container").classList.add("correct-answer");
    }

    // Add row to summary table
    tableRows += `
      <tr>
        <td>${qNum}</td>
        <td>${yourAns.toUpperCase()}</td>
        <td>${correctAns.toUpperCase()}</td>
        <td>${resultText}</td>
      </tr>
    `;
  });

  let percent = ((score / questions.length) * 100).toFixed(2);

  // FINAL RESULT HTML (includes summary + graph + table)
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

    <h3 style="margin-top:18px;">Summary Table</h3>
    <table class="result-table">
      <tr>
        <th>Q.No</th>
        <th>Your Ans</th>
        <th>Correct</th>
        <th>Result</th>
      </tr>
      ${tableRows}
    </table>

    <div class="negative-note">
      Negative Marking: ${negativeMark} per wrong answer
    </div>
  `;

  // animate graph bar
  setTimeout(() => {
    document.getElementById("percentFill").style.width = percent + "%";
  }, 150);
}

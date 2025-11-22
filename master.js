let timeLeft = 1200, timerInterval;

/* Timer */
function startTimer() {
  const timerEl = document.getElementById("timer");
  timerInterval = setInterval(() => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;

    timerEl.textContent = `Time Left: ${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    timerEl.style.color = timeLeft <= 600 ? "red" : "green";

    if (timeLeft-- <= 0) {
      clearInterval(timerInterval);
      alert("Time's up!");
      submitTest();
    }
  }, 1000);
}

/* Test Submission */
function submitTest() {
  if (!confirm("Are you sure you want to submit the test?")) return;
  clearInterval(timerInterval);
  exitFullscreen();

  const correctAnswers = window.correctAnswers;
  let score=0,total=Object.keys(correctAnswers).length,attempted=0;

  for (let q in correctAnswers) {
    const options=document.querySelectorAll(`input[name="${q}"]`);
    let selected=false;

    options.forEach(opt=>{
      const label=opt.nextElementSibling;
      label.style.backgroundColor="";
      label.style.borderColor="";

      if(opt.checked) selected=true;

      if(opt.value===correctAnswers[q]) {
        label.style.backgroundColor="green";
        label.style.borderColor="#008000";
      }
      if(opt.checked && opt.value!==correctAnswers[q]) {
        label.style.backgroundColor="red";
        label.style.borderColor="#ff0000";
      }
    });

    if(selected){
      attempted++;
      const selectedOpt=document.querySelector(`input[name="${q}"]:checked`);
      if(selectedOpt && selectedOpt.value===correctAnswers[q]) score++;
    }
  }

  const unattempted=total-attempted;
  const wrong=attempted-score;
  const percentage=((score/total)*100).toFixed(2);

  document.getElementById("score-circle").innerText=(score*5)-wrong+" / "+total*5;
  document.getElementById("attempted-circle").innerText=attempted+" / "+total;
  document.getElementById("accuracy-circle").innerText=percentage+"%";
  document.getElementById("percentile-circle").innerText=percentage;
  document.getElementById("rank-circle").innerText=(percentage>50?"12 / 100":"54 / 100");

  document.getElementById("result").innerHTML=
    `<b>Total Questions:</b> ${total}<br>
     <b>Attempted:</b> ${attempted}<br>
     <b>Unattempted:</b> ${unattempted}<br>
     <b>Correct:</b> ${score}<br>
     <b>Wrong:</b> ${wrong}<br>
     <b>Percentage:</b> ${percentage}%`;
}

/* Deselectable Options */
document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll('.option-container').forEach(container=>{
    const input=container.querySelector('input[type="radio"]');
    container.addEventListener('click',e=>{
      if(input.checked){input.checked=false;e.preventDefault();}
      else input.checked=true;
    });
  });

  enterFullscreen();
  hideBloggerControls();
  startTimer();
});

/* Fullscreen */
function enterFullscreen(){
  const el=document.documentElement;
  if(el.requestFullscreen) el.requestFullscreen();
  else if(el.webkitRequestFullscreen) el.webkitRequestFullscreen();
}

function exitFullscreen(){
  if(document.exitFullscreen) document.exitFullscreen();
  else if(document.webkitExitFullscreen) document.webkitExitFullscreen();
}

/* Disable Right Click */
document.addEventListener("contextmenu",e=>e.preventDefault());

/* Tab Switching */
document.addEventListener("visibilitychange",()=>{
  if(document.hidden){
    alert("You left the test. Submitting now.");
    submitTest();
    window.location.href="about:blank";
  }
});

/* Hide Blogger Header/Footer */
function hideBloggerControls(){
  ["header","footer","nav","aside",".sidebar",".header",".footer"]
  .forEach(sel=>document.querySelectorAll(sel)
  .forEach(el=>el.style.display="none"));
}

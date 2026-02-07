// 🔐 CONFIG
const INVITE_CODE = "CHURCH2026";
const SCRIPT_URL = "PASTE_WEB_APP_URL_HERE";
const QUIZ_ID = "bible_quiz_2026"; // change for new quiz

let playerName = "";
let current = 0;
let answers = [];
let timeLeft = 300;
let timer;

const questions = [
  {
    q: "Who built the ark?",
    options: ["Moses", "Noah", "Abraham", "David"],
    answer: 1
  },
  {
    q: "How many disciples did Jesus have?",
    options: ["10", "11", "12", "13"],
    answer: 2
  },
  {
    q: "Where was Jesus born?",
    options: ["Nazareth", "Jerusalem", "Bethlehem", "Rome"],
    answer: 2
  }
];

// 🚫 ONE ATTEMPT CHECK
function hasAttempted(name) {
  return localStorage.getItem(QUIZ_ID + "_" + name);
}

function markAttempted(name) {
  localStorage.setItem(QUIZ_ID + "_" + name, "submitted");
}

function startQuiz() {
  const name = document.getElementById("name").value.trim();
  const code = document.getElementById("code").value.trim();

  if (!name || code !== INVITE_CODE) {
    alert("Invalid name or invite code");
    return;
  }

  if (hasAttempted(name)) {
    alert("You have already attempted this quiz.");
    return;
  }

  playerName = name;
  answers = Array(questions.length).fill(null);

  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("quizBox").classList.remove("hidden");

  loadQuestion();
  startTimer();
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText =
      "Time Left: " + formatTime(timeLeft);

    if (timeLeft <= 0) submitQuiz();
  }, 1000);
}

function formatTime(s) {
  return Math.floor(s / 60) + ":" + (s % 60).toString().padStart(2, "0");
}

function loadQuestion() {
  const q = questions[current];
  document.getElementById("question").innerText = q.q;

  let html = "";
  q.options.forEach((opt, i) => {
    html += `
      <label>
        <input type="radio" name="opt" value="${i}">
        ${opt}
      </label>`;
  });
  document.getElementById("options").innerHTML = html;
}

function nextQuestion() {
  saveAnswer();
  if (current < questions.length - 1) {
    current++;
    loadQuestion();
  } else {
    alert("Last question. Please submit.");
  }
}

function saveAnswer() {
  const sel = document.querySelector('input[name="opt"]:checked');
  if (sel) answers[current] = parseInt(sel.value);
}

function submitQuiz() {
  clearInterval(timer);
  saveAnswer();

  let score = 0;
  answers.forEach((a, i) => {
    if (a === questions[i].answer) score++;
  });

  const timeTaken = 300 - timeLeft;

  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
      name: playerName,
      score: score,
      time: timeTaken
    })
  });

  markAttempted(playerName);

  alert("🙏 Thank you for participating. Quiz submitted!");
  location.reload();
}

// Disable browser back
history.pushState(null, null, location.href);
window.onpopstate = () => history.go(1);

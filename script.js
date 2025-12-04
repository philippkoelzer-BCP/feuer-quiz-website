const BASE_QUESTIONS = [
  {
    type: "mc",
    category: "Grundlagen",
    question: "Welche drei Bedingungen braucht ein Feuer?",
    answers: [
      "Sauerstoff, Brennstoff, Zündquelle",
      "Wasser, Luft, Metall",
      "Wind, Licht, Holz"
    ],
    correctIndex: 0
  },
  {
    type: "tf",
    category: "Grundlagen",
    question: "Wahr oder falsch: Ein Feuer erlischt, wenn man eine der drei Bedingungen (z.B. Sauerstoff) wegnimmt.",
    correct: true
  },
  {
    type: "mc",
    category: "Brandschutz",
    question: "Was ist im Klassenzimmer beim Umgang mit Kerzen besonders wichtig?",
    answers: [
      "Kerzen niemals unbeaufsichtigt lassen",
      "Kerzen direkt unter Papierdekoration stellen",
      "Kerzen neben Gardinen aufstellen"
    ],
    correctIndex: 0
  },
  {
    type: "tf",
    category: "Brandschutz",
    question: "Wahr oder falsch: Ein Papierkorbbrand kann sich im Klassenzimmer sehr schnell ausbreiten.",
    correct: true
  },
  {
    type: "mc",
    category: "Verhalten im Brandfall",
    question: "Welche Nummer wählst du im Brandfall in Deutschland?",
    answers: [
      "112",
      "110",
      "911"
    ],
    correctIndex: 0
  },
  {
    type: "mc",
    category: "Verhalten im Brandfall",
    question: "Was ist die richtige Reihenfolge beim Notruf?",
    answers: [
      "Wer meldet? Was ist passiert? Wo ist es passiert?",
      "Wie ist das Wetter? Wer bist du?",
      "Wann musst du wieder in der Schule sein?"
    ],
    correctIndex: 0
  },
  {
    type: "tf",
    category: "Rauch",
    question: "Wahr oder falsch: Rauch ist ungefährlich, Hauptsache, man ist weit genug weg vom Feuer.",
    correct: false
  },
  {
    type: "mc",
    category: "Rauch",
    question: "Wie verhältst du dich richtig, wenn ein Flur voller Rauch ist?",
    answers: [
      "Aufrecht und schnell durchrennen",
      "Flach am Boden bleiben und unter dem Rauch hindurchkriechen",
      "Das Atmen anhalten und durch den Rauch laufen"
    ],
    correctIndex: 1
  },
  {
    type: "mc",
    category: "Löschen",
    question: "Was solltest du NICHT mit Wasser löschen?",
    answers: [
      "Brennendes Holzscheit",
      "Brennende Kerze",
      "Brennendes heißes Fett in der Pfanne"
    ],
    correctIndex: 2
  },
  {
    type: "tf",
    category: "Löschen",
    question: "Wahr oder falsch: Brennendes Fett in der Pfanne löscht man am besten mit einem passenden Deckel.",
    correct: true
  },
  {
    type: "mc",
    category: "Fluchtwege",
    question: "Was ist bei Fluchtwegen in der Schule wichtig?",
    answers: [
      "Fluchtwege dürfen mit Stühlen zugestellt sein",
      "Fluchtwege müssen immer frei und gekennzeichnet sein",
      "Fluchtwege dürfen abgeschlossen sein"
    ],
    correctIndex: 1
  },
  {
    type: "tf",
    category: "Aufzug",
    question: "Wahr oder falsch: Im Brandfall darf man den Aufzug benutzen, um schneller nach draußen zu kommen.",
    correct: false
  },
  {
    type: "mc",
    category: "Feuerlöscher",
    question: "Was solltest du tun, bevor du einen Feuerlöscher benutzt?",
    answers: [
      "Erst die Lehrkraft oder eine erwachsene Person informieren",
      "Den Löscher schütteln und hinlegen",
      "Den Löscher ins Feuer werfen"
    ],
    correctIndex: 0
  },
  {
    type: "tf",
    category: "Verhalten",
    question: "Wahr oder falsch: Bei einem Feueralarm sollst du ruhig bleiben, zügig gehen und keine Sachen mehr einpacken.",
    correct: true
  },
  {
    type: "mc",
    category: "Verhalten",
    question: "Was machst du, wenn deine Kleidung Feuer fängt?",
    answers: [
      "Weglaufen und schreien",
      "Am Boden hin- und herrollen, um die Flammen zu ersticken",
      "Auf einen Stuhl springen"
    ],
    correctIndex: 1
  }
];

const QUIZ_TIME_SECONDS = 5 * 60; // 5 Minuten

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
}

let questions = [];
let currentIndex = 0;
let score = 0;
let selectedAnswer = null;
let timerId = null;
let timeLeft = QUIZ_TIME_SECONDS;
let userAnswers = [];

const highscoreKey = "feuerBrandschutzQuizBestScore";

const categoryBadge = document.getElementById("categoryBadge");
const progressEl = document.getElementById("progress");
const timerEl = document.getElementById("timer");
const highscoreEl = document.getElementById("highscore");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("nextBtn");
const resultEl = document.getElementById("result");
const infoEl = document.getElementById("info");
const restartBtn = document.getElementById("restartBtn");
const summaryEl = document.getElementById("summary");

function loadHighscore() {
  const best = localStorage.getItem(highscoreKey);
  if (best !== null) {
    highscoreEl.textContent = "Bisheriger Highscore: " + best + " / " + BASE_QUESTIONS.length;
  } else {
    highscoreEl.textContent = "Noch kein Highscore gespeichert – leg los!";
  }
}

function startTimer() {
  timeLeft = QUIZ_TIME_SECONDS;
  timerEl.textContent = "⏱ " + formatTime(timeLeft);
  timerId = setInterval(() => {
    timeLeft--;
    timerEl.textContent = "⏱ " + formatTime(Math.max(timeLeft, 0));
    if (timeLeft <= 0) {
      clearInterval(timerId);
      finishQuiz(true);
    }
  }, 1000);
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function startQuiz() {
  questions = BASE_QUESTIONS.map(q => ({ ...q }));
  shuffle(questions);
  currentIndex = 0;
  score = 0;
  selectedAnswer = null;
  userAnswers = [];
  resultEl.textContent = "";
  summaryEl.innerHTML = "";
  restartBtn.style.display = "none";
  nextBtn.disabled = true;
  infoEl.textContent = "";

  loadHighscore();
  startTimer();
  showQuestion();
}

function showQuestion() {
  const q = questions[currentIndex];

  categoryBadge.textContent = "Kategorie: " + q.category;
  progressEl.textContent = "Frage " + (currentIndex + 1) + " / " + questions.length;

  questionEl.textContent = q.question;
  answersEl.innerHTML = "";
  selectedAnswer = null;
  nextBtn.disabled = true;

  if (q.type === "mc") {
    const answerIndices = q.answers.map((_, i) => i);
    shuffle(answerIndices);

    answerIndices.forEach(originalIndex => {
      const btn = document.createElement("button");
      btn.textContent = q.answers[originalIndex];
      btn.addEventListener("click", () => {
        Array.from(answersEl.children).forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedAnswer = originalIndex;
        nextBtn.disabled = false;
      });
      answersEl.appendChild(btn);
    });
  } else if (q.type === "tf") {
    ["Wahr", "Falsch"].forEach((label, i) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.addEventListener("click", () => {
        Array.from(answersEl.children).forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedAnswer = (i === 0);
        nextBtn.disabled = false;
      });
      answersEl.appendChild(btn);
    });
  }
}

function handleNext() {
  if (selectedAnswer === null) return;

  const q = questions[currentIndex];
  let correct = false;

  if (q.type === "mc") {
    correct = (selectedAnswer === q.correctIndex);
  } else if (q.type === "tf") {
    correct = (selectedAnswer === q.correct);
  }

  if (correct) score++;

  userAnswers.push({
    question: q.question,
    type: q.type,
    answers: q.answers,
    correctIndex: q.correctIndex,
    correctBool: q.correct,
    userAnswerIndex: q.type === "mc" ? selectedAnswer : null,
    userAnswerBool: q.type === "tf" ? selectedAnswer : null,
    isCorrect: correct
  });

  currentIndex++;
  if (currentIndex < questions.length && timeLeft > 0) {
    showQuestion();
  } else {
    finishQuiz(false);
  }
}

function renderSummary() {
  let html = "<h3>Auswertung der Fragen</h3>";
  html += '<ol class="summary-list">';
  userAnswers.forEach((entry, index) => {
    let correctText = "";
    let userText = "";
    if (entry.type === "mc") {
      correctText = entry.correctIndex != null ? entry.answers[entry.correctIndex] : "–";
      userText = entry.userAnswerIndex != null ? entry.answers[entry.userAnswerIndex] : "Keine Antwort";
    } else if (entry.type === "tf") {
      correctText = entry.correctBool ? "Wahr" : "Falsch";
      if (entry.userAnswerBool === null) {
        userText = "Keine Antwort";
      } else {
        userText = entry.userAnswerBool ? "Wahr" : "Falsch";
      }
    }

    const icon = entry.isCorrect ? "✅" : "❌";
    const cls = entry.isCorrect ? "summary-correct" : "summary-wrong";

    html += '<li class="summary-item">';
    html += '<div class="summary-question">' + (index + 1) + ". " + entry.question + "</div>";
    html += '<div class="summary-answer ' + cls + '">' + icon +
            " Deine Antwort: " + userText +
            " – Richtige Antwort: " + correctText + "</div>";
    html += "</li>";
  });
  html += "</ol>";
  summaryEl.innerHTML = html;
}

function finishQuiz(timeUp) {
  stopTimer();
  questionEl.textContent = timeUp ? "Zeit abgelaufen!" : "Quiz beendet!";
  answersEl.innerHTML = "";
  progressEl.textContent = "Fertig";
  categoryBadge.textContent = "Kategorie: –";
  nextBtn.style.display = "none";

  const best = parseInt(localStorage.getItem(highscoreKey) || "0", 10);
  let newHighscore = false;
  if (score > best) {
    localStorage.setItem(highscoreKey, String(score));
    newHighscore = true;
  }

  const baseText = "Du hast " + score + " von " + questions.length + " Fragen richtig beantwortet.";
  const timeText = timeUp ? " (Zeit war abgelaufen.)" : "";
  const highscoreValue = localStorage.getItem(highscoreKey) || score;
  const highscoreText = newHighscore
    ? " 🎉 Neuer Highscore!"
    : " Bisheriger Highscore bleibt: " + highscoreValue + " Punkte.";

  resultEl.textContent = baseText + timeText + highscoreText;
  renderSummary();
  restartBtn.style.display = "inline-flex";
}

nextBtn.addEventListener("click", handleNext);
restartBtn.addEventListener("click", () => {
  nextBtn.style.display = "inline-flex";
  startQuiz();
});

startQuiz();
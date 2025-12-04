const BASE_QUESTIONS = [
  {
    type: "mc",
    category: "Grundlagen",
    question: "Welche drei Dinge braucht ein Feuer, um zu brennen?",
    answers: [
      "Sauerstoff, Brennstoff, Zündenergie",
      "Wasser, Holz, Licht",
      "Metall, Kohlenstoff, Hitze"
    ],
    correctIndex: 0
  },
  {
    type: "mc",
    category: "Brennstoffe",
    question: "Welcher Stoff ist ein typischer Brennstoff?",
    answers: ["Kupfer", "Holz", "Sand"],
    correctIndex: 1
  },
  {
    type: "tf",
    category: "Sauerstoff",
    question: "Wahr oder falsch: Ohne Sauerstoff kann kein Feuer entstehen.",
    correct: true
  },
  {
    type: "mc",
    category: "Zündtemperatur",
    question: "Was versteht man unter Zündtemperatur?",
    answers: [
      "Die Temperatur, bei der ein Stoff von selbst zu brennen beginnt",
      "Die Temperatur, bei der Wasser kocht",
      "Die Temperatur, bei der Rauch entsteht"
    ],
    correctIndex: 0
  },
  {
    type: "tf",
    category: "Oberfläche",
    question: "Wahr oder falsch: Eine größere Oberfläche (z.B. feine Holzspäne) brennt schneller als ein großes Stück Holz.",
    correct: true
  },
  {
    type: "mc",
    category: "Verbrennung",
    question: "Welcher Vorgang ist eine Verbrennung?",
    answers: ["Eis schmilzt", "Holz entzündet sich", "Wasser verdunstet"],
    correctIndex: 1
  },
  {
    type: "mc",
    category: "Verbrennungsdreieck",
    question: "Welches gehört NICHT zum Verbrennungsdreieck?",
    answers: ["Sauerstoff", "Zündenergie", "Kälte"],
    correctIndex: 2
  },
  {
    type: "tf",
    category: "Funken",
    question: "Wahr oder falsch: Funken entstehen, wenn zwei Materialien stark aneinander gerieben werden.",
    correct: true
  },
  {
    type: "mc",
    category: "Löschen",
    question: "Warum löscht man Feuer häufig mit Wasser?",
    answers: [
      "Wasser erhöht die Temperatur",
      "Wasser entzieht dem Feuer Wärme",
      "Wasser liefert zusätzlichen Sauerstoff"
    ],
    correctIndex: 1
  },
  {
    type: "tf",
    category: "Oberfläche",
    question: "Wahr oder falsch: Papier entzündet sich schneller, wenn es fein zerkleinert wurde.",
    correct: true
  },
  {
    type: "mc",
    category: "Chemische Reaktion",
    question: "Was passiert bei einer Verbrennung chemisch?",
    answers: [
      "Der Stoff reagiert mit Sauerstoff",
      "Der Stoff friert",
      "Der Stoff wird flüssig"
    ],
    correctIndex: 0
  },
  {
    type: "tf",
    category: "Eigenschaften",
    question: "Wahr oder falsch: Ein Feuer erzeugt immer Licht und Wärme.",
    correct: true
  },
  {
    type: "mc",
    category: "Verbrennungsprodukte",
    question: "Welcher Stoff entsteht bei fast jeder Verbrennung kohlenstoffhaltiger Stoffe?",
    answers: ["Kohlenstoffdioxid", "Helium", "Stickstoff"],
    correctIndex: 0
  },
  {
    type: "mc",
    category: "Löschen",
    question: "Welche Maßnahme kann ein Feuer löschen?",
    answers: [
      "Zufuhr von mehr Brennstoff",
      "Entzug von Sauerstoff",
      "Erhöhung der Temperatur"
    ],
    correctIndex: 1
  },
  {
    type: "tf",
    category: "Flamme",
    question: "Wahr oder falsch: Eine Flamme ist ein glühendes Gas.",
    correct: true
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

const highscoreKey = "feuerQuizBestScore";

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
  resultEl.textContent = "";
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

  currentIndex++;
  if (currentIndex < questions.length && timeLeft > 0) {
    showQuestion();
  } else {
    finishQuiz(false);
  }
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
  restartBtn.style.display = "inline-flex";
}

nextBtn.addEventListener("click", handleNext);
restartBtn.addEventListener("click", () => {
  nextBtn.style.display = "inline-flex";
  startQuiz();
});

startQuiz();
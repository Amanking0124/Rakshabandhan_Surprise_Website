const questions = [
  {
    question: "Who is the cooler sibling?",
    options: [
      "You 😎",
      "Me",
      "Both",
      "Nobody"
    ],
    correct: 0,
    correctMessage: "Obviously. At least you know the important things. 😌",
    wrongMessage: "Wrong. Seriously? Try again 😂"
  },
  {
    question: "Who usually starts the fights?",
    options: [
      "Me 🙋‍♀️",
      "You",
      "Mom",
      "Nobody"
    ],
    correct: 0,
    correctMessage: "See? Honesty. I respect that. 😂",
    wrongMessage: "Nice attempt at rewriting history. Try again."
  },
  {
    question: "Who borrows other's stuff more and make it disappear?",
    options: [
      "Me 🤫",
      "You",
      "Both",
      "Nobody"
    ],
    correct: 0,
    correctMessage: "Finally, you admit it. Case closed. 👨‍⚖️",
    wrongMessage: "The evidence says otherwise. Try again 😂"
  },
  {
    question: "If you need help at 2 AM, who will you probably pick up?",
    options: [
      "Google",
      "Friends",
      "You ❤️",
      "Nobody"
    ],
    correct: 2,
    correctMessage: "Correct. Unfortunately, you're stuck with me. ❤️",
    wrongMessage: "Think carefully. Who's always got your back?"
  },
  {
    question: "Who is secretly my favourite person?",
    options: [
      "Phone",
      "Me ❤️",
      "Snacks",
      "Nobody"
    ],
    correct: 1,
    correctMessage: "Okay fine... you got the final one. ❤️",
    wrongMessage: "Ouch. You really thought I'd choose my snacks? 😂"
  }
];

const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");
const quizCard = document.getElementById("quizCard");
const successCard = document.getElementById("successCard");
const questionNumber = document.getElementById("questionNumber");
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");
const scoreElement = document.getElementById("score");
const unlockBtn = document.getElementById("unlockBtn");
const restartBtn = document.getElementById("restartBtn");
const musicBtn = document.getElementById("musicBtn");
const confettiBtn = document.getElementById("confettiBtn");

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

function loadQuestion() {
  selectedAnswer = null;
  nextBtn.disabled = true;
  feedback.textContent = "";
  feedback.className = "feedback";

  const q = questions[currentQuestion];
  const displayNumber = String(currentQuestion + 1).padStart(2, "0");
  questionNumber.textContent = `QUESTION ${displayNumber} / 05`;
  progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  questionElement.textContent = q.question;
  optionsElement.innerHTML = "";

  q.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option";
    button.type = "button";

    const letter = document.createElement("span");
    letter.className = "option-letter";
    letter.textContent = String.fromCharCode(65 + index);

    const text = document.createElement("span");
    text.textContent = option;

    button.appendChild(letter);
    button.appendChild(text);
    button.addEventListener("click", () => selectAnswer(index));
    optionsElement.appendChild(button);
  });
}

function selectAnswer(index) {
  if (selectedAnswer !== null) return;
  selectedAnswer = index;

  const q = questions[currentQuestion];
  const buttons = document.querySelectorAll(".option");

  if (index === q.correct) {
    score++;
    scoreElement.textContent = score;
    buttons[index].classList.add("correct");
    feedback.textContent = q.correctMessage;
    feedback.className = "feedback good";
    nextBtn.disabled = false;
  } else {
    buttons[index].classList.add("wrong");
    feedback.textContent = q.wrongMessage;
    feedback.className = "feedback bad";
    setTimeout(() => {
      selectedAnswer = null;
      buttons[index].classList.remove("wrong");
      feedback.textContent = "Try again — you need the correct answer to continue.";
    }, 700);
  }
}

nextBtn.addEventListener("click", () => {
  if (selectedAnswer === null) return;
  currentQuestion++;
  if (currentQuestion >= questions.length) {
    quizCard.classList.add("hidden");
    successCard.classList.remove("hidden");
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    return;
  }
  loadQuestion();
});

unlockBtn.addEventListener("click", () => {
  page1.classList.add("hidden");
  page2.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
});

restartBtn.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  selectedAnswer = null;
  scoreElement.textContent = "0";
  successCard.classList.add("hidden");
  quizCard.classList.remove("hidden");
  page2.classList.add("hidden");
  page1.classList.remove("hidden");
  loadQuestion();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function revealGift(el, rewardText) {
  el.innerHTML = `<div style="font-size:1.6rem; margin-bottom:6px;">✨</div><div style="font-size:0.9rem; font-weight:600; color:#fff; line-height:1.4;">${rewardText}</div>`;
  el.style.borderStyle = "solid";
  el.style.borderColor = "#2ed573";
  confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
}

confettiBtn.addEventListener("click", () => {
  confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
});

/* =====================================================
   BACKGROUND MUSIC (AUTO-PLAY + CONTINUOUS LOOP)
===================================================== */

const audio = new Audio("music.mp3");
audio.loop = true; // Keeps playing on repeat till the very end

let musicPlaying = false;

function playAudio() {
  if (!musicPlaying) {
    audio.play().then(() => {
      musicPlaying = true;
      if (musicBtn) musicBtn.textContent = "❚❚";
    }).catch(() => {
      // Browser blocked autoplay; waiting for first user click
    });
  }
}

// 1. Try playing immediately on page load
window.addEventListener("DOMContentLoaded", playAudio);

// 2. Play on first click/tap anywhere on the screen if autoplay was blocked
window.addEventListener("click", () => {
  if (!musicPlaying) {
    playAudio();
  }
}, { once: true });

// 3. Manual toggle button (if she wants to pause/resume)
if (musicBtn) {
  musicBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevents triggering the window click listener
    if (!musicPlaying) {
      audio.play().then(() => {
        musicPlaying = true;
        musicBtn.textContent = "❚❚";
      });
    } else {
      audio.pause();
      musicPlaying = false;
      musicBtn.textContent = "♪";
    }
  });
}

// Floating Background Animation
const floatingContainer = document.getElementById("floatingIcons");
const icons = ["🌸", "✨", "🪷", "💖", "🌼", "🎁"];

function createFloatingIcon() {
  const el = document.createElement("div");
  el.className = "floating-icon";
  el.textContent = icons[Math.floor(Math.random() * icons.length)];
  el.style.left = Math.random() * 100 + "vw";
  el.style.animationDuration = Math.random() * 3 + 5 + "s";
  floatingContainer.appendChild(el);
  setTimeout(() => el.remove(), 8000);
}
setInterval(createFloatingIcon, 700);

loadQuestion();
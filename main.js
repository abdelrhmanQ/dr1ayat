/* ─── QUIZ DATA: 2 questions each ─── */
const quizData = {
  blank: [
    {
      question: "Blank verse is best described as poetry that is:",
      options: [
        "Rhymed and written in iambic pentameter",
        "Unrhymed and written in iambic pentameter",
        "Written without any metrical pattern whatsoever",
        "Composed entirely of heroic couplets",
      ],
      correct: 1,
      why: "Blank verse is defined by its <em>iambic pentameter</em>  ten syllables per line in a da-DUM da-DUM pattern  while remaining free from end-rhyme. This is its defining characteristic, distinguishing it from both rhymed verse and true free verse.",
    },
    {
      question:
        "Which of the following is the most celebrated example of sustained blank verse in English literature?",
      options: [
        "The Canterbury Tales by Chaucer",
        "The Waste Land by T.S. Eliot",
        "Paradise Lost by John Milton",
        "Leaves of Grass by Walt Whitman",
      ],
      correct: 2,
      why: "<em>Paradise Lost</em> (1667) by John Milton is universally regarded as the supreme achievement of blank verse. Milton consciously chose it over rhyme, calling rhyme 'the invention of a barbarous age'. The 10,000-line epic demonstrates the full majestic power of the form.",
    },
  ],
  free: [
    {
      question: "Free verse is primarily characterised by its:",
      options: [
        "Strict adherence to rhyme scheme",
        "Use of exactly fourteen lines",
        "Absence of consistent metre and rhyme",
        "Reliance on heroic couplets",
      ],
      correct: 2,
      why: "The very definition of free verse (<em>vers libre</em>) is poetry that rejects fixed metrical patterns and rhyme schemes. It creates rhythm through repetition, line breaks, and the natural cadences of speech but imposes no predetermined formal constraints.",
    },
    {
      question:
        "Which poet is most widely credited with pioneering free verse in the English language?",
      options: [
        "John Keats",
        "Walt Whitman",
        "Alfred Lord Tennyson",
        "Alexander Pope",
      ],
      correct: 1,
      why: "Walt Whitman's <em>Leaves of Grass</em> (1855) fundamentally broke with the formal verse traditions of his era and introduced the long, rolling, catalogue-driven free verse line to English poetry. His influence on all subsequent poetry  especially in America is immeasurable.",
    },
  ],
};

/* ─── STATE ─── */
const state = {
  blank: { answered: [], score: 0, rendered: false },
  free: { answered: [], score: 0, rendered: false },
};

/* ─── PAGE NAVIGATION ─── */
function showPage(type) {
  document.getElementById("landing").style.display = "none";
  document.getElementById("page-" + type).classList.add("active");
  if (type !== "team" && !state[type].rendered) {
    renderQuiz(type);
    state[type].rendered = true;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function goHome() {
  document
    .querySelectorAll(".detail-page")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById("landing").style.display = "flex";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ─── TAB SWITCHING ─── */
function switchTab(type, panel, btn) {
  document
    .querySelectorAll("#nav-" + type + " .cat-tab")
    .forEach((t) => t.classList.remove("active"));
  ["def", "ex", "au", "mcq"].forEach((p) => {
    const el = document.getElementById(type + "-" + p);
    if (el) el.classList.remove("active");
  });
  btn.classList.add("active");
  document.getElementById(type + "-" + panel).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ─── RENDER QUIZ ─── */
function renderQuiz(type) {
  const container = document.getElementById("questions-" + type);
  container.innerHTML = "";
  quizData[type].forEach((q, qi) => {
    const letters = ["A", "B", "C", "D"];
    const block = document.createElement("div");
    block.className = "question-block";
    block.id = `qblock-${type}-${qi}`;
    block.innerHTML = `
      <div class="question-num">Question ${qi + 1} of ${quizData[type].length}</div>
      <div class="question-text">${q.question}</div>
      <div class="options-grid">
        ${q.options
          .map(
            (opt, oi) => `
          <button class="option-btn" id="opt-${type}-${qi}-${oi}" onclick="handleAnswer('${type}',${qi},${oi})">
            <span class="option-letter">${letters[oi]}</span>${opt}
          </button>`,
          )
          .join("")}
      </div>
      <div class="feedback-area" id="feedback-${type}-${qi}">
        <div class="feedback-badge" id="badge-${type}-${qi}"></div>
        <div class="why-box"><strong>✦ Wherefore?</strong><span id="why-text-${type}-${qi}"></span></div>
      </div>
      <div class="seal" id="seal-${type}-${qi}">🔮</div>`;
    container.appendChild(block);
  });
}

/* ─── HANDLE ANSWER ─── */
function handleAnswer(type, qi, chosen) {
  if (state[type].answered[qi] !== undefined) return;
  state[type].answered[qi] = chosen;

  const q = quizData[type][qi];
  const isCorrect = chosen === q.correct;
  const block = document.getElementById(`qblock-${type}-${qi}`);
  const feedback = document.getElementById(`feedback-${type}-${qi}`);
  const badge = document.getElementById(`badge-${type}-${qi}`);
  const whyText = document.getElementById(`why-text-${type}-${qi}`);
  const seal = document.getElementById(`seal-${type}-${qi}`);

  q.options.forEach((_, oi) => {
    const btn = document.getElementById(`opt-${type}-${qi}-${oi}`);
    btn.disabled = true;
    if (oi === q.correct) btn.classList.add("correct");
    if (oi === chosen && !isCorrect) btn.classList.add("incorrect");
  });

  if (isCorrect) {
    state[type].score++;
    badge.className = "feedback-badge correct-badge";
    badge.innerHTML = "✦ Splendid! Thou hast answered correctly.";
    block.classList.add("animate-glow");
    seal.textContent = "🏅";
    seal.classList.add("stamp");
    spawnConfetti();
  } else {
    badge.className = "feedback-badge incorrect-badge";
    badge.innerHTML = "✗ Nay that is not correct.";
    block.classList.add("animate-shake");
    setTimeout(() => block.classList.remove("animate-shake"), 600);
  }

  whyText.innerHTML = " " + q.why;
  feedback.classList.add("show");

  const answered = state[type].answered.filter((v) => v !== undefined).length;
  const total = quizData[type].length;
  document.getElementById("prog-" + type).style.width =
    (answered / total) * 100 + "%";
  if (answered === total) setTimeout(() => showScore(type), 700);
}

/* ─── SHOW SCORE ─── */
function showScore(type) {
  const total = quizData[type].length;
  const score = state[type].score;
  const name = (
    document.getElementById("name-" + type).value || "Scholar"
  ).trim();
  const pct = score / total;
  const verdict =
    pct === 1
      ? `Remarkable, ${name}! A perfect score  thou art a true master of the poetic arts.`
      : pct >= 0.5
        ? `Well done, ${name}! Thy knowledge of verse is commendable indeed.`
        : `Fear not, ${name}  even the greatest scholars must sometimes return to their texts.`;
  document.getElementById("score-num-" + type).textContent =
    `${score} / ${total}`;
  document.getElementById("score-verdict-" + type).textContent = verdict;
  document.getElementById("score-" + type).classList.add("show");
  document
    .getElementById("score-" + type)
    .scrollIntoView({ behavior: "smooth", block: "center" });
}

/* ─── RESET QUIZ ─── */
function resetQuiz(type) {
  state[type] = { answered: [], score: 0, rendered: true };
  document.getElementById("score-" + type).classList.remove("show");
  document.getElementById("prog-" + type).style.width = "0%";
  renderQuiz(type);
  document
    .getElementById("questions-" + type)
    .scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ─── CONFETTI ─── */
function spawnConfetti() {
  const colors = [
    "#d4af37",
    "#c8920a",
    "#8aaa70",
    "#b8955e",
    "#a8890a",
    "#d4a030",
  ];
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "confetti-piece";
      el.style.left = 10 + Math.random() * 80 + "vw";
      el.style.top = Math.random() * 30 + "vh";
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.setProperty("--drift", Math.random() * 100 - 50 + "px");
      el.style.animationDelay = Math.random() * 0.4 + "s";
      el.style.animationDuration = 1 + Math.random() + "s";
      el.style.width = el.style.height = 6 + Math.random() * 6 + "px";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2500);
    }, i * 40);
  }
}


    let prompts = [];
    let currentIndex = 0;
    let usedIndexes = JSON.parse(localStorage.getItem("usedIndexes")) || [];
    let tries = 0;
    let totalPoints = parseInt(localStorage.getItem("totalPoints")) || 0;
    const sentenceBox = document.getElementById("sentenceBox");
    const clue = document.getElementById("clue");
    const nextButton = document.getElementById("nextButton");
    const scorePanel = document.getElementById("scorePanel");
    const questionText = document.getElementById("questionText");
    const buttons = document.querySelectorAll(".pos-button");
    const message = document.getElementById("message");

    function updateScoreboard() {
  scorePanel.textContent = `Points: ${totalPoints}`;
  const messages = [
    { threshold: 100, text: "👍 Great start! You're on your way!" },
    { threshold: 300, text: "🔥 Building momentum — keep it up!" },
    { threshold: 600, text: "💪 You're making solid progress!" },
    { threshold: 900, text: "🧠 Smart moves! You're learning fast!" },
    { threshold: 1200, text: "🚀 Halfway there! Keep charging forward!" },
    { threshold: 1500, text: "🏆 Great job — you're mastering this!" },
    { threshold: 1800, text: "🎯 So close to the final stretch!" },
    { threshold: 2200, text: "👏 Amazing focus — just a bit more!" },
    { threshold: 2600, text: "💥 Unstoppable! You're almost perfect!" },
    { threshold: 3000, text: "👑 Perfect 3000! You're a Word Wizard Supreme!" }
  ];
  const shown = JSON.parse(localStorage.getItem("messagesShown")) || [];
  for (const { threshold, text } of messages) {
    const id = "m_" + threshold;
    if (totalPoints >= threshold && !shown.includes(id)) {
      message.textContent = text;
      message.style.display = "block";
      shown.push(id);
      localStorage.setItem("messagesShown", JSON.stringify(shown));
      break;
    }
  }
}
  const messages = [
    { threshold: 100, text: "👍 Great start! You're on your way!" },
    { threshold: 300, text: "🔥 Building momentum — keep it up!" },
    { threshold: 600, text: "💪 You're making solid progress!" },
    { threshold: 900, text: "🧠 Smart moves! You're learning fast!" },
    { threshold: 1200, text: "🚀 Halfway there! Keep charging forward!" },
    { threshold: 1500, text: "🏆 Great job — you're mastering this!" },
    { threshold: 1800, text: "🎯 So close to the final stretch!" },
    { threshold: 2200, text: "👏 Amazing focus — just a bit more!" },
    { threshold: 2600, text: "💥 Unstoppable! You're almost perfect!" },
    { threshold: 3000, text: "👑 Perfect 3000! You're a Word Wizard Supreme!" }
  ];
  const shown = JSON.parse(localStorage.getItem("messagesShown")) || [];
  for (const { threshold, text } of messages) {
    const id = "m_" + threshold;
    if (totalPoints >= threshold && !shown.includes(id)) {
      message.textContent = text;
      message.style.display = "block";
      shown.push(id);
      localStorage.setItem("messagesShown", JSON.stringify(shown));
      break;
    }
  }

   

    function loadQuestion() {
      const q = prompts[currentIndex];
      sentenceBox.innerHTML = q.sentence;
      questionText.textContent = `In this sentence, what kind of word is "${q.word}"?`;
      clue.style.visibility = "hidden";
      nextButton.classList.remove("show");
      message.style.display = "none";
      tries = 0;

      buttons.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove("correct", "incorrect");
      });
    }

    function nextQuestion() {
      usedIndexes.push(currentIndex);
      localStorage.setItem("usedIndexes", JSON.stringify(usedIndexes));

      const availableIndexes = prompts.map((_, i) => i).filter(i => !usedIndexes.includes(i));
      if (availableIndexes.length === 0) {
        sentenceBox.innerHTML = "🎉 You’ve completed all prompts!";
        document.querySelector(".button-container").style.display = "none";
        clue.style.visibility = "hidden";
        questionText.style.display = "none";
        nextButton.classList.remove("show");
        message.style.display = "none";
        return;
      }

      currentIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
      loadQuestion();
    }

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        const selected = button.getAttribute("data-pos");
        const correct = prompts[currentIndex].answer;
        tries++;

        if (selected === correct) {
          let points = tries === 1 ? 10 : tries === 2 ? 7 : 4;
          totalPoints += points;
          localStorage.setItem("totalPoints", totalPoints);
          updateScoreboard();
          button.classList.add("correct");
          clue.textContent = `✅ Correct! You earned ${points} point${points === 1 ? '' : 's'}.`;
          clue.style.color = "#006600";
          clue.style.visibility = "visible";
          nextButton.classList.add("show");
          buttons.forEach(btn => btn.disabled = true);
        } else {
          button.classList.add("incorrect");
          clue.textContent = "❌ Try again. Clue: " + prompts[currentIndex].clue;
          clue.style.color = "#cc0000";
          clue.style.visibility = "visible";
        }
      });
    });

    nextButton.addEventListener("click", nextQuestion);

    Promise.all([
      fetch('nouns.json').then(res => res.json()),
      fetch('verbs.json').then(res => res.json()),
      fetch('adjectives.json').then(res => res.json()),
      fetch('adverbs.json').then(res => res.json())
    ]).then(([nouns, verbs, adjectives, adverbs]) => {
      prompts = [...nouns, ...verbs, ...adjectives, ...adverbs].sort(() => Math.random() - 0.5);
      const availableIndexes = prompts.map((_, i) => i).filter(i => !usedIndexes.includes(i));

      if (availableIndexes.length === 0) {
        sentenceBox.innerHTML = `🎉 You’ve completed all prompts!`;
        document.querySelector(".button-container").style.display = "none";
        clue.style.display = "none";
        questionText.style.display = "none";
        nextButton.classList.remove("show");
        setTimeout(() => {
          localStorage.removeItem("usedIndexes");
          localStorage.removeItem("totalPoints");
          location.reload();
        }, 8000);
        return;
      }

      currentIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
      updateScoreboard();
      loadQuestion();
    }).catch(err => {
      sentenceBox.innerHTML = "Error loading prompts.";
      console.error(err);
    });
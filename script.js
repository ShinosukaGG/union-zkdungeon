let username = '';
let currentMilestone = 0;
const totalMilestones = 6;
const character = document.getElementById("character");
const terminal = document.getElementById("terminal");
const popup = document.createElement("div");
popup.className = "popup hidden";
document.body.appendChild(popup);

const pathContainer = document.getElementById("path-container");
const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");
const jumpBtn = document.getElementById("jump-btn");

// Milestone data
const milestones = [
  {
    title: "ZKdungeon Gate",
    desc: "You’ve reached the gate of ZKdungeon. This is where the journey begins. Prepare yourself!",
    img: "game0.png",
    terminal: [
      "Welcome, adventurer!",
      "You've arrived at the Gate.",
      "Press 1 to Enter the ZKdungeon."
    ]
  },
  {
    title: "First Fight",
    desc: "The Fudders appear from the shadows... Will you engage in battle or run?",
    img: "game1.png",
    terminal: [
      "A wild Fudder appears!",
      "What will you do?",
      "1. Engage in Battle",
      "2. Flee"
    ]
  },
  {
    title: "Treasure Found",
    desc: "You discovered ancient relics of the chain gods. $auBTC is yours!",
    img: "game2.png",
    terminal: [
      "You stumbled on treasure!",
      "Press 1 to Loot and Continue."
    ]
  },
  {
    title: "Fork in the Path",
    desc: "Two paths diverge. One leads to L2 peace, the other to chaos. Choose wisely.",
    img: "game3.png",
    terminal: [
      "You've reached a ZK-backed fork.",
      "1. Choose Secure Path",
      "2. Test Unknown Road"
    ]
  },
  {
    title: "Final Boss",
    desc: "The main Fudder stands tall. He says 'Bridges are dead!' Will you finish him?",
    img: "game4.png",
    terminal: [
      "The Final Boss mocks interop!",
      "1. Finish the Fudders!"
    ]
  },
  {
    title: "Dungeon Exit",
    desc: "You have conquered ZKdungeon. Time to echo the truth.",
    img: "game5.png",
    terminal: [
      "You have made it.",
      "ZKGMer.",
      "We. Are. Union.",
      "Press 1 to Share Your Victory."
    ],
    isFinal: true
  }
];

// Handle Twitter username
document.getElementById("enter-username-button").onclick = () => {
  const raw = document.getElementById("username-input").value.trim();
  username = raw.startsWith("@") ? raw.slice(1) : raw;
  document.getElementById("username-entry-box").classList.add("hidden");
  document.getElementById("intro-buttons").classList.remove("hidden");
};

// Start Game
document.getElementById("start-button").onclick = () => {
  document.getElementById("intro-screen").classList.add("hidden");
  document.getElementById("game-container").classList.remove("hidden");
  buildPath();
  scrollToMilestone(0);
  currentMilestone = 0;
  printToTerminal(milestones[0].terminal, () => {
    showPopup(currentMilestone);
  });
};

// Build path dots and milestones
function buildPath() {
  pathContainer.innerHTML = '';
  for (let i = 0; i < totalMilestones; i++) {
    if (i > 0) {
      for (let j = 0; j < 3; j++) {
        const dot = document.createElement("div");
        dot.className = "path-dot";
        pathContainer.appendChild(dot);
      }
    }
    const block = document.createElement("div");
    block.className = "milestone-block";
    block.innerText = `Step ${i + 1}`;
    block.id = `milestone-${i}`;
    pathContainer.appendChild(block);
  }
}

// Character movement
function moveCharacterTo(index) {
  const block = document.getElementById(`milestone-${index}`);
  const topPos = block.offsetTop;
  character.style.top = `${topPos}px`;

  // activate path dots visually
  const dots = document.querySelectorAll(".path-dot");
  for (let i = 0; i < index * 3; i++) {
    if (dots[i]) dots[i].classList.add("active-dot");
  }
}

// Scroll to milestone
function scrollToMilestone(index) {
  const block = document.getElementById(`milestone-${index}`);
  block.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Terminal print with line-by-line delay (slower, with proper spaces)
function printToTerminal(lines, callback) {
  terminal.innerText = "";
  let i = 0;
  function printLine() {
    if (i < lines.length) {
      terminal.innerText += lines[i] + "\n";
      i++;
      setTimeout(printLine, 550); // slow down for drama
    } else if (callback) {
      callback();
    }
  }
  printLine();
}

// Show popup (with X share btn at the end)
function showPopup(index) {
  const { title, desc, img, isFinal } = milestones[index];
  popup.innerHTML = `
    <img src="${img}" alt="Popup Image"/>
    <h2>${title}</h2>
    <p>${desc}</p>
    ${
      isFinal
        ? `<button id="share-btn" class="input-button" style="margin-top:18px;font-size:1rem;background:#A9ECFD;color:#000;">
            Share Your Victory on X
           </button>`
        : ''
    }
  `;
  popup.classList.remove("hidden");
  if (isFinal) {
    document.getElementById("share-btn").onclick = () => {
      const tweet = `I just conquered the ZKdungeon on union-zkdungeon.vercel.app by @Shinosuka_eth!\nFaced the Fudders, looted $auBTC, and proved We. Are. Union.\nzkgm 🚀\n\nJoin the quest: union-zkdungeon.vercel.app`;
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
      window.open(url, "_blank");
      for (let i = 0; i < 5; i++) setTimeout(() => confetti(), i * 300);
    };
  }
  enableStepButtons(index);
}

// Button control logic for progression
function enableStepButtons(index) {
  btn1.disabled = false;
  btn2.disabled = false;
  btn1.onclick = () => {
    btn1.disabled = true;
    popup.classList.add("hidden");
    if (index < totalMilestones - 1) {
      currentMilestone++;
      moveCharacterTo(currentMilestone);
      scrollToMilestone(currentMilestone);
      printToTerminal(milestones[currentMilestone].terminal, () => {
        showPopup(currentMilestone);
      });
    } else {
      // Final step: show popup & confetti after terminal
      printToTerminal([
        "🎉 You’ve completed the ZKdungeon!",
        "",
        "Tweet your triumph at union-zkdungeon.vercel.app"
      ], () => {
        showPopup(currentMilestone);
        // Fire confetti 5x!
        for (let i = 0; i < 5; i++) {
          setTimeout(() => confetti(), i * 300);
        }
      });
    }
  };
  btn2.onclick = () => {
    btn2.disabled = true;
    popup.classList.add("hidden");
    printToTerminal(["You chose option 2. Be careful..."]);
    // btn1 stays enabled so player can proceed
  };
}

// Jump effect
jumpBtn.onclick = () => {
  character.classList.add("jump");
  setTimeout(() => character.classList.remove("jump"), 300);
};

const bgm = document.getElementById("bgm-audio");
const musicBtn = document.getElementById("bgm-toggle");
let isPlaying = false;

// Modern browsers block autoplay, so play on user click
musicBtn.onclick = () => {
  if (!isPlaying) {
    bgm.volume = 0.16; // not too loud!
    bgm.play();
    musicBtn.textContent = "⏸️ Pause Music";
    isPlaying = true;
  } else {
    bgm.pause();
    musicBtn.textContent = "🎵 Play Music";
    isPlaying = false;
  }
};

const DIGIT_COUNT = 6;

const targetRow = document.getElementById("target-row");

let targetDigits = [];
let typedDigits = [];
let activeIndex = 0;
let waitingForNextRound = false;
let nextRoundTimerId = null;

function randomDigit() {
  return String(Math.floor(Math.random() * 10));
}

function makeSlot(char = "") {
  const slot = document.createElement("div");
  slot.className = "digit-slot pending";
  slot.textContent = char;
  return slot;
}

function renderTarget() {
  targetRow.replaceChildren();
  for (let i = 0; i < DIGIT_COUNT; i += 1) {
    const slot = makeSlot(targetDigits[i]);

    if (typedDigits[i] !== undefined) {
      if (typedDigits[i] === targetDigits[i]) {
        slot.classList.remove("pending");
        slot.classList.add("correct");
      } else {
        slot.classList.remove("pending");
        slot.classList.add("incorrect");
      }
    }

    targetRow.appendChild(slot);
  }
}

function startNewRound() {
  if (nextRoundTimerId !== null) {
    clearTimeout(nextRoundTimerId);
    nextRoundTimerId = null;
  }

  targetDigits = Array.from({ length: DIGIT_COUNT }, randomDigit);
  typedDigits = [];
  activeIndex = 0;
  waitingForNextRound = false;
  renderTarget();
}

function handleBackspace() {
  if (waitingForNextRound) {
    return;
  }

  // If the current slot contains a typed (incorrect) digit, clear it first.
  if (typedDigits[activeIndex] !== undefined) {
    typedDigits[activeIndex] = undefined;
    renderTarget();
    return;
  }

  if (activeIndex === 0) {
    return;
  }

  activeIndex -= 1;
  typedDigits[activeIndex] = undefined;
  renderTarget();
}

function handleDigitInput(digit) {
  if (activeIndex >= DIGIT_COUNT || waitingForNextRound) {
    return;
  }

  typedDigits[activeIndex] = digit;
  if (digit === targetDigits[activeIndex]) {
    activeIndex += 1;
  }

  if (activeIndex >= DIGIT_COUNT) {
    waitingForNextRound = true;
    nextRoundTimerId = setTimeout(() => {
      startNewRound();
    }, 250);
  }

  renderTarget();
}

window.addEventListener("keydown", (event) => {
  if (waitingForNextRound) {
    return;
  }

  if (event.key === "Backspace") {
    event.preventDefault();
    handleBackspace();
    return;
  }

  if (/^[0-9]$/.test(event.key)) {
    handleDigitInput(event.key);
  }
});

startNewRound();

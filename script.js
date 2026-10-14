const page = {
  herName: "Angela",
  letter: `La distancia no ha cambiado lo importante que eres para mí. Me importas muchísimo y te extraño más de lo que suelo decir. Nuestras llamadas, nuestros correos y cada pequeño momento en el que sé de ti siguen siendo especiales para mí.

No hice esto para presionarte ni para pedirte una respuesta. Lo hice porque, aun desde lejos, quería encontrar una forma bonita de recordarte cuánto significas para mí.

Has sido una persona demasiado especial en mi vida. Lo que siento por ti es real...`,
  reasons: [
    { icon: "❦", text: "Lo que siento por ti sigue ahí, incluso desde la distancia." },
    { icon: "✦", text: "Me importas muchísimo. Más de lo que cabe en un correo." },
    { icon: "❋", text: "Te extraño en esos momentos cotidianos que quisiera compartir contigo." },
    { icon: "♥", text: "Has sido una persona demasiado especial para mí." },
    { icon: "⌁", text: "Quise escribir un mensaje normal… pero mis sentimientos exigieron flores y una página completa." },
  ],
};

const intro = document.querySelector("#intro");
const story = document.querySelector("#story");
const openStory = document.querySelector("#open-story");
const envelope = document.querySelector("#envelope");
const envelopeHint = document.querySelector("#envelope-hint");
const loveButton = document.querySelector("#love-button");
const finalMessage = document.querySelector("#final-message");
const accessGate = document.querySelector("#access-gate");
const accessForm = document.querySelector("#access-form");
const accessPassword = document.querySelector("#access-password");
const accessError = document.querySelector("#access-error");
const revealPassword = document.querySelector("#reveal-password");
const passwordField = document.querySelector(".access-form__field");
const accessHash =
  "c741c53870292f2ee92a85aec89cea97c6c8ffd2e5c17e1eaf980e148eee7063";

async function hashText(value) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function unlockPage(animate = true) {
  if (!animate) accessGate.style.transition = "none";
  accessGate.classList.add("is-unlocked");
  accessGate.setAttribute("aria-hidden", "true");
  intro.inert = false;

  if (animate) {
    releasePetals(12);
    window.setTimeout(() => openStory.focus(), 850);
  }
}

intro.inert = true;

if (sessionStorage.getItem("heart-access") === "granted") {
  unlockPage(false);
}

accessForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const normalizedPassword = accessPassword.value.trim().toLocaleLowerCase("es");
  const submittedHash = await hashText(normalizedPassword);

  if (submittedHash === accessHash) {
    sessionStorage.setItem("heart-access", "granted");
    accessError.textContent = "";
    unlockPage();
    return;
  }

  accessError.textContent = "Esa palabra no abrió el camino. Inténtalo otra vez.";
  passwordField.classList.remove("is-wrong");
  void passwordField.offsetWidth;
  passwordField.classList.add("is-wrong");
  accessPassword.select();
});

revealPassword.addEventListener("click", () => {
  const isHidden = accessPassword.type === "password";
  accessPassword.type = isHidden ? "text" : "password";
  revealPassword.textContent = isHidden ? "◆" : "◇";
  revealPassword.setAttribute(
    "aria-label",
    isHidden ? "Ocultar contraseña" : "Mostrar contraseña"
  );
  accessPassword.focus();
});

function plantFlowers(section, amount, side) {
  const garden = document.createElement("div");
  garden.className = `flower-garden flower-garden--${side}`;
  garden.setAttribute("aria-hidden", "true");

  for (let index = 0; index < amount; index += 1) {
    const flower = document.createElement("span");
    flower.className = "wildflower";
    flower.style.setProperty("--x", `${8 + index * (82 / Math.max(amount - 1, 1))}%`);
    flower.style.setProperty("--height", `${30 + Math.random() * 55}%`);
    flower.style.setProperty("--lean", `${-8 + Math.random() * 15}deg`);
    flower.style.setProperty("--delay", `${-Math.random() * 4}s`);
    flower.innerHTML = '<span class="bloom"><i class="bloom__center"></i></span>';
    garden.append(flower);
  }

  section.append(garden);
}

plantFlowers(accessGate, 7, "left");
plantFlowers(accessGate, 5, "right");
plantFlowers(intro, 7, "left");
plantFlowers(intro, 5, "right");
plantFlowers(document.querySelector(".letter-section"), 6, "left");
plantFlowers(document.querySelector(".finale"), 7, "right");

document.body.style.overflow = "hidden";

document.querySelectorAll("[data-her-name]").forEach((element) => {
  element.textContent = page.herName;
});

document.querySelectorAll("[data-my-name]").forEach((element) => {
  element.textContent = "Alguien que te ama";
});

const letterText = document.querySelector("[data-letter-text]");
letterText.textContent = page.letter;
letterText.style.whiteSpace = "pre-line";

openStory.addEventListener("click", () => {
  intro.classList.add("is-hidden");
  story.classList.add("is-visible");
  story.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "";
  window.setTimeout(() => {
    document.querySelector(".hero .reveal")?.classList.add("is-revealed");
  }, 500);
  releasePetals(14);
});

envelope.addEventListener("click", () => {
  if (envelope.classList.contains("is-open")) return;

  envelope.classList.add("is-open");
  envelopeHint.textContent =
    "La escribí con el corazón. Y también con demasiadas líneas de código.";
  releasePetals(9);
});

const reasonCard = document.querySelector("#reason-card");
const reasonNumber = document.querySelector("#reason-number");
const reasonIcon = document.querySelector("#reason-icon");
const reasonText = document.querySelector("#reason-text");
const reasonDots = document.querySelector("#reason-dots");
let currentReason = 0;
let reasonTimer;

page.reasons.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Mostrar mensaje ${index + 1}`);
  dot.addEventListener("click", () => showReason(index));
  reasonDots.append(dot);
});

function showReason(index) {
  currentReason = (index + page.reasons.length) % page.reasons.length;
  reasonCard.classList.add("is-changing");

  window.setTimeout(() => {
    const reason = page.reasons[currentReason];
    reasonNumber.textContent = String(currentReason + 1).padStart(2, "0");
    reasonIcon.textContent = reason.icon;
    reasonText.textContent = reason.text;
    [...reasonDots.children].forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentReason);
    });
  }, 200);

  window.setTimeout(() => reasonCard.classList.remove("is-changing"), 430);
  restartReasonTimer();
}

function restartReasonTimer() {
  window.clearInterval(reasonTimer);
  reasonTimer = window.setInterval(() => showReason(currentReason + 1), 6500);
}

document.querySelector("#reason-prev").addEventListener("click", () => {
  showReason(currentReason - 1);
});

document.querySelector("#reason-next").addEventListener("click", () => {
  showReason(currentReason + 1);
});

showReason(0);

loveButton.addEventListener("click", () => {
  finalMessage.classList.add("is-visible");
  loveButton.style.display = "none";
  releasePetals(24);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const petalField = document.querySelector("#floating-hearts");

function createPetal(delay = 0) {
  const petal = document.createElement("span");
  petal.className = "petal";
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.setProperty("--drift", `${Math.random() * 180 - 90}px`);
  petal.style.animationDuration = `${6 + Math.random() * 5}s`;
  petal.style.animationDelay = `${delay}s`;
  petal.style.transform = `scale(${0.55 + Math.random() * 0.8})`;
  petalField.append(petal);
  window.setTimeout(() => petal.remove(), (delay + 12) * 1000);
}

function releasePetals(amount) {
  for (let index = 0; index < amount; index += 1) {
    createPetal(index * 0.14);
  }
}

window.setInterval(() => {
  if (!intro.classList.contains("is-hidden")) return;
  createPetal();
}, 2400);

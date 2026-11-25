const words = ["in real time.", "at the edge.", "from one screen."];
const typed = document.getElementById("typed");
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
  const word = words[wordIndex];

  if (deleting) {
    charIndex--;
  } else {
    charIndex++;
  }
  typed.textContent = word.substring(0, charIndex);

  let delay = deleting ? 50 : 100;

  if (!deleting && charIndex === word.length) {
    deleting = true;
    delay = 1500;
  } else if (deleting && charIndex === 0) {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    delay = 300;
  }

  setTimeout(typeEffect, delay);
}

typeEffect();

const miniBars = document.getElementById("miniBars");
for (let i = 0; i < 12; i++) {
  miniBars.innerHTML += "<div></div>";
}

function updateHeroCard() {
  miniBars.querySelectorAll("div").forEach(function (bar) {
    bar.style.height = random(20, 100) + "%";
  });
  document.getElementById("heroSpeed").textContent = random(380, 560);
  document.getElementById("heroDelay").textContent = random(9, 18) + " ms";
  document.getElementById("heroLoad").textContent = random(30, 70) + "%";
  document.getElementById("heroTemp").textContent = random(45, 60) + "°C";
}

updateHeroCard();
setInterval(updateHeroCard, 1200);

function countUp(el) {
  const target = Number(el.dataset.target);
  const suffix = el.dataset.suffix || "";
  let current = 0;
  const step = Math.ceil(target / 40);

  const timer = setInterval(function () {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current + suffix;
  }, 30);
}

const counterObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      countUp(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll(".counter h2").forEach(function (el) {
  counterObserver.observe(el);
});

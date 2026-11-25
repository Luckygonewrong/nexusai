const navbar = document.getElementById("navbar");
const navLinks = document.getElementById("navLinks");
const menuBtn = document.getElementById("menuBtn");
const themeBtn = document.getElementById("themeBtn");
const topBtn = document.getElementById("topBtn");
const toast = document.getElementById("toast");

menuBtn.addEventListener("click", function () {
  navLinks.classList.toggle("open");
});

function setTheme(light) {
  document.body.classList.toggle("light", light);
  if (light) {
    themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
  } else {
    themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
}

let savedLight = false;
try {
  savedLight = localStorage.getItem("theme") === "light";
} catch (e) {}
setTheme(savedLight);

themeBtn.addEventListener("click", function () {
  const light = !document.body.classList.contains("light");
  setTheme(light);
  window.dispatchEvent(new Event("resize"));
  try {
    localStorage.setItem("theme", light ? "light" : "dark");
  } catch (e) {}
});

window.addEventListener("scroll", function () {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
  topBtn.classList.toggle("show", window.scrollY > 400);
});

topBtn.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(function (el) {
  revealObserver.observe(el);
});

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2500);
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const items = [
  { id: 1, name: "Nexus N1", type: "npu", icon: "fa-microchip", power: 5,
    desc: "Small AI chip for smart cameras and sensors.",
    specs: { "AI Speed": "8 TOPS", Memory: "4 GB", Size: "45 x 45 mm" } },
  { id: 2, name: "Nexus N2 Pro", type: "npu", icon: "fa-microchip", power: 15,
    desc: "Powerful AI chip for heavy factory workloads.",
    specs: { "AI Speed": "32 TOPS", Memory: "16 GB", Size: "70 x 45 mm" } },
  { id: 3, name: "Nexus N3 Ultra", type: "npu", icon: "fa-brain", power: 30,
    desc: "Top model that can run many AI models at once.",
    specs: { "AI Speed": "100 TOPS", Memory: "32 GB", Cooling: "Fan" } },
  { id: 4, name: "ArmCore R5", type: "robot", icon: "fa-robot", power: 24,
    desc: "Controls robotic arms on assembly lines.",
    specs: { Axes: "6", Response: "2 ms", Ports: "8" } },
  { id: 5, name: "MoveBot X", type: "robot", icon: "fa-gears", power: 40,
    desc: "Controller for moving warehouse robots.",
    specs: { Motors: "4", Battery: "8 hrs", Range: "200 m" } },
  { id: 6, name: "ThermoSense", type: "sensor", icon: "fa-temperature-half", power: 1,
    desc: "Tracks machine temperature in real time.",
    specs: { Range: "-20 to 150 °C", Rate: "10 / sec", Battery: "1 year" } },
  { id: 7, name: "VibeTrack", type: "sensor", icon: "fa-wave-square", power: 2,
    desc: "Detects vibration to predict machine failure.",
    specs: { Accuracy: "99%", Rate: "50 / sec", Wireless: "Yes" } },
  { id: 8, name: "VisionCam V2", type: "sensor", icon: "fa-camera", power: 6,
    desc: "HD camera that spots defects on products.",
    specs: { Resolution: "4K", FPS: "60", Lens: "Wide angle" } }
];

const typeNames = { npu: "AI Chip", robot: "Controller", sensor: "Sensor" };

let filter = "all";
let searchText = "";
let sortBy = "name";
let favs = [];
let shown = [];
let current = 0;

const grid = document.getElementById("grid");
const overlay = document.getElementById("overlay");

function render() {
  shown = items.filter(function (item) {
    const matchType = filter === "all" || item.type === filter;
    const text = (item.name + " " + item.desc).toLowerCase();
    return matchType && text.includes(searchText);
  });

  if (sortBy === "name") shown.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === "low") shown.sort((a, b) => a.power - b.power);
  if (sortBy === "high") shown.sort((a, b) => b.power - a.power);

  let html = "";
  shown.forEach(function (item, i) {
    const liked = favs.includes(item.id) ? "on" : "";
    html += `
      <div class="card item" data-i="${i}">
        <button class="fav ${liked}" data-id="${item.id}" title="Save"><i class="fa-solid fa-heart"></i></button>
        <div class="i-icon"><i class="fa-solid ${item.icon}"></i></div>
        <span class="pill">${typeNames[item.type]}</span>
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <div class="item-foot"><span>${item.power} W</span><span>View specs &rarr;</span></div>
      </div>`;
  });

  if (shown.length === 0) {
    html = '<p class="empty">No components found. Try another search.</p>';
  }

  grid.innerHTML = html;
  document.getElementById("count").textContent = "Showing " + shown.length + " of " + items.length;
}

grid.addEventListener("click", function (e) {
  const favBtn = e.target.closest(".fav");
  if (favBtn) {
    const id = Number(favBtn.dataset.id);
    if (favs.includes(id)) {
      favs = favs.filter(f => f !== id);
      showToast("Removed from saved");
    } else {
      favs.push(id);
      showToast("Saved to favourites");
    }
    favBtn.classList.toggle("on");
    document.getElementById("favCount").textContent = favs.length;
    return;
  }

  const card = e.target.closest(".item");
  if (card) openModal(Number(card.dataset.i));
});

document.querySelectorAll(".filter").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelector(".filter.active").classList.remove("active");
    btn.classList.add("active");
    filter = btn.dataset.type;
    render();
  });
});

document.getElementById("search").addEventListener("input", function () {
  searchText = this.value.toLowerCase().trim();
  render();
});

document.getElementById("sort").addEventListener("change", function () {
  sortBy = this.value;
  render();
});

function openModal(i) {
  current = i;
  const item = shown[i];
  document.getElementById("mIcon").innerHTML = '<i class="fa-solid ' + item.icon + '"></i>';
  document.getElementById("mType").textContent = typeNames[item.type];
  document.getElementById("mName").textContent = item.name;
  document.getElementById("mDesc").textContent = item.desc;
  document.getElementById("mCount").textContent = (i + 1) + " / " + shown.length;

  let specs = "<li><span>Power</span><b>" + item.power + " W</b></li>";
  for (let key in item.specs) {
    specs += "<li><span>" + key + "</span><b>" + item.specs[key] + "</b></li>";
  }
  document.getElementById("mSpecs").innerHTML = specs;
  overlay.classList.add("show");
}

function closeModal() {
  overlay.classList.remove("show");
}

function nextItem(step) {
  openModal((current + step + shown.length) % shown.length);
}

document.getElementById("closeBtn").addEventListener("click", closeModal);
document.getElementById("prevBtn").addEventListener("click", () => nextItem(-1));
document.getElementById("nextBtn").addEventListener("click", () => nextItem(1));

overlay.addEventListener("click", function (e) {
  if (e.target === overlay) closeModal();
});

document.addEventListener("keydown", function (e) {
  if (!overlay.classList.contains("show")) return;
  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowRight") nextItem(1);
  if (e.key === "ArrowLeft") nextItem(-1);
});

render();

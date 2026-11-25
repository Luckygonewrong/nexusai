const nodes = [
  { name: "Node A", type: "AI Chip", on: true },
  { name: "Node B", type: "AI Chip", on: true },
  { name: "Node C", type: "Robot Arm", on: true },
  { name: "Node D", type: "Sensor Hub", on: true }
];

let paused = false;
let spike = 0;
let alerts = 0;
let speedData = [];
let delayData = [];
let timer;

const nodesBox = document.getElementById("nodes");
const log = document.getElementById("log");
const pauseBtn = document.getElementById("pauseBtn");

function addLog(message, type) {
  const li = document.createElement("li");
  li.className = type || "";
  li.innerHTML = '<span class="time">' + new Date().toLocaleTimeString() + "</span>" + message;
  log.prepend(li);
  if (log.children.length > 20) {
    log.lastChild.remove();
  }
}

function buildNodes() {
  let html = "";
  nodes.forEach(function (node, i) {
    html += `
      <div class="node" id="node${i}">
        <div class="node-top">
          <div><b>${node.name}</b><small>${node.type}</small></div>
          <span class="load" id="load${i}">0%</span>
          <label class="switch">
            <input type="checkbox" checked data-i="${i}">
            <span class="slider"></span>
          </label>
        </div>
        <div class="bar"><div class="fill" id="fill${i}"></div></div>
      </div>`;
  });
  nodesBox.innerHTML = html;
}

nodesBox.addEventListener("change", function (e) {
  const i = e.target.dataset.i;
  const node = nodes[i];
  node.on = e.target.checked;
  document.getElementById("node" + i).classList.toggle("off", !node.on);

  if (node.on) {
    addLog(node.name + " is back online.", "ok");
  } else {
    alerts++;
    addLog(node.name + " was turned off.", "warn");
  }
  update();
});

function drawLine(ctx, data, max, color, w, h) {
  const gap = w / 19;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  ctx.beginPath();
  data.forEach(function (value, i) {
    const x = i * gap;
    const y = h - (value / max) * (h - 10);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function cssColor(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

function drawChart() {
  const canvas = document.getElementById("chart");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  ctx.strokeStyle = cssColor("--border");
  ctx.lineWidth = 1;
  for (let i = 1; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(0, (h / 5) * i);
    ctx.lineTo(w, (h / 5) * i);
    ctx.stroke();
  }

  drawLine(ctx, speedData, 1000, cssColor("--accent-ink"), w, h);
  drawLine(ctx, delayData, 150, cssColor("--text"), w, h);
}

function getReading() {
  let online = 0;
  const loads = nodes.map(function (node) {
    if (!node.on) return 0;
    online++;
    return spike > 0 ? random(82, 99) : random(20, 70);
  });

  let speed = 0;
  let delay = 0;
  if (online > 0) {
    speed = spike > 0 ? random(800, 980) : random(300, 550);
    speed = Math.round(speed * online / 4);
    delay = spike > 0 ? random(70, 130) : random(8, 20);
  }

  return { loads: loads, online: online, speed: speed, delay: delay };
}

function update() {
  if (paused) return;

  const data = getReading();
  const speed = data.speed;
  const delay = data.delay;
  const online = data.online;

  data.loads.forEach(function (load, i) {
    const fill = document.getElementById("fill" + i);
    fill.style.width = load + "%";
    fill.classList.toggle("high", load > 80);
    document.getElementById("load" + i).textContent = nodes[i].on ? load + "%" : "OFF";
  });

  if (spike > 0) {
    spike--;
    if (spike === 0) addLog("Load is back to normal.", "ok");
  }

  document.getElementById("speed").textContent = speed;
  document.getElementById("delay").textContent = delay;
  document.getElementById("online").textContent = online;
  document.getElementById("alerts").textContent = alerts;
  document.getElementById("speed").classList.toggle("danger", spike > 0);
  document.getElementById("delay").classList.toggle("danger", spike > 0);

  speedData.push(speed);
  delayData.push(delay);
  if (speedData.length > 20) {
    speedData.shift();
    delayData.shift();
  }
  drawChart();
}

pauseBtn.addEventListener("click", function () {
  paused = !paused;
  document.getElementById("liveTag").classList.toggle("paused", paused);
  if (paused) {
    pauseBtn.innerHTML = '<i class="fa-solid fa-play"></i> Resume';
    addLog("Stream paused.");
  } else {
    pauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
    addLog("Stream resumed.");
  }
});

document.getElementById("spikeBtn").addEventListener("click", function () {
  spike = 5;
  alerts++;
  addLog("Load spike detected on all nodes!", "warn");
  showToast("Load spike started for 5 seconds");
  update();
});

document.getElementById("rate").addEventListener("change", function () {
  clearInterval(timer);
  timer = setInterval(update, Number(this.value));
  addLog("Refresh rate changed to " + this.value / 1000 + " s.");
});

document.getElementById("clearBtn").addEventListener("click", function () {
  log.innerHTML = "";
});

buildNodes();
addLog("Dashboard started. All 4 nodes online.", "ok");
update();
timer = setInterval(update, 1000);
window.addEventListener("resize", drawChart);

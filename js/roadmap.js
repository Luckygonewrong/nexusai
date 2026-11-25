const phases = [
  {
    title: "Core Architecture",
    desc: "Build the base dashboard and data engine.",
    tasks: [["Design the dashboard", true], ["Build telemetry simulator", true], ["Create component catalog", true]]
  },
  {
    title: "Edge Integration",
    desc: "Connect real AI chips and controllers.",
    tasks: [["Connect NPU nodes", true], ["Set up MQTT data pipeline", false], ["Add device health checks", false]]
  },
  {
    title: "Automation & Alerts",
    desc: "Respond to problems automatically.",
    tasks: [["Auto spike detection", false], ["Email and SMS alerts", false], ["Robot auto-shutdown", false]]
  },
  {
    title: "Enterprise Hubs",
    desc: "Run many sites from one control room.",
    tasks: [["Multi-site support", false], ["Central control room", false], ["User login and roles", false]]
  }
];

let openPhase = 1;
const phasesBox = document.getElementById("phases");

function render() {
  let total = 0;
  let doneTotal = 0;
  let html = "";

  phases.forEach(function (phase, p) {
    const done = phase.tasks.filter(t => t[1]).length;
    total += phase.tasks.length;
    doneTotal += done;

    let status = "Planned";
    let cls = "planned";
    if (done === phase.tasks.length) {
      status = "Done";
      cls = "done";
    } else if (done > 0) {
      status = "In Progress";
      cls = "progress";
    }

    let tasksHTML = "";
    phase.tasks.forEach(function (task, t) {
      const checked = task[1] ? "checked" : "";
      tasksHTML += `<li><label class="${checked}"><input type="checkbox" data-p="${p}" data-t="${t}" ${checked}><span>${task[0]}</span></label></li>`;
    });

    html += `
      <div class="card phase ${cls} ${openPhase === p ? "open" : ""}">
        <button class="phase-head" data-p="${p}">
          <span class="num">${p + 1}</span>
          <div>
            <h3>${phase.title} <span class="badge ${cls}">${status}</span></h3>
            <small>${phase.desc}</small>
          </div>
          <span class="arrow"><i class="fa-solid fa-chevron-down"></i></span>
        </button>
        <div class="phase-body"><ul class="tasks">${tasksHTML}</ul></div>
      </div>`;
  });

  phasesBox.innerHTML = html;

  const percent = Math.round((doneTotal / total) * 100);
  document.getElementById("pText").textContent = doneTotal + " of " + total + " tasks done";
  document.getElementById("pPercent").textContent = percent + "%";
  document.getElementById("pFill").style.width = percent + "%";
}

phasesBox.addEventListener("click", function (e) {
  const head = e.target.closest(".phase-head");
  if (!head) return;
  const p = Number(head.dataset.p);
  openPhase = openPhase === p ? -1 : p;
  render();
});

phasesBox.addEventListener("change", function (e) {
  const p = e.target.dataset.p;
  const t = e.target.dataset.t;
  phases[p].tasks[t][1] = e.target.checked;
  render();

  const phase = phases[p];
  if (phase.tasks.every(task => task[1])) {
    showToast("Phase " + (Number(p) + 1) + " complete!");
  }
});

render();

// app.js — bootstrap: load the trophy data, wire the tracker, filters,
// spoiler setting, views and export/import. Query parameters set up states
// for screenshots and shared links: ?view=roadmap, ?filter=story,
// ?spoiler=on, ?earned=1,2,3, ?open=17.
import { TrophyTracker } from "./tracker.js";
import { applyFilters } from "./filters.js";
import { renderProgress, renderChecklist, renderDetail, renderRoadmap } from "./render.js";

const data = await (await fetch("data/trophies.json")).json();
const trophies = data.trophies;
const trophiesByName = new Map(trophies.map((t) => [t.name, t]));
const trophiesById = new Map(trophies.map((t) => [t.id, t]));

const params = new URLSearchParams(location.search);
const tracker = new TrophyTracker(trophies.length);

let kind = params.get("filter") ?? "all";
let grade = "all";
let query = "";
let spoilerOn = params.get("spoiler") === "on";
let view = params.get("view") === "roadmap" ? "roadmap" : "checklist";
let selectedId = null;

if (params.has("earned")) {
  const ids = params
    .get("earned")
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isInteger(n));
  tracker.setEarned(ids);
}
if (params.has("open")) {
  const openId = Number(params.get("open"));
  if (trophiesById.has(openId)) selectedId = openId;
}

function currentFiltered() {
  return applyFilters(trophies, { kind, grade, query });
}

function renderAll() {
  renderProgress(tracker, trophies.length);
  const filtered = currentFiltered();
  const note = document.getElementById("filterNote");
  if (kind === "online") {
    note.textContent =
      "The official list holds no online trophies — every one of the 55 is earned in single-player.";
  } else {
    note.textContent = `Showing ${filtered.length} of ${trophies.length} trophies.`;
  }
  renderChecklist({
    trophies: filtered,
    tracker,
    spoilerOn,
    selectedId,
    onSelect: (id) => {
      selectedId = id;
      renderAll();
    },
    onToggle: (id) => {
      tracker.toggle(id);
      renderAll();
    },
  });
  renderDetail(selectedId ? trophiesById.get(selectedId) : null, tracker, spoilerOn);
  renderRoadmap(trophiesByName, tracker, (id) => {
    selectedId = id;
    showView("checklist");
  });
}

function showView(next) {
  view = next;
  document.getElementById("checklistView").hidden = view !== "checklist";
  document.getElementById("roadmapView").hidden = view !== "roadmap";
  document.getElementById("viewChecklist").classList.toggle("active", view === "checklist");
  document.getElementById("viewRoadmap").classList.toggle("active", view === "roadmap");
}

function setKind(next) {
  kind = next;
  for (const button of document.querySelectorAll("#kindFilters .kind-btn")) {
    button.classList.toggle("active", button.dataset.kind === next);
  }
  renderAll();
}

document.getElementById("viewChecklist").addEventListener("click", () => showView("checklist"));
document.getElementById("viewRoadmap").addEventListener("click", () => showView("roadmap"));
for (const button of document.querySelectorAll("#kindFilters .kind-btn")) {
  button.addEventListener("click", () => setKind(button.dataset.kind));
}
document.getElementById("gradeFilter").addEventListener("change", (event) => {
  grade = event.target.value;
  renderAll();
});
document.getElementById("searchBox").addEventListener("input", (event) => {
  query = event.target.value;
  renderAll();
});
const spoilerToggle = document.getElementById("spoilerToggle");
spoilerToggle.checked = spoilerOn;
spoilerToggle.addEventListener("change", () => {
  spoilerOn = spoilerToggle.checked;
  renderAll();
});
document.getElementById("exportBtn").addEventListener("click", () => tracker.exportToFile());
document.getElementById("importFile").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const count = await tracker.importFromFile(file);
    renderAll();
    alert(`Imported progress: ${count} trophies earned.`);
  } catch (error) {
    alert(`Could not import that file: ${error.message}`);
  }
  event.target.value = "";
});

// Apply any filter from the URL, then render.
if (kind !== "all") setKind(kind);
showView(view);
renderAll();

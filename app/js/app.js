// Bootstrap for the Leonida Trophy Guide: loads the trophy data, wires the
// checklist, filters, spoiler setting, roadmap, export/import, and the
// screenshot states (?shot=, ?earned=, ?open=, ?kind=).
import { loadEarned, saveEarned, toggleEarned, exportProgress, parseProgressFile, resetProgress } from './tracker.js';
import { createFilterState } from './filters.js';
import { renderRoadmap } from './roadmap.js';
import { renderList, renderDetail, renderProgress } from './render.js';
import { isHiddenBySpoiler } from './filters.js';

const params = new URLSearchParams(location.search);
const data = await (await fetch('data/trophies.json')).json();
const trophies = data.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));
let earned = loadEarned();

// Screenshot state: ?earned=3,4,5 pre-marks trophies as earned for the shot.
if (params.has('earned')) {
  for (const raw of params.get('earned').split(',')) {
    const id = Number(raw);
    if (Number.isInteger(id) && id >= 1 && id <= 55) earned.add(id);
  }
}

const state = createFilterState();
let selectedId = null;
let view = 'checklist';

const listEl = document.getElementById('trophy-list');
const metaEl = document.getElementById('list-meta');
const emptyEl = document.getElementById('empty-note');
const countEl = document.getElementById('progress-count');
const pctEl = document.getElementById('progress-pct');
const fillEl = document.getElementById('progress-fill');
const toolbarEl = document.getElementById('toolbar');
const layoutEl = document.querySelector('.layout');
const roadmapEl = document.getElementById('roadmap-view');
const stagesEl = document.getElementById('stages');
const searchEl = document.getElementById('search');
const spoilerEl = document.getElementById('spoiler');

function renderAll() {
  renderProgress(countEl, pctEl, fillEl, earned, trophies.length);
  renderList(listEl, metaEl, emptyEl, trophies, earned, state, selectedId,
    (id) => { selectedId = id; renderAll(); },
    (id) => { toggleEarned(earned, id); renderAll(); });
  renderDetail(selectedId ? byId.get(selectedId) : null, earned, state.spoiler);
  renderRoadmap(stagesEl, trophies, earned, isHiddenBySpoiler, state.spoiler);
}

function setView(next) {
  view = next;
  document.getElementById('tab-checklist').classList.toggle('active', view === 'checklist');
  document.getElementById('tab-roadmap').classList.toggle('active', view === 'roadmap');
  const checklist = view === 'checklist';
  toolbarEl.hidden = !checklist;
  layoutEl.hidden = !checklist;
  roadmapEl.hidden = checklist;
}

function setKindFilter(kind) {
  state.kind = kind;
  for (const chip of document.querySelectorAll('#kind-filters .chip')) {
    chip.classList.toggle('active', chip.dataset.kind === kind);
  }
}

function setGradeFilter(grade) {
  state.grade = grade;
  for (const chip of document.querySelectorAll('#grade-filters .chip')) {
    chip.classList.toggle('active', chip.dataset.grade === grade);
  }
}

document.getElementById('tab-checklist').addEventListener('click', () => { setView('checklist'); renderAll(); });
document.getElementById('tab-roadmap').addEventListener('click', () => { setView('roadmap'); renderAll(); });

for (const chip of document.querySelectorAll('#kind-filters .chip')) {
  chip.addEventListener('click', () => { setKindFilter(chip.dataset.kind); renderAll(); });
}
for (const chip of document.querySelectorAll('#grade-filters .chip')) {
  chip.addEventListener('click', () => { setGradeFilter(chip.dataset.grade); renderAll(); });
}

searchEl.addEventListener('input', () => { state.query = searchEl.value.trim(); renderAll(); });
spoilerEl.addEventListener('change', () => { state.spoiler = spoilerEl.checked; renderAll(); });

document.getElementById('export-btn').addEventListener('click', () => exportProgress(earned));
document.getElementById('import-btn').addEventListener('click', () => document.getElementById('import-file').click());
document.getElementById('import-file').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    earned = parseProgressFile(await file.text());
    saveEarned(earned);
    renderAll();
  } catch {
    alert('That file is not a Leonida Trophy Guide progress export.');
  }
  event.target.value = '';
});
document.getElementById('reset-btn').addEventListener('click', () => {
  if (confirm('Clear all earned trophies?')) {
    earned = resetProgress();
    selectedId = null;
    renderAll();
  }
});
document.getElementById('detail-earn').addEventListener('click', () => {
  if (selectedId) { toggleEarned(earned, selectedId); renderAll(); }
});

// Screenshot states.
const shot = params.get('shot');
if (params.get('kind')) setKindFilter(params.get('kind'));
if (shot === 'roadmap') setView('roadmap');
if (shot === 'spoiler') { state.spoiler = true; spoilerEl.checked = true; }
if (shot === 'collectibles') setKindFilter('collectibles');
if (params.get('open')) {
  const id = Number(params.get('open'));
  if (byId.has(id)) selectedId = id;
}

renderAll();

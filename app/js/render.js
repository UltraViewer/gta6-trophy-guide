// Rendering for the checklist, the detail panel and the progress bar.
// Nothing here fetches or writes: it only turns trophy data into DOM.
import { isHiddenBySpoiler, trophyMatches } from './filters.js';

export function renderProgress(countEl, pctEl, fillEl, earned, total) {
  const pct = total === 0 ? 0 : Math.round((earned.size / total) * 100);
  countEl.textContent = `${earned.size} / ${total}`;
  pctEl.textContent = `${pct}%`;
  fillEl.style.width = `${pct}%`;
}

export function renderList(listEl, metaEl, emptyEl, trophies, earned, state, selectedId, onSelect, onToggle) {
  const visible = trophies.filter((t) => trophyMatches(t, state));
  listEl.replaceChildren();
  metaEl.textContent = `Showing ${visible.length} of ${trophies.length} trophies` +
    (state.kind === 'online' ? ' — the official list has no online trophies, so this filter is empty by design.' : '');
  emptyEl.hidden = visible.length !== 0;
  for (const t of visible) {
    const hidden = isHiddenBySpoiler(t, earned, state.spoiler);
    const li = document.createElement('li');
    li.className = 'trophy-row';
    if (earned.has(t.id)) li.classList.add('earned');
    if (selectedId === t.id) li.classList.add('selected');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', `Mark ${hidden ? 'hidden trophy' : t.name} as earned`);
    box.addEventListener('change', (event) => {
      event.stopPropagation();
      onToggle(t.id);
    });
    const main = document.createElement('div');
    main.className = 'trophy-main';
    const name = document.createElement('div');
    name.className = 'trophy-name' + (hidden ? ' hidden-name' : '');
    name.textContent = hidden ? 'Hidden trophy — earn it to reveal' : t.name;
    const desc = document.createElement('div');
    desc.className = 'trophy-desc';
    desc.textContent = hidden
      ? 'Its name and description stay hidden until earned (spoiler setting).'
      : t.description;
    const tags = document.createElement('div');
    tags.className = 'trophy-tags';
    const kindTag = document.createElement('span');
    kindTag.className = 'tag';
    kindTag.textContent = t.kind;
    tags.appendChild(kindTag);
    if (t.missable) {
      const miss = document.createElement('span');
      miss.className = 'tag missable';
      miss.textContent = '⚠ missable';
      tags.appendChild(miss);
    }
    if (t.hidden) {
      const hid = document.createElement('span');
      hid.className = 'tag hidden-tag';
      hid.textContent = 'hidden on PSN';
      tags.appendChild(hid);
    }
    main.append(name, desc, tags);
    const badge = document.createElement('span');
    badge.className = `grade-badge ${t.grade}`;
    badge.textContent = t.grade;
    li.append(box, main, badge);
    li.addEventListener('click', () => onSelect(t.id));
    listEl.appendChild(li);
  }
}

export function renderDetail(trophy, earned, spoilerOn) {
  const cardEl = document.getElementById('detail-card');
  const emptyEl = document.getElementById('detail-empty');
  if (!trophy) {
    cardEl.hidden = true;
    emptyEl.hidden = false;
    return;
  }
  const hidden = isHiddenBySpoiler(trophy, earned, spoilerOn);
  emptyEl.hidden = true;
  cardEl.hidden = false;
  const gradeEl = document.getElementById('detail-grade');
  gradeEl.className = `grade-badge ${trophy.grade}`;
  gradeEl.textContent = trophy.grade;
  document.getElementById('detail-name').textContent = hidden ? 'Hidden trophy' : trophy.name;
  document.getElementById('detail-desc').textContent = hidden
    ? 'Its name and description stay hidden until earned (spoiler setting).'
    : trophy.description;
  const tags = document.getElementById('detail-tags');
  tags.replaceChildren();
  const makeTag = (text, cls) => {
    const s = document.createElement('span');
    s.className = 'tag' + (cls ? ` ${cls}` : '');
    s.textContent = text;
    return s;
  };
  tags.append(makeTag(trophy.kind), makeTag(`roadmap stage ${trophy.roadmap_stage}`));
  if (trophy.missable) tags.appendChild(makeTag('⚠ missable — one-time moment', 'missable'));
  if (trophy.hidden) tags.appendChild(makeTag('hidden on PSN', 'hidden-tag'));
  document.getElementById('detail-guide').textContent = trophy.guide;
  document.getElementById('detail-source').textContent = trophy.source;
  const btn = document.getElementById('detail-earn');
  const isEarned = earned.has(trophy.id);
  btn.textContent = isEarned ? '✓ Earned — click to unmark' : 'Mark as earned';
  btn.classList.toggle('earned', isEarned);
}

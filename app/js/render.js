// render.js — draws the checklist, the trophy detail panel and the roadmap.
import { isSpoilerHidden, spoilerPlaceholder } from "./filters.js";
import { ROADMAP_STAGES, stageTrophies, countMissableInStage } from "./roadmap.js";

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

export function renderProgress(tracker, total) {
  document.getElementById("progressText").textContent = `${tracker.earnedCount()} of ${total} earned`;
  document.getElementById("progressPct").textContent = `${tracker.earnedPercent()}%`;
  document.getElementById("progressFill").style.width = `${tracker.earnedPercent()}%`;
}

export function renderChecklist({ trophies, tracker, spoilerOn, selectedId, onSelect, onToggle }) {
  const list = document.getElementById("trophyList");
  list.replaceChildren();
  for (const trophy of trophies) {
    const earned = tracker.isEarned(trophy.id);
    const hidden = isSpoilerHidden(trophy, spoilerOn, earned);
    const shown = hidden ? spoilerPlaceholder() : trophy;

    const item = document.createElement("li");
    item.className = `trophy-item${earned ? " earned" : ""}${trophy.id === selectedId ? " selected" : ""}${hidden ? " spoiler-hidden" : ""}`;

    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "trophy-check";
    check.checked = earned;
    check.setAttribute("aria-label", `Mark ${trophy.name} earned`);
    check.addEventListener("click", (event) => {
      event.stopPropagation();
      onToggle(trophy.id);
    });

    const body = document.createElement("div");
    body.className = "trophy-body";
    const name = document.createElement("div");
    name.className = "trophy-name";
    name.textContent = shown.name;
    const desc = document.createElement("div");
    desc.className = "trophy-desc";
    desc.textContent = shown.description;
    const meta = document.createElement("div");
    meta.className = "trophy-meta";
    const grade = document.createElement("span");
    grade.className = `grade-badge grade-${trophy.grade}`;
    grade.textContent = gradeLabel(trophy.grade);
    const kind = document.createElement("span");
    kind.className = "kind-tag";
    kind.textContent = trophy.kind;
    meta.append(grade, kind);
    if (trophy.missable) {
      const flag = document.createElement("span");
      flag.className = "missable-flag";
      flag.textContent = "⚠ MISSABLE";
      meta.append(flag);
    }
    body.append(name, desc, meta);
    item.append(check, body);
    item.addEventListener("click", () => onSelect(trophy.id));
    list.append(item);
  }
}

export function renderDetail(trophy, tracker, spoilerOn) {
  const panel = document.getElementById("detailPanel");
  panel.replaceChildren();
  if (!trophy) {
    const empty = document.createElement("p");
    empty.className = "detail-empty";
    empty.textContent = "Select a trophy to read its guide.";
    panel.append(empty);
    return;
  }
  const earned = tracker.isEarned(trophy.id);
  const hidden = isSpoilerHidden(trophy, spoilerOn, earned);
  if (hidden) {
    const title = document.createElement("h2");
    title.textContent = "??? — Hidden story trophy";
    const note = document.createElement("p");
    note.className = "detail-desc";
    note.textContent = "Spoiler setting is on. Earn this trophy to reveal its name, description and guide.";
    panel.append(title, note);
    return;
  }
  const title = document.createElement("h2");
  title.textContent = trophy.name;
  const meta = document.createElement("div");
  meta.className = "detail-meta";
  const grade = document.createElement("span");
  grade.className = `grade-badge grade-${trophy.grade}`;
  grade.textContent = gradeLabel(trophy.grade);
  const kind = document.createElement("span");
  kind.className = "kind-tag";
  kind.textContent = trophy.kind;
  meta.append(grade, kind);
  if (trophy.missable) {
    const flag = document.createElement("span");
    flag.className = "missable-flag";
    flag.textContent = "⚠ MISSABLE — do this before moving on";
    meta.append(flag);
  }
  const desc = document.createElement("p");
  desc.className = "detail-desc";
  desc.textContent = trophy.description;
  const guide = document.createElement("p");
  guide.className = "detail-guide";
  guide.textContent = trophy.guide;
  const source = document.createElement("p");
  source.className = "detail-source";
  const label = document.createElement("strong");
  label.textContent = "Source: ";
  source.append(label, document.createTextNode(trophy.source));
  const state = document.createElement("p");
  state.className = "detail-source";
  state.textContent = earned ? "✓ Earned — saved in this browser." : "Not earned yet.";
  panel.append(title, meta, desc, guide, source, state);
}

export function renderRoadmap(trophiesByName, tracker, onSelect) {
  const host = document.getElementById("roadmapStages");
  host.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const items = stageTrophies(stage, trophiesByName);
    const earnedHere = items.filter((t) => tracker.isEarned(t.id)).length;
    const missableHere = countMissableInStage(stage, trophiesByName);

    const section = document.createElement("section");
    section.className = "stage";
    const title = document.createElement("h2");
    title.textContent = stage.title;
    const blurb = document.createElement("p");
    blurb.textContent = stage.blurb;
    const count = document.createElement("p");
    count.className = "stage-count";
    count.textContent =
      `${earnedHere} of ${items.length} earned` +
      (missableHere ? ` · ${missableHere} missable` : "");
    const chips = document.createElement("div");
    chips.className = "stage-trophies";
    for (const trophy of items) {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = `stage-chip${tracker.isEarned(trophy.id) ? " earned" : ""}`;
      const dot = document.createElement("span");
      dot.className = `dot dot-${trophy.grade}`;
      chip.append(dot, document.createTextNode(trophy.name));
      if (trophy.missable) {
        const flag = document.createElement("span");
        flag.className = "missable-flag";
        flag.textContent = "⚠ MISSABLE";
        chip.append(flag);
      }
      chip.addEventListener("click", () => onSelect(trophy.id));
      chips.append(chip);
    }
    section.append(title, blurb, count, chips);
    host.append(section);
  }
}

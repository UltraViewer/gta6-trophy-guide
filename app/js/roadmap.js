// The five-stage roadmap to the platinum, built from the official
// descriptions: story first, then contacts, activities, collectibles,
// and the 100% cleanup last. The missable trophies all live in stage 1.
export const STAGES = [
  {
    stage: 1,
    title: 'Play the story',
    blurb:
      'Chapters 1 to 4, the final mission, and every mission trophy. The seven missable moments all happen here — the cocktail on Ocean Beach, the showroom exit, the bowling alley follow-through, the VCIA departure and the story choices — so take them while they are in front of you.',
  },
  {
    stage: 2,
    title: 'Contacts and strangers',
    blurb:
      'Finish the contact strands for Andy, Kenton, Billy, Randy and Tyrone, complete 8 stranger strands across Leonida, and earn the two partner trophies with your partner beside you.',
  },
  {
    stage: 3,
    title: 'Activities and skills',
    blurb:
      'Stunts, races, the shooting range, fishing, arcade games, challenges, robberies and the money trophies. Everything here is repeatable, so work through it at your own pace after the story.',
  },
  {
    stage: 4,
    title: 'Collectibles and exploration',
    blurb:
      'Meditation spots, card sets, WAiNK locations, vehicles, garages, the Scooter Bros registrations and exploring every corner of Leonida.',
  },
  {
    stage: 5,
    title: '100% and the platinum',
    blurb:
      'Clean up whatever the in-game stats still show below 100%, earn A Long Road, and the platinum — Vice Got a Price! — pops on its own.',
  },
];

export function trophiesForStage(trophies, stage) {
  return trophies.filter((t) => t.roadmap_stage === stage).sort((a, b) => a.id - b.id);
}

export function renderRoadmap(container, trophies, earned, isHiddenBySpoiler, spoilerOn) {
  container.replaceChildren();
  for (const s of STAGES) {
    const items = trophiesForStage(trophies, s.stage);
    const done = items.filter((t) => earned.has(t.id)).length;
    const li = document.createElement('li');
    li.className = 'stage';
    const h = document.createElement('h3');
    h.textContent = `Stage ${s.stage}: ${s.title} `;
    const count = document.createElement('span');
    count.className = 'stage-count';
    count.textContent = `(${done}/${items.length} earned)`;
    h.appendChild(count);
    const p = document.createElement('p');
    p.textContent = s.blurb;
    const ul = document.createElement('ul');
    ul.className = 'stage-trophies';
    for (const t of items) {
      const chip = document.createElement('li');
      const hidden = isHiddenBySpoiler(t, earned, spoilerOn);
      chip.textContent = hidden ? 'Hidden trophy' : t.name;
      if (t.missable) {
        const flag = document.createElement('span');
        flag.className = 'flag-miss';
        flag.textContent = ' ⚠ missable';
        chip.appendChild(flag);
      }
      if (earned.has(t.id)) chip.classList.add('done');
      ul.appendChild(chip);
    }
    li.append(h, p, ul);
    container.appendChild(li);
  }
}

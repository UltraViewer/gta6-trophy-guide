// Filtering for the trophy checklist: by kind, by grade, by text search,
// and the spoiler setting that hides unrevealed story trophies.
export const KINDS = ['story', 'missable', 'collectibles', 'activities', 'online'];

export function createFilterState() {
  return { kind: 'all', grade: 'all', query: '', spoiler: false };
}

export function isStoryTrophy(trophy) {
  return trophy.kind === 'story' || trophy.kind === 'missable';
}

export function isHiddenBySpoiler(trophy, earned, spoilerOn) {
  return spoilerOn && isStoryTrophy(trophy) && !earned.has(trophy.id);
}

export function trophyMatches(trophy, state) {
  if (state.kind !== 'all' && trophy.kind !== state.kind) return false;
  if (state.grade !== 'all' && trophy.grade !== state.grade) return false;
  if (state.query) {
    const q = state.query.toLowerCase();
    const hay = `${trophy.name} ${trophy.description}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

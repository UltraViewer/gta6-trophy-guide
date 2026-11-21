// filters.js — kind / grade / search filtering and the spoiler setting.
// The spoiler setting hides the names and descriptions of story trophies
// until they are earned, so a player can browse the guide without story spoilers.
export const KINDS = ["all", "story", "missable", "collectibles", "activities", "online"];

export function trophyMatchesKind(trophy, kind) {
  if (kind === "all") return true;
  if (kind === "missable") return trophy.missable === true;
  return trophy.kind === kind;
}

export function trophyMatchesGrade(trophy, grade) {
  return grade === "all" || trophy.grade === grade;
}

export function trophyMatchesSearch(trophy, query) {
  if (!query) return true;
  const hay = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
  return hay.includes(query.toLowerCase());
}

export function applyFilters(trophies, { kind, grade, query }) {
  return trophies.filter(
    (t) => trophyMatchesKind(t, kind) && trophyMatchesGrade(t, grade) && trophyMatchesSearch(t, query),
  );
}

export function isSpoilerHidden(trophy, spoilerOn, isEarned) {
  return spoilerOn && trophy.kind === "story" && !isEarned;
}

export function spoilerPlaceholder() {
  return {
    name: "??? — Hidden story trophy",
    description: "Spoiler setting is on. Earn this trophy to reveal its name and description.",
  };
}

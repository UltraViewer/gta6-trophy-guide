// roadmap.js — the five stages to the platinum, built from the official
// descriptions: story first, then stranger strands, then collectibles,
// then the activity grinds, and 100% completion last.
export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: "Stage 1 — Play the story",
    blurb:
      "Finish Chapters 1–4 and the final mission, plus every named story mission. Two trophies here can be missed — keep a save before major story choices.",
    trophyNames: [
      "Just Like Paradise",
      "Paradise Lost",
      "T**s Ass Drug Money",
      "Vice City, Baby!",
      "Top Of The World, Ma",
      "You Gotta Know When to Get Off",
      "Trust",
      "Break the Bank",
      "Family Matters",
      "DWNFALL",
      "Hi-Jacked",
      "Snow Storm",
      "Actions Speak Louder",
      "Bad Luck, I Guess",
    ],
  },
  {
    stage: 2,
    title: "Stage 2 — Strangers and side missions",
    blurb:
      "Work the stranger mission strands to their finales and try each activity type once. The five stranger finals count toward the 8 strands.",
    trophyNames: [
      "Road to Rehabilitation",
      "This Was No Boat Accident",
      "The Lone Rider",
      "Supply & Demand",
      "Spin On This!",
      "Strangers & Freaks",
      "Master of None",
      "Stick Fiddler",
      "In The Beginning…",
      "Let’s Go Bowling",
    ],
  },
  {
    stage: 3,
    title: "Stage 3 — Explore Leonida and collect",
    blurb:
      "Sweep the map: every region, the card sets, the WAiNK spots, meditation spots, vehicles, garages and the Scooter Bros registrations.",
    trophyNames: [
      "The Goodtime State",
      "Whip It Good",
      "Don't Touch My Deck",
      "You WAiNKer!",
      "Positive Mental Attitude",
      "Fair Game",
      "The Truth Is Out There",
      "Little Boxes",
      "On the Spot",
    ],
  },
  {
    stage: 4,
    title: "Stage 4 — Activities, combat and money",
    blurb:
      "The long grinds: 250 stunts, 42 gold Shooting Range medals, races, robberies, Combat Focus kills and the money trophies.",
    trophyNames: [
      "Cunning Stunts",
      "The Shootist",
      "Top Fun",
      "Earn Cash, Not Kudos",
      "Baited My Tackle",
      "One Last Thing",
      "Hot Together",
      "Retail Therapy",
      "Gunslinger",
      "Catch Me If You Can",
      "Challenging Tank",
      "Sneakthief",
      "Maximum Withdrawal",
      "A Classic Blitz Play",
      "Pest Control",
      "Capital Offense",
      "Personal Best",
      "Ten Pin",
      "Dime on the Dollar",
      "Treat Yo Self",
    ],
  },
  {
    stage: 5,
    title: "Stage 5 — 100% and the platinum",
    blurb: "When everything else is done, 100% completion unlocks — and with it, the platinum.",
    trophyNames: ["A Long Road", "Vice Got a Price!"],
  },
];

export function stageTrophies(stage, trophiesByName) {
  return stage.trophyNames.map((name) => trophiesByName.get(name)).filter(Boolean);
}

export function countMissableInStage(stage, trophiesByName) {
  return stageTrophies(stage, trophiesByName).filter((t) => t.missable).length;
}

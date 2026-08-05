import {
  GENESIS_ARCS,
  listGenesisByArc,
  type GenesisArc,
} from "./genesisChapters";

const day1 = require("../../assets/panels/genesis-day1-light.jpg");
const arcFall = require("../../assets/panels/arc-fall-cain.jpg");
const arcFlood = require("../../assets/panels/arc-flood.jpg");
const arcNations = require("../../assets/panels/arc-nations.jpg");
const arcAbraham = require("../../assets/panels/arc-abraham.jpg");
const arcIsaac = require("../../assets/panels/arc-isaac.jpg");
const arcJacob = require("../../assets/panels/arc-jacob.jpg");
const arcJoseph = require("../../assets/panels/arc-joseph.jpg");

const ARC_IMAGES: Record<GenesisArc, number> = {
  Creation: day1,
  Fall: arcFall,
  Flood: arcFlood,
  Nations: arcNations,
  Abraham: arcAbraham,
  Isaac: arcIsaac,
  Jacob: arcJacob,
  Joseph: arcJoseph,
};

const ARC_BLURBS: Record<GenesisArc, string> = {
  Creation: "Beginnings — light, garden, and life",
  Fall: "Trust breaks — and a promise remains",
  Flood: "Judgment, an ark, and a rainbow",
  Nations: "Scattered languages at Babel",
  Abraham: "Go to the land — and count the stars",
  Isaac: "The promised son — and Mount Moriah",
  Jacob: "Birthright, Bethel, and a new name",
  Joseph: "Coat, Egypt, and forgiveness",
};

export type GenesisArcCard = {
  arc: GenesisArc;
  image: number;
  blurb: string;
  startChapter: number;
  endChapter: number;
  chapterCount: number;
};

export function listGenesisArcCards(): GenesisArcCard[] {
  return GENESIS_ARCS.map((arc) => {
    const chapters = listGenesisByArc(arc);
    return {
      arc,
      image: ARC_IMAGES[arc],
      blurb: ARC_BLURBS[arc],
      startChapter: chapters[0]?.number ?? 1,
      endChapter: chapters[chapters.length - 1]?.number ?? 1,
      chapterCount: chapters.length,
    };
  });
}

export function getArcImage(arc: GenesisArc): number {
  return ARC_IMAGES[arc];
}

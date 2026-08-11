import {
  EXODUS_ARCS,
  listExodusByArc,
  type ExodusArc,
} from "./exodusChapters";

const ARC_IMAGES: Record<ExodusArc, number> = {
  Oppression: require("../../assets/panels/arc-exodus-oppression.jpg"),
  Call: require("../../assets/panels/arc-exodus-call.jpg"),
  Plagues: require("../../assets/panels/arc-exodus-plagues.jpg"),
  Passover: require("../../assets/panels/arc-exodus-passover.jpg"),
  Deliverance: require("../../assets/panels/arc-exodus-deliverance.jpg"),
  Wilderness: require("../../assets/panels/arc-exodus-wilderness.jpg"),
  Sinai: require("../../assets/panels/arc-exodus-sinai.jpg"),
  Tabernacle: require("../../assets/panels/arc-exodus-tabernacle.jpg"),
  Rebellion: require("../../assets/panels/arc-exodus-rebellion.jpg"),
  Glory: require("../../assets/panels/arc-exodus-glory.jpg"),
};

const ARC_BLURBS: Record<ExodusArc, string> = {
  Oppression: "Slavery in Egypt — and a deliverer is born",
  Call: "The bush burns — I AM sends Moses",
  Plagues: "Signs and wonders against Pharaoh",
  Passover: "The lamb, the blood, and the night of freedom",
  Deliverance: "Through the sea — salvation and song",
  Wilderness: "Manna, water, and daily trust",
  Sinai: "Covenant words from the mountain",
  Tabernacle: "A dwelling place in their midst",
  Rebellion: "The calf — and mercy renewed",
  Glory: "The cloud fills the finished tent",
};

export type ExodusArcCard = {
  arc: ExodusArc;
  image: number;
  blurb: string;
  startChapter: number;
  endChapter: number;
  chapterCount: number;
};

export function listExodusArcCards(): ExodusArcCard[] {
  return EXODUS_ARCS.map((arc) => {
    const chapters = listExodusByArc(arc);
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

export function getExodusArcImage(arc: ExodusArc): number {
  return ARC_IMAGES[arc];
}

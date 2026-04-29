export interface StoryVisual {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface StoryBeat {
  eyebrow: string;
  title: string;
  body: string;
  image: StoryVisual;
  stat: string;
}

export const fabricSignals = ["240gsm body", "Double bio washed", "Heavy rib collar", "Short-run release"] as const;

export const storyBeats: StoryBeat[] = [
  {
    eyebrow: "01 / Weight",
    title: "240gsm body, enough weight to hold the line.",
    body:
      "A heavier knit keeps the silhouette upright, so the piece lands with presence instead of collapsing after a few wears.",
    image: {
      src: "/story/240gsm-fabric.svg",
      alt: "Close-up of dense 240gsm fabric with layered weave and warm light on the folds",
      width: 1600,
      height: 2000,
    },
    stat: "Built to hold shape, not sag.",
  },
  {
    eyebrow: "02 / Finish",
    title: "Double bio washed for a softer edge.",
    body:
      "The cloth breaks in without losing structure. It feels easier on skin and still looks sharp in the room.",
    image: {
      src: "/story/double-bio-wash.svg",
      alt: "Soft washed fabric drape with diffused highlights and a calm blue finish",
      width: 1600,
      height: 2000,
    },
    stat: "Softness without surrender.",
  },
  {
    eyebrow: "03 / Shape",
    title: "A controlled cut with a heavier collar.",
    body:
      "Necklines, seams, and shoulder lines are set to keep the tee from reading like another basic.",
    image: {
      src: "/story/heavy-rib-collar.svg",
      alt: "Macro view of a heavy rib collar and stitched seam framed like an editorial detail shot",
      width: 1600,
      height: 2000,
    },
    stat: "Shape that stays composed.",
  },
  {
    eyebrow: "04 / Run",
    title: "Short release windows keep the room intentional.",
    body:
      "Small batches protect the fit, the finish, and the point of view. When a piece lands, it feels chosen, not scattered.",
    image: {
      src: "/story/short-run-release.svg",
      alt: "Editorial still life of folded garments, tags, and release notes in a dark studio setting",
      width: 1600,
      height: 2000,
    },
    stat: "Measured drops over noise.",
  },
];

import { InfoTerminalPage } from "@/components/layout/InfoTerminalPage";

export default function SizeGuidePage() {
  return (
    <InfoTerminalPage
      eyebrow="FIT MATRIX"
      lead="Raptile silhouettes are intentionally shape-driven. Read each cut note closely before acquisition, especially on oversized and dropped-shoulder builds."
      sections={[
        {
          label: "Core Rule",
          body: "Use your everyday size for the intended silhouette. Size down only if you prefer a cleaner line through the body and sleeve.",
        },
        {
          label: "Measurement Logic",
          body: "Chest width, body length, and shoulder drop are the primary indicators. Compare them against a garment you already own rather than body measurements alone.",
        },
        {
          label: "Oversized Cuts",
          body: "Pieces labeled oversized architecture or boxy fit are drafted with extra room in the chest and shoulder. That volume is intentional, not a grading error.",
        },
        {
          label: "Help Channel",
          body: "If you need sizing support, use the studio inquiry route with your height, weight, and preferred fit reference. The team will recommend the correct size profile.",
        },
      ]}
      title="Size Guide"
    />
  );
}

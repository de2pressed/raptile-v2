import { InfoTerminalPage } from "@/components/layout/InfoTerminalPage";

export default function StudioInquiryPage() {
  return (
    <InfoTerminalPage
      eyebrow="DIRECT STUDIO LINE"
      lead="Use the inquiry channel for wholesale requests, artist collaborations, press pulls, custom commissions, and sizing support tied to a live product drop."
      sections={[
        {
          label: "Creative Collaborations",
          body: "Include concept references, intended format, and delivery timeline when requesting capsule work, editorial pieces, or spatial activations.",
        },
        {
          label: "Press + Pulls",
          body: "Please provide outlet, publication date, talent context, and return logistics so the team can evaluate availability against release schedules.",
        },
        {
          label: "Wholesale",
          body: "Attach your store profile, regional market, and buy rationale. Raptile only opens wholesale to partners with a clear point of view and disciplined presentation.",
        },
        {
          label: "Primary Contact",
          body: "For all studio communication, route requests through hello@raptile.studio with the subject line matching the inquiry type.",
        },
      ]}
      title="Studio Inquiry"
    />
  );
}

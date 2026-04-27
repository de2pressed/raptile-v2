import { InfoTerminalPage } from "@/components/layout/InfoTerminalPage";

export default function ReturnsPage() {
  return (
    <InfoTerminalPage
      eyebrow="RETURN CHANNEL"
      lead="Returns are assessed as part of the garment's condition log. Pieces must arrive back unworn, unwashed, and in their original packaging state."
      sections={[
        {
          label: "Return Window",
          body: "Eligible domestic orders can be requested within 7 calendar days of delivery. Archive, made-to-order, and marked final-sale pieces are non-returnable.",
        },
        {
          label: "Condition Check",
          body: "Returned items must retain original tags, packaging components, and surface finish. Items showing wear, scent, or wash exposure cannot be accepted.",
        },
        {
          label: "Refund Timeline",
          body: "Approved returns are processed to the original payment method within 5 to 7 business days after warehouse inspection completes.",
        },
        {
          label: "Exchange Flow",
          body: "Size exchanges depend on live stock at the moment the returned unit clears inspection. If replacement stock is unavailable, a refund is issued instead.",
        },
      ]}
      title="Returns"
    />
  );
}

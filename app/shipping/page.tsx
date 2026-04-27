import { InfoTerminalPage } from "@/components/layout/InfoTerminalPage";

export default function ShippingPage() {
  return (
    <InfoTerminalPage
      eyebrow="LOGISTICS PROTOCOL"
      lead="Raptile shipments move in tightly controlled release windows. Each parcel is checked for finishing, size validation, and packing integrity before dispatch."
      sections={[
        {
          label: "Dispatch Window",
          body: "Core collection orders dispatch within 3 to 5 business days. Limited capsules and vaulted archive pulls may require additional inspection time before handoff.",
        },
        {
          label: "Domestic Transit",
          body: "India shipments typically arrive within 2 to 6 business days after dispatch, with live tracking issued as soon as the label is activated.",
        },
        {
          label: "International",
          body: "International orders are quoted case by case based on destination, import requirements, and release batch timing. Duties may apply on arrival.",
        },
        {
          label: "Packaging",
          body: "Every piece ships in low-gloss archival packaging designed to protect structure, surface print, and presentation during transit.",
        },
      ]}
      title="Shipping Policy"
    />
  );
}

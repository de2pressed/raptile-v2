import { InfoTerminalPage } from "@/components/layout/InfoTerminalPage";

export default function TermsPage() {
  return (
    <InfoTerminalPage
      eyebrow="TERMS OF USE"
      lead="By using the Raptile storefront, you agree to the operating conditions around product availability, pricing, fulfillment, and studio communications."
      sections={[
        {
          label: "Availability",
          body: "All pieces are offered subject to stock, release timing, and verification. Vaulted items may remain visible for archival reference even when unavailable for acquisition.",
        },
        {
          label: "Pricing",
          body: "Prices are listed in INR unless otherwise noted. Taxes, import duties, and shipping charges may be applied depending on destination and order context.",
        },
        {
          label: "Intellectual Property",
          body: "All garment graphics, photography, visual systems, and written content belong to Raptile Studio or their respective collaborators unless explicitly stated otherwise.",
        },
        {
          label: "Liability",
          body: "Raptile is not liable for indirect losses caused by delayed transit, third-party carrier events, customs holds, or temporary storefront outages beyond reasonable control.",
        },
      ]}
      title="Terms"
    />
  );
}

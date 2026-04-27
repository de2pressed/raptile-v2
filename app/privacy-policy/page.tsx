import { InfoTerminalPage } from "@/components/layout/InfoTerminalPage";

export default function PrivacyPolicyPage() {
  return (
    <InfoTerminalPage
      eyebrow="DATA HANDLING"
      lead="Raptile collects only the information required to process orders, coordinate support, and understand storefront performance at an aggregate level."
      sections={[
        {
          label: "Order Data",
          body: "Name, delivery address, contact details, and purchase details are used strictly for order fulfillment, fraud review, and customer support follow-up.",
        },
        {
          label: "Analytics",
          body: "Storefront interaction data may be used to understand navigation behavior, collection demand, and release performance without selling personal information.",
        },
        {
          label: "Retention",
          body: "Order records are retained for legal, accounting, and support purposes. Inquiry emails remain archived only as long as required to complete the request.",
        },
        {
          label: "Requests",
          body: "To request access, correction, or deletion of your data where legally applicable, contact the studio directly and include enough detail to verify ownership.",
        },
      ]}
      title="Privacy Policy"
    />
  );
}

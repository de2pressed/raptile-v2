import { SupportPageFrame } from "@/components/layout/SupportPageFrame";

export default function TermsPage() {
  return (
    <SupportPageFrame title="Terms">
      <div className="support-stack">
        <section>
          <h2 className="support-heading">Acceptance</h2>
          <p>By using this site, you agree to these terms and any policies linked from the storefront.</p>
        </section>
        <section>
          <h2 className="support-heading">Product Descriptions</h2>
          <p>
            We aim to present products accurately, but slight differences in color and finish may occur across
            screens and production runs.
          </p>
        </section>
        <section>
          <h2 className="support-heading">Pricing and Payment</h2>
          <p>All prices are listed in INR. Payment must be completed before an order is processed for dispatch.</p>
        </section>
        <section>
          <h2 className="support-heading">Shipping and Liability</h2>
          <p>
            Once a parcel is handed to the carrier, transit timing depends on that carrier. Refer to our shipping
            and returns pages for the current policies.
          </p>
        </section>
        <section>
          <h2 className="support-heading">Governing Law</h2>
          <p>These terms are governed by the laws of India.</p>
        </section>
      </div>
    </SupportPageFrame>
  );
}

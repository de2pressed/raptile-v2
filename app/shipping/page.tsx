import { SupportPageFrame } from "@/components/layout/SupportPageFrame";

export default function ShippingPage() {
  return (
    <SupportPageFrame title="Shipping">
      <div className="support-stack">
        <section>
          <h2 className="support-heading">Processing Time</h2>
          <p>
            Orders are prepared within 2 to 4 business days. Each piece is checked for finish, sizing, and
            packing before it leaves the studio.
          </p>
        </section>
        <section>
          <h2 className="support-heading">Domestic Shipping</h2>
          <p>
            India orders usually arrive in 4 to 7 business days after dispatch. Shipping is free on domestic
            orders above ₹2,999.
          </p>
        </section>
        <section>
          <h2 className="support-heading">International</h2>
          <p>International shipping is currently unavailable while we refine packaging and customs handling.</p>
        </section>
      </div>
    </SupportPageFrame>
  );
}

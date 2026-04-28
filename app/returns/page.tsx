import { SupportPageFrame } from "@/components/layout/SupportPageFrame";

export default function ReturnsPage() {
  return (
    <SupportPageFrame title="Returns">
      <div className="support-stack">
        <section>
          <h2 className="support-heading">Return Window</h2>
          <p>Return requests must be made within 7 days from the delivery date.</p>
        </section>
        <section>
          <h2 className="support-heading">Conditions</h2>
          <p>
            Items must be unworn, unwashed, and returned with original tags attached, including all original
            packaging.
          </p>
        </section>
        <section>
          <h2 className="support-heading">Process</h2>
          <p>
            Email us with your order number and reason for return. We will share the next steps once the request
            is reviewed.
          </p>
        </section>
        <section>
          <h2 className="support-heading">Non-returnable</h2>
          <p>Sale items, worn items, and products returned without their original packaging are not eligible.</p>
        </section>
      </div>
    </SupportPageFrame>
  );
}

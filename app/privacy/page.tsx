import { SupportPageFrame } from "@/components/layout/SupportPageFrame";

export default function PrivacyPage() {
  return (
    <SupportPageFrame title="Privacy Policy">
      <div className="support-stack">
        <section>
          <h2 className="support-heading">What We Collect</h2>
          <p>We collect information such as your name, email address, shipping details, and order data.</p>
        </section>
        <section>
          <h2 className="support-heading">Why We Use It</h2>
          <p>We use your information to fulfill orders, provide support, and send essential order updates.</p>
        </section>
        <section>
          <h2 className="support-heading">Third Parties</h2>
          <p>
            Orders and storefront data are processed through Shopify, and the site is hosted on Vercel. These
            providers only receive the data needed to operate the store.
          </p>
        </section>
        <section>
          <h2 className="support-heading">Cookies</h2>
          <p>Cookies help keep your cart active, remember basic preferences, and improve site performance.</p>
        </section>
        <section>
          <h2 className="support-heading">Requests</h2>
          <p>Contact us if you would like to review, update, or delete your personal information.</p>
        </section>
      </div>
    </SupportPageFrame>
  );
}

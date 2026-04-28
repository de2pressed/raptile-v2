import { ContactForm } from "@/components/contact/ContactForm";
import { SupportPageFrame } from "@/components/layout/SupportPageFrame";

export default function ContactPage() {
  return (
    <SupportPageFrame title="Contact">
      <div className="support-stack">
        <section>
          <h2 className="support-heading">Get in Touch</h2>
          <p>
            Reach out for order support, sizing help, or general questions. We usually reply within 1 to 2
            business days.
          </p>
        </section>
        <ContactForm />
      </div>
    </SupportPageFrame>
  );
}

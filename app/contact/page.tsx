import { SupportPageFrame } from "@/components/layout/SupportPageFrame";
import { ContactForm } from "@/components/contact/ContactForm";

export default function ContactPage() {
  return (
    <SupportPageFrame title="Contact">
      <div className="grid gap-6">
        <p className="t-ui max-w-[42rem] leading-7 text-[color:var(--text-muted)]">
          Use this form for sizing, order support, or general questions. We usually reply within 1 to 2 business
          days.
        </p>
        <ContactForm />
      </div>
    </SupportPageFrame>
  );
}

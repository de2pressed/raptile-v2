import { ContactForm } from "@/components/contact/ContactForm";
import { SupportPageFrame } from "@/components/layout/SupportPageFrame";

export default function ContactPage() {
  return (
    <SupportPageFrame title="Contact">
      <div className="grid gap-6">
        <section className="max-w-[46rem] space-y-4">
          <h2 className="support-heading">Get in Touch</h2>
          <p className="text-[1.1rem] leading-[1.7] text-[color:var(--text-muted)] md:text-[1.2rem]">
            Reach out for order support, sizing help, or general questions. We usually reply within 1 to 2 business days.
          </p>
        </section>
        <div className="w-full max-w-[560px] lg:ml-auto lg:mr-[6%]">
          <ContactForm />
        </div>
      </div>
    </SupportPageFrame>
  );
}

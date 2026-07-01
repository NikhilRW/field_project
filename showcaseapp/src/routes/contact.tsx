import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Helping Hands · Samajik Seva Sanstha" },
      { name: "description", content: "Get in touch with Helping Hands — office address, phone, email and volunteer inquiries." },
      { property: "og:title", content: "Contact Us — Helping Hands" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const cards = [
  { icon: Phone, label: "Phone", value: "+91 98200 12345" },
  { icon: Mail, label: "Email", value: "hello@helpinghands.org" },
  { icon: MapPin, label: "Office", value: "112 Community Lane, Andheri West, Mumbai 400058" },
  { icon: Clock, label: "Hours", value: "Mon – Sat · 10:00 AM – 6:30 PM IST" },
];

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={<>We'd love to <span className="text-gradient">hear from you</span>.</>}
        subtitle="Questions, partnerships, volunteering — reach out and a real human will reply within 24 hours."
        imageLabel="volunteers greeting visitors at NGO office"
      />
      <section className="py-16">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <Reveal key={c.label} delay={i * 60}>
              <div className="card-lift h-full rounded-2xl border border-border bg-card p-6">
                <div className="mb-3 inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <c.icon className="size-5" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{c.label}</p>
                <p className="mt-1 font-bold">{c.value}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="container-page grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message sent! We'll be in touch shortly.");
              }}
              className="grid gap-4 rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)] sm:grid-cols-2"
            >
              <h2 className="text-3xl sm:col-span-2">Send us a message</h2>
              <Field label="Full name" name="name" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Phone" name="phone" type="tel" />
              <Field label="Subject" name="subject" />
              <div className="sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Message</label>
                <textarea
                  required
                  rows={5}
                  className="mt-2 w-full rounded-2xl border-2 border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Preferred contact</p>
                <div className="mt-2 flex flex-wrap gap-4 text-sm">
                  <label className="inline-flex items-center gap-2"><input type="radio" name="pref" defaultChecked /> Email</label>
                  <label className="inline-flex items-center gap-2"><input type="radio" name="pref" /> Phone</label>
                  <label className="inline-flex items-center gap-2"><input type="checkbox" /> I want to volunteer</label>
                </div>
              </div>
              <button className="btn-primary sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-bold">
                <Send className="size-4" /> Send message
              </button>
            </form>
          </Reveal>
          <Reveal delay={150}>
            <div className="grid gap-4">
              <ImagePlaceholder label="Google Maps embed of NGO office location" aspect="aspect-[4/3]" />
              <ImagePlaceholder label="office reception with volunteers" aspect="aspect-[4/3]" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-2xl border-2 border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}

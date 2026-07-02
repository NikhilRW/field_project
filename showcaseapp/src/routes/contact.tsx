import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useRef } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Helping Hands" },
      { name: "description", content: "Get in touch with Helping Hands — office address, phone, email and volunteer inquiries." },
      { property: "og:title", content: "Contact Us — Helping Hands" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const cards = [
  { icon: Phone, label: "Phone", value: "+91 88982 35366" },
  { icon: Mail, label: "Email", value: "sachindilipraut@gmail.com" },
  { icon: MapPin, label: "Office", value: "Near Manali Palace, Kalyan West, Maharashtra" },
  { icon: Clock, label: "Hours", value: "Mon – Sat · 5:00 PM – 9:00 PM IST" },
];

function ContactPage() {
  const msgRef = useRef<HTMLTextAreaElement>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = msgRef.current?.value.trim();
    if (!text) return;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/918898235366?text=${encoded}`, "_blank");
  };
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={<>We'd love to <span className="text-gradient">hear from you</span>.</>}
        subtitle="Questions, partnerships, volunteering — reach out and a real human will reply within 24 hours."
        imageSrc="/ngo-pamplet.jpeg"
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
                <p className={"mt-1 font-bold "+(c.value.includes('@') ? " text-[13px]" : "")}>{c.value}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="container-page grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]"
            >
              <h2 className="text-3xl">Send us a message</h2>
              <div className="mt-4">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Message <span className="text-primary">*</span></label>
                <textarea
                  ref={msgRef}
                  required
                  rows={6}
                  className="mt-2 w-full rounded-2xl border-2 border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <button className="btn-primary mt-4 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-bold">
                <Send className="size-4" /> Send via WhatsApp
              </button>
            </form>
          </Reveal>
          <Reveal delay={150}>
            <div className="grid gap-4">
              <img
                src="/ngo-founder-donating-water.jpeg"
                alt="NGO office location"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover rounded-2xl"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}


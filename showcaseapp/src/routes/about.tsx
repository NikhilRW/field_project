import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Eye, HeartHandshake, Lightbulb, ShieldCheck, Target, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Helping Hands" },
      {
        name: "description",
        content:
          "About Helping Hands (Samajik Seva Sanstha) — a registered NGO in Kalyan West, Maharashtra working across education, healthcare and food security since 2018.",
      },
      { property: "og:title", content: "About Us — Helping Hands" },
      { property: "og:description", content: "Our mission, vision, values and 8-year journey." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const values = [
  { icon: Eye, label: "Transparency", text: "Public reports, audited financials, open books." },
  { icon: HeartHandshake, label: "Compassion", text: "People before processes, always." },
  { icon: ShieldCheck, label: "Integrity", text: "Honest work, honest reporting." },
  { icon: Users, label: "Community", text: "Programs co-created with local leaders." },
  { icon: Lightbulb, label: "Innovation", text: "Simple, scalable solutions that work." },
];

const posters = ["/ngo-poster.jpeg", "/ngo-poster-2.jpeg"];

function AboutPage() {
  const [posterIndex, setPosterIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setPosterIndex((i) => (i + 1) % posters.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={
          <>
            Eight years of <span className="text-gradient">standing beside</span> the underserved.
          </>
        }
        subtitle="Helping Hands (Samajik Seva Sanstha) is a registered non-profit working across education, healthcare, food security, women's empowerment and disaster relief in India."
      />

      <section className="pb-10">
        <div className="container-page">
          <img
            src="/very-large-portrait-of-multiple-donations.jpeg"
            alt="Helping Hands community work"
            loading="lazy"
            className="w-full rounded-3xl object-contain shadow-[var(--shadow-lift)]"
            style={{ height: "160dvh" }}
          />
        </div>
      </section>

      <section className="py-20">
        <div className="container-page grid gap-8 md:grid-cols-2">
          <Reveal>
            <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Target className="size-6" />
              </div>
              <h2 className="text-2xl">Our Mission</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Enable dignified access to education, healthcare, nutrition and livelihoods for every
                underserved family — and equip communities to sustain their own progress.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                <Eye className="size-6" />
              </div>
              <h2 className="text-2xl">Our Vision</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                A future where geography, gender or income no longer decide the opportunities a
                child, woman or family will have access to.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[image:var(--gradient-soft)] py-20">
        <div className="container-page">
          <Reveal>
            <h2 className="text-center text-4xl md:text-5xl">Core values</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {values.map((v, i) => (
              <Reveal key={v.label} delay={i * 80}>
                <div className="card-lift h-full rounded-2xl border border-border bg-card p-6 text-center">
                  <div className="mx-auto mb-3 grid size-11 place-items-center rounded-xl bg-[image:var(--gradient-warm)] text-primary-foreground">
                    <v.icon className="size-5" />
                  </div>
                  <p className="font-bold">{v.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-primary">Team</span>
              <h2 className="mt-3 text-4xl md:text-5xl">A team rooted in the communities we serve</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Our 5+ volunteers from across Maharashtra. Together with 3 full-time staff, they
                power every program on the ground.
              </p>
              <Link
                to="/contact"
                className="btn-primary mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold"
              >
                Join our team <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl">
              {posters.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt="NGO team with community"
                  loading={i === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
                  style={{ opacity: i === posterIndex ? 1 : 0 }}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
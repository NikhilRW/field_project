import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Droplet, Home, Sparkles, Stethoscope, Utensils } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Our Programs — Helping Hands · Samajik Seva Sanstha" },
      {
        name: "description",
        content:
          "Explore our programs — education drives, health camps, food distribution, women empowerment, disaster relief and sustainable community development.",
      },
      { property: "og:title", content: "Our Programs — Helping Hands" },
      { property: "og:url", content: "/programs" },
    ],
    links: [{ rel: "canonical", href: "/programs" }],
  }),
  component: ProgramsPage,
});

const programs = [
  { icon: BookOpen, title: "Education Drives", text: "Scholarships, learning centers and school kits.", imageLabel: "volunteers teaching children" },
  { icon: Stethoscope, title: "Health Camps", text: "Free medical checkups and specialist consultations.", imageLabel: "free medical camp" },
  { icon: Utensils, title: "Food Distribution", text: "Meals and monthly ration kits for vulnerable families.", imageLabel: "food packet distribution" },
  { icon: Sparkles, title: "Women Empowerment", text: "Skill workshops and self-help groups.", imageLabel: "women skill training" },
  { icon: Droplet, title: "Disaster Relief", text: "Rapid response, shelter and rehabilitation.", imageLabel: "disaster relief distribution" },
  { icon: Home, title: "Community Development", text: "Sanitation, clean water and public infrastructure.", imageLabel: "community sanitation drive" },
];

function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Programs"
        title={<>Six focused programs. <span className="text-gradient">One shared purpose.</span></>}
        subtitle="Every program is co-designed with community leaders and measured on real, long-term outcomes."
        imageLabel="NGO programs collage — teaching, health camp, food drive"
      />
      <section className="py-20">
        <div className="container-page grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((p, i) => (
            <Reveal key={p.title} delay={i * 60}>
              <article className="card-lift flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card">
                <div className="image-zoom">
                  <ImagePlaceholder label={p.imageLabel} aspect="aspect-[16/10]" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <p.icon className="size-5" />
                  </div>
                  <h3 className="text-xl">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                  <Link to="/donate" className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-bold text-primary hover:gap-2 transition-all">
                    Support this program <ArrowRight className="size-4" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

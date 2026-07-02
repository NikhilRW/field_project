import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Droplet, Home, ShoppingBag, Sparkles, Stethoscope, Utensils } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Our Programs — Helping Hands" },
      {
        name: "description",
        content:
          "Explore Helping Hands NGO programs in Kalyan, Maharashtra — education drives, health camps, food distribution, women empowerment and disaster relief.",
      },
      { property: "og:title", content: "Our Programs — Helping Hands" },
      { property: "og:url", content: "/programs" },
    ],
    links: [{ rel: "canonical", href: "/programs" }],
  }),
  component: ProgramsPage,
});

const programs = [
  { icon: BookOpen, title: "Education Drives", text: "Scholarships, learning centers and school kits.", img: "/school-kids-photo.jpeg" },
  { icon: Droplet, title: "Water donation", text: "Access to clean water for underserved communities.", img: "/image-beneficiary-getting-water.jpeg" },
  { icon: Utensils, title: "Food Distribution", text: "Meals and monthly ration kits for vulnerable families.", img: "/again-village-people-getting-donation.jpeg" },
  { icon: Sparkles, title: "Women Empowerment", text: "Skill workshops and self-help groups.", img: "/volunteers-giving-saree-to-womes-on-deviji-puja.jpeg" },
  { icon: ShoppingBag, title: "Goods Distribution", text: "Essential items and supplies for villages.", img: "/donation-at-village.jpeg" },
  { icon: Home, title: "Community Development", text: "Sanitation, clean water and public infrastructure.", img: "/ngo-founder-donating-water.jpeg" },
];

function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Programs"
        title={<>Six focused programs. <span className="text-gradient">One shared purpose.</span></>}
        subtitle="Every program is co-designed with community leaders and measured on real, long-term outcomes."
        imageSrc="/again-village-people-getting-donation-portrait-multiple.jpeg"
      />
      <section className="py-20">
        <div className="container-page grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((p, i) => (
            <Reveal key={p.title} delay={i * 60}>
              <article className="card-lift flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card">
                <div className="image-zoom">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover"
                  />
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
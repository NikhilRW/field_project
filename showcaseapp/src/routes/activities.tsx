import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, MapPin, Users } from "lucide-react";
import { useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";

export const Route = createFileRoute("/activities")({
  head: () => ({
    meta: [
      { title: "Community Activities — Helping Hands · Samajik Seva Sanstha" },
      { name: "description", content: "Recent community activities — education drives, health camps, tree plantation, blood donation, blanket distribution and more." },
      { property: "og:title", content: "Community Activities — Helping Hands" },
      { property: "og:url", content: "/activities" },
    ],
    links: [{ rel: "canonical", href: "/activities" }],
  }),
  component: ActivitiesPage,
});

const activities = [
  { title: "School Supplies Distribution", date: "May 18, 2026", location: "Palghar", participants: "420 children", category: "Education", text: "Notebooks, uniforms and bags delivered across three villages.", imageLabel: "children receiving school supplies" },
  { title: "Tree Plantation Drive", date: "Jun 5, 2026", location: "Nashik", participants: "150 volunteers", category: "Environment", text: "1,200 native saplings on World Environment Day.", imageLabel: "students planting saplings" },
  { title: "Free Medical Camp", date: "Jun 14, 2026", location: "Panvel", participants: "380 patients", category: "Health", text: "General, pediatric and eye specialists served in a single day.", imageLabel: "doctors examining patients" },
  { title: "Winter Blanket Distribution", date: "Dec 22, 2025", location: "Delhi NCR", participants: "800 families", category: "Relief", text: "Blankets to families and elderly living on the streets.", imageLabel: "blanket distribution night" },
  { title: "Blood Donation Camp", date: "Apr 7, 2026", location: "Mumbai", participants: "112 units", category: "Health", text: "Partnered with the state blood bank.", imageLabel: "blood donation drive" },
  { title: "Women's Skill Workshop", date: "Mar 12, 2026", location: "Pune", participants: "60 women", category: "Empowerment", text: "4-week tailoring & entrepreneurship program.", imageLabel: "women tailoring workshop" },
  { title: "Community Kitchen", date: "Feb 8, 2026", location: "Mumbai", participants: "1,500 meals", category: "Food", text: "Hot meals served during civic works displacement.", imageLabel: "community kitchen cooking" },
  { title: "Computer Literacy Program", date: "Jan 18, 2026", location: "Thane", participants: "85 students", category: "Education", text: "Basic digital literacy for high-school students.", imageLabel: "computer literacy class" },
  { title: "Flood Relief Camp", date: "Aug 2, 2025", location: "Konkan", participants: "1,200 families", category: "Relief", text: "Emergency shelter, food kits and medical care.", imageLabel: "flood relief distribution" },
];

const filters = ["All", "Education", "Health", "Food", "Empowerment", "Environment", "Relief"];

function ActivitiesPage() {
  const [f, setF] = useState("All");
  const visible = f === "All" ? activities : activities.filter((a) => a.category === f);
  return (
    <>
      <PageHero
        eyebrow="Activities"
        title={<>Community <span className="text-gradient">activities</span> from the field.</>}
        subtitle="A living log of the drives, camps and workshops we run every week across India."
        imageLabel="recent NGO event group photo"
      />
      <section className="py-14">
        <div className="container-page">
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((x) => (
              <button
                key={x}
                onClick={() => setF(x)}
                className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  f === x
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                {x}
              </button>
            ))}
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((a, i) => (
              <Reveal key={a.title} delay={i * 60}>
                <article className="card-lift flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card">
                  <div className="image-zoom relative">
                    <ImagePlaceholder label={a.imageLabel} aspect="aspect-[16/10]" />
                    <span className="absolute left-4 top-4 rounded-full bg-[image:var(--gradient-warm)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow">
                      {a.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Clock className="size-3.5" />{a.date}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" />{a.location}</span>
                      <span className="inline-flex items-center gap-1"><Users className="size-3.5" />{a.participants}</span>
                    </div>
                    <h3 className="mt-3 text-lg leading-tight">{a.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{a.text}</p>
                    <Link to="/donate" className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-bold text-primary hover:gap-2 transition-all">
                      Read more <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 flex justify-center gap-2">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={`grid size-10 place-items-center rounded-full border text-sm font-bold ${
                  n === 1 ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

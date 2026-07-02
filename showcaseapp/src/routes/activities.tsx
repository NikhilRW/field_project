import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { fetchActivities } from "@/lib/api";

export const Route = createFileRoute("/activities")({
  head: () => ({
    meta: [
      { title: "Community Activities — Helping Hands" },
      { name: "description", content: "Recent activities by Helping Hands NGO in Kalyan, Maharashtra — community drives, health camps, education programs and relief work." },
      { property: "og:title", content: "Community Activities — Helping Hands" },
      { property: "og:url", content: "/activities" },
    ],
    links: [{ rel: "canonical", href: "/activities" }],
  }),
  component: ActivitiesPage,
});

function ActivitiesPage() {
  const [activities, setActivities] = useState<Array<{ title: string; date: string; location: string; participants: string; category: string; text: string; img: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities()
      .then((data) => {
        const upcoming = data
          .filter((a) => a.status === "Upcoming")
          .map((a) => ({
            title: a.name,
            date: a.date,
            location: "",
            participants: "",
            category: "",
            text: a.description,
            img: a.imageUrl || "",
          }));
        setActivities(upcoming);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
      <PageHero
        eyebrow="Activities"
        title={<>Community <span className="text-gradient">activities</span> from the NGO.</>}
        subtitle="A living log of the drives, camps and workshops we run every week across India."
        imageSrc="/landscape-photo-all-people-in-view.jpeg"
      />
      <section className="py-14">
        <div className="container-page">

          <div className="mt-10">
            {activities.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-center">
                <p className="text-lg font-semibold text-muted-foreground">No upcoming activities yet</p>
                <p className="mt-1 text-sm text-muted-foreground/60">Check back soon for new updates from the NGO.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {activities.map((a, i) => (
                  <Reveal key={a.title} delay={i * 60}>
                    <article className="card-lift flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card">
                      <div className="image-zoom relative">
                        {a.img ? (
                          <img
                            src={a.img}
                            alt={a.title}
                            loading="lazy"
                            className="aspect-[16/10] w-full object-cover"
                          />
                        ) : (
                          <div className="flex aspect-[16/10] w-full items-center justify-center bg-muted">
                            <Calendar className="size-12 text-muted-foreground/40" />
                          </div>
                        )}
                        {a.category && (
                          <span className="absolute left-4 top-4 rounded-full bg-[image:var(--gradient-warm)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow">
                            {a.category}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><Clock className="size-3.5" />{a.date}</span>
                          {a.location && <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" />{a.location}</span>}
                          {a.participants && <span className="inline-flex items-center gap-1"><Users className="size-3.5" />{a.participants}</span>}
                        </div>
                        <h3 className="mt-3 text-lg leading-tight">{a.title}</h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{a.text}</p>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

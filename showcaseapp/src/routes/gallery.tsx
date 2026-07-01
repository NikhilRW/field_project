import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Impact Gallery — Helping Hands · Samajik Seva Sanstha" },
      { name: "description", content: "Photographs from Helping Hands programs and community moments across India." },
      { property: "og:title", content: "Impact Gallery — Helping Hands" },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

const items = [
  { label: "children studying in a village classroom", aspect: "aspect-[3/4]" },
  { label: "women's tailoring training workshop", aspect: "aspect-square" },
  { label: "community kitchen preparing meals", aspect: "aspect-[4/5]" },
  { label: "volunteers cleaning a public park", aspect: "aspect-[3/4]" },
  { label: "free rural health camp in progress", aspect: "aspect-square" },
  { label: "tree plantation event with students", aspect: "aspect-[4/5]" },
  { label: "smiling elderly beneficiary receiving support", aspect: "aspect-[3/4]" },
  { label: "NGO annual gathering group photo", aspect: "aspect-square" },
  { label: "volunteer teaching computer skills", aspect: "aspect-[4/5]" },
  { label: "disaster relief distribution camp", aspect: "aspect-[3/4]" },
  { label: "blood donation drive", aspect: "aspect-square" },
  { label: "children receiving school supplies", aspect: "aspect-[4/5]" },
];

function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={<>Moments from <span className="text-gradient">the field</span>.</>}
        subtitle="Real people. Real programs. Real change — captured across our work in 120+ communities."
        imageLabel="collage of NGO activities across India"
      />
      <section className="py-14">
        <div className="container-page">
          <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [column-fill:_balance]">
            {items.map((g, i) => (
              <Reveal key={i} delay={(i % 4) * 60}>
                <div className="mb-4 break-inside-avoid image-zoom card-lift overflow-hidden rounded-2xl border border-border bg-card">
                  <ImagePlaceholder label={g.label} aspect={g.aspect} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

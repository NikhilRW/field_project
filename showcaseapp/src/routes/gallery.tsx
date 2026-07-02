import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Impact Gallery — Helping Hands" },
      { name: "description", content: "Photo gallery of Helping Hands NGO activities in Kalyan, Maharashtra — education, health camps, donations and community moments." },
      { property: "og:title", content: "Impact Gallery — Helping Hands" },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

const items = [
  { label: "children studying in a village classroom", aspect: "aspect-[3/4]", img: "/small-kids-photo.jpeg" },
  { label: "women's tailoring training workshop", aspect: "aspect-square", img: "/volunteers-giving-saree-to-womes-on-deviji-puja.jpeg" },
  { label: "community kitchen preparing meals", aspect: "aspect-[4/5]", img: "/utensils-donation.jpeg" },
  { label: "volunteers cleaning a public park", aspect: "aspect-[3/4]", img: "/ngo-volunteer-donating-water.jpeg" },
  { label: "free rural health camp in progress", aspect: "aspect-square", img: "/image-beneficiary-getting-water.jpeg" },
  { label: "tree plantation event with students", aspect: "aspect-[4/5]", img: "/school-kids-photo.jpeg" },
  { label: "children playing and learning together", aspect: "aspect-[3/4]", img: "/small-kids-photos.jpeg" },
  { label: "NGO annual gathering group photo", aspect: "aspect-square", img: "/very-large-portrait-of-multiple-donations.jpeg" },
  { label: "volunteer teaching computer skills", aspect: "aspect-[4/5]", img: "/small-kids-smiling-after-getting-donation.jpeg" },
  { label: "disaster relief distribution camp", aspect: "aspect-[3/4]", img: "/donation-at-village.jpeg" },
  { label: "blood donation drive", aspect: "aspect-square", img: "/ngo-founder-donating-water.jpeg" },
  { label: "children receiving school supplies", aspect: "aspect-[4/5]", img: "/ngo-bag-donated-to-school-kids.jpeg" },
  { label: "toy donations to kids", aspect: "aspect-square", img: "/toy-donations-to-kids.jpeg" },
  { label: "NGO awareness poster", aspect: "aspect-[3/4]", img: "/ngo-poster.jpeg" },
  { label: "NGO awareness campaign", aspect: "aspect-[3/4]", img: "/ngo-poster-2.jpeg" },
  { label: "Helping Hands pamphlet", aspect: "aspect-[4/5]", img: "/ngo-pamplet.jpeg" },
  { label: "founder distributing in village", aspect: "aspect-square", img: "/ngo-founder-donating-village-peoples.jpeg" },
  { label: "landscape community photo", aspect: "aspect-[16/9]", img: "/landscape-photo-all-people-in-view.jpeg" },
  { label: "elders receiving donations", aspect: "aspect-[3/4]", img: "/elders-getting-donation.jpeg" },
  { label: "village people receiving donations", aspect: "aspect-[4/5]", img: "/again-village-people-getting-donation.jpeg" },
  { label: "multiple portrait donations", aspect: "aspect-[3/4]", img: "/again-village-people-getting-donation-portrait-multiple.jpeg" },
  { label: "single woman receiving donation", aspect: "aspect-square", img: "/a-single-women-in-ngo-getting-donation.jpeg" },
];

function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={<>Moments from <span className="text-gradient">the field</span>.</>}
        subtitle="Real people. Real programs. Real change — captured across our work in 50+ communities."
      />
      <section className="py-14">
        <div className="container-page">
          <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [column-fill:_balance]">
            {items.map((g, i) => (
              <Reveal key={i} delay={(i % 4) * 60}>
                <div className="mb-4 break-inside-avoid image-zoom card-lift overflow-hidden rounded-2xl border border-border bg-card">
                  <img
                    src={g.img}
                    alt={g.label}
                    loading="lazy"
                    className={`${g.aspect} w-full object-cover`}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
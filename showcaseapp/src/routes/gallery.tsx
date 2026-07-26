import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { fetchGalleryImages } from "@/lib/api";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Impact Gallery — Helping Hands" },
      {
        name: "description",
        content:
          "Photo gallery of Helping Hands NGO activities in Kalyan, Maharashtra — education, health camps, donations and community moments.",
      },
      { property: "og:title", content: "Impact Gallery — Helping Hands" },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

const items = [
  {
    label: "children studying in a village classroom",
    aspect: "aspect-[3/4]",
    img: "/small-kids-photo.jpeg",
  },
  {
    label: "women's tailoring training workshop",
    aspect: "aspect-square",
    img: "/volunteers-giving-saree-to-womes-on-deviji-puja.jpeg",
  },
  {
    label: "community kitchen preparing meals",
    aspect: "aspect-[4/5]",
    img: "/utensils-donation.jpeg",
  },
  {
    label: "volunteers cleaning a public park",
    aspect: "aspect-[3/4]",
    img: "/ngo-volunteer-donating-water.jpeg",
  },
  {
    label: "free rural health camp in progress",
    aspect: "aspect-square",
    img: "/image-beneficiary-getting-water.jpeg",
  },
  {
    label: "tree plantation event with students",
    aspect: "aspect-[4/5]",
    img: "/school-kids-photo.jpeg",
  },
  {
    label: "children playing and learning together",
    aspect: "aspect-[3/4]",
    img: "/small-kids-photos.jpeg",
  },
  {
    label: "NGO annual gathering group photo",
    aspect: "aspect-square",
    img: "/very-large-portrait-of-multiple-donations.jpeg",
  },
  {
    label: "volunteer teaching computer skills",
    aspect: "aspect-[4/5]",
    img: "/small-kids-smiling-after-getting-donation.jpeg",
  },
  {
    label: "disaster relief distribution camp",
    aspect: "aspect-[3/4]",
    img: "/donation-at-village.jpeg",
  },
  {
    label: "blood donation drive",
    aspect: "aspect-square",
    img: "/ngo-founder-donating-water.jpeg",
  },
  {
    label: "children receiving school supplies",
    aspect: "aspect-[4/5]",
    img: "/ngo-bag-donated-to-school-kids.jpeg",
  },
  { label: "toy donations to kids", aspect: "aspect-square", img: "/toy-donations-to-kids.jpeg" },
  { label: "NGO awareness poster", aspect: "aspect-[3/4]", img: "/ngo-poster.jpeg" },
  { label: "NGO awareness campaign", aspect: "aspect-[3/4]", img: "/ngo-poster-2.jpeg" },
  { label: "Helping Hands pamphlet", aspect: "aspect-[4/5]", img: "/ngo-pamplet.jpeg" },
  {
    label: "founder distributing in village",
    aspect: "aspect-square",
    img: "/ngo-founder-donating-village-peoples.jpeg",
  },
  {
    label: "landscape community photo",
    aspect: "aspect-[16/9]",
    img: "/landscape-photo-all-people-in-view.jpeg",
  },
  {
    label: "elders receiving donations",
    aspect: "aspect-[3/4]",
    img: "/elders-getting-donation.jpeg",
  },
  {
    label: "village people receiving donations",
    aspect: "aspect-[4/5]",
    img: "/again-village-people-getting-donation.jpeg",
  },
  {
    label: "multiple portrait donations",
    aspect: "aspect-[3/4]",
    img: "/again-village-people-getting-donation-portrait-multiple.jpeg",
  },
  {
    label: "single woman receiving donation",
    aspect: "aspect-square",
    img: "/a-single-women-in-ngo-getting-donation.jpeg",
  },
  {
    label: "bag distribution with school administration",
    aspect: "aspect-[4/5]",
    img: "/bag_distribution_photos_with_school_adminstration.jpeg",
  },
  {
    label: "bag donation to students",
    aspect: "aspect-[3/4]",
    img: "/bag_donation_to_students.jpeg",
  },
  {
    label: "cake cutting with kids celebration",
    aspect: "aspect-square",
    img: "/cake_cutting_with_kids.jpeg",
  },
  {
    label: "school bag distribution event",
    aspect: "aspect-[4/5]",
    img: "/school_bag_distribution.jpeg",
  },
  {
    label: "new school bag distribution photo",
    aspect: "aspect-[3/4]",
    img: "/school_bag_distribution_new_photo.jpeg",
  },
  {
    label: "school kids group photo",
    aspect: "aspect-square",
    img: "/school_kids_new_photos_2.jpeg",
  },
  {
    label: "school kids smiling together",
    aspect: "aspect-[4/5]",
    img: "/shools_kids_new_photos.jpeg",
  },
  { label: "toy distribution to children", aspect: "aspect-[3/4]", img: "/toy_distribution.jpeg" },
  {
    label: "all students with bags and founder",
    aspect: "aspect-[4/5]",
    img: "/all-students-with-bags-and-founder-in-photo.jpeg",
  },
  {
    label: "all students with bags group photo",
    aspect: "aspect-square",
    img: "/all-students-with-bags.jpeg",
  },
  {
    label: "founder giving biscuits to children",
    aspect: "aspect-[3/4]",
    img: "/founder-giving-biscuits-to-children.jpeg",
  },
  {
    label: "kids going from stairs happy after receiving bags",
    aspect: "aspect-[4/5]",
    img: "/kids-going-from-stairs-being-happy-after-getting-bags.jpeg",
  },
  {
    label: "kids smiling after receiving bags",
    aspect: "aspect-square",
    img: "/kids-smilling-after-receiving-bags.jpeg",
  },
  {
    label: "small kids holding bags",
    aspect: "aspect-[3/4]",
    img: "/small-kids-holding-bags.jpeg",
  },
  {
    label: "volunteer giving biscuits",
    aspect: "aspect-[4/5]",
    img: "/volunteer-giving-biscuits.jpeg",
  },
  { label: "old age home residents group", aspect: "aspect-[4/5]", img: "/old_age_home_1.jpeg" },
  { label: "old age home care and companionship", aspect: "aspect-square", img: "/old_age_home_2.jpeg" },
  { label: "old age home activities", aspect: "aspect-[3/4]", img: "/old_age_home_3.jpeg" },
  { label: "old age home visit", aspect: "aspect-[4/5]", img: "/old_age_home_4.jpeg" },
];

function GalleryPage() {
  const [apiItems, setApiItems] = useState<Array<{ label: string; aspect: string; img: string }>>(
    [],
  );

  useEffect(() => {
    console.log("[GalleryPage] Fetching gallery images...");
    fetchGalleryImages()
      .then((data) => {
        console.log("[GalleryPage] Fetched", data.length, "images from API");
        const mapped = data.map((item) => ({
          label: item.caption || "Gallery image",
          aspect: "aspect-[4/5]",
          img: item.imageUrl,
        }));
        console.log("[GalleryPage] first API image URL:", mapped[0]?.img);
        setApiItems(mapped);
      })
      .catch((err) => {
        console.error("[GalleryPage] Failed to fetch gallery images:", err.message || err);
        console.error("[GalleryPage] Check that the backend server is running on", import.meta.env.VITE_API_URL || "http://localhost:5000");
        console.error("[GalleryPage] Also check CORS config allows", window.location.origin);
      });
  }, []);

  const allItems = [...items, ...apiItems];

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={
          <>
            Moments from <span className="text-gradient">the field</span>.
          </>
        }
        subtitle="Real people. Real programs. Real change — captured across our work in 50+ communities."
      />
      <section className="py-14">
        <div className="container-page">
          <div className="columns-2 gap-4 md:columns-3 [column-fill:_balance]">
            {allItems.map((g, i) => (
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

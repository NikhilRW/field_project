import { createFileRoute } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { HelpingHand } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { fetchDonations } from "@/lib/api";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate — Helping Hands" },
      { name: "description", content: "Donate to Helping Hands NGO in Kalyan, Maharashtra. 80G tax benefits. Transparent donations for education, health camps and community programs." },
      { property: "og:title", content: "Donate — Helping Hands" },
      { property: "og:url", content: "/donate" },
    ],
    links: [{ rel: "canonical", href: "/donate" }],
  }),
  component: DonatePage,
});

const impact = [
  { amt: "₹500", text: "One month of school supplies for a child" },
  { amt: "₹5,000", text: "Nutritious meals for a family of five for a month" },
  { amt: "₹20,000", text: "A full village health camp for 300+ people" },
];

const categoryLabel: Record<string, string> = {
  money: "Monetary",
  books: "Books",
  clothes: "Clothes",
  grocery: "Grocery",
  other_items: "Other Items",
};

const PAGE_SIZE = 6;
const MAX_PAGES = 4;

function DonatePage() {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["donations"],
    queryFn: ({ pageParam }) => fetchDonations(pageParam, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.pagination.hasMore ? last.pagination.page + 1 : undefined,
  });

  const pages = data?.pages ?? [];
  const donations = pages.flatMap((p) => p.data);
  const loading = isLoading;
  const pageCount = pages.length;
  const showCTA = !hasNextPage || pageCount >= MAX_PAGES;

  return (
    <>
      <PageHero
        eyebrow="Donate"
        title={<>Your support creates <span className="text-gradient">lasting change</span>.</>}
        subtitle="100% secure. Instant 80G tax-benefit receipt. Full transparency on every rupee spent."
      />

      <section className="py-16">
        <div className="container-page grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <div className="flex flex-col items-center rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)] md:p-10">
              <h2 className="text-2xl">Scan to donate</h2>
              <p className="mt-2 text-center text-muted-foreground">
                All donations are eligible for tax benefits under section 80G of the Income Tax Act, 1961.
              </p>
              <img
                src="/qr-code-2.png"
                alt="Donation QR code"
                loading="lazy"
                className="mt-6 w-72 rounded-2xl shadow-[var(--shadow-lift)]"
              />
              <p className="mt-4 text-sm text-muted-foreground">
                Any UPI app · Instant confirmation · Auto-generated 80G receipt
              </p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="grid gap-5">
              <img
                src="/small-kids-smiling-after-getting-donation.jpeg"
                alt="Smiling children after receiving donations"
                loading="lazy"
                width={1280}
                height={1280}
                className="rounded-3xl object-cover shadow-[var(--shadow-lift)]"
              />
              <div className="rounded-3xl border border-border bg-card p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Your impact</p>
                <ul className="mt-4 space-y-4">
                  {impact.map((i) => (
                    <li key={i.amt} className="flex items-start gap-4">
                      <span className="rounded-xl bg-[image:var(--gradient-warm)] px-3 py-1.5 text-sm font-bold text-primary-foreground">{i.amt}</span>
                      <p className="text-sm text-muted-foreground">{i.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-page">
          <Reveal>
            <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
              <h2 className="text-2xl">Recent donations</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Every contribution — monetary, books, clothes, or grocery — fuels our mission.
              </p>
              {loading ? (
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
                  ))}
                </div>
              ) : donations.length === 0 ? (
                <div className="mt-8 flex flex-col items-center py-10 text-center">
                  <p className="text-sm text-muted-foreground">No donations yet. Be the first to contribute!</p>
                </div>
              ) : (
                <>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {donations.map((d) => (
                      <div key={d.id} className="rounded-2xl border border-border bg-card p-5 card-lift">
                        <div className="flex items-start gap-3">
                          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                            {d.imageUrl ? (
                              <img src={d.imageUrl} alt="" className="size-10 rounded-xl object-cover" />
                            ) : (
                              <HelpingHand className="size-5" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold">{d.donor}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{d.date}</p>
                          </div>
                          {d.category === "money" && (
                            <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                              ₹{d.amount.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {d.purpose && (
                          <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">{d.purpose}</p>
                        )}
                        <span className="mt-2 inline-block rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {categoryLabel[d.category] || d.category}
                        </span>
                      </div>
                    ))}
                  </div>
                  {hasNextPage && (
                    <div className="mt-8 flex justify-center">
                      {showCTA ? (
                        <a
                          href="https://app.helpingshands.org"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-warm)] px-6 py-3 text-sm font-bold text-primary-foreground shadow transition-transform hover:-translate-y-0.5"
                        >
                          Create account to see more donations
                        </a>
                      ) : (
                        <button
                          onClick={() => fetchNextPage()}
                          disabled={isFetchingNextPage}
                          className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-warm)] px-6 py-3 text-sm font-bold text-primary-foreground shadow transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                        >
                          {isFetchingNextPage ? "Loading..." : "Show more"}
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

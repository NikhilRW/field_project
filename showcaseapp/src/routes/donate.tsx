import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import donateImg from "@/assets/donate.jpg";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate — Helping Hands · Samajik Seva Sanstha" },
      { name: "description", content: "Support Helping Hands. All donations are eligible for tax benefits under section 80G." },
      { property: "og:title", content: "Donate — Helping Hands" },
      { property: "og:url", content: "/donate" },
    ],
    links: [{ rel: "canonical", href: "/donate" }],
  }),
  component: DonatePage,
});

const amounts = [500, 1000, 2500, 5000, 10000, 25000];
const methods = ["UPI", "Credit Card", "Debit Card", "Net Banking"];

const impact = [
  { amt: "₹500", text: "One month of school supplies for a child" },
  { amt: "₹2,500", text: "Nutritious meals for a family of five for a month" },
  { amt: "₹10,000", text: "A full village health camp for 300+ people" },
];

function DonatePage() {
  const [amount, setAmount] = useState(1000);
  const [method, setMethod] = useState("UPI");
  return (
    <>
      <PageHero
        eyebrow="Donate"
        title={<>Your support creates <span className="text-gradient">lasting change</span>.</>}
        subtitle="100% secure. Instant 80G tax-benefit receipt. Full transparency on every rupee spent."
        imageLabel="smiling child holding new school materials"
      />

      <section className="py-16">
        <div className="container-page grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)] md:p-10">
              <h2 className="text-2xl">Choose an amount</h2>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {amounts.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAmount(a)}
                    className={`rounded-2xl border-2 py-4 text-center font-bold transition-all ${
                      amount === a
                        ? "border-primary bg-primary/10 text-primary shadow-[var(--shadow-soft)]"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    ₹{a.toLocaleString()}
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Custom amount</label>
                <div className="mt-2 flex overflow-hidden rounded-2xl border-2 border-border bg-card focus-within:border-primary">
                  <span className="grid place-items-center bg-primary/10 px-4 font-bold text-primary">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value) || 0)}
                    className="w-full bg-transparent px-4 py-3.5 text-base font-semibold outline-none"
                  />
                </div>
              </div>

              <h3 className="mt-8 text-lg">Payment method</h3>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {methods.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`rounded-xl border-2 px-4 py-3 text-sm font-bold transition-all ${
                      method === m ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-5 sm:flex-row">
                <div className="grid size-24 shrink-0 place-items-center rounded-xl bg-card" role="img" aria-label="Donation UPI QR code" data-image-placeholder="Donation UPI QR code">
                  <span className="text-[10px] font-bold text-muted-foreground text-center leading-tight">[INSERT<br/>QR CODE]</span>
                </div>
                <div>
                  <p className="text-sm font-bold">Scan to donate via UPI</p>
                  <p className="mt-1 text-xs text-muted-foreground">Any UPI app · Instant confirmation · Auto-generated 80G receipt</p>
                </div>
              </div>

              <button className="btn-primary mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-bold">
                Donate ₹{amount.toLocaleString()} securely <ArrowRight className="size-4" />
              </button>
              <p className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 text-success" /> All donations are eligible for tax benefits under applicable laws (Sec. 80G).
              </p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="grid gap-5">
              <img
                src={donateImg}
                alt="Smiling child holding new school supplies"
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
            <ImagePlaceholder label="beneficiaries with donated supplies" aspect="aspect-[21/9]" />
          </Reveal>
        </div>
      </section>
    </>
  );
}

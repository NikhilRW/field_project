import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Compass,
  Eye,
  Gift,
  Handshake,
  HeartHandshake,
  Leaf,
  Lightbulb,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Target,
  Users,
  Utensils,
} from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/site/Reveal";
import { Counter } from "@/components/site/Counter";

export const Route = createFileRoute("/")({
  component: Home,
});

const stats = [
  { label: "Meals Served", value: 200 , suffix: "+" },
  { label: "Children Helped", value: 150, suffix: "+" },
  { label: "Medical Beneficiaries", value: 100, suffix: "+" },
  { label: "Community Programs", value: 30, suffix: "+" },
  { label: "Volunteers", value: 5, suffix: "+" },
  { label: "Years of Service", value: 8, suffix: "+" },
];

const trustBadges = [
  "Registered NGO",
  "Transparent Donations",
  "1000+ Lives Impacted",
];

const values = [
  { icon: Eye, label: "Transparency" },
  { icon: HeartHandshake, label: "Compassion" },
  { icon: ShieldCheck, label: "Integrity" },
  { icon: Users, label: "Community" },
  { icon: Lightbulb, label: "Innovation" },
];

const milestones = [
  { year: "2018", text: "Founded with 5 volunteers" },
  { year: "2020", text: "1,000 meals distributed" },
  { year: "2021", text: "First free health camp" },
  { year: "2022", text: "Women's self-help initiative" },
  { year: "2025", text: "Present in 50+ communities" },
];

const whyUs = [
  {
    icon: ShieldCheck,
    title: "Transparent Fund Utilization",
    text: "Every rupee is tracked and reported. See exactly where your donation goes.",
  },
  {
    icon: Users,
    title: "Community Driven",
    text: "Programs designed with local leaders around real, on-ground needs.",
  },
  {
    icon: HeartHandshake,
    title: "Experienced Volunteers",
    text: "10+ dedicated professionals and community champions across maharashtra.",
  },
  {
    icon: Target,
    title: "Long-term Impact",
    text: "Sustainable impact and help — not one-time aid.",
  },
];

const programs = [
  {
    icon: BookOpen,
    title: "Education Drives",
    text: "School kits for children in underserved areas.",
    imageLabel: "volunteers teaching children in a rural classroom",
  },
  {
    icon: Stethoscope,
    title: "Health Camps",
    text: "Free medical aids",
    imageLabel: "doctors conducting a free community health checkup",
  },
  {
    icon: Utensils,
    title: "Food Distribution",
    text: "Nutritious meals and monthly ration kits for vulnerable households.",
    imageLabel: "NGO volunteers distributing food packets to families",
  },
  {
    icon: Sparkles,
    title: "Women Empowerment",
    text: "Giving gifts to women in need",
    imageLabel: "women's tailoring and skill development workshop",
  },
  {
    icon: ShoppingBag,
    title: "Bag Distribution",
    text: "School bags and stationery for underprivileged students.",
    imageLabel: "bag distribution program with school administration",
  },
  {
    icon: Gift,
    title: "Toy donation drives",
    text: "Bringing joy to children through toy donations.",
    imageLabel: "toy donation drive event",
  },
];

const impactSteps = [
  { icon: Target, title: "Identify Need" },
  { icon: Compass, title: "Plan Initiative" },
  { icon: Users, title: "Community Participation" },
  { icon: Handshake, title: "Implementation" },
  { icon: Eye, title: "Monitoring" },
  { icon: Leaf, title: "Long-term Support" },
];

const galleryLabels = [
  { label: "children studying in a village classroom", aspect: "aspect-[3/4]" },
  { label: "women's tailoring training workshop", aspect: "aspect-square" },
  { label: "community kitchen preparing meals", aspect: "aspect-[4/5]" },
  { label: "volunteers cleaning a public park", aspect: "aspect-[3/4]" },
  { label: "free rural health camp in progress", aspect: "aspect-square" },
  { label: "tree plantation event with students", aspect: "aspect-[4/5]" },
  { label: "smiling elderly beneficiary receiving support", aspect: "aspect-[3/4]" },
  { label: "NGO annual gathering group photo", aspect: "aspect-square" },
  { label: "all students with bags and founder", aspect: "aspect-[4/5]" },
  { label: "all students with bags group photo", aspect: "aspect-square" },
  { label: "founder giving biscuits to children", aspect: "aspect-[3/4]" },
  { label: "kids going from stairs happy after receiving bags", aspect: "aspect-[4/5]" },
  { label: "kids smiling after receiving bags", aspect: "aspect-square" },
  { label: "small kids holding bags", aspect: "aspect-[3/4]" },
  { label: "volunteer giving biscuits", aspect: "aspect-[4/5]" },
];

const homeStaticImages = [
  "/small-kids-photo.jpeg",
  "/volunteers-giving-saree-to-womes-on-deviji-puja.jpeg",
  "/utensils-donation.jpeg",
  "/ngo-volunteer-donating-water.jpeg",
  "/image-beneficiary-getting-water.jpeg",
  "/school-kids-photo.jpeg",
  "/elders-getting-donation.jpeg",
  "/very-large-portrait-of-multiple-donations.jpeg",
  "/shools_kids_new_photos.jpeg",
  "/school_bag_distribution_new_photo.jpeg",
  "/toy_distribution.jpeg",
  "/bag_donation_to_students.jpeg",
  "/all-students-with-bags-and-founder-in-photo.jpeg",
  "/all-students-with-bags.jpeg",
  "/founder-giving-biscuits-to-children.jpeg",
  "/kids-going-from-stairs-being-happy-after-getting-bags.jpeg",
  "/kids-smilling-after-receiving-bags.jpeg",
  "/small-kids-holding-bags.jpeg",
  "/volunteer-giving-biscuits.jpeg",
];

const testimonials = [
  {
    name: "Anita Sharma",
    role: "Beneficiary, Palghar",
    quote:
      "My daughter is the first in our family to attend school. The Helping Hands scholarship changed our future.",
  },
  {
    name: "Rohan Mehta",
    role: "Volunteer, Mumbai",
    quote:
      "In two years I've helped run 30+ health camps. The team's discipline and heart make every weekend meaningful.",
  },
  {
    name: "Priya Iyer",
    role: "Monthly Donor",
    quote:
      "I get transparent quarterly reports on exactly where my contribution went. That trust is priceless.",
  },
];

const faqs = [
  {
    q: "How can I donate?",
    a: "You can donate online via UPI for more — write to us for details.",
  },
  {
    q: "Can I volunteer?",
    a: "Absolutely. Come to our office or reach out via our contact form. We have opportunities for both short-term and long-term volunteers.",
  },
  {
    q: "Is my donation tax deductible?",
    a: "Yes. Helping Hands is registered under section 80G, so donations made by Indian taxpayers are eligible for tax exemption. A receipt is given in hand instantly.",
  },
];



function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen w-full overflow-hidden">
        <img
          src="/landscape-photo-all-people-in-view.jpeg"
          alt="NGO volunteers and community members together"
          className="absolute inset-0 size-full object-cover"
          width={1920}
          height={1280}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, oklch(0 0 0 / 0.35) 0%, oklch(0 0 0 / 0.75) 100%)" }}
        />
        <div className="absolute -left-24 top-32 size-72 rounded-full bg-primary/25 blur-3xl animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute -right-24 bottom-32 size-96 rounded-full bg-secondary/25 blur-3xl animate-[float_10s_ease-in-out_infinite]" />

        <div className="container-page relative flex min-h-screen flex-col justify-center pt-32 pb-24 text-white">
          <Reveal>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur">
              <Sparkles className="size-3.5 text-primary-glow" />
              Samajik Seva Sanstha · Since 2018
            </span>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-6  max-w-4xl text-5xl leading-[1.15] sm:text-6xl md:text-7xl lg:text-8xl">
              Helping Hands
              <br />
              <span className="text-gradient">Changing Lives.</span>
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-5 text-lg font-semibold text-white/90 md:text-xl">
              Empowering Communities Through Action
            </p>
          </Reveal>
          <Reveal delay={280}>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
              Together, we create opportunities, spread hope, and transform lives through
              education, healthcare, food support, and sustainable community development.
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/donate"
                className="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-bold"
              >
                Donate Now <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                Explore Our Work
              </Link>
            </div>
          </Reveal>
          <Reveal delay={440}>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white/85">
              {trustBadges.map((b) => (
                <li key={b} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary-glow" />
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>

          <a
            href="#stats"
            aria-label="Scroll to statistics"
            className="mx-auto mt-14 grid size-10 place-items-center rounded-full border border-white/25 text-white/80 animate-bounce"
          >
            <ChevronDown className="size-5" />
          </a>
        </div>
      </section>

      {/* STATS */}
      <section id="stats" className="relative -mt-20 z-10">
        <div className="container-page">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-lift)] md:p-10">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 60}>
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-gradient md:text-4xl">
                      <Counter end={s.value} suffix={s.suffix} />
                    </p>
                    <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground md:text-sm">
                      {s.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24">
        <div className="container-page grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-primary">
                About Us
              </span>
              <h2 className="mt-3 text-4xl md:text-5xl">
                Eight years of standing beside{" "}
                <span className="text-gradient">the people who need it most</span>
              </h2>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
                  <div className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Target className="size-5" />
                  </div>
                  <h3 className="text-lg">Our Mission</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Enable dignified access to education, healthcare, nutrition and livelihoods for
                    every underserved family.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
                  <div className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                    <Eye className="size-5" />
                  </div>
                  <h3 className="text-lg">Our Vision</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    A future where geography and income no longer decide opportunity.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Core values
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {values.map((v) => (
                    <span
                      key={v.label}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold"
                    >
                      <v.icon className="size-4 text-primary" />
                      {v.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-10">
                {/* TODO: think it is right. */}
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Our Journey
                </p>
                <ol className="mt-4 relative border-l-2 border-primary/25 pl-6">
                  {milestones.map((m) => (
                    <li key={m.year} className="mb-4 last:mb-0">
                      <span className="absolute -left-[9px] mt-1.5 grid size-4 place-items-center rounded-full bg-[image:var(--gradient-warm)]" />
                      <p className="text-sm font-bold text-secondary">{m.year}</p>
                      <p className="text-sm text-muted-foreground">{m.text}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="relative">
              <div className="image-zoom rounded-3xl shadow-[var(--shadow-lift)]">
                <img
                  src="/very-large-portrait-of-multiple-donations.jpeg"
                  alt="NGO volunteers with community members"
                  loading="lazy"
                  width={1280}
                  height={1024}
                  className="size-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-lift)] sm:block">
                <p className="text-3xl font-extrabold text-gradient">8+</p>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Years of service
                </p>
              </div>
              <div className="absolute -top-6 -right-6 hidden rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-lift)] sm:block">
                <p className="text-3xl font-extrabold text-secondary">50+</p>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Communities served
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-[image:var(--gradient-soft)] py-24">
        <div className="container-page">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-primary">
                Why choose us
              </span>
              <h2 className="mt-3 text-4xl md:text-5xl">Trusted by donors. Loved by communities.</h2>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((w, i) => (
              <Reveal key={w.title} delay={i * 100}>
                <div className="card-lift h-full rounded-2xl border border-border bg-card p-7">
                  <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-[image:var(--gradient-warm)] text-primary-foreground shadow-[var(--shadow-lift)]">
                    <w.icon className="size-6" />
                  </div>
                  <h3 className="text-lg">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section id="programs" className="py-24">
        <div className="container-page">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div className="max-w-xl">
                <span className="text-sm font-bold uppercase tracking-widest text-primary">
                  Programs & Services
                </span>
                <h2 className="mt-3 text-4xl md:text-5xl">
                  Six areas of focus. <span className="text-gradient">One purpose.</span>
                </h2>
              </div>
              <Link
                to="/programs"
                className="inline-flex items-center gap-1 text-sm font-bold text-secondary hover:gap-2 transition-all"
              >
                View all programs <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {programs.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <article className="card-lift group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card">
                  <div className="image-zoom">
                    <img
                      src={[
                        "/school-kids-photo.jpeg",
                        "/image-beneficiary-getting-water.jpeg",
                        "/again-village-people-getting-donation.jpeg",
                        "/volunteers-giving-saree-to-womes-on-deviji-puja.jpeg",
                        "/bag_donation_to_students.jpeg",
                        "/toy_distribution.jpeg",
                      ][i]}
                      alt={p.title}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <div className="mb-3 inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <p.icon className="size-5" />
                    </div>
                    <h3 className="text-xl">{p.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {p.text}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT PROCESS */}
      <section className="bg-secondary/5 py-24">
        <div className="container-page">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-primary">
                Our impact process
              </span>
              <h2 className="mt-3 text-4xl md:text-5xl">How change actually happens</h2>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {impactSteps.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <div className="relative">
                  <div className="card-lift rounded-2xl border border-border bg-card p-5 text-center">
                    <div className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-[image:var(--gradient-warm)] text-primary-foreground shadow-[var(--shadow-lift)]">
                      <s.icon className="size-5" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Step {i + 1}
                    </p>
                    <p className="mt-1 text-sm font-bold">{s.title}</p>
                  </div>
                  {i < impactSteps.length - 1 && (
                    <ArrowRight className="absolute -right-3 top-1/2 hidden size-5 -translate-y-1/2 text-primary/60 lg:block" />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIVITIES */}
      {/* PARALLAX CAMPAIGN BANNER */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url("/ngo-founder-donating-village-peoples.jpeg")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
        <div className="container-page relative py-28 text-white md:py-36">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur">
              Featured campaign
            </span>
            <h2 className="mt-5 max-w-2xl text-4xl leading-tight md:text-6xl">
              Every contribution changes a life.
            </h2>
            <p className="mt-4 max-w-xl text-white/80">
              ₹500 provides a month of school supplies for one child. ₹5,000 funds a full health
              camp for a village. Your support compounds — every day, in every corner.
            </p>
            <Link
              to="/donate"
              className="btn-primary mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-bold"
            >
              Support our mission <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-24">
        <div className="container-page">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-primary">
                Impact gallery
              </span>
              <h2 className="mt-3 text-4xl md:text-5xl">Moments from the field</h2>
            </div>
          </Reveal>
          <div className="mt-12 columns-2 gap-4 md:columns-3 lg:columns-4 [column-fill:_balance]">
            {galleryLabels.map((g, i) => (
              <Reveal key={i} delay={(i % 4) * 80}>
                <div className="mb-4 break-inside-avoid image-zoom card-lift overflow-hidden rounded-2xl border border-border bg-card">
                  <img
                    src={homeStaticImages[i % homeStaticImages.length]}
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

      {/* TESTIMONIALS */}
      {/* <section className="bg-secondary/5 py-24">
        <div className="container-page">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-primary">
                Voices of impact
              </span>
              <h2 className="mt-3 text-4xl md:text-5xl">In their own words</h2>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="relative mx-auto mt-12 max-w-3xl">
              <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)] md:p-12">
                <Quote className="size-10 text-primary/40" />
                <p className="mt-4 text-lg leading-relaxed text-foreground md:text-xl">
                  “{testimonials[testIndex].quote}”
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="grid size-12 place-items-center rounded-full bg-[image:var(--gradient-warm)] text-lg font-bold text-primary-foreground">
                    {testimonials[testIndex].name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold">{testimonials[testIndex].name}</p>
                    <p className="text-sm text-muted-foreground">{testimonials[testIndex].role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestIndex(i)}
                    aria-label={`Show testimonial ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      i === testIndex ? "w-8 bg-primary" : "w-2 bg-primary/25"
                    }`}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section> */}

      {/* TRANSPARENCY */}
      {/* DONATION SECTION */}
      <section id="donate" className="relative overflow-hidden bg-[image:var(--gradient-soft)] py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="relative">
              <img
                src="/small-kids-smiling-after-getting-donation.jpeg"
                alt="Smiling children after receiving donations"
                loading="lazy"
                width={1280}
                height={1280}
                className="rounded-3xl object-cover shadow-[var(--shadow-lift)]"
              />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-sm font-bold uppercase tracking-widest text-primary">
                Donate
              </span>
              <h2 className="mt-3 text-center text-4xl md:text-5xl lg:text-left">
                Your support creates <span className="text-gradient">lasting change</span>
              </h2>
              <p className="mt-4 text-center text-muted-foreground lg:text-left">
                Scan the QR code to donate. All donations are eligible for tax benefits under
                section 80G of the Income Tax Act, 1961.
              </p>
              <img
                src="/qr-code-2.png"
                alt="Donation QR code"
                loading="lazy"
                className="mt-6 mx-auto w-64 rounded-2xl shadow-[var(--shadow-lift)]"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* VOLUNTEER */}
      {/* NEWSLETTER */}
      <section className="py-16">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-[image:var(--gradient-warm)] p-10 text-primary-foreground shadow-[var(--shadow-lift)] md:p-14">
            <div className="absolute -right-16 -top-16 size-64 rounded-full bg-white/15 blur-2xl" />
            <div className="absolute -bottom-16 -left-16 size-64 rounded-full bg-secondary/40 blur-2xl" />
            <div className="relative grid gap-6 lg:grid-cols-2 lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl text-white md:text-4xl">Stay connected</h2>
                <p className="mt-2 max-w-md text-white/85">
                  Receive updates activities, volunteer opportunities and impact stories
                  — straight to your app account.
                </p>
              </div>
              <a
                href="https://app.helpingshands.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit justify-self-end rounded-full bg-white px-8 py-3.5 text-sm font-bold text-primary shadow transition-transform hover:-translate-y-0.5"
              >
                Create account
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-primary">
                Frequently asked
              </span>
              <h2 className="mt-3 text-4xl md:text-5xl">Answers to what donors and volunteers ask most</h2>
              <p className="mt-4 text-muted-foreground">
                Don't see your question? Reach out via our{" "}
                <Link to="/contact" className="font-bold text-primary underline underline-offset-4">
                  contact page
                </Link>
                .
              </p>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
              {faqs.map((f, i) => (
                <div key={f.q}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={openFaq === i}
                  >
                    <span className="font-bold">{f.q}</span>
                    <ChevronDown
                      className={`size-5 shrink-0 text-primary transition-transform ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground animate-[fade-up_.4s_ease]">
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT PREVIEW */}
      <section id="contact" className="pb-24">
        <div className="container-page grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <img
              src="/ngo-pamplet.jpeg"
              alt="Helping Hands community center"
              loading="lazy"
              className="h-full w-full object-cover rounded-3xl"
            />
          </Reveal>
          <Reveal delay={150}>
            <div className="grid gap-3">
              <div className="rounded-2xl border border-border bg-card p-5 card-lift">
                <div className="mb-1 inline-flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="size-4" />
                </div>
                <p className="font-bold">Office</p>
                <p className="text-sm text-muted-foreground">
                  Near Manali Palace, Kalyan West, Maharashtra
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-5 card-lift">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone</p>
                  <p className="mt-1 font-bold">+91 88982 35366</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5 card-lift">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</p>
                  <p className="mt-1 font-bold text-xs">sachindilipraut@gmail.com</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5 card-lift sm:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Office Hours</p>
                  <p className="mt-1 font-bold">Mon – Sat · 5:00 PM – 9:00 PM IST</p>
                </div>
              </div>
              <Link
                to="/contact"
                className="btn-primary mt-2 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold"
              >
                Get in touch <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

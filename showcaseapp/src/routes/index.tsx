import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock,
  Compass,
  Eye,
  Handshake,
  HeartHandshake,
  Leaf,
  Lightbulb,
  MapPin,
  Quote,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Target,
  Users,
  Utensils,
} from "lucide-react";
import { useState } from "react";

import heroImg from "@/assets/hero.jpg";
import aboutImg from "@/assets/about.jpg";
import campaignImg from "@/assets/campaign.jpg";
import donateImg from "@/assets/donate.jpg";
import { Reveal } from "@/components/site/Reveal";
import { Counter } from "@/components/site/Counter";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";

export const Route = createFileRoute("/")({
  component: Home,
});

const stats = [
  { label: "Meals Served", value: 12500, suffix: "+" },
  { label: "Children Educated", value: 2300, suffix: "+" },
  { label: "Medical Beneficiaries", value: 4100, suffix: "+" },
  { label: "Community Programs", value: 450, suffix: "+" },
  { label: "Volunteers", value: 800, suffix: "+" },
  { label: "Years of Service", value: 15, suffix: "+" },
];

const trustBadges = [
  "Registered NGO",
  "80G Tax Benefits",
  "Transparent Donations",
  "5000+ Lives Impacted",
];

const values = [
  { icon: Eye, label: "Transparency" },
  { icon: HeartHandshake, label: "Compassion" },
  { icon: ShieldCheck, label: "Integrity" },
  { icon: Users, label: "Community" },
  { icon: Lightbulb, label: "Innovation" },
];

const milestones = [
  { year: "2010", text: "Founded with 5 volunteers" },
  { year: "2013", text: "1,000 meals distributed" },
  { year: "2015", text: "First free health camp" },
  { year: "2018", text: "Women's self-help initiative" },
  { year: "2021", text: "Education scholarship program" },
  { year: "2024", text: "Present in 120+ communities" },
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
    text: "800+ dedicated professionals and community champions across India.",
  },
  {
    icon: Target,
    title: "Long-term Impact",
    text: "Sustainable systems and skills — not one-time aid.",
  },
];

const programs = [
  {
    icon: BookOpen,
    title: "Education Drives",
    text: "Scholarships, learning centers and school kits for children in underserved areas.",
    imageLabel: "volunteers teaching children in a rural classroom",
  },
  {
    icon: Stethoscope,
    title: "Health Camps",
    text: "Free medical checkups, vaccinations and specialist consultations for families.",
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
    text: "Skill workshops, self-help groups and micro-enterprise support for women.",
    imageLabel: "women's tailoring and skill development workshop",
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

const activities = [
  {
    title: "School Supplies Distribution",
    date: "May 18, 2026",
    location: "Palghar, Maharashtra",
    category: "Education",
    text: "Delivered notebooks, uniforms and school bags to 420 children across three villages.",
    imageLabel: "children receiving school supply kits",
  },
  {
    title: "Tree Plantation Drive",
    date: "Jun 5, 2026",
    location: "Nashik, Maharashtra",
    category: "Environment",
    text: "1,200 native saplings planted with 150 student volunteers on World Environment Day.",
    imageLabel: "students and volunteers planting saplings",
  },
  {
    title: "Free Medical Camp",
    date: "Jun 14, 2026",
    location: "Panvel, Maharashtra",
    category: "Health",
    text: "General physicians, pediatricians and eye specialists served 380 patients in a single day.",
    imageLabel: "doctors examining patients at a rural health camp",
  },
  {
    title: "Winter Blanket Distribution",
    date: "Dec 22, 2025",
    location: "Delhi NCR",
    category: "Relief",
    text: "800 warm blankets distributed to families and elderly living on the streets.",
    imageLabel: "volunteers distributing blankets on a winter night",
  },
  {
    title: "Blood Donation Camp",
    date: "Apr 7, 2026",
    location: "Mumbai, Maharashtra",
    category: "Health",
    text: "112 units of blood collected in partnership with the state blood bank.",
    imageLabel: "blood donation drive with volunteers and donors",
  },
  {
    title: "Women's Skill Workshop",
    date: "Mar 12, 2026",
    location: "Pune, Maharashtra",
    category: "Empowerment",
    text: "60 women completed a 4-week tailoring & entrepreneurship program.",
    imageLabel: "women learning tailoring skills",
  },
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
    a: "You can donate online via UPI, credit/debit card or net banking on our secure Donate page. Cheques and bank transfers are also accepted — write to us for details.",
  },
  {
    q: "Can I volunteer?",
    a: "Absolutely. Fill out the volunteer form below with your skills and availability, and our team will match you to an active program within 3-5 days.",
  },
  {
    q: "Is my donation tax deductible?",
    a: "Yes. Helping Hands is registered under section 80G, so donations made by Indian taxpayers are eligible for tax exemption. A receipt is emailed instantly.",
  },
  {
    q: "How are funds utilized?",
    a: "Approximately 82% of funds go directly to programs, 12% to on-ground operations and 6% to administration. We publish an annual audited report.",
  },
  {
    q: "How do I organize a community drive?",
    a: "Reach out through our contact form or email hello@helpinghands.org. We help with planning, volunteer mobilization and logistics.",
  },
];

const donationAmounts = [500, 1000, 2500, 5000];

function Home() {
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [testIndex, setTestIndex] = useState(0);
  const [activityFilter, setActivityFilter] = useState<string>("All");

  const filters = ["All", "Education", "Health", "Environment", "Relief", "Empowerment"];
  const visibleActivities =
    activityFilter === "All"
      ? activities
      : activities.filter((a) => a.category === activityFilter);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen w-full overflow-hidden">
        {/* [INSERT IMAGE: smiling NGO volunteers helping children in a rural village] */}
        <img
          src={heroImg}
          alt="Volunteers and families sharing a moment of hope in a rural village"
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
              Samajik Seva Sanstha · Since 2010
            </span>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-6 max-w-4xl text-5xl leading-[1.05] sm:text-6xl md:text-7xl lg:text-8xl">
              Helping Hands.
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
                Fifteen years of standing beside{" "}
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
              {/* [INSERT IMAGE: NGO volunteers interacting with local families] */}
              <div className="image-zoom rounded-3xl shadow-[var(--shadow-lift)]">
                <img
                  src={aboutImg}
                  alt="NGO volunteers interacting warmly with local families"
                  loading="lazy"
                  width={1280}
                  height={1024}
                  className="size-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-lift)] sm:block">
                <p className="text-3xl font-extrabold text-gradient">15+</p>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Years of service
                </p>
              </div>
              <div className="absolute -top-6 -right-6 hidden rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-lift)] sm:block">
                <p className="text-3xl font-extrabold text-secondary">120+</p>
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
                    {/* [INSERT IMAGE: {p.imageLabel}] */}
                    <ImagePlaceholder label={p.imageLabel} aspect="aspect-[16/10]" />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <div className="mb-3 inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <p.icon className="size-5" />
                    </div>
                    <h3 className="text-xl">{p.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {p.text}
                    </p>
                    <button className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-bold text-primary transition-all hover:gap-2">
                      Learn more <ArrowRight className="size-4" />
                    </button>
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
      <section id="activities" className="py-24">
        <div className="container-page">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-xl">
                <span className="text-sm font-bold uppercase tracking-widest text-primary">
                  Recent activities
                </span>
                <h2 className="mt-3 text-4xl md:text-5xl">On the ground, every week</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActivityFilter(f)}
                    className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                      activityFilter === f
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleActivities.map((a, i) => (
              <Reveal key={a.title} delay={i * 60}>
                <article className="card-lift group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card">
                  <div className="image-zoom relative">
                    {/* [INSERT IMAGE: {a.imageLabel}] */}
                    <ImagePlaceholder label={a.imageLabel} aspect="aspect-[16/10]" />
                    <span className="absolute left-4 top-4 rounded-full bg-[image:var(--gradient-warm)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow">
                      {a.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {a.date}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        {a.location}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg leading-tight">{a.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {a.text}
                    </p>
                    <Link
                      to="/activities"
                      className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-bold text-primary transition-all hover:gap-2"
                    >
                      Read more <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PARALLAX CAMPAIGN BANNER */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${campaignImg})` }}
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
                  {/* [INSERT IMAGE: {g.label}] */}
                  <ImagePlaceholder label={g.label} aspect={g.aspect} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-secondary/5 py-24">
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
      </section>

      {/* TRANSPARENCY */}
      <section className="py-24">
        <div className="container-page">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-primary">
                Annual transparency
              </span>
              <h2 className="mt-3 text-4xl md:text-5xl">Every rupee. Accounted for.</h2>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { label: "Funds Raised", value: "₹1.8 Cr", pct: 92 },
              { label: "Projects Completed", value: "450+", pct: 88 },
              { label: "Communities Served", value: "120+", pct: 76 },
            ].map((c, i) => (
              <Reveal key={c.label} delay={i * 100}>
                <div className="card-lift rounded-3xl border border-border bg-card p-8">
                  <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    {c.label}
                  </p>
                  <p className="mt-2 text-5xl font-extrabold text-gradient">{c.value}</p>
                  <div className="mt-6 h-2.5 w-full overflow-hidden rounded-full bg-primary/10">
                    <div
                      className="h-full rounded-full bg-[image:var(--gradient-warm)]"
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {c.pct}% of annual target achieved
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DONATION SECTION */}
      <section id="donate" className="relative overflow-hidden bg-[image:var(--gradient-soft)] py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="relative">
              {/* [INSERT IMAGE: smiling child receiving educational materials] */}
              <img
                src={donateImg}
                alt="Smiling child receiving school supplies"
                loading="lazy"
                width={1280}
                height={1280}
                className="rounded-3xl object-cover shadow-[var(--shadow-lift)]"
              />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-primary">
                Donate
              </span>
              <h2 className="mt-3 text-4xl md:text-5xl">
                Your support creates <span className="text-gradient">lasting change</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Choose an amount to contribute. All donations are eligible for tax benefits under
                section 80G of the Income Tax Act, 1961.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {donationAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setSelectedAmount(amt)}
                    className={`rounded-2xl border-2 py-4 text-center font-bold transition-all ${
                      selectedAmount === amt
                        ? "border-primary bg-primary/10 text-primary shadow-[var(--shadow-soft)]"
                        : "border-border bg-card text-foreground hover:border-primary/40"
                    }`}
                  >
                    ₹{amt.toLocaleString()}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Or enter custom amount
                </label>
                <div className="mt-2 flex overflow-hidden rounded-2xl border-2 border-border bg-card focus-within:border-primary">
                  <span className="grid place-items-center bg-primary/10 px-4 font-bold text-primary">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={selectedAmount}
                    onChange={(e) => setSelectedAmount(Number(e.target.value) || 0)}
                    className="w-full bg-transparent px-4 py-3.5 text-base font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {["UPI", "Credit Card", "Debit Card", "Net Banking", "QR Code"].map((m) => (
                  <span
                    key={m}
                    className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground"
                  >
                    {m}
                  </span>
                ))}
              </div>

              <button className="btn-primary mt-6 inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold">
                Donate ₹{selectedAmount.toLocaleString()} now <ArrowRight className="size-4" />
              </button>

              <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 text-success" />
                Secure payment · Instant 80G receipt · 100% of funds go to programs & operations
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* VOLUNTEER */}
      <section id="volunteer" className="py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-primary">
                Volunteer
              </span>
              <h2 className="mt-3 text-4xl md:text-5xl">Give a few hours. Change a lifetime.</h2>
              <form
                className="mt-8 grid gap-4 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you for volunteering! We'll be in touch shortly.");
                }}
              >
                <Field label="Full name" name="name" required />
                <Field label="Email" name="email" type="email" required />
                <Field label="Phone" name="phone" type="tel" />
                <Field label="Availability" name="availability" placeholder="e.g. Weekends" />
                <div className="sm:col-span-2">
                  <Field label="Your skills" name="skills" placeholder="Teaching, medical, design..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    className="mt-2 w-full rounded-2xl border-2 border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
                    placeholder="Tell us a bit about why you'd like to volunteer..."
                  />
                </div>
                <button className="btn-primary sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-bold">
                  <Send className="size-4" /> Submit application
                </button>
              </form>
            </div>
          </Reveal>
          <Reveal delay={150}>
            {/* [INSERT IMAGE: volunteers working together] */}
            <div className="image-zoom rounded-3xl">
              <ImagePlaceholder label="volunteers working together on a community project" aspect="aspect-[4/5]" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-16">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-[image:var(--gradient-warm)] p-10 text-primary-foreground shadow-[var(--shadow-lift)] md:p-14">
            <div className="absolute -right-16 -top-16 size-64 rounded-full bg-white/15 blur-2xl" />
            <div className="absolute -bottom-16 -left-16 size-64 rounded-full bg-secondary/40 blur-2xl" />
            <div className="relative grid gap-6 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl text-white md:text-4xl">Stay connected</h2>
                <p className="mt-2 max-w-md text-white/85">
                  Receive updates on campaigns, events, volunteer opportunities and impact stories
                  — straight to your inbox.
                </p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Subscribed! Thank you.");
                }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="w-full rounded-full border-2 border-white/30 bg-white/15 px-5 py-3.5 text-sm font-medium text-white placeholder:text-white/70 outline-none focus:border-white"
                />
                <button className="rounded-full bg-white px-6 py-3.5 text-sm font-bold text-primary shadow transition-transform hover:-translate-y-0.5">
                  Subscribe
                </button>
              </form>
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
            {/* [INSERT IMAGE: office building] */}
            <ImagePlaceholder label="Helping Hands community center building" aspect="aspect-[16/10]" className="h-full" />
          </Reveal>
          <Reveal delay={150}>
            <div className="grid gap-3">
              <div className="rounded-2xl border border-border bg-card p-5 card-lift">
                <div className="mb-1 inline-flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="size-4" />
                </div>
                <p className="font-bold">Office</p>
                <p className="text-sm text-muted-foreground">
                  112 Community Lane, Andheri West, Mumbai 400058
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-5 card-lift">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone</p>
                  <p className="mt-1 font-bold">+91 98200 12345</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5 card-lift">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</p>
                  <p className="mt-1 font-bold">hello@helpinghands.org</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5 card-lift sm:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Office Hours</p>
                  <p className="mt-1 font-bold">Mon – Sat · 10:00 AM – 6:30 PM IST</p>
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

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border-2 border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}

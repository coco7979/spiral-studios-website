import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import mark from "@/assets/spiral-mark.png"
import wordmark from "@/assets/spiral-wordmark.png"
import tlSignature from "@/assets/tamala/signature.jpg"
import tlOperation from "@/assets/tamala/operation.jpg"
import tlMagic from "@/assets/tamala/magic.jpg"
import tlBuffet from "@/assets/tamala/buffet.jpg"
import tlFoodPlate from "@/assets/tamala/food-2.jpg"
import tlFoodDumpling from "@/assets/tamala/food-6.jpg"
import tlFoodSkewer from "@/assets/tamala/food-10.jpg"
import tlFoodSpread from "@/assets/tamala/food-13.jpg"
import tlAmbRooftop from "@/assets/tamala/amb-21.jpg"
import tlAmbBuffet from "@/assets/tamala/amb-9.jpg"
import tlAmbNight from "@/assets/tamala/amb-26.jpg"

const img = (id: string, w = 1600, h = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`

const IMG = {
  burger: "1568901346375-23c9450c58cd",
  momos: "1625220194771-7ebdea0b70b9",
  wrap: "1626700051175-6818013e1d4f",
  pasta: "1621996346565-e3dbc646d9a9",
  drink: "1551024709-8f23befc6f87",
  fries: "1573080496219-bb080dd4f877",
  outlet: "1517248135467-4c7edcad34c4",
  camera: "1492691527719-9d1e07e534b4",
  friends: "1529543544282-ea669407fca3",
  dessert: "1563805042-7684c019e1cb",
}

/* ---------- motion ---------- */

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties

function useMotion() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach(
          (e) =>
            e.isIntersecting &&
            (e.target.classList.add("is-in"), io.unobserve(e.target)),
        ),
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    )
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el))
    let raf = 0
    const tick = () => {
      raf = 0
      const vh = window.innerHeight
      document
        .querySelectorAll<HTMLElement>("[data-parallax]")
        .forEach((el) => {
          const r = el.parentElement!.getBoundingClientRect()
          if (r.bottom < 0 || r.top > vh) return
          const p = (r.top + r.height / 2 - vh / 2) / vh
          el.style.setProperty("--py", `${(p * -40).toFixed(1)}px`)
        })
    }
    const onScroll = () => raf || (raf = requestAnimationFrame(tick))
    tick()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => (
      io.disconnect(), window.removeEventListener("scroll", onScroll)
    )
  }, [])
}

function CountUp({ value }: { value: string }) {
  const target = Number(value.replace(/,/g, ""))
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState(0)
  useEffect(() => {
    const el = ref.current!
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        if (matchMedia("(prefers-reduced-motion: reduce)").matches)
          return setN(target)
        const t0 = performance.now()
        const step = (t: number) => {
          const k = Math.min(1, (t - t0) / 1400)
          setN(Math.round((target * (1 - Math.pow(1 - k, 4))) / 500) * 500)
          if (k < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [target])
  return (
    <span ref={ref} className="tabular-nums">
      {n.toLocaleString("en-IN")}
    </span>
  )
}

/* ---------- primitives ---------- */

function Page({
  n,
  label,
  dark,
  children,
  className = "",
}: {
  n: string
  label: string
  dark?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <section
      id={`p${n}`}
      className={`relative px-6 py-20 md:px-14 lg:px-20 lg:py-28 ${
        dark ? "bg-ink text-paper" : "bg-paper text-ink"
      } ${className}`}
    >
      <div
        data-reveal
        className={`mb-14 flex items-center justify-between border-b pb-4 font-mono text-[11px] uppercase tracking-[0.2em] ${
          dark ? "border-paper/15 text-paper/50" : "border-ink/15 text-ink/50"
        }`}
      >
        <span>
          {n} — {label}
        </span>
        <span className="hidden sm:inline">
          ZORKO × Spiral Studios · Yamuna City
        </span>
      </div>
      {children}
    </section>
  )
}

function Pill({
  children,
  tone = "line",
}: {
  children: ReactNode
  tone?: "line" | "chili" | "mustard"
}) {
  const t = {
    line: "border border-current/30",
    chili: "bg-chili text-paper",
    mustard: "bg-mustard text-ink",
  }[tone]
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${t}`}
    >
      {children}
    </span>
  )
}

function H2({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h2
      data-reveal
      className={`font-display text-[clamp(3rem,7.5vw,7.5rem)] font-extrabold uppercase leading-[0.86] tracking-tight ${className}`}
    >
      {children}
    </h2>
  )
}

function Photo({
  id,
  alt,
  className = "",
  w,
  h,
}: {
  id: string
  alt: string
  className?: string
  w?: number
  h?: number
}) {
  return (
    <div data-reveal="img" className={`overflow-hidden bg-ink-2 ${className}`}>
      <img
        data-parallax
        src={img(id, w, h)}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </div>
  )
}

function Shot({
  src,
  alt,
  className = "",
  cap,
  delay = 0,
}: {
  src: string
  alt: string
  className?: string
  cap?: string
  delay?: number
}) {
  return (
    <figure
      data-reveal="img"
      style={d(delay)}
      className={`group relative overflow-hidden bg-ink-2 ${className}`}
    >
      <img
        data-parallax
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover"
      />
      {cap && (
        <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/85 to-transparent p-4 pt-10 font-mono text-[10px] uppercase tracking-[0.18em] text-paper opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          {cap}
        </figcaption>
      )}
    </figure>
  )
}

/* ---------- data ---------- */

type Pkg = {
  key: string
  name: string
  price: string
  role: string
  pitch: string
  note: string
  hi: [string, string, string][]
  groups: { t: string items: string[] }[]
}

const PACKAGES: Pkg[] = [
  {
    key: "trial",
    name: "Trial",
    price: "15,000",
    role: "Test the collaboration",
    pitch:
      "For testing the collaboration and establishing the outlet's content direction.",
    hi: [
      ["04", "Reels", "Short-form 9:16 social content"],
      ["04", "Static / Carousel", "Product & offer creatives"],
      ["4–6", "Stories", "Everyday communication"],
      ["02", "Meta Creatives", "Ad-ready variations"],
    ],
    note: "Designed as a low-risk starting point to establish content quality, workflow and creative direction.",
    groups: [
      {
        t: "Content Production",
        items: [
          "1 on-location production session",
          "Up to 3 hours",
          "Food + outlet + product footage",
        ],
      },
      {
        t: "Short-form Content",
        items: [
          "4 short-form Reels",
          "Platform-ready 9:16",
          "Hooks + basic CTA direction",
        ],
      },
      { t: "Static Content", items: ["4 custom static / carousel creatives"] },
      { t: "Stories", items: ["4–6 story creatives"] },
      {
        t: "Strategy",
        items: [
          "Monthly content planning",
          "Basic trend research",
          "Content theme planning",
        ],
      },
      {
        t: "Meta Creative Support",
        items: ["2 advertising creative variations"],
      },
      {
        t: "Reporting",
        items: ["Basic monthly content / performance summary"],
      },
    ],
  },
  {
    key: "starter",
    name: "Starter",
    price: "25,000",
    role: "Consistent monthly content",
    pitch:
      "For ZORKO outlets looking to build consistent local visibility and a stronger monthly content presence.",
    hi: [
      ["06", "Reels", "Trend, product & promotional"],
      ["06", "Static / Carousel", "Product, offer & engagement creatives"],
      ["8–10", "Stories", "Social engagement & communication"],
      ["03", "Meta Creatives", "Awareness, offer & local reach"],
    ],
    note: "One production session → multiple content outputs → one consistent monthly visual system.",
    groups: [
      {
        t: "Content Production",
        items: [
          "1 dedicated on-location session",
          "Up to 5 hours",
          "Directed food + product + ambience + outlet footage",
          "Multiple concepts captured per session",
        ],
      },
      {
        t: "Short-form Video",
        items: [
          "6 professionally edited Reels",
          "Trend-led + product-led + promotional",
          "9:16 social format",
          "Hooks + CTA direction",
        ],
      },
      {
        t: "Static / Carousel",
        items: [
          "6 custom-designed creatives",
          "Product / offer / informational / engagement",
        ],
      },
      {
        t: "Stories",
        items: [
          "8–10 story creatives",
          "Offer / engagement / product / announcement",
        ],
      },
      {
        t: "Content Strategy",
        items: [
          "Monthly content calendar",
          "Trend research",
          "Competitor / content observation",
          "Content pillar planning",
        ],
      },
      {
        t: "Meta Ad Creative",
        items: [
          "3 Meta-ready creative variations",
          "Different hooks / visual treatments",
          "For awareness / offer / local reach",
        ],
      },
      {
        t: "Social Support",
        items: [
          "Caption and CTA direction",
          "Instagram / Facebook scheduling support",
        ],
      },
      {
        t: "Reporting",
        items: [
          "Monthly performance summary",
          "Key content observations",
          "Next month's recommendations",
        ],
      },
    ],
  },
  {
    key: "growth",
    name: "Growth",
    price: "35,000",
    role: "Volume + campaign support",
    pitch:
      "For outlets ready to increase content volume, campaign frequency and local reach.",
    hi: [
      ["08", "Reels", "Five format types each month"],
      ["08", "Static / Carousel", "Custom creatives"],
      ["12–15", "Stories", "High-frequency communication"],
      ["4–6", "Meta Creatives", "With creative testing concepts"],
    ],
    note: "Built for consistency, experimentation and higher creative output.",
    groups: [
      {
        t: "Content Production",
        items: [
          "2 on-location production sessions",
          "Up to 4 hours per session",
          "Food + product + ambience + outlet + promotional",
        ],
      },
      {
        t: "Short-form Video",
        items: [
          "8 professionally edited Reels",
          "Product · trend · offer · engagement · local-awareness formats",
        ],
      },
      { t: "Static / Carousel", items: ["8 custom creatives"] },
      { t: "Stories", items: ["12–15 story creatives"] },
      {
        t: "Content Strategy",
        items: [
          "Advanced monthly content calendar",
          "Trend research + competitor observation",
          "Campaign / content themes",
          "Offer communication planning",
        ],
      },
      {
        t: "Meta Ad Creative System",
        items: [
          "4–6 ad creative variations",
          "Creative testing concepts",
          "Awareness + offer + engagement formats",
        ],
      },
      {
        t: "Meta Support",
        items: [
          "Basic campaign setup / creative support",
          "Creative optimisation recommendations",
          "Monthly campaign observations",
        ],
      },
      {
        t: "Reporting",
        items: [
          "Monthly performance report",
          "Content insights + creative recommendations",
          "Next-month content direction",
        ],
      },
    ],
  },
]

const ROWS: [string, string, string, string][] = [
  ["Content production sessions", "1", "1", "2"],
  ["Shoot duration", "Up to 3 hrs", "Up to 5 hrs", "Up to 4 hrs × 2"],
  ["Reels", "4", "6", "8"],
  ["Static / carousel creatives", "4", "6", "8"],
  ["Stories", "4–6", "8–10", "12–15"],
  ["Content strategy", "Monthly plan", "Monthly calendar", "Advanced calendar"],
  ["Trend research", "Basic", "✓", "✓ + competitor"],
  ["Meta ad creatives", "2", "3", "4–6"],
  ["Social support", "—", "✓", "✓"],
  ["Reporting", "Summary", "Summary + insights", "Full report"],
  ["Campaign support", "—", "—", "✓"],
]

/* ---------- pages ---------- */

function Cover() {
  return (
    <section
      id="p00"
      className="relative flex min-h-screen flex-col overflow-hidden bg-ink text-paper"
    >
      <img
        src={img(IMG.burger, 2400, 1600)}
        alt="Close-up of a stacked vegetarian burger with melted cheese"
        className="kenburns absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
      <div className="hero-in relative flex items-center justify-between px-6 pt-8 md:px-14 lg:px-20">
        <img
          src={wordmark}
          alt="Spiral Studios"
          className="h-12 w-auto md:h-14"
        />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/70">
          Proposal · 2026
        </span>
      </div>
      <div className="relative mt-auto px-6 pb-14 md:px-14 lg:px-20">
        <div className="hero-in mb-6 flex flex-wrap gap-2" style={d(300)}>
          <Pill tone="mustard">Yamuna City · Greater Noida</Pill>
          <Pill>100% Vegetarian</Pill>
        </div>
        <h1
          style={d(450)}
          className="hero-in font-display text-[clamp(4rem,14vw,14rem)] font-black uppercase leading-[0.8] tracking-tight"
        >
          Zorko <span className="text-chili">×</span>
          <br />
          Spiral Studios
        </h1>
        <div
          className="hero-in mt-10 grid gap-6 border-t border-paper/20 pt-6 md:grid-cols-12"
          style={d(750)}
        >
          <p className="font-display text-3xl font-bold uppercase md:col-span-5">
            Local Content & Social Growth Proposal
          </p>
          <p className="max-w-md text-paper/75 md:col-span-4 md:col-start-9">
            Building local awareness through strategy, storytelling &
            high-impact content.
          </p>
        </div>
      </div>
    </section>
  )
}

function Why() {
  const pillars = [
    ["Be Seen", "Build consistent local visibility."],
    [
      "Look Good",
      "Showcase food, ambience and offers through high-quality visual content.",
    ],
    [
      "Stay Relevant",
      "Use trends, short-form video and culturally relevant content.",
    ],
    [
      "Drive Action",
      "Create Meta-ready creatives designed around awareness, offers and customer intent.",
    ],
  ]
  return (
    <Page n="01" label="Why this collaboration">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch">
        <div className="flex flex-col lg:col-span-7">
          <H2>
            From a food outlet to a{" "}
            <span className="text-chili">local favourite.</span>
          </H2>
          <p
            data-reveal
            style={d(120)}
            className="mt-8 max-w-xl text-lg leading-relaxed text-ink/75"
          >
            ZORKO already brings variety and value — burgers, wraps, momos,
            pasta, shakes and combos, all 100% vegetarian. The opportunity in
            Yamuna City is making sure nearby students, residents, families and
            young customers <em>see it, crave it and choose it.</em>
          </p>
          <ol className="mt-10 grid grid-cols-2 gap-px bg-ink/15 sm:grid-cols-4 lg:mt-auto">
            {["Local awareness", "Content", "Engagement", "Store visits"].map(
              (f, i) => (
                <li
                  key={f}
                  data-reveal
                  style={d(200 + i * 90)}
                  className={`relative p-4 ${
                    i === 3 ? "bg-ink text-paper" : "bg-paper-2"
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] ${
                      i === 3 ? "text-mustard" : "text-chili"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <div className="mt-2 font-display text-xl font-extrabold uppercase leading-none">
                    {f}
                  </div>
                  {i < 3 && (
                    <span className="absolute right-3 top-3 hidden text-ink/30 sm:block">
                      →
                    </span>
                  )}
                </li>
              ),
            )}
          </ol>
        </div>
        <Photo
          id={IMG.momos}
          alt="Steaming plate of vegetarian momos"
          className="aspect-[4/3] lg:col-span-5 lg:aspect-auto lg:min-h-[420px]"
          w={1000}
          h={1100}
        />
      </div>
      <div
        data-reveal
        className="mt-10 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45"
      >
        <span className="h-px flex-1 bg-ink/15" />
        How we get there
        <span className="h-px flex-1 bg-ink/15" />
      </div>
      <div className="mt-6 grid border-t border-ink/15 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map(([t, desc], i) => (
          <div
            key={t}
            data-reveal
            style={d(i * 110)}
            className="border-b border-ink/15 py-8 pr-6 sm:[&:nth-child(odd)]:border-r lg:border-r lg:last:border-r-0 lg:pl-6 lg:first:pl-0"
          >
            <div className="font-mono text-xs text-chili">0{i + 1}</div>
            <h3 className="mt-3 font-display text-4xl font-extrabold uppercase">
              {t}
            </h3>
            <p className="mt-3 text-ink/70">{desc}</p>
          </div>
        ))}
      </div>
      <p
        data-reveal
        className="mt-12 max-w-3xl border-l-4 border-mustard pl-6 text-xl font-semibold leading-snug"
      >
        Our focus is not simply posting content. It is building a repeatable
        local content system for the outlet.
      </p>
    </Page>
  )
}

function Approach() {
  const steps = [
    [
      "Strategy",
      "Audience, trends, offers, content themes and monthly planning.",
      "Himani",
    ],
    [
      "Production",
      "Directed food photography + videography at the outlet.",
      "Harsh · Aryan",
    ],
    [
      "Editing",
      "Reels, graphics, hooks, captions, motion and platform-ready formats.",
      "Aryan · Neelansh",
    ],
    [
      "Distribution",
      "Instagram/Facebook content + Meta-ready advertising creatives + performance review.",
      "Team",
    ],
  ]
  const team = [
    [
      "Aryan",
      "Creative Director / Video Editor",
      "Creative direction, shoot direction, editing, motion & quality control.",
    ],
    [
      "Harsh",
      "DOP / Videographer / Camera",
      "Food & product videography, framing, lighting and on-location production.",
    ],
    [
      "Himani",
      "Content & Strategy",
      "Trend research, content ideas, campaign concepts and the monthly calendar.",
    ],
    [
      "Neelansh",
      "UI UX / Graphic Design Support",
      "Static creatives, carousels and promotional graphics.",
    ],
  ]
  return (
    <Page n="02" label="Our approach" dark>
      <H2>
        One team.
        <br />
        <span className="text-mustard">Four moves.</span>
      </H2>
      <div className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
        <div className="absolute left-0 right-0 top-[22px] hidden h-px bg-paper/20 md:block" />
        {steps.map(([t, desc, who], i) => (
          <div key={t} data-reveal style={d(i * 140)} className="relative">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-full font-mono text-sm ${
                i === 1 ? "bg-chili text-paper" : "bg-paper text-ink"
              }`}
            >
              0{i + 1}
            </div>
            <h3 className="mt-6 font-display text-4xl font-extrabold uppercase">
              {t}
            </h3>
            <p className="mt-3 text-paper/70">{desc}</p>
            <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-mustard">
              {who}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-24 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Pill>The studio</Pill>
          <p className="mt-6 font-display text-4xl font-bold uppercase leading-none">
            A focused creative studio with a hands-on production team.
          </p>
          <p className="mt-5 text-paper/60">
            Strategy, shooting, design and editing are handled internally — no
            hand-offs, no outsourcing.
          </p>
        </div>
        <div className="grid gap-px bg-paper/15 sm:grid-cols-2 lg:col-span-8">
          {team.map(([n, r, desc], i) => (
            <div
              key={n}
              data-reveal
              style={d(i * 90)}
              className="bg-ink p-7 transition-colors duration-500 hover:bg-ink-2"
            >
              <div className="font-display text-3xl font-extrabold uppercase">
                {n}
              </div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-chili">
                {r}
              </div>
              <p className="mt-4 text-sm text-paper/65">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Page>
  )
}

function Pillars() {
  const p: [string, string, string][] = [
    [
      "Product",
      "Hero food shots, close-ups, texture, preparation.",
      IMG.burger,
    ],
    ["Offers", "Combos, pricing, limited-time offers.", IMG.fries],
    [
      "Experience",
      "Outlet ambience, customer experience, dining moments.",
      IMG.outlet,
    ],
    ["Trend", "Trend-led Reels and culturally relevant formats.", IMG.drink],
    ["People", "Team, behind-the-scenes, human moments.", IMG.friends],
    [
      "Local",
      "Yamuna City / Greater Noida relevance, nearby audience and local discovery.",
      IMG.wrap,
    ],
  ]
  return (
    <Page n="06" label="Content system for ZORKO">
      <div className="grid items-end gap-6 lg:grid-cols-12">
        <H2 className="lg:col-span-8">
          What we can build <span className="text-chili">for ZORKO</span>
        </H2>
        <p className="text-ink/70 lg:col-span-4">
          Six pillars, rotated monthly, so every post has a job — and the feed
          never repeats itself.
        </p>
      </div>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {p.map(([t, desc, id], i) => (
          <article
            key={t}
            data-reveal
            style={d((i % 3) * 120)}
            className={`group relative overflow-hidden bg-ink text-paper ${
              i === 0 ? "lg:row-span-2" : ""
            }`}
          >
            <img
              src={img(id, 900, i === 0 ? 1400 : 700)}
              alt={`${t} content example`}
              loading="lazy"
              className="h-full min-h-72 w-full object-cover opacity-80 transition duration-[1400ms] ease-out group-hover:scale-[1.06] group-hover:opacity-65"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
            <div className="absolute bottom-0 p-6">
              <div className="font-mono text-[11px] text-mustard">
                P.0{i + 1}
              </div>
              <h3 className="font-display text-5xl font-black uppercase leading-none">
                {t}
              </h3>
              <p className="mt-2 max-w-xs text-sm text-paper/80">{desc}</p>
            </div>
          </article>
        ))}
      </div>
    </Page>
  )
}

/* ---------- selected work: Tamala Leaf ---------- */

type Clip = {
  id: string
  title: string
  tag: string
  poster?: string
  ratio: "v" | "h"
  desc: string
}

const CLIPS: Record<string, Clip> = {
  signature: {
    id: "1Ke5ycedgwEC4pUB5C8i6UaRLae70UHSZ",
    title: "Signature dish's reel",
    tag: "Product",
    poster: tlSignature,
    ratio: "v",
    desc: "Hands-on preparation, close-up texture and process.",
  },
  operation: {
    id: "1RQRSnF8bvH0ctNhsGqbKKynkuQ8fmiHw",
    title: "Operation reel",
    tag: "People · BTS",
    poster: tlOperation,
    ratio: "v",
    desc: "The kitchen team, framed as the heroes of the dish.",
  },
  magic: {
    id: "1oer5u-rIOYSpeLo9Q4NerGNvE8b8zdDL",
    title: "Magic reel",
    tag: "Trend · Ambience",
    poster: tlMagic,
    ratio: "v",
    desc: "Platform-native format set inside the dining room.",
  },
  buffet: {
    id: "1SVomUYlWa9VlFeIXzhxa6kpXim-ya_0X",
    title: "Buffet launch reel",
    tag: "Promotional",
    poster: tlBuffet,
    ratio: "h",
    desc: '"Your favourite flavours, now unlimited."',
  },
}

const IG_POSTS = [
  ["reel", "DblAO59wNS3", "Reel 01"],
  ["reel", "DcYi2lgx0KM", "Reel 02"],
  ["p", "DbvgoW_mYm2", "Post 03"],
  ["p", "Db-w9c1GYyK", "Post 04"],
  ["p", "DbsxmN9vVuc", "Post 05"],
  ["p", "Dbnn6YrGfIa", "Post 06"],
] as const

function PlayIcon({ big }: { big?: boolean }) {
  return (
    <span
      className={`flex items-center justify-center rounded-full bg-paper/95 text-ink shadow-xl transition duration-500 group-hover:scale-110 group-hover:bg-mustard ${
        big ? "h-20 w-20" : "h-14 w-14"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`${
          big ? "h-7 w-7" : "h-5 w-5"
        } translate-x-0.5 fill-current`}
        aria-hidden
      >
        <path d="M7 4.5v15l12-7.5-12-7.5Z" />
      </svg>
    </span>
  )
}

function ClipCard({
  c,
  onPlay,
  className = "",
  big,
}: {
  c: Clip
  onPlay: (c: Clip) => void
  className?: string
  big?: boolean
}) {
  return (
    <button
      type="button"
      onClick={() => onPlay(c)}
      data-reveal="img"
      className={`group relative block w-full overflow-hidden bg-ink-2 text-left text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mustard ${
        c.ratio === "v" ? "aspect-[9/16]" : "aspect-video"
      } ${className}`}
      aria-label={`Play ${c.title}`}
    >
      {c.poster ? (
        <img
          src={c.poster}
          alt={`${c.title} — Tamala Leaf, frame`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_40%,#2a221e,#141110_70%)]">
          <img src={mark} alt="" className="h-20 w-auto opacity-20" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-ink/20 transition-opacity duration-500 group-hover:opacity-80" />
      <div className="absolute left-4 top-4">
        <Pill tone="mustard">{c.tag}</Pill>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <PlayIcon big={big} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="font-display text-2xl font-extrabold uppercase leading-none md:text-3xl">
          {c.title}
        </div>
        <p className="mt-2 max-h-0 overflow-hidden text-sm text-paper/80 opacity-0 transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100">
          {c.desc}
        </p>
      </div>
    </button>
  )
}

function VideoModal({
  clip,
  onClose,
}: {
  clip: Clip | null
  onClose: () => void
}) {
  useEffect(() => {
    if (!clip) return
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", k)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", k)
      document.body.style.overflow = ""
    }
  }, [clip, onClose])
  if (!clip) return null
  const v = clip.ratio === "v"
  return (
    <div
      role="dialog"
      aria-modal
      aria-label={clip.title}
      className="modal-in fixed inset-0 z-[100] flex items-center justify-center bg-ink/92 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="flex max-h-full w-full flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="mb-3 flex w-full max-w-5xl items-center justify-between text-paper"
          style={v ? { maxWidth: "min(420px, 90vw)" } : undefined}
        >
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-mustard">
              Tamala Leaf · {clip.tag}
            </div>
            <div className="font-display text-2xl font-extrabold uppercase">
              {clip.title}
            </div>
          </div>
          <button
            onClick={onClose}
            className="lift rounded-full border border-paper/30 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] hover:bg-paper hover:text-ink"
          >
            Close ✕
          </button>
        </div>
        <div
          className={`w-full overflow-hidden bg-black ${
            v ? "aspect-[9/16]" : "aspect-video max-w-5xl"
          }`}
          style={
            v ? { maxWidth: "min(420px, 90vw)", maxHeight: "78vh" } : undefined
          }
        >
          <iframe
            src={`https://drive.google.com/file/d/${clip.id}/preview`}
            title={clip.title}
            allow="autoplay; fullscreen"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  )
}

function IgEmbed({
  kind,
  code,
  label,
  i,
}: {
  kind: string
  code: string
  label: string
  i: number
}) {
  const [on, setOn] = useState(false)
  const href = `https://www.instagram.com/${kind}/${code}/`
  return (
    <figure
      data-reveal
      style={d((i % 3) * 100)}
      className="flex flex-col border border-paper/15 bg-ink-2"
    >
      <div className="flex items-center justify-between border-b border-paper/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-full bg-gradient-to-br from-mustard to-chili p-[1.5px]">
            <span className="block h-full w-full rounded-full bg-ink-2" />
          </span>
          <span className="text-xs font-semibold">tamalaleaf_</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-paper/45">
          {label}
        </span>
      </div>
      <div className="relative aspect-[4/5] bg-paper">
        {on ? (
          <iframe
            src={`${href}embed/`}
            title={`Tamala Leaf Instagram ${label}`}
            loading="lazy"
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            onClick={() => setOn(true)}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink-2 text-paper"
          >
            <PlayIcon />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/70 group-hover:text-mustard">
              Load {kind === "reel" ? "reel" : "post"} here
            </span>
          </button>
        )}
      </div>
      <figcaption className="flex justify-end px-4 py-3">
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[10px] uppercase tracking-[0.15em] text-paper/60 transition-colors hover:text-mustard"
        >
          View original on Instagram ↗
        </a>
      </figcaption>
    </figure>
  )
}

function HighlightPlayer() {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    const v = ref.current!
    const io = new IntersectionObserver(
      ([e]) => !e.isIntersecting && v.pause(),
      { threshold: 0.25 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])
  const play = () => {
    setStarted(true)
    ref.current!.play()
  }
  return (
    <div
      data-reveal="img"
      className="group relative mt-10 aspect-video overflow-hidden bg-black"
    >
      <video
        ref={ref}
        src="/media/tamala-highlight.mp4"
        poster="/media/tamala-highlight-poster.jpg"
        preload="none"
        playsInline
        controls={started}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="h-full w-full object-contain"
      />
      {!playing && (
        <button
          onClick={play}
          aria-label="Play Tamala Leaf highlight film"
          className={`absolute inset-0 flex flex-col items-center justify-center gap-4 transition-colors duration-500 ${
            started ? "bg-ink/30" : "bg-ink/45 hover:bg-ink/30"
          }`}
        >
          <PlayIcon big />
          {!started && (
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/85">
              Play film · 1:10
            </span>
          )}
        </button>
      )}
    </div>
  )
}

function Work() {
  const [clip, setClip] = useState<Clip | null>(null)
  const close = () => setClip(null)
  const created = [
    [
      "Product shoot",
      "Prep, plating and texture-first close-ups.",
      tlSignature,
    ],
    ["Ambience", "Lighting, interiors and the feel of the room.", tlBuffet],
    [
      "Short-form video",
      "Five edited videos — reels and a highlight film.",
      tlMagic,
    ],
    [
      "Social creatives",
      "Published content designed for the feed.",
      tlOperation,
    ],
  ] as const
  const flow = [
    "Content planning",
    "Directed shoot",
    "Product + ambience",
    "Video editing",
    "Graphic design",
    "Reels + social content",
    "Meta-ready creative",
  ]
  const bridge = [
    [
      "Product",
      "Hero food photography and appetising close-ups.",
      "Signature dish prep",
    ],
    [
      "Experience",
      "Outlet ambience, customers, staff and environment.",
      "Dining room & buffet",
    ],
    [
      "Content",
      "Reels, carousels, stories and promotional creatives.",
      "Reels + feed posts",
    ],
    [
      "Campaigns",
      "Meta-ready creative assets for local awareness and offers.",
      "Buffet launch promo",
    ],
  ]
  return (
    <>
      {/* hero */}
      <Page n="03" label="Selected work · Tamala Leaf">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div
              data-reveal
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-chili"
            >
              Selected work
            </div>
            <H2 className="mt-4">
              Tamala
              <br />
              Leaf
            </H2>
            <p
              data-reveal
              className="mt-4 font-display text-2xl font-bold uppercase text-ink/70"
            >
              Restaurant content & social media
            </p>
            <p
              data-reveal
              style={d(100)}
              className="mt-6 max-w-lg text-lg leading-relaxed text-ink/75"
            >
              A content-focused collaboration covering product visuals,
              ambience, short-form video and social media creatives — built to
              make the brand feel more consistent, appetising and engaging
              online.
            </p>
            <div
              data-reveal
              style={d(200)}
              className="mt-8 flex flex-wrap gap-2"
            >
              <Pill>Food</Pill>
              <Pill>Hospitality</Pill>
              <Pill>Social content</Pill>
            </div>
            <p
              data-reveal
              style={d(250)}
              className="mt-10 border-l-4 border-mustard pl-5 text-ink/70"
            >
              A glimpse into how we create, shoot and shape content for food &
              hospitality brands.{" "}
              <span className="font-semibold text-ink">
                Tap any frame to play.
              </span>
            </p>
          </div>
          <div className="grid grid-cols-5 gap-3 lg:col-span-6">
            <ClipCard
              c={CLIPS.signature}
              onPlay={setClip}
              className="col-span-3"
              big
            />
            <div className="col-span-2 flex flex-col gap-3">
              <ClipCard c={CLIPS.magic} onPlay={setClip} />
              <div
                data-reveal
                className="flex flex-1 flex-col justify-end bg-ink p-4 text-paper"
              >
                <div className="font-display text-4xl font-black leading-none">
                  05
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-mustard">
                  Videos delivered
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* what we created */}
        <div className="mt-24 flex flex-wrap items-end justify-between gap-4 border-t border-ink/15 pt-10">
          <h3
            data-reveal
            className="font-display text-5xl font-black uppercase leading-none md:text-6xl"
          >
            What we created
          </h3>
          <p data-reveal className="max-w-sm text-ink/60">
            Product, ambience and short-form content created by Spiral Studios.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {created.map(([t, desc, src], i) => (
            <article
              key={t}
              data-reveal
              style={d(i * 110)}
              className="group overflow-hidden bg-paper-2 transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(20,17,16,0.4)]"
            >
              <div className="aspect-[4/3] overflow-hidden bg-ink-2">
                <img
                  src={src}
                  alt={`${t} — Tamala Leaf`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-[1200ms] group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-5">
                <div className="font-mono text-[10px] text-chili">0{i + 1}</div>
                <h4 className="mt-1 font-display text-2xl font-extrabold uppercase">
                  {t}
                </h4>
                <p className="mt-1 text-sm text-ink/65">{desc}</p>
              </div>
            </article>
          ))}
        </div>
      </Page>

      {/* product + ambience + reels */}
      <Page n="04" label="Product · Ambience · Short-form" dark>
        {/* product storytelling */}
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="flex flex-col lg:col-span-4">
            <div
              data-reveal
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-mustard"
            >
              Product storytelling
            </div>
            <h3
              data-reveal
              className="mt-3 font-display text-5xl font-black uppercase leading-[0.9] md:text-6xl"
            >
              From the kitchen to the feed.
            </h3>
            <p data-reveal className="mt-5 text-paper/70">
              We focus on making food look desirable, tangible and
              platform-ready — from hero compositions to detailed close-ups and
              texture-driven frames.
            </p>
            <Shot
              src={tlFoodSkewer}
              alt="Glazed skewers on crispy straw, Tamala Leaf"
              cap="Hero composition"
              className="mt-8 hidden aspect-[4/5] lg:block lg:mt-auto"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 lg:col-span-8 lg:grid-cols-5">
            <Shot
              src={tlFoodDumpling}
              alt="Dumplings in golden broth, Tamala Leaf"
              cap="Texture & steam"
              className="col-span-2 aspect-[4/5] lg:col-span-3 lg:row-span-2 lg:aspect-auto"
            />
            <Shot
              src={tlFoodSpread}
              alt="Spread of dishes on a marble table, Tamala Leaf"
              cap="Table spread"
              delay={120}
              className="aspect-[4/5] lg:col-span-2"
            />
            <Shot
              src={tlFoodPlate}
              alt="Sauce being plated, with 'Art' typography overlay"
              cap="Detail + type"
              delay={240}
              className="aspect-[4/5] lg:col-span-2"
            />
            <Shot
              src={tlFoodSkewer}
              alt="Glazed skewers on crispy straw, Tamala Leaf"
              cap="Hero composition"
              className="col-span-2 aspect-[16/10] lg:hidden"
            />
          </div>
        </div>

        {/* kitchen → feed sequence */}
        <div className="mt-16 border-t border-paper/15 pt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h4
              data-reveal
              className="font-display text-3xl font-black uppercase md:text-4xl"
            >
              Production → Editing → Social content
            </h4>
            <p
              data-reveal
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/45"
            >
              Real frames · Tamala Leaf
            </p>
          </div>
          <ol className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              [
                "Raw product / food",
                tlSignature,
                "Hands-on preparation at the pass",
              ],
              [
                "Directed shoot",
                tlOperation,
                "Kitchen team framed on location",
              ],
              ["Edited content", tlFoodPlate, "Pacing, grading & typography"],
              ["Social-ready output", tlBuffet, "Copy-led promotional frame"],
            ].map(([t, src, desc], i) => (
              <li key={t} data-reveal style={d(i * 110)} className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-ink-2">
                  <img
                    src={src}
                    alt={t}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-[1200ms] group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-paper font-mono text-xs text-ink">
                    0{i + 1}
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <span className="font-display text-xl font-extrabold uppercase leading-none">
                    {t}
                  </span>
                  {i < 3 && (
                    <span className="hidden text-mustard lg:inline">→</span>
                  )}
                </div>
                <p className="mt-1 text-sm text-paper/55">{desc}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* reels */}
        <div className="mt-16 grid gap-8 border-t border-paper/15 pt-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div
              data-reveal
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-mustard"
            >
              Short-form content
            </div>
            <h3
              data-reveal
              className="mt-3 font-display text-5xl font-black uppercase leading-[0.9] md:text-6xl"
            >
              Designed for attention.
            </h3>
            <p data-reveal className="mt-5 text-paper/70">
              Built for the feed. Tap a reel to play it here.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-8">
            <ClipCard c={CLIPS.signature} onPlay={setClip} />
            <ClipCard c={CLIPS.operation} onPlay={setClip} />
            <ClipCard
              c={CLIPS.magic}
              onPlay={setClip}
              className="col-span-2 sm:col-span-1"
            />
          </div>
        </div>

        {/* ambience */}
        <div className="mt-16 grid gap-8 border-t border-paper/15 pt-10 lg:grid-cols-12">
          <div className="flex flex-col lg:col-span-4">
            <div
              data-reveal
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-mustard"
            >
              Ambience
            </div>
            <h3
              data-reveal
              className="mt-3 font-display text-5xl font-black uppercase leading-[0.9] md:text-6xl"
            >
              Beyond the plate.
            </h3>
            <p data-reveal className="mt-5 text-paper/70">
              A restaurant is more than its menu. We capture the atmosphere,
              details and experience that help customers understand what it
              feels like to be there.
            </p>
            <Shot
              src={tlAmbBuffet}
              alt="Rooftop buffet counter lit at dusk"
              cap="Buffet counter"
              className="mt-8 aspect-[16/10] lg:mt-auto"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
            <Shot
              src={tlAmbRooftop}
              alt="Rooftop dining with woven lamps at night, Tamala Leaf"
              cap="Rooftop · evening service"
              className="aspect-[16/9] sm:col-span-2"
            />
            <Shot
              src={tlAmbNight}
              alt="Guests dining on the rooftop at night"
              cap="Guests & atmosphere"
              delay={120}
              className="aspect-video"
            />
            <ClipCard c={CLIPS.buffet} onPlay={setClip} />
          </div>
        </div>
      </Page>

      {/* featured: highlight film */}
      <section
        id="p04b"
        className="bg-ink px-6 pb-20 text-paper md:px-14 lg:px-20 lg:pb-28"
      >
        <div className="border-t border-paper/15 pt-10">
          <div className="grid items-end gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div
                data-reveal
                className="font-mono text-[11px] uppercase tracking-[0.22em] text-mustard"
              >
                Featured work · Highlight film
              </div>
              <h3
                data-reveal
                className="mt-3 font-display text-[clamp(3rem,6vw,6rem)] font-black uppercase leading-[0.86]"
              >
                Tamala Leaf, <span className="text-chili">in motion.</span>
              </h3>
            </div>
            <p
              data-reveal
              className="text-paper/65 lg:col-span-4 lg:col-start-9"
            >
              Launch, people, rooftop and buffet — the collaboration cut into
              one 70-second film. Sound on.
            </p>
          </div>
          <HighlightPlayer />
        </div>
      </section>

      {/* production to platform */}
      <Page n="05" label="Social presence">
        <div className="grid items-end gap-6 lg:grid-cols-12">
          <H2 className="lg:col-span-8">
            From production <span className="text-chili">to platform.</span>
          </H2>
          <p data-reveal className="text-ink/70 lg:col-span-4">
            Our work doesn't stop at shooting — we create content designed to
            live naturally on social platforms. Six selected posts from
            @tamalaleaf_, loaded live from Instagram.
          </p>
        </div>
        <div className="mt-12 bg-ink p-4 text-paper sm:p-6 lg:p-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {IG_POSTS.map(([k, c, l], i) => (
              <IgEmbed key={c} kind={k} code={c} label={l} i={i} />
            ))}
          </div>
          <div className="mt-6 grid gap-3 border-t border-paper/10 pt-6 text-sm text-paper/70 md:grid-cols-2">
            <p>
              — Built a more consistent visual language across the social feed.
            </p>
            <p>
              — Created a stronger mix of product, ambience and short-form
              content.
            </p>
          </div>
        </div>

        {/* capability map */}
        <div className="mt-24">
          <h3
            data-reveal
            className="max-w-4xl font-display text-5xl font-black uppercase leading-[0.9] md:text-6xl"
          >
            From one shoot to a complete content system.
          </h3>
          <ol className="mt-10 grid gap-px bg-ink/15 sm:grid-cols-2 lg:grid-cols-7">
            {flow.map((f, i) => (
              <li
                key={f}
                data-reveal
                style={d(i * 80)}
                className={`group relative flex min-h-36 flex-col justify-between p-5 transition-colors duration-500 ${
                  i === flow.length - 1
                    ? "bg-chili text-paper"
                    : "bg-paper hover:bg-paper-2"
                }`}
              >
                <span
                  className={`font-mono text-[11px] ${
                    i === flow.length - 1 ? "text-mustard" : "text-chili"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-xl font-extrabold uppercase leading-tight">
                  {f}
                </span>
                {i < flow.length - 1 && (
                  <span className="absolute right-3 top-4 text-ink/30 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
          <p data-reveal className="mt-6 max-w-3xl text-lg font-semibold">
            One production session can become multiple platform-ready content
            assets when the shoot is planned around content from the beginning.
          </p>
        </div>

        {/* bridge to ZORKO */}
        <div className="mt-24 grid gap-10 bg-ink p-8 text-paper md:p-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-mustard">
              Tamala Leaf → ZORKO
            </div>
            <h3
              data-reveal
              className="mt-3 font-display text-5xl font-black uppercase leading-[0.9]"
            >
              How this translates to ZORKO.
            </h3>
            <p data-reveal className="mt-5 text-paper/70">
              The same production approach can be adapted for ZORKO — combining
              food-first visuals, outlet ambience, short-form storytelling and
              promotional content into one consistent content system.
            </p>
          </div>
          <div className="grid gap-px bg-paper/15 sm:grid-cols-2 lg:col-span-8">
            {bridge.map(([t, desc, proof], i) => (
              <div
                key={t}
                data-reveal
                style={d(i * 90)}
                className="bg-ink p-6 transition-colors duration-500 hover:bg-ink-2"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45">
                  Proven on: {proof}
                </div>
                <div className="mt-3 font-display text-3xl font-black uppercase text-mustard">
                  {t}
                </div>
                <p className="mt-2 text-sm text-paper/75">{desc}</p>
              </div>
            ))}
          </div>
          <p
            data-reveal
            className="border-t border-paper/15 pt-6 font-display text-2xl font-bold uppercase lg:col-span-12 md:text-3xl"
          >
            Different brand. Same production discipline.{" "}
            <span className="text-chili">Tailored creative direction.</span>
          </p>
        </div>
      </Page>
      <VideoModal clip={clip} onClose={close} />
    </>
  )
}

function PackageCard({ p, i }: { p: Pkg i: number }) {
  const rec = p.key === "starter"
  return (
    <article
      data-reveal
      style={d(i * 130)}
      className={`relative flex flex-col border p-8 transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:p-10 ${
        rec
          ? "border-chili bg-chili text-paper shadow-2xl shadow-chili/30 hover:-translate-y-2 hover:scale-[1.015] hover:border-mustard hover:shadow-[0_40px_80px_-20px_rgba(214,42,30,0.55)] lg:-my-8 lg:py-16"
          : "border-transparent bg-paper-2 text-ink hover:-translate-y-1.5 hover:scale-[1.01] hover:border-chili/40 hover:shadow-[0_30px_60px_-25px_rgba(20,17,16,0.35)]"
      }`}
    >
      {rec && (
        <div className="absolute right-8 top-8">
          <Pill tone="mustard">★ Recommended</Pill>
        </div>
      )}
      <div
        className={`font-mono text-[11px] uppercase tracking-[0.18em] ${
          rec ? "text-paper/80" : "text-ink/55"
        }`}
      >
        {p.role}
      </div>
      <h3 className="mt-3 font-display text-6xl font-black uppercase leading-none">
        {p.name}
      </h3>
      <div className="mt-6 flex items-baseline gap-2">
        <span className="font-display text-2xl font-bold">₹</span>
        <span className="font-display text-7xl font-black leading-none tracking-tight">
          <CountUp value={p.price} />
        </span>
        <span className={`text-sm ${rec ? "text-paper/80" : "text-ink/60"}`}>
          / month
        </span>
      </div>
      <p
        className={`mt-5 text-[15px] lg:min-h-[4.5rem] ${
          rec ? "text-paper/90" : "text-ink/75"
        }`}
      >
        {p.pitch}
      </p>
      <div
        className={`mt-6 grid grid-cols-2 gap-px ${
          rec ? "bg-paper/20" : "bg-ink/10"
        }`}
      >
        {p.hi.map(([q, l, desc]) => (
          <div key={l} className={`p-4 ${rec ? "bg-chili" : "bg-paper-2"}`}>
            <div className="font-display text-4xl font-black leading-none tabular-nums">
              {q}
            </div>
            <div
              className={`mt-1 font-mono text-[10px] uppercase tracking-[0.16em] ${
                rec ? "text-mustard" : "text-chili"
              }`}
            >
              {l}
            </div>
            <div
              className={`mt-1 text-xs leading-snug ${
                rec ? "text-paper/75" : "text-ink/60"
              }`}
            >
              {desc}
            </div>
          </div>
        ))}
      </div>
      <details className="group/d mt-6" open>
        <summary
          className={`flex cursor-pointer list-none items-center justify-between border-t py-4 font-mono text-[11px] uppercase tracking-[0.18em] ${
            rec ? "border-paper/25" : "border-ink/15"
          }`}
        >
          Full deliverables
          <span className="transition-transform duration-300 group-open/d:rotate-45">
            +
          </span>
        </summary>
        <div className="space-y-5">
          {p.groups.map((g) => (
            <div key={g.t}>
              <div
                className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
                  rec ? "text-mustard" : "text-chili"
                }`}
              >
                {g.t}
              </div>
              <ul className="mt-2 space-y-1 text-sm">
                {g.items.map((it) => (
                  <li key={it} className="flex gap-2">
                    <span className={rec ? "text-paper/60" : "text-ink/40"}>
                      —
                    </span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>
      <p
        className={`mt-auto pt-8 text-sm font-semibold italic ${
          rec ? "text-paper" : "text-ink/70"
        }`}
      >
        {p.note}
      </p>
    </article>
  )
}

function Packages() {
  return (
    <Page n="07" label="Package system">
      <div className="grid items-end gap-6 lg:grid-cols-12">
        <H2 className="lg:col-span-7">Three ways to build momentum.</H2>
        <p className="text-ink/70 lg:col-span-4 lg:col-start-9">
          Trial tests the collaboration. Starter builds consistent monthly
          content. Growth adds volume and campaign support.
        </p>
      </div>
      <div className="mt-20 grid gap-4 lg:grid-cols-3 lg:items-start">
        {PACKAGES.map((p, i) => (
          <PackageCard key={p.key} p={p} i={i} />
        ))}
      </div>
    </Page>
  )
}

function Compare() {
  const [hl, setHl] = useState(1)
  const cols = ["Trial", "Starter", "Growth"]
  return (
    <Page n="08" label="Package comparison" dark>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <H2>Side by side.</H2>
        <div className="flex gap-1 rounded-full border border-paper/20 p-1">
          {cols.map((c, i) => (
            <button
              key={c}
              onClick={() => setHl(i)}
              className={`lift rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition ${
                hl === i
                  ? "bg-paper text-ink"
                  : "text-paper/60 hover:text-paper"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div data-reveal className="mt-12 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-paper/25">
              <th className="py-5 font-mono text-[11px] font-normal uppercase tracking-[0.18em] text-paper/50">
                Deliverable
              </th>
              {cols.map((c, i) => (
                <th
                  key={c}
                  className={`w-[22%] px-4 py-5 transition ${
                    hl === i ? "bg-paper/[0.06]" : ""
                  }`}
                >
                  <div className="font-display text-3xl font-black uppercase">
                    {c}
                  </div>
                  <div className="font-mono text-[11px] text-paper/50">
                    ₹{PACKAGES[i].price} / mo
                  </div>
                  {i === 1 && (
                    <div className="mt-2">
                      <Pill tone="chili">Recommended</Pill>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr
                key={r[0]}
                className="border-b border-paper/10 transition-colors hover:bg-paper/[0.03]"
              >
                <td className="py-4 pr-4 text-paper/75">{r[0]}</td>
                {r.slice(1).map((v, i) => (
                  <td
                    key={i}
                    className={`px-4 py-4 font-display text-xl font-bold transition ${
                      hl === i ? "bg-paper/[0.06]" : ""
                    } ${
                      v === "—"
                        ? "text-paper/25"
                        : v.includes("✓")
                          ? "text-mustard"
                          : ""
                    }`}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  )
}

function Meta() {
  const uses = [
    "Awareness",
    "Local reach",
    "Offer promotion",
    "Product discovery",
    "Engagement",
    "Store visit intent",
  ]
  return (
    <Page n="09" label="Meta ad creative system">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <H2>
            Built for organic content.
            <br />
            <span className="text-chili">Ready for paid reach.</span>
          </H2>
          <p className="mt-8 max-w-lg text-lg text-ink/75">
            Every shoot is planned with paid distribution in mind. We create
            multiple creative formats — varied hooks, crops and visual
            treatments — that can be adapted across campaign objectives.
          </p>
          <p className="mt-4 font-semibold">
            Creative assets designed to support Meta campaigns.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {uses.map((u, i) => (
              <div
                key={u}
                data-reveal
                style={d(i * 70)}
                className="lift border border-ink/15 p-4 hover:border-chili hover:bg-chili hover:text-paper"
              >
                <div className="font-mono text-[10px] opacity-60">0{i + 1}</div>
                <div className="mt-1 font-display text-xl font-extrabold uppercase">
                  {u}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative lg:sticky lg:top-12 lg:col-span-5 lg:col-start-8 lg:self-start">
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-3">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
                9:16 · Reel / Story
              </div>
              <Photo
                id={IMG.pasta}
                alt="Creamy vegetarian pasta, vertical ad format"
                className="aspect-[9/16]"
                w={540}
                h={960}
              />
            </div>
            <div className="col-span-2 flex flex-col justify-end gap-3">
              <div>
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
                  4:5 · Feed
                </div>
                <Photo
                  id={IMG.drink}
                  alt="Chilled shake, feed ad format"
                  className="aspect-[4/5]"
                  w={480}
                  h={600}
                />
              </div>
              <div>
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
                  1:1 · Carousel
                </div>
                <Photo
                  id={IMG.dessert}
                  alt="Dessert, square carousel format"
                  className="aspect-square"
                  w={480}
                  h={480}
                />
              </div>
            </div>
          </div>
          <div className="mt-6 bg-ink p-5 text-sm text-paper">
            <span className="text-mustard">Note —</span> Meta media/ad spend is
            separate from the Spiral Studios service fee.
          </div>
        </div>
      </div>
    </Page>
  )
}

function Process() {
  const s = [
    ["Discover", "Understand outlet, audience, offers and priorities."],
    ["Plan", "Monthly content calendar + concepts."],
    ["Shoot", "Directed on-location production."],
    ["Edit", "Video + design + motion + captions."],
    ["Review", "Client approval and consolidated feedback."],
    ["Publish / Deploy", "Platform-ready content and Meta creatives."],
    ["Review", "Monthly performance observations."],
  ]
  const why = [
    [
      "One creative system",
      "Strategy, shoot, design and editing under one team.",
    ],
    [
      "Directed production",
      "We do not simply record. We plan what needs to be captured and why.",
    ],
    [
      "Content that has a purpose",
      "Every piece is designed around awareness, engagement, product discovery or action.",
    ],
    [
      "Local + brand-aware",
      "We combine the ZORKO brand identity with content relevant to the local Yamuna City audience.",
    ],
  ]
  return (
    <Page n="10" label="Process & why Spiral" dark>
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <H2 className="!text-[clamp(2.75rem,5.5vw,5.5rem)]">
            The monthly loop.
          </H2>
          <ol className="mt-10">
            {s.map(([t, desc], i) => (
              <li
                key={i}
                data-reveal
                style={d(i * 70)}
                className="group grid grid-cols-[3rem_1fr] border-t border-paper/15 py-4 last:border-b"
              >
                <span className="font-mono text-xs text-paper/40 transition-colors group-hover:text-mustard">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="font-display text-2xl font-extrabold uppercase transition-transform duration-500 group-hover:translate-x-2">
                    {t}
                  </div>
                  <div className="text-sm text-paper/60">{desc}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Photo
            id={IMG.camera}
            alt="Behind-the-scenes camera setup on a production shoot"
            className="aspect-[16/10]"
            w={1200}
            h={750}
          />
          <h3 className="mt-12 font-display text-5xl font-black uppercase">
            Why Spiral Studios
          </h3>
          <div className="mt-6 grid gap-px bg-paper/15 sm:grid-cols-2">
            {why.map(([t, desc]) => (
              <div
                key={t}
                className="bg-ink py-6 pr-6 sm:odd:pr-8 sm:even:pl-6"
              >
                <div className="font-display text-2xl font-extrabold uppercase text-mustard">
                  {t}
                </div>
                <p className="mt-2 text-sm text-paper/70">{desc}</p>
              </div>
            ))}
          </div>
          <blockquote
            data-reveal
            className="mt-10 font-display text-3xl font-bold uppercase leading-tight md:text-4xl"
          >
            “We build content that feels native to the platform —{" "}
            <span className="text-chili">
              not like advertising forced into a feed.
            </span>
            ”
          </blockquote>
        </div>
      </div>
    </Page>
  )
}

function Scope() {
  const inc = [
    "Creative direction",
    "On-location production within the agreed local area",
    "Editing",
    "Graphic design",
    "Content planning",
    "Standard revisions",
    "Platform-ready exports",
  ]
  const ex = [
    "Meta advertising spend",
    "Influencer fees",
    "Paid models / talent",
    "Professional makeup / styling",
    "Props or materials purchased for specific campaigns",
    "Large-scale production",
    "Paid location rentals",
    "Travel outside the agreed local area",
    "Food / product required specifically for production",
  ]
  return (
    <Page n="11" label="Scope & production notes">
      <H2 className="max-w-5xl">
        A clear scope creates <span className="text-chili">better work.</span>
      </H2>
      <div className="mt-16 grid gap-4 lg:grid-cols-2">
        <div data-reveal className="bg-ink p-8 text-paper lg:p-10">
          <Pill tone="mustard">Included in every package</Pill>
          <ul className="mt-8 space-y-3">
            {inc.map((i) => (
              <li
                key={i}
                className="flex gap-3 border-b border-paper/10 pb-3 text-lg"
              >
                <span className="text-mustard">✓</span>
                {i}
              </li>
            ))}
          </ul>
        </div>
        <div
          data-reveal
          style={d(150)}
          className="border border-ink/15 p-8 lg:p-10"
        >
          <Pill>Arranged separately, if required</Pill>
          <ul className="mt-8 space-y-3">
            {ex.map((i) => (
              <li
                key={i}
                className="flex gap-3 border-b border-ink/10 pb-3 text-ink/80"
              >
                <span className="text-ink/35">○</span>
                {i}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-10 grid gap-6 border-t border-ink/15 pt-8 md:grid-cols-12">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-chili md:col-span-3">
          Revisions
        </div>
        <p className="text-lg md:col-span-8">
          Each creative includes one consolidated round of standard revisions.
          Additional revisions or major concept changes may be quoted
          separately.
        </p>
      </div>
    </Page>
  )
}

function Investment() {
  return (
    <Page n="12" label="Investment" dark>
      <H2>Investment.</H2>
      <div className="mt-14 border-t border-paper/20">
        {PACKAGES.map((p, i) => {
          const rec = p.key === "starter"
          return (
            <div
              key={p.key}
              data-reveal
              style={d(i * 140)}
              className={`grid items-center gap-4 border-b border-paper/20 py-8 transition-[padding] duration-500 hover:py-10 md:grid-cols-12 ${
                rec ? "bg-chili -mx-6 px-6 md:-mx-8 md:px-8" : ""
              }`}
            >
              <div className="font-display text-5xl font-black uppercase md:col-span-3">
                {p.name}
              </div>
              <div
                className={`text-sm md:col-span-4 ${
                  rec ? "text-paper/90" : "text-paper/60"
                }`}
              >
                {p.role}
              </div>
              <div className="md:col-span-2">
                {rec && <Pill tone="mustard">Recommended</Pill>}
              </div>
              <div className="font-display text-6xl font-black tracking-tight md:col-span-3 md:text-right">
                ₹<CountUp value={p.price} />
                <span className="ml-2 font-sans text-sm font-normal opacity-70">
                  / month
                </span>
              </div>
            </div>
          )
        })}
      </div>
      <p className="mt-8 text-paper/70">
        Advertising spend is separate and paid directly to the advertising
        platform.
      </p>
    </Page>
  )
}

function Closing() {
  const contacts = [
    {
      k: "WhatsApp",
      v: "+91 78049 07742",
      href: "https://wa.me/917804907742",
      icon: (
        <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Zm4.6 12.6c-.2.6-1.1 1.1-1.6 1.2-.4 0-.9.2-3-.6-2.5-1-4.1-3.6-4.2-3.8-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.3.5-.3.6-.3h.5c.1 0 .4 0 .6.4l.8 1.9c.1.1.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.7-.1 1.3Z" />
      ),
    },
    {
      k: "Email",
      v: "Spiralstudios552026@gmail.com",
      href: "mailto:Spiralstudios552026@gmail.com?subject=ZORKO%20Yamuna%20City%20%C3%97%20Spiral%20Studios",
      icon: (
        <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Zm2 .9V17h14V7.4l-7 4.9-7-4.9ZM6.6 7 12 10.8 17.4 7H6.6Z" />
      ),
    },
  ]
  return (
    <section
      id="p13"
      className="relative flex min-h-screen flex-col overflow-hidden bg-ink text-paper"
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={img(IMG.wrap, 2400, 1600)}
          alt="Loaded vegetarian wrap, close-up"
          className="kenburns h-full w-full object-cover opacity-40"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30" />
      <div className="relative flex flex-1 flex-col justify-center px-6 py-20 md:px-14 lg:px-20">
        <h2
          data-reveal
          className="max-w-5xl font-display text-[clamp(3.5rem,10vw,10rem)] font-black uppercase leading-[0.82] tracking-tight"
        >
          Let's make ZORKO a{" "}
          <span className="text-mustard">local favourite.</span>
        </h2>
        <p
          data-reveal
          style={d(150)}
          className="mt-8 max-w-xl text-lg text-paper/80"
        >
          A stronger content system. A stronger local presence. A stronger
          reason to choose ZORKO.
        </p>
        <div data-reveal style={d(300)} className="mt-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-mustard">
            Let's work together
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            {contacts.map((c) => (
              <a
                key={c.k}
                href={c.href}
                target={c.k === "WhatsApp" ? "_blank" : undefined}
                rel="noreferrer"
                className="group flex items-center gap-4 border border-paper/20 bg-ink/40 px-5 py-4 backdrop-blur-sm transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-mustard hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mustard"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-chili text-paper transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-[18px] w-[18px] fill-current"
                    aria-hidden
                  >
                    {c.icon}
                  </svg>
                </span>
                <span>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.18em] opacity-60">
                    {c.k}
                  </span>
                  <span className="block break-all font-semibold">{c.v}</span>
                </span>
                <span className="ml-auto pl-2 opacity-0 transition duration-500 group-hover:translate-x-1 group-hover:opacity-100">
                  →
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="relative flex flex-wrap items-center justify-between gap-6 border-t border-paper/20 px-6 py-8 md:px-14 lg:px-20">
        <div className="flex items-center gap-5">
          <img
            src={mark}
            alt="Spiral Studios mark"
            className="drift h-14 w-auto"
          />
          <div>
            <div className="font-display text-2xl font-black uppercase tracking-wide">
              Spiral Studios
            </div>
            <div className="text-sm italic text-paper/60">
              Designed by balance. Driven by creativity.
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-paper/70">
          <a
            href="https://wa.me/917804907742"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-mustard"
          >
            WhatsApp — +91 78049 07742
          </a>
          <a
            href="mailto:Spiralstudios552026@gmail.com"
            className="transition-colors hover:text-mustard"
          >
            Email — Spiralstudios552026@gmail.com
          </a>
        </div>
      </div>
    </section>
  )
}

function Nav() {
  const items = Array.from({ length: 14 }, (_, i) => String(i).padStart(2, "0"))
  return (
    <nav
      className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-2 lg:flex"
      aria-label="Pages"
    >
      {items.map((n) => (
        <a
          key={n}
          href={`#p${n}`}
          className="group flex items-center justify-end gap-2"
          aria-label={`Page ${n}`}
        >
          <span className="font-mono text-[10px] text-mustard opacity-0 transition group-hover:opacity-100">
            {n}
          </span>
          <span className="block h-px w-4 bg-stone transition-all group-hover:w-8 group-hover:bg-mustard" />
        </a>
      ))}
    </nav>
  )
}

export default function App() {
  useMotion()
  return (
    <main>
      <Nav />
      <Cover />
      <Why />
      <Approach />
      <Work />
      <Pillars />
      <Packages />
      <Compare />
      <Meta />
      <Process />
      <Scope />
      <Investment />
      <Closing />
    </main>
  )
}

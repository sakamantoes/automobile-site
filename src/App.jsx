import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Search,
  Menu,
  X,
  Star,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Gauge,
  Fuel,
  Settings2,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  BadgeCheck,
  Diamond,
} from "lucide-react";
// Import social icons from react-icons
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: "Inventory", href: "#inventory" },
  { label: "Financing", href: "#trust" },
  { label: "Reviews", href: "#reviews" },
  { label: "Journal", href: "#journal" },
  { label: "Visit Us", href: "#visit" },
];

const BRANDS = ["Toyota", "Lexus", "Chevrolet", "Maserati", "Range Rover", "Volvo"];

const CARS = [
  {
    name: "Toyota GR Supra",
    trim: "3.0 Premium",
    price: "$52,900",
    specs: ["Automatic", "Petrol", "2,400 mi"],
    img: "https://images.pexels.com/photos/31853160/pexels-photo-31853160.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Lexus ES 350h",
    trim: "F Sport",
    price: "$46,250",
    specs: ["Hybrid", "Automatic", "8,100 mi"],
    img: "https://images.pexels.com/photos/8737951/pexels-photo-8737951.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Chevrolet Camaro SS",
    trim: "2SS Coupe",
    price: "$58,700",
    specs: ["Automatic", "Petrol", "5,600 mi"],
    img: "https://images.pexels.com/photos/30816058/pexels-photo-30816058.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Maserati Ghibli",
    trim: "Modena Q4",
    price: "$71,300",
    specs: ["Automatic", "Petrol", "3,950 mi"],
    img: "https://images.pexels.com/photos/10836789/pexels-photo-10836789.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Range Rover Sport",
    trim: "HSE Dynamic",
    price: "$84,600",
    specs: ["Automatic", "Diesel", "12,300 mi"],
    img: "https://images.pexels.com/photos/5288744/pexels-photo-5288744.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Volvo XC90",
    trim: "Recharge Inscription",
    price: "$61,150",
    specs: ["Automatic", "Hybrid", "9,800 mi"],
    img: "https://images.pexels.com/photos/14776590/pexels-photo-14776590.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

const TRUST_CARDS = [
  {
    icon: BadgeCheck,
    title: "Transparent pricing",
    body: "No hidden fees at pickup — every inspection report and history check comes included.",
    img: "https://images.pexels.com/photos/12175738/pexels-photo-12175738.jpeg?auto=compress&cs=tinysrgb&w=1200",
    panel: "top",
  },
  {
    icon: Sparkles,
    title: "Fast purchase process",
    body: "Reserve online, get approved, and drive away within 48 hours of your visit.",
    img: "https://images.pexels.com/photos/18748230/pexels-photo-18748230.jpeg?auto=compress&cs=tinysrgb&w=1200",
    panel: "bottom",
  },
  {
    icon: ShieldCheck,
    title: "150-point inspection",
    body: "Every vehicle passes a full mechanical, electrical, and safety certification.",
    img: "https://images.pexels.com/photos/4004696/pexels-photo-4004696.jpeg?auto=compress&cs=tinysrgb&w=1200",
    panel: "top",
  },
];

const REVIEWS = [
  {
    title: "Bought a Toyota GR Supra",
    rating: "4.9",
    text: "Test drive to keys in one afternoon. Paperwork was refreshingly simple and honest.",
    name: "Leslie Alexander",
    time: "1 week ago",
  },
  {
    title: "Bought a Chevrolet Camaro SS",
    rating: "5.0",
    text: "The inspection report matched the car exactly — zero surprises at pickup.",
    name: "Darrell Steward",
    time: "2 weeks ago",
  },
  {
    title: "Bought a Range Rover Sport",
    rating: "4.8",
    text: "Financing was sorted before I even arrived at the showroom floor.",
    name: "Jacob Jones",
    time: "1 week ago",
  },
  {
    title: "Bought a Maserati Ghibli",
    rating: "4.9",
    text: "Best buying experience I've had — the team knew every detail of the car.",
    name: "Guy Hawkins",
    time: "7 days ago",
  },
  {
    title: "Bought a Volvo XC90",
    rating: "4.9",
    text: "Trade-in valuation was fair and the whole process took under an hour.",
    name: "Robert Fox",
    time: "5 days ago",
  },
  {
    title: "Bought a Lexus ES 350h",
    rating: "5.0",
    text: "A genuinely curated inventory — every car felt inspected and honest.",
    name: "Esther Howard",
    time: "3 days ago",
  },
];

const ARTICLES = [
  {
    date: "17 July 2026",
    title: "Buying your first performance car",
    body: "What to check before you sign, from compression numbers to service records.",
    img: "https://images.pexels.com/photos/18739392/pexels-photo-18739392.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    date: "19 July 2026",
    title: "EV vs hybrid: what fits your commute",
    body: "A practical breakdown of range, charging, and running costs for daily drivers.",
    img: "https://images.pexels.com/photos/18748245/pexels-photo-18748245.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    date: "23 July 2026",
    title: "The real cost of ownership, explained",
    body: "Depreciation, insurance, and maintenance — the numbers dealers rarely show you.",
    img: "https://images.pexels.com/photos/18739389/pexels-photo-18739389.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

/* ------------------------------------------------------------------ */
/*  HOOKS                                                               */
/* ------------------------------------------------------------------ */

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}

/* ------------------------------------------------------------------ */
/*  PRIMITIVES                                                         */
/* ------------------------------------------------------------------ */

function Reveal({ children, delay = 0, className = "", as: Tag = "div", ...rest }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function Eyebrow({ children }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-3">
      <span style={{ width: 22, height: 1, background: "var(--line-strong)" }} />
      <span
        className="font-mono"
        style={{ fontSize: 12, letterSpacing: "0.16em", color: "var(--accent)", textTransform: "uppercase" }}
      >
        {children}
      </span>
      <span style={{ width: 22, height: 1, background: "var(--line-strong)" }} />
    </div>
  );
}

function PrimaryButton({ children, icon: Icon = ArrowRight, onClick, style = {} }) {
  return (
    <button onClick={onClick} className="btn-primary" style={style}>
      <span>{children}</span>
      <Icon size={16} strokeWidth={2.25} />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  NAV                                                                 */
/* ------------------------------------------------------------------ */

function Logo({ size = 30 }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="flex items-center justify-center"
        style={{
          width: size,
          height: size,
          borderRadius: 9,
          background: "linear-gradient(135deg, var(--accent), var(--accent-deep))",
          boxShadow: "0 4px 16px rgba(255,90,31,0.35)",
        }}
      >
        <Diamond size={size * 0.52} color="#ffffff" strokeWidth={2.5} />
      </span>
      <span className="font-display" style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text)" }}>
        NOVA<span style={{ color: "var(--accent)" }}>MOTORS</span>
      </span>
    </div>
  );
}

function NavBar() {
  const y = useScrollY();
  const [open, setOpen] = useState(false);
  const scrolled = y > 24;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0"
        style={{
          zIndex: 60,
          transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
          background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: `1px solid ${scrolled ? "var(--line)" : "transparent"}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between" style={{ height: 76 }}>
          <Logo />
          <nav className="hidden lg:flex items-center gap-9">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="nav-link">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button className="icon-btn lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu size={19} />
            </button>
          </div>
        </div>
      </header>

      <div
        className="fixed inset-0"
        style={{
          zIndex: 90,
          pointerEvents: open ? "auto" : "none",
          opacity: open ? 1 : 0,
          transition: "opacity 0.35s ease",
          background: "rgba(255,255,255,0.98)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between" style={{ height: 76 }}>
          <Logo />
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={19} />
          </button>
        </div>
        <nav className="flex flex-col px-8 pt-6 gap-1">
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-display"
              style={{
                fontSize: 30,
                padding: "14px 0",
                borderBottom: "1px solid var(--line)",
                color: "var(--text)",
                transform: open ? "translateY(0)" : "translateY(12px)",
                opacity: open ? 1 : 0,
                transition: `all 0.4s ease ${i * 60}ms`,
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  HERO                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  const y = useScrollY();
  const [query, setQuery] = useState("");

  return (
    <section className="relative overflow-hidden" style={{ paddingTop: 76 }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(255,90,31,0.08), transparent 60%), var(--bg)",
        }}
      />
      <div className="relative max-w-4xl mx-auto text-center px-6 pt-20 pb-10">
        <Reveal>
          <Eyebrow>New &amp; certified pre-owned</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(2.6rem, 6vw, 4.6rem)",
              lineHeight: 1.04,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--text)",
            }}
          >
            The smarter way
            <br />
            to own your next car
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p style={{ color: "var(--muted)", fontSize: 17, marginTop: 20, maxWidth: 460, marginInline: "auto" }}>
            Browse a curated, fully inspected inventory with transparent pricing and financing built around you.
          </p>
        </Reveal>

      </div>

      <Reveal delay={120} className="relative max-w-6xl mx-auto px-4 md:px-8">
        <div className="hero-frame">
          <img
            src="https://images.pexels.com/photos/18748254/pexels-photo-18748254.jpeg?auto=compress&cs=tinysrgb&w=1800"
            alt="Silver sports car on rooftop parking"
            className="hero-image"
            style={{ transform: `translateY(${y * 0.08}px) scale(1.02)` }}
          />
          <div className="hero-fade" />
          <div className="hero-tag hero-tag-left">
            <Gauge size={15} color="var(--accent)" />
            <span>0&ndash;60 in 3.9s</span>
          </div>
          <div className="hero-tag hero-tag-right">
            <ShieldCheck size={15} color="var(--accent)" />
            <span>Certified &amp; inspected</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  BRAND MARQUEE                                                       */
/* ------------------------------------------------------------------ */

function BrandStrip() {
  const list = [...BRANDS, ...BRANDS];
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10" style={{ paddingTop: 88 }}>
      <Reveal className="text-center" style={{ marginBottom: 36 }}>
        <h2 className="font-display section-title">Selected top-rated makes</h2>
        <p className="section-sub">Every listing verified against full-service dealer records</p>
      </Reveal>
      <Reveal delay={100}>
        <div className="marquee-mask">
          <div className="marquee-track">
            {list.map((b, i) => (
              <span key={i} className="font-mono marquee-item">
                {b}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CAR GALLERY — signature tilt cards                                  */
/* ------------------------------------------------------------------ */

function CarCard({ car, index }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, sx: 50, sy: 50, active: false });
  const [revealRef, visible] = useReveal();

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * 10,
      ry: (px - 0.5) * 12,
      sx: px * 100,
      sy: py * 100,
      active: true,
    });
  }, []);

  const onLeave = useCallback(() => {
    setTilt((t) => ({ ...t, rx: 0, ry: 0, active: false }));
  }, []);

  return (
    <div
      ref={revealRef}
      className={`reveal ${visible ? "reveal-visible" : ""}`}
      style={{ transitionDelay: `${(index % 3) * 90}ms` }}
    >
      <article
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="car-card"
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) ${
            tilt.active ? "scale3d(1.015,1.015,1.015)" : "scale3d(1,1,1)"
          }`,
        }}
      >
        <div className="car-card-media">
          <img src={car.img} alt={car.name} />
          <div
            className="car-card-spot"
            style={{
              opacity: tilt.active ? 1 : 0,
              background: `radial-gradient(circle at ${tilt.sx}% ${tilt.sy}%, rgba(255,255,255,0.22), transparent 45%)`,
            }}
          />
          <span className="car-card-price">{car.price}</span>
        </div>
        <div className="car-card-body">
          <div className="flex items-baseline justify-between">
            <h3 className="font-display" style={{ fontSize: 19, fontWeight: 600, color: "var(--text)" }}>
              {car.name}
            </h3>
            <ArrowUpRight size={17} color="var(--accent)" />
          </div>
          <p className="font-mono" style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3 }}>
            {car.trim}
          </p>
          <div className="car-specs">
            <span>
              <Settings2 size={13} /> {car.specs[0]}
            </span>
            <span>
              <Fuel size={13} /> {car.specs[1]}
            </span>
            <span>
              <Gauge size={13} /> {car.specs[2]}
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}

function Gallery() {
  return (
    <section id="inventory" className="max-w-7xl mx-auto px-6 md:px-10" style={{ paddingTop: 110 }}>
      <Reveal className="text-center">
        <h2 className="font-display section-title">Explore the current inventory</h2>
        <p className="section-sub">Every vehicle photographed, inspected, and priced upfront</p>
      </Reveal>
      <Reveal delay={80} className="text-center" style={{ marginTop: 22, marginBottom: 46 }}>
        <a href="#visit" className="btn-outline">
          View full inventory
        </a>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CARS.map((car, i) => (
          <CarCard car={car} index={i} key={car.name} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  TRUST BENTO                                                         */
/* ------------------------------------------------------------------ */

function TrustSection() {
  return (
    <section id="trust" className="max-w-7xl mx-auto px-6 md:px-10" style={{ paddingTop: 120 }}>
      <Reveal className="text-center">
        <h2 className="font-display section-title">Why buyers trust Nova Motors</h2>
        <p className="section-sub">From first search to signed paperwork, nothing is left vague</p>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginTop: 46 }}>
        {TRUST_CARDS.map((c, i) => {
          const Icon = c.icon;
          return (
            <Reveal delay={i * 100} key={c.title}>
              <div className="trust-card">
                <img src={c.img} alt={c.title} />
                <div className="trust-card-overlay" />
                <div className={`trust-panel trust-panel-${c.panel}`}>
                  <div className="trust-icon">
                    <Icon size={16} color="var(--accent)" />
                  </div>
                  <h3 className="font-display" style={{ fontSize: 16.5, fontWeight: 600, color: "#ffffff" }}>
                    {c.title}
                  </h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 4, lineHeight: 1.5 }}>{c.body}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  REVIEWS                                                             */
/* ------------------------------------------------------------------ */

function ReviewCard({ r, index }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} review-card`}
      style={{ transitionDelay: `${(index % 3) * 90}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono" style={{ fontSize: 12, color: "var(--muted)" }}>
          {r.title}
        </span>
        <span className="flex items-center gap-1" style={{ fontSize: 12.5, color: "var(--text)" }}>
          <Star size={13} color="var(--accent)" fill="var(--accent)" /> {r.rating}
        </span>
      </div>
      <p className="font-display" style={{ fontSize: 16, fontWeight: 500, color: "var(--text)", marginTop: 14, lineHeight: 1.4 }}>
        {r.text}
      </p>
      <div className="flex items-center gap-3" style={{ marginTop: 20 }}>
        <span className="avatar-dot">{r.name.charAt(0)}</span>
        <div>
          <p style={{ fontSize: 13.5, color: "var(--text)", fontWeight: 500 }}>{r.name}</p>
          <p style={{ fontSize: 12, color: "var(--muted)" }}>{r.time}</p>
        </div>
      </div>
    </div>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="max-w-7xl mx-auto px-6 md:px-10" style={{ paddingTop: 120 }}>
      <Reveal className="text-center">
        <h2 className="font-display section-title">Reviews from our buyers</h2>
        <p className="section-sub">Real deliveries, verified by purchase record</p>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ marginTop: 46 }}>
        {REVIEWS.map((r, i) => (
          <ReviewCard r={r} index={i} key={r.name} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  ARTICLES                                                            */
/* ------------------------------------------------------------------ */

function ArticleCard({ a, index }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`reveal ${visible ? "reveal-visible" : ""}`} style={{ transitionDelay: `${index * 100}ms` }}>
      <a href="#" className="article-card">
        <div className="article-media">
          <img src={a.img} alt={a.title} />
          <span className="article-arrow">
            <ArrowUpRight size={16} color="#ffffff" />
          </span>
        </div>
        <p className="font-mono" style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 14, letterSpacing: "0.06em" }}>
          {a.date}
        </p>
        <h3 className="font-display" style={{ fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 6 }}>
          {a.title}
        </h3>
        <p style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 6, lineHeight: 1.5 }}>{a.body}</p>
      </a>
    </div>
  );
}

function Articles() {
  return (
    <section id="journal" className="max-w-7xl mx-auto px-6 md:px-10" style={{ paddingTop: 120 }}>
      <Reveal className="text-center">
        <h2 className="font-display section-title">Latest from the garage journal</h2>
        <p className="section-sub">Buying guides and ownership notes, written plainly</p>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ marginTop: 46 }}>
        {ARTICLES.map((a, i) => (
          <ArticleCard a={a} index={i} key={a.title} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  VISIT / CONTACT                                                     */
/* ------------------------------------------------------------------ */

function Visit() {
  return (
    <section id="visit" className="max-w-7xl mx-auto px-6 md:px-10" style={{ paddingTop: 120 }}>
      <Reveal className="text-center">
        <h2 className="font-display section-title">Comfort and performance await you</h2>
        <p className="section-sub">Visit the showroom or arrange a private viewing</p>
      </Reveal>

      <Reveal delay={100}>
        <div className="map-frame" style={{ marginTop: 46 }}>
          <iframe
            title="Nova Motors showroom location"
            src="https://www.google.com/maps?q=Karl-Marx-Allee%2045%2C%2010178%20Berlin%2C%20Germany&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "grayscale(1) invert(0.92) contrast(0.9)" }}
            loading="lazy"
          />
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ marginTop: 24 }}>
        <Reveal delay={160}>
          <div className="contact-card">
            <MapPin size={17} color="var(--accent)" />
            <div>
              <p style={{ fontSize: 13.5, color: "var(--text)", fontWeight: 500 }}>Showroom</p>
              <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 2, lineHeight: 1.5 }}>
                Karl-Marx-Allee 45
                <br />
                10178 Berlin, Germany
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={220}>
          <div className="contact-card">
            <Phone size={17} color="var(--accent)" />
            <div style={{ width: "100%" }}>
              <p style={{ fontSize: 13.5, color: "var(--text)", fontWeight: 500 }}>+1 (415) 555-0132</p>
              <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>Call the sales floor</p>
              <div style={{ height: 1, background: "var(--line)", margin: "12px 0" }} />
              <div className="flex items-center gap-2.5">
                <Mail size={16} color="var(--accent)" />
                <p style={{ fontSize: 13.5, color: "var(--text)" }}>sales@novamotors.com</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA + FOOTER                                                        */
/* ------------------------------------------------------------------ */

function CTA() {
  return (
    <section className="max-w-5xl mx-auto px-6 text-center" style={{ paddingTop: 130, paddingBottom: 40 }}>
      <Reveal>
        <h2
          className="font-display"
          style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.12 }}
        >
          Ready to own your
          <br /> next car?
        </h2>
      </Reveal>
      <Reveal delay={100} style={{ marginTop: 30 }}>
        <PrimaryButton>Book a test drive</PrimaryButton>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", marginTop: 70 }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <Logo size={26} />
        <p style={{ fontSize: 12.5, color: "var(--muted)" }} className="text-center">
          Karl-Marx-Allee 45, 10178 Berlin, Germany
        </p>
        <div className="flex items-center gap-4">
          <FaFacebook size={16} color="var(--muted)" className="hover:text-[#1877f2] transition-colors cursor-pointer" />
          <FaTwitter size={16} color="var(--muted)" className="hover:text-[#1da1f2] transition-colors cursor-pointer" />
          <FaInstagram size={16} color="var(--muted)" className="hover:text-[#e4405f] transition-colors cursor-pointer" />
          <FaLinkedin size={16} color="var(--muted)" className="hover:text-[#0a66c2] transition-colors cursor-pointer" />
        </div>
      </div>
      <div style={{ borderTop: "1px solid var(--line)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-center">
          <p style={{ fontSize: 11.5, color: "var(--muted)" }}>&copy; 2026 Nova Motors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  GLOBAL STYLE (injected once)                                        */
/* ------------------------------------------------------------------ */

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

      :root {
        --bg: #f8f9fa;
        --surface: #ffffff;
        --surface-alt: #f1f3f5;
        --line: #e9ecef;
        --line-strong: #dee2e6;
        --text: #1a1a2e;
        --muted: #6c757d;
        --accent: #e63946;
        --accent-deep: #c62828;
      }

      * { box-sizing: border-box; }

      .app-root {
        background: var(--bg);
        color: var(--text);
        font-family: 'Inter', sans-serif;
        min-height: 100vh;
        overflow-x: hidden;
      }

      .font-display { font-family: 'Space Grotesk', sans-serif; }
      .font-mono { font-family: 'IBM Plex Mono', monospace; }

      .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.8s cubic-bezier(.22,.61,.36,1), transform 0.8s cubic-bezier(.22,.61,.36,1); }
      .reveal-visible { opacity: 1; transform: translateY(0); }

      @media (prefers-reduced-motion: reduce) {
        .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
        * { animation: none !important; }
      }

      .section-title { font-size: clamp(1.6rem, 3vw, 2.3rem); font-weight: 700; letter-spacing: -0.02em; color: var(--text); }
      .section-sub { color: var(--muted); font-size: 14.5px; margin-top: 8px; }

      .nav-link { font-size: 14px; color: var(--muted); transition: color 0.25s ease; }
      .nav-link:hover { color: var(--text); }

      .icon-btn {
        width: 38px; height: 38px; border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        background: var(--surface); border: 1px solid var(--line);
        color: var(--text); transition: border-color 0.25s ease, background 0.25s ease;
      }
      .icon-btn:hover { border-color: var(--accent); background: var(--surface-alt); }

      .btn-outline {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 10px 20px; border-radius: 999px; border: 1px solid var(--line-strong);
        font-size: 13.5px; color: var(--text); transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
      }
      .btn-outline:hover { border-color: var(--accent); background: rgba(230,57,70,0.08); transform: translateY(-1px); }

      .btn-primary {
        display: inline-flex; align-items: center; gap: 10px;
        padding: 14px 26px; border-radius: 999px; border: none; cursor: pointer;
        background: var(--accent); color: #ffffff; font-weight: 600; font-size: 14.5px;
        box-shadow: 0 10px 30px rgba(230,57,70,0.28);
        transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
      }
      .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 36px rgba(230,57,70,0.4); background: #ef5350; }

      .search-bar {
        display: flex; align-items: center; gap: 8px;
        background: var(--surface); border: 1px solid var(--line-strong);
        border-radius: 999px; padding: 6px; max-width: 520px; margin-inline: auto;
      }
      .search-input {
        flex: 1; background: transparent; border: none; outline: none;
        color: var(--text); font-size: 14px; padding: 10px 4px;
      }
      .search-input::placeholder { color: var(--muted); }
      .search-submit {
        width: 40px; height: 40px; border-radius: 999px; border: none; cursor: pointer;
        background: var(--accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        transition: background 0.25s ease;
      }
      .search-submit:hover { background: #ef5350; }

      .hero-frame {
        position: relative; border-radius: 26px; overflow: hidden;
        border: 1px solid var(--line); height: min(62vw, 520px);
        background: var(--surface);
      }
      .hero-image { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.6s ease; will-change: transform; }
      .hero-fade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(255,255,255,0.1) 40%, rgba(0,0,0,0.35) 100%); }
      .hero-tag {
        position: absolute; display: flex; align-items: center; gap: 8px;
        background: rgba(255,255,255,0.88); backdrop-filter: blur(10px);
        border: 1px solid var(--line-strong); border-radius: 999px;
        padding: 9px 16px; font-size: 12.5px; color: var(--text);
      }
      .hero-tag-left { left: 20px; bottom: 20px; }
      .hero-tag-right { right: 20px; top: 20px; }

      .marquee-mask { overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); }
      .marquee-track { display: flex; gap: 56px; width: max-content; animation: marquee 26s linear infinite; }
      .marquee-item { font-size: 15px; letter-spacing: 0.08em; color: var(--muted); white-space: nowrap; opacity: 0.7; transition: opacity 0.25s ease, color 0.25s ease; }
      .marquee-item:hover { opacity: 1; color: var(--accent); }
      @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

      .car-card {
        background: var(--surface); border: 1px solid var(--line); border-radius: 20px;
        overflow: hidden; transition: transform 0.15s ease-out, border-color 0.3s ease, box-shadow 0.3s ease;
        transform-style: preserve-3d; will-change: transform; height: 100%;
      }
      .car-card:hover { border-color: var(--line-strong); box-shadow: 0 24px 50px rgba(0,0,0,0.1); }
      .car-card-media { position: relative; height: 210px; overflow: hidden; }
      .car-card-media img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
      .car-card:hover .car-card-media img { transform: scale(1.06); }
      .car-card-spot { position: absolute; inset: 0; transition: opacity 0.2s ease; pointer-events: none; }
      .car-card-price {
        position: absolute; top: 14px; right: 14px; background: rgba(255,255,255,0.92); backdrop-filter: blur(8px);
        border: 1px solid var(--line-strong); color: var(--text); font-family: 'IBM Plex Mono', monospace;
        font-size: 13px; padding: 6px 12px; border-radius: 999px;
      }
      .car-card-body { padding: 18px 20px 20px; }
      .car-specs { display: flex; gap: 14px; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--line); }
      .car-specs span { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--muted); }

      .trust-card { position: relative; border-radius: 20px; overflow: hidden; height: 340px; border: 1px solid var(--line); }
      .trust-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
      .trust-card:hover img { transform: scale(1.06); }
      .trust-card-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.65) 100%); }
      .trust-panel {
        position: absolute; left: 16px; right: 16px; background: rgba(0,0,0,0.72); backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 16px 18px;
      }
      .trust-panel-top { top: 16px; }
      .trust-panel-bottom { bottom: 16px; }
      .trust-icon { width: 30px; height: 30px; border-radius: 9px; background: rgba(230,57,70,0.18); display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }

      .review-card { background: var(--surface); border: 1px solid var(--line); border-radius: 18px; padding: 22px; transition: border-color 0.3s ease, transform 0.3s ease; }
      .review-card:hover { border-color: var(--line-strong); transform: translateY(-3px); }
      .avatar-dot {
        width: 34px; height: 34px; border-radius: 999px; background: linear-gradient(135deg, var(--accent), var(--accent-deep));
        display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: #ffffff;
      }

      .article-card { display: block; }
      .article-media { position: relative; border-radius: 18px; overflow: hidden; height: 220px; border: 1px solid var(--line); }
      .article-media img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
      .article-card:hover .article-media img { transform: scale(1.07); }
      .article-arrow {
        position: absolute; top: 14px; right: 14px; width: 34px; height: 34px; border-radius: 999px;
        background: var(--accent); display: flex; align-items: center; justify-content: center;
        transition: transform 0.3s ease;
      }
      .article-card:hover .article-arrow { transform: rotate(45deg); }

      .map-frame { height: 360px; border-radius: 22px; overflow: hidden; border: 1px solid var(--line); }
      .contact-card { background: var(--surface); border: 1px solid var(--line); border-radius: 16px; padding: 20px; display: flex; gap: 14px; align-items: flex-start; }
    `}</style>
  );
}

/* ------------------------------------------------------------------ */
/*  APP                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  return (
    <div className="app-root">
      <GlobalStyle />
      <NavBar />
      <Hero />
      <BrandStrip />
      <Gallery />
      <TrustSection />
      <Reviews />
      <Articles />
      <Visit />
      <CTA />
      <Footer />
    </div>
  );
}
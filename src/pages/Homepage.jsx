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
  ChevronLeft,
  BadgeCheck,
  Diamond,
  XCircle,
  User,
  Briefcase,
  Award,
  Car,
  Users,
  Send,
  Clock,
  Calendar,
  Wrench,
  GaugeCircle,
  Cog,
  Filter,
  Battery,
  Fan,
  Sparkle,
  MessageCircle,
} from "lucide-react";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import images from "../assets/image.js";
import { Link } from "react-router-dom";
import newCars from "../assets/newCar/newcars.js";
import { getListings } from "../utils/api";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: "Inventory", href: "#inventory" },
  { label: "Spare Parts", href: "#spare-parts" },
  { label: "Financing", href: "#trust" },
  { label: "Reviews", href: "#reviews" },
  { label: "Journal", href: "#journal" },
  { label: "About", href: "#about" },
  { label: "Visit Us", href: "#visit" },
];

const BRANDS = ["Toyota", "Lexus", "Mercedes-Benz", "Maserati", "Range Rover", "Volvo"];

const ADMIN_EMAIL = "chinwekeleuchenna@gmail.com";

const CAR_IMAGES = [
  images.Car1, images.Car2, images.Car3, images.Car4, images.Car5,
  images.Car6, images.Car7, images.Car8, images.Car9, images.Car10,
  images.Car11, images.Car12, images.Car13, images.Car14, images.Car15,
  images.Car16, images.Car17, images.Car18, images.Car19, images.Car20,
  images.Car21, images.Car22, images.Car23, images.Car24, images.Car25,
  images.Car26, images.Car27,
];

const NEW_CAR_IMAGES = {
  lexus: [newCars.lexus1, newCars.lexus2, newCars.lexus3, newCars.lexus4],
  benz: [newCars.Benz1, newCars.Benz2, newCars.Benz3, newCars.Benz4, newCars.Benz5],
  highlander: [
    newCars.ToyotaHighlander,
    newCars.ToyotaHighlander2,
    newCars.ToyotaHighlander3,
    newCars.ToyotaHighlander4,
    newCars.ToyotaHighlander5,
    newCars.ToyotaHighlander6,
  ],
  hl: [newCars.hl, newCars.hl1, newCars.hl2, newCars.hl3, newCars.hl4, newCars.hl5],
};

const CAR_IMAGE_RANGES = {
  "Toyota Camry": { start: 0, end: 4 },
  "Mercedes-AMG": { start: 5, end: 7 },
  Lexus: { start: 9, end: 13 },
  "Mercedes-Benz": { start: 14, end: 17 },
  "Lexus RX 2012": { start: 19, end: 20 },
  "Toyota Highlander": { start: 22, end: 23 },
  "Lexus RX 2018": { start: 25, end: 26 },
};

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
    title: "Bought a Toyota Camry",
    rating: "4.9",
    text: "Test drive to keys in one afternoon. Paperwork was refreshingly simple and honest.",
    name: "nnamdi Alexander",
    time: "1 week ago",
  },
  {
    title: "Bought a Mercedes G 63",
    rating: "5.0",
    text: "The inspection report matched the car exactly — zero surprises at pickup.",
    name: "totti mba",
    time: "2 weeks ago",
  },
  {
    title: "Bought a Lexus RX 350",
    rating: "4.8",
    text: "Financing was sorted before I even arrived at the showroom floor.",
    name: "Jacob Adeleke",
    time: "1 week ago",
  },
  {
    title: "Bought a Mercedes ML 350",
    rating: "4.9",
    text: "Best buying experience I've had — the team knew every detail of the car.",
    name: "Musa Bello",
    time: "7 days ago",
  },
  {
    title: "Bought a Toyota Highlander",
    rating: "4.9",
    text: "Trade-in valuation was fair and the whole process took under an hour.",
    name: "Robert Chika",
    time: "5 days ago",
  },
  {
    title: "Bought a Lexus ES 350",
    rating: "5.0",
    text: "A genuinely curated inventory — every car felt inspected and honest.",
    name: "Esther benjamin",
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
/*  HOOKS                                                              */
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
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function collectCarImages(car) {
  if (!car) return [];
  const list = [];
  const push = (u) => {
    if (typeof u === "string" && u.trim()) list.push(u);
  };

  push(car.coverImage?.url);
  if (Array.isArray(car.subImages)) car.subImages.forEach((i) => push(i?.url));
  if (Array.isArray(car.galleries)) {
    car.galleries.forEach((g) => {
      if (Array.isArray(g?.images)) g.images.forEach((i) => push(i?.url));
    });
  }

  if (!list.length && car.imageRange) {
    const key = car.imageRange;
    if (NEW_CAR_IMAGES[key]) {
      NEW_CAR_IMAGES[key].forEach(push);
    } else if (CAR_IMAGE_RANGES[key]) {
      const { start, end } = CAR_IMAGE_RANGES[key];
      for (let i = start; i <= end && i < CAR_IMAGES.length; i++) push(CAR_IMAGES[i]);
    }
  }

  if (!list.length) push(car.img);
  return [...new Set(list)];
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((value || "").trim());
}

/**
 * Sends a clean, named-field email to the dealership via FormSubmit's
 * AJAX endpoint. Using discrete fields (name, email, phone, message,
 * vehicle, etc.) instead of a single `message` blob makes FormSubmit
 * render a neat table rather than the generic "Someone just submitted
 * your form..." wrapper.
 *
 * When `replyTo` (the customer's own email) is supplied, it's passed
 * along as `_replyto` so the admin's email client can hit "Reply" and
 * go straight back to the customer.
 */
async function sendEmailNotification({ subject, fields, replyTo }) {
  try {
    const payload = {
      _subject: subject,
      _template: "table",
      _captcha: "false",
      ...fields,
    };
    if (replyTo) payload._replyto = replyTo;

    const response = await fetch(
      `https://formsubmit.co/ajax/${ADMIN_EMAIL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    return response.ok;
  } catch (error) {
    console.error("Email notification error:", error);
    return false;
  }
}

async function orderByEmail(item, kind = "car", customerEmail = "") {
  const fields = {};

  if (kind === "car") {
    fields.Vehicle = `${item.name || ""} ${item.year ? `(${item.year})` : ""}`.trim();
    if (item.make || item.model)
      fields["Make / Model"] = `${item.make || ""} ${item.model || ""}`.trim();
    if (item.trim) fields.Trim = item.trim;
    if (item.color) fields.Color = item.color;
    if (item.transmission) fields.Transmission = item.transmission;
    if (item.fuel) fields.Fuel = item.fuel;
    if (item.mileage)
      fields.Mileage = `${Number(item.mileage).toLocaleString()} mi`;
    if (item.price) fields.Price = item.price;
    if (item.location) fields.Location = item.location;
  } else {
  fields.Part = item.name || "";
  if (item.brand) fields.Brand = item.brand;
  if (item.category) fields.Category = item.category;
  if (item.subcategory) fields.Subcategory = item.subcategory;
  if (item.price) fields.Price = item.price;    // ← NEW
}

  if (customerEmail) fields["Customer Email"] = customerEmail;
  fields.Request = "Place Order";

  const ok = await sendEmailNotification({
    subject: `Order Request — ${item.name || "Item"}`,
    fields,
    replyTo: customerEmail,
  });

  if (ok) {
    window.alert("Your order request has been sent! We'll be in touch shortly.");
  } else {
    window.alert(
      "We couldn't send your order request. Please try again or call us at +234 706 172 2513."
    );
  }
}

async function quoteByEmail(item, kind = "car", customerEmail = "") {
  const fields = {};

  if (kind === "car") {
    fields.Vehicle = `${item.name || ""} ${item.year ? `(${item.year})` : ""}`.trim();
    if (item.make || item.model)
      fields["Make / Model"] = `${item.make || ""} ${item.model || ""}`.trim();
    if (item.color) fields.Color = item.color;
    if (item.price) fields.Price = item.price;
  } else {
    fields.Part = item.name || "";
    if (item.brand) fields.Brand = item.brand;
  }

  if (customerEmail) fields["Customer Email"] = customerEmail;
  fields.Request = "Quote";

  const ok = await sendEmailNotification({
    subject: `Quote Request — ${item.name || "Item"}`,
    fields,
    replyTo: customerEmail,
  });

  if (ok) {
    window.alert("Your quote request has been sent! We'll be in touch shortly.");
  } else {
    window.alert(
      "We couldn't send your quote request. Please try again or call us at +234 706 172 2513."
    );
  }
}

async function bookTestDriveByEmail(car, customerEmail = "") {
  const fields = {
    Vehicle: `${car.name || ""} ${car.year ? `(${car.year})` : ""}`.trim(),
    Request: "Book a Test Drive",
  };
  if (car.make || car.model)
    fields["Make / Model"] = `${car.make || ""} ${car.model || ""}`.trim();
  if (car.color) fields.Color = car.color;
  if (car.location) fields.Location = car.location;
  if (customerEmail) fields["Customer Email"] = customerEmail;

  const ok = await sendEmailNotification({
    subject: `Test Drive Booking — ${car.name || "Vehicle"}`,
    fields,
    replyTo: customerEmail,
  });

  if (ok) {
    window.alert("Your test drive request has been sent! We'll be in touch shortly.");
  } else {
    window.alert(
      "We couldn't send your test drive request. Please try again or call us at +234 706 172 2513."
    );
  }
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
        style={{
          fontSize: 12,
          letterSpacing: "0.16em",
          color: "var(--accent)",
          textTransform: "uppercase",
        }}
      >
        {children}
      </span>
      <span style={{ width: 22, height: 1, background: "var(--line-strong)" }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EMAIL CAPTURE MODAL                                                */
/* ------------------------------------------------------------------ */

/**
 * Small popup that asks the customer for their own email address
 * before a request (test drive / quote / order) is sent to the admin.
 * `onSubmit(email)` is only called once the address passes basic
 * validation. Purely presentational — the caller owns all send logic.
 */
function EmailCaptureModal({ open, title, description, sending, onSubmit, onClose }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setEmail("");
      setError("");
      // slight delay so the modal is mounted before we try to focus it
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    onSubmit(email.trim());
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 120,
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(12px)",
        animation: "fadeIn 0.25s ease",
      }}
      onClick={sending ? undefined : onClose}
    >
      <div
        className="relative w-full max-w-sm mx-4 rounded-2xl"
        style={{
          background: "#1a1a1a",
          border: "1px solid var(--line)",
          padding: 26,
          animation: "slideUp 0.35s cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {!sending && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/10 transition-colors"
            style={{ color: "#999" }}
            aria-label="Close"
            type="button"
          >
            <XCircle size={22} />
          </button>
        )}

        <div
          className="flex items-center justify-center"
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "rgba(0,102,204,0.15)",
            marginBottom: 16,
          }}
        >
          <Mail size={20} color="var(--accent)" />
        </div>

        <h3 className="font-display" style={{ fontSize: 19, fontWeight: 600, color: "#fff" }}>
          {title}
        </h3>
        <p style={{ fontSize: 13.5, color: "#999", marginTop: 6, lineHeight: 1.5 }}>
          {description || "Enter your email so our team can reach you about this request."}
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
          <label className="form-label" style={{ display: "block", marginBottom: 6 }}>
            Your Email Address
          </label>
          <input
            ref={inputRef}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="form-input"
            disabled={sending}
            required
          />
          {error && (
            <p style={{ fontSize: 12.5, color: "#ef4444", marginTop: 8 }}>{error}</p>
          )}

          <div className="flex gap-3" style={{ marginTop: 18 }}>
            <button
              type="button"
              className="btn-outline justify-center flex-1"
              onClick={onClose}
              disabled={sending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary justify-center flex-1"
              disabled={sending}
            >
              {sending ? "Sending..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  NAV                                                                */
/* ------------------------------------------------------------------ */

function Logo({ size = 40 }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex items-center justify-center"
        style={{
          width: size,
          height: size,
          borderRadius: 10,
          background: "linear-gradient(135deg, var(--accent), var(--accent-deep))",
          boxShadow: "0 4px 16px rgba(0,102,204,0.35)",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <img
          src={images.Logo2}
          alt="Lord Group Autos"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </span>
      <span
        className="font-display"
        style={{
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "var(--text)",
          lineHeight: 1.2,
        }}
      >
        Lord Group
        <span style={{ color: "var(--accent)" }}> AUTOS</span>
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
          background: scrolled ? "rgba(0,0,0,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: `1px solid ${scrolled ? "var(--line)" : "transparent"}`,
        }}
      >
        <div
          className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between"
          style={{ height: 76 }}
        >
          <Logo />
          <nav className="hidden lg:flex items-center gap-9">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="nav-link">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button
              className="icon-btn lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
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
          background: "rgba(0,0,0,0.98)",
        }}
      >
        <div
          className="max-w-7xl mx-auto px-6 flex items-center justify-between"
          style={{ height: 76 }}
        >
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
/*  HERO                                                               */
/* ------------------------------------------------------------------ */

function Hero() {
  const y = useScrollY();

  return (
    <section className="relative overflow-hidden" style={{ paddingTop: 76 }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(0,102,204,0.15), transparent 60%), var(--bg)",
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
            Reliable Cars.
            <br />
            <span style={{ color: "var(--accent)" }}>Trusted Hire.</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p
            style={{
              color: "var(--muted)",
              fontSize: 17,
              marginTop: 20,
              maxWidth: 460,
              marginInline: "auto",
            }}
          >
            Driven by Integrity — Browse a curated, fully inspected inventory with transparent
            pricing and financing built around you.
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
/*  BRAND MARQUEE                                                      */
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
/*  CAR CARD                                                           */
/* ------------------------------------------------------------------ */

function CarCard({ car, index, onOpen }) {
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

  const cover = car.coverImage?.url || car.img || "";

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
        className="car-card cursor-pointer"
        onClick={() => onOpen(car)}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) ${
            tilt.active ? "scale3d(1.015,1.015,1.015)" : "scale3d(1,1,1)"
          }`,
        }}
      >
        <div className="car-card-media">
          {cover ? (
            <img src={cover} alt={car.name} loading="lazy" />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--muted)",
              }}
            >
              <Car size={40} />
            </div>
          )}
          <div
            className="car-card-spot"
            style={{
              opacity: tilt.active ? 1 : 0,
              background: `radial-gradient(circle at ${tilt.sx}% ${tilt.sy}%, rgba(255,255,255,0.08), transparent 45%)`,
            }}
          />
          {car.price && (
            <div
              className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {car.price}
            </div>
          )}
        </div>
        <div className="car-card-body">
          <div className="flex items-baseline justify-between">
            <h3
              className="font-display"
              style={{ fontSize: 19, fontWeight: 600, color: "var(--text)" }}
            >
              {car.name}
            </h3>
            <ArrowUpRight size={17} color="var(--accent)" />
          </div>
          <p
            className="font-mono"
            style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3 }}
          >
            {car.trim || car.year || ""}
          </p>
          <div className="car-specs">
            <span>
              <Settings2 size={13} /> {car.transmission || "Automatic"}
            </span>
            <span>
              <Fuel size={13} /> {car.fuel || "Petrol"}
            </span>
            <span>
              <Gauge size={13} />{" "}
              {car.mileage ? `${Number(car.mileage).toLocaleString()} mi` : "Contact us"}
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  LIGHTBOX                                                           */
/* ------------------------------------------------------------------ */

function CarLightbox({ car, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sending, setSending] = useState(null); // "test-drive" | "quote" | "order" | null
  const [emailPromptType, setEmailPromptType] = useState(null); // "test-drive" | "quote" | "order" | null

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [car?._id, car?.id]);

  if (!car) return null;

  const carImages = collectCarImages(car);
  const safeImages = carImages.length ? carImages : [];
  const currentSrc = safeImages[currentIndex] || safeImages[0] || "";

  const handlePrev = (e) => {
    e.stopPropagation();
    if (safeImages.length < 2) return;
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (safeImages.length < 2) return;
    setCurrentIndex((prev) => (prev + 1) % safeImages.length);
  };

  // These now just open the email-capture popup; the actual send
  // happens in handleEmailSubmit once the customer enters their email.
  const openEmailPrompt = (type) => (e) => {
    e.stopPropagation();
    if (sending) return;
    setEmailPromptType(type);
  };

  const handleEmailSubmit = async (customerEmail) => {
    const type = emailPromptType;
    if (!type) return;
    setSending(type);
    if (type === "test-drive") await bookTestDriveByEmail(car, customerEmail);
    else if (type === "quote") await quoteByEmail(car, "car", customerEmail);
    else if (type === "order") await orderByEmail(car, "car", customerEmail);
    setSending(null);
    setEmailPromptType(null);
  };

  const EMAIL_PROMPT_COPY = {
    "test-drive": {
      title: "Book a Test Drive",
      description: `Enter your email and we'll confirm a test drive time for the ${car.name}.`,
    },
    quote: {
      title: "Request a Quote",
      description: `Enter your email and we'll send pricing details for the ${car.name}.`,
    },
    order: {
      title: "Place an Order",
      description: `Enter your email so we can process your order for the ${car.name}.`,
    },
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
      style={{
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(12px)",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <div
        className="relative bg-[#1a1a1a] rounded-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideUp 0.4s cubic-bezier(0.22, 0.61, 0.36, 1)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full shadow-lg hover:bg-black/70 transition-colors"
          style={{ color: "#ffffff" }}
          aria-label="Close"
        >
          <XCircle size={28} />
        </button>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                className="font-display text-2xl font-bold mb-1"
                style={{ color: "#ffffff" }}
              >
                {car.name}
              </h2>
              <p className="font-mono text-sm" style={{ color: "#999" }}>
                {car.trim || car.year}
              </p>
              {car.price && (
                <p
                  className="font-display text-lg"
                  style={{ color: "var(--accent)", marginTop: 4 }}
                >
                  {car.price}
                </p>
              )}
            </div>
            {car.location && (
              <span
                className="text-xs font-mono px-3 py-1 rounded-full"
                style={{
                  background: "var(--surface)",
                  color: "var(--muted)",
                  border: "1px solid var(--line)",
                  whiteSpace: "nowrap",
                }}
              >
                📍 {car.location}
              </span>
            )}
          </div>

          <div className="relative mt-4">
            <div
              className="relative overflow-hidden rounded-xl"
              style={{ background: "#0a0a0a", height: 400 }}
            >
              {currentSrc ? (
                <img
                  src={currentSrc}
                  alt={`${car.name} view ${currentIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#555",
                  }}
                >
                  <Car size={64} />
                </div>
              )}
            </div>

            {safeImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full shadow-lg hover:bg-black/70 transition-colors"
                  style={{ color: "#ffffff" }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full shadow-lg hover:bg-black/70 transition-colors"
                  style={{ color: "#ffffff" }}
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {safeImages.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {safeImages.map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    onClick={() => setCurrentIndex(i)}
                    className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all"
                    style={{
                      borderColor: i === currentIndex ? "var(--accent)" : "transparent",
                      background: "#0a0a0a",
                    }}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {(car.fullDescription || car.description) && (
            <div className="mt-4 p-4 rounded-lg" style={{ background: "#0a0a0a" }}>
              <p
                className="text-sm whitespace-pre-wrap"
                style={{ color: "#ccc", lineHeight: 1.6 }}
              >
                {car.fullDescription || car.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="p-3 rounded-lg" style={{ background: "#0a0a0a" }}>
              <p className="text-xs font-mono" style={{ color: "#666" }}>
                Transmission
              </p>
              <p className="font-medium" style={{ color: "#ffffff" }}>
                {car.transmission || "—"}
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: "#0a0a0a" }}>
              <p className="text-xs font-mono" style={{ color: "#666" }}>
                Fuel
              </p>
              <p className="font-medium" style={{ color: "#ffffff" }}>
                {car.fuel || "—"}
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: "#0a0a0a" }}>
              <p className="text-xs font-mono" style={{ color: "#666" }}>
                Mileage
              </p>
              <p className="font-medium" style={{ color: "#ffffff" }}>
                {car.mileage ? `${Number(car.mileage).toLocaleString()} mi` : "—"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {car.status && (
              <span
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  background: "rgba(0,102,204,0.15)",
                  color: "var(--accent)",
                  border: "1px solid rgba(0,102,204,0.2)",
                }}
              >
                {car.status}
              </span>
            )}
            {car.grade && (
              <span
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  background: "rgba(34,197,94,0.15)",
                  color: "#22c55e",
                  border: "1px solid rgba(34,197,94,0.2)",
                }}
              >
                Grade: {car.grade}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <button
              className="btn-primary justify-center flex-1"
              onClick={openEmailPrompt("test-drive")}
              type="button"
              disabled={sending !== null}
            >
              <Calendar size={16} />
              {sending === "test-drive" ? "Sending..." : "Book a Test Drive"}
            </button>
            <button
              className="btn-outline justify-center flex-1"
              onClick={openEmailPrompt("quote")}
              type="button"
              disabled={sending !== null}
            >
              <MessageCircle size={16} />
              {sending === "quote" ? "Sending..." : "Request Quote"}
            </button>
            <button
              className="btn-primary justify-center flex-1"
              onClick={openEmailPrompt("order")}
              type="button"
              disabled={sending !== null}
            >
              <Send size={16} />
              {sending === "order" ? "Sending..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>

      <EmailCaptureModal
        open={emailPromptType !== null}
        title={EMAIL_PROMPT_COPY[emailPromptType]?.title || "Enter your email"}
        description={EMAIL_PROMPT_COPY[emailPromptType]?.description}
        sending={sending !== null}
        onSubmit={handleEmailSubmit}
        onClose={() => setEmailPromptType(null)}
      />

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  GALLERY (Explore the current inventory)                            */
/* ------------------------------------------------------------------ */

function Gallery() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getListings("gallery", { limit: 6 })
      .then(setCars)
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="inventory"
      className="max-w-7xl mx-auto px-6 md:px-10"
      style={{ paddingTop: 110 }}
    >
      <Reveal className="text-center">
        <h2 className="font-display section-title">Explore the current inventory</h2>
        <p className="section-sub">Every vehicle photographed, inspected, and priced upfront</p>
      </Reveal>
      <Reveal delay={80} className="text-center" style={{ marginTop: 22, marginBottom: 46 }}>
        <Link to="/gallery" className="btn-primary">
          View All Vehicles
        </Link>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="car-card"
                style={{ opacity: 0.4, height: 320 }}
              />
            ))
          : cars.map((car, i) => (
              <CarCard
                key={car._id || car.id || i}
                car={car}
                index={i}
                onOpen={setSelectedCar}
              />
            ))}
      </div>

      {selectedCar && (
        <CarLightbox car={selectedCar} onClose={() => setSelectedCar(null)} />
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  NEW ARRIVALS                                                       */
/* ------------------------------------------------------------------ */

function NewArrivals() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getListings("new-arrivals", { limit: 6 })
      .then(setCars)
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10" style={{ paddingTop: 110 }}>
      <Reveal className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkle size={28} color="var(--accent)" />
          <h2 className="font-display section-title">New Arrivals</h2>
          <Sparkle size={28} color="var(--accent)" />
        </div>
        <p className="section-sub">The latest models just landed — be the first to drive them</p>
      </Reveal>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        style={{ marginTop: 46 }}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="car-card"
                style={{ opacity: 0.4, height: 320 }}
              />
            ))
          : cars.map((car, index) => (
              <Reveal delay={(index % 4) * 100} key={car._id || car.id || index}>
                <article
                  className="car-card cursor-pointer"
                  onClick={() => setSelectedCar(car)}
                >
                  <div className="car-card-media">
                    {car.coverImage?.url ? (
                      <img src={car.coverImage.url} alt={car.name} loading="lazy" />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--muted)",
                        }}
                      >
                        <Car size={40} />
                      </div>
                    )}
                    <div className="car-card-spot" />
                    {car.price && (
                      <div
                        className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
                        style={{ background: "var(--accent)", color: "#fff" }}
                      >
                        {car.price}
                      </div>
                    )}
                    {(car.newArrival || car.status) && (
                      <div
                        className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs"
                        style={{
                          background: "rgba(0,0,0,.75)",
                          color: "#fff",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        {car.status || "New Listing"}
                      </div>
                    )}
                  </div>
                  <div className="car-card-body">
                    <div className="flex items-baseline justify-between">
                      <h3
                        className="font-display"
                        style={{ fontSize: 19, fontWeight: 600, color: "var(--text)" }}
                      >
                        {car.name}
                      </h3>
                      <ArrowUpRight size={17} color="var(--accent)" />
                    </div>
                    <p
                      className="font-mono"
                      style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3 }}
                    >
                      {car.trim || car.year}
                    </p>
                    <div className="car-specs">
                      <span>
                        <Settings2 size={13} /> {car.transmission || "Automatic"}
                      </span>
                      <span>
                        <Fuel size={13} /> {car.fuel || "Petrol"}
                      </span>
                      <span>
                        <Gauge size={13} />{" "}
                        {car.mileage
                          ? `${Number(car.mileage).toLocaleString()} mi`
                          : "Contact us"}
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
      </div>

      {selectedCar && (
        <CarLightbox car={selectedCar} onClose={() => setSelectedCar(null)} />
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  SPARE PARTS                                                        */
/* ------------------------------------------------------------------ */

function SpareParts() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderingId, setOrderingId] = useState(null);
  const [emailPromptPart, setEmailPromptPart] = useState(null); // the part pending an email

  useEffect(() => {
    getListings("spare-parts")
      .then(setParts)
      .catch(() => setParts([]))
      .finally(() => setLoading(false));
  }, []);

  const openEmailPrompt = (e, part) => {
    e.stopPropagation();
    if (orderingId) return;
    setEmailPromptPart(part);
  };

  const handleEmailSubmit = async (customerEmail) => {
    const part = emailPromptPart;
    if (!part) return;
    const id = part._id || part.id || part.name;
    setOrderingId(id);
    await orderByEmail(part, "spare-part", customerEmail);
    setOrderingId(null);
    setEmailPromptPart(null);
  };

  return (
    <section
      id="spare-parts"
      className="max-w-7xl mx-auto px-6 md:px-10"
      style={{ paddingTop: 110 }}
    >
      <Reveal className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Wrench size={28} color="var(--accent)" />
          <h2 className="font-display section-title">Genuine Spare Parts</h2>
          <Wrench size={28} color="var(--accent)" />
        </div>
        <p className="section-sub">
          Quality parts for every vehicle — from filters to full engine components
        </p>
      </Reveal>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        style={{ marginTop: 46 }}
      >
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="spare-part-card"
                style={{ opacity: 0.4, height: 240 }}
              />
            ))
          : parts.map((part, index) => {
              const id = part._id || part.id || part.name || index;
              const isOrdering = orderingId === id;
              return (
                <Reveal delay={(index % 4) * 80} key={id}>
                  <div className="spare-part-card">
                    <div className="spare-part-image">
                      {part.coverImage?.url ? (
                        <img src={part.coverImage.url} alt={part.name} loading="lazy" />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--muted)",
                          }}
                        >
                          <Wrench size={32} />
                        </div>
                      )}
                      {part.category && (
                        <span className="spare-part-category">{part.category}</span>
                      )}
                    </div>
                    <div className="spare-part-body">
                      <h3
                        className="font-display"
                        style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}
                      >
                        {part.name}
                      </h3>
                      <div
                        className="flex items-center justify-between"
                        style={{ marginTop: 10 }}
                      >
                        <span
                          style={{
                            fontSize: 14,
                            color: part.price ? "var(--accent)" : "var(--muted)",
                            fontWeight: part.price ? 700 : 400,
                            fontFamily: part.price
                              ? "'Space Grotesk', sans-serif"
                              : "inherit",
                          }}
                        >
                          {part.price
                            ? part.price
                            : part.inStock === false
                            ? "Out of Stock"
                            : "In Stock"}
                        </span>
                        <button
                          className="spare-part-order"
                          onClick={(e) => openEmailPrompt(e, part)}
                          type="button"
                          disabled={orderingId !== null}
                        >
                          {isOrdering ? "Sending..." : "Place Order"}{" "}
                          <ArrowUpRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
      </div>

      <Reveal delay={100} className="text-center" style={{ marginTop: 40 }}>
        <Link to="/spare-parts" className="btn-primary">
          <Cog size={16} />
          Request Custom Parts
        </Link>
      </Reveal>

      <EmailCaptureModal
        open={emailPromptPart !== null}
        title="Place Order"
        description={
          emailPromptPart
            ? `Enter your email and we'll process your order for ${
                emailPromptPart.name
              }${emailPromptPart.price ? ` (${emailPromptPart.price})` : ""}.`
            : ""
        }
        sending={orderingId !== null}
        onSubmit={handleEmailSubmit}
        onClose={() => setEmailPromptPart(null)}
      />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  TRUST                                                              */
/* ------------------------------------------------------------------ */

function TrustSection() {
  return (
    <section
      id="trust"
      className="max-w-7xl mx-auto px-6 md:px-10"
      style={{ paddingTop: 120 }}
    >
      <Reveal className="text-center">
        <h2 className="font-display section-title">Why buyers trust Lord Group Autos</h2>
        <p className="section-sub">
          From first search to signed paperwork, nothing is left vague
        </p>
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
                  <h3
                    className="font-display"
                    style={{ fontSize: 16.5, fontWeight: 600, color: "#ffffff" }}
                  >
                    {c.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.8)",
                      marginTop: 4,
                      lineHeight: 1.5,
                    }}
                  >
                    {c.body}
                  </p>
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
/*  ABOUT / FOUNDER                                                    */
/* ------------------------------------------------------------------ */

function AboutSection() {
  return (
    <section
      id="about"
      className="max-w-7xl mx-auto px-6 md:px-10"
      style={{ paddingTop: 120 }}
    >
      <Reveal className="text-center">
        <h2 className="font-display section-title">Meet the Founder</h2>
        <p className="section-sub">Driven by integrity, built on trust</p>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12" style={{ marginTop: 46 }}>
        <Reveal delay={100}>
          <div className="founder-image-wrapper">
            <img
              src={images.Ceo}
              alt="Obinna Ezichi Fidelis - Founder, Lord Group Autos"
              className="founder-image"
            />
            <div className="founder-image-overlay">
              <span className="founder-tag">Founder</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="founder-content">
            <h3
              className="font-display"
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "var(--text)",
                letterSpacing: "-0.02em",
              }}
            >
              Obinna Ezichi Fidelis
            </h3>
            <p
              className="font-mono"
              style={{ fontSize: 14, color: "var(--accent)", marginTop: 4 }}
            >
              Founder, Lord Group Autos
            </p>

            <div
              style={{
                height: 2,
                width: 60,
                background: "var(--accent)",
                marginTop: 20,
                marginBottom: 20,
              }}
            />

            <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.7 }}>
              Obinna Ezichi Fidelis is an entrepreneur based in Abia State, with roots in
              Ugwunagbo LGA. He's a graduate of Urban and Regional Planning from Abia State
              University, and since 2023 he's been building a reputation in the auto industry.
            </p>

            <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.7, marginTop: 14 }}>
              With a planner's mindset and a service-first attitude, Obinna Ezichi leads a
              mobility business focused on two things:{" "}
              <strong style={{ color: "var(--text)" }}>helping people own reliable cars</strong>{" "}
              and{" "}
              <strong style={{ color: "var(--text)" }}>
                providing dependable car hire solutions
              </strong>
              .
            </p>

            <p
              style={{
                fontSize: 15,
                color: "var(--text)",
                lineHeight: 1.7,
                marginTop: 20,
                fontWeight: 500,
              }}
            >
              Driven by integrity and customer satisfaction, Obinna Ezichi believes trust is
              more valuable than a quick sale.
            </p>

            <div style={{ marginTop: 24 }}>
              <div className="founder-services">
                <div className="founder-service-item">
                  <div className="founder-service-icon">
                    <Car size={16} color="var(--accent)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                      Car Sales
                    </h4>
                    <p style={{ fontSize: 12.5, color: "var(--muted)" }}>
                      Sourcing verified, well-maintained vehicles
                    </p>
                  </div>
                </div>
                <div className="founder-service-item">
                  <div className="founder-service-icon">
                    <Users size={16} color="var(--accent)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                      Car Hire / Rental
                    </h4>
                    <p style={{ fontSize: 12.5, color: "var(--muted)" }}>
                      Flexible rental for airport, business, events
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 24,
                padding: 16,
                borderRadius: 12,
                background: "var(--surface)",
                border: "1px solid var(--line)",
              }}
            >
              <p style={{ fontSize: 13, color: "var(--muted)", fontStyle: "italic" }}>
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>Tagline:</span>{" "}
                Reliable Cars. Trusted Hire. Driven by Integrity.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  REVIEWS                                                            */
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
        <span
          className="flex items-center gap-1"
          style={{ fontSize: 12.5, color: "var(--text)" }}
        >
          <Star size={13} color="var(--accent)" fill="var(--accent)" /> {r.rating}
        </span>
      </div>
      <p
        className="font-display"
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: "var(--text)",
          marginTop: 14,
          lineHeight: 1.4,
        }}
      >
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
    <section
      id="reviews"
      className="max-w-7xl mx-auto px-6 md:px-10"
      style={{ paddingTop: 120 }}
    >
      <Reveal className="text-center">
        <h2 className="font-display section-title">Reviews from our buyers</h2>
        <p className="section-sub">Real deliveries, verified by purchase record</p>
      </Reveal>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        style={{ marginTop: 46 }}
      >
        {REVIEWS.map((r, i) => (
          <ReviewCard r={r} index={i} key={r.name} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  ARTICLES                                                           */
/* ------------------------------------------------------------------ */

function ArticleCard({ a, index }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <a href="#" className="article-card">
        <div className="article-media">
          <img src={a.img} alt={a.title} />
          <span className="article-arrow">
            <ArrowUpRight size={16} color="#ffffff" />
          </span>
        </div>
        <p
          className="font-mono"
          style={{
            fontSize: 11.5,
            color: "var(--muted)",
            marginTop: 14,
            letterSpacing: "0.06em",
          }}
        >
          {a.date}
        </p>
        <h3
          className="font-display"
          style={{ fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 6 }}
        >
          {a.title}
        </h3>
        <p style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 6, lineHeight: 1.5 }}>
          {a.body}
        </p>
      </a>
    </div>
  );
}

function Articles() {
  return (
    <section
      id="journal"
      className="max-w-7xl mx-auto px-6 md:px-10"
      style={{ paddingTop: 120 }}
    >
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
/*  VISIT / CONTACT                                                    */
/* ------------------------------------------------------------------ */

function Visit() {
  return (
    <section
      id="visit"
      className="max-w-7xl mx-auto px-6 md:px-10"
      style={{ paddingTop: 120 }}
    >
      <Reveal className="text-center">
        <h2 className="font-display section-title">Comfort and performance await you</h2>
        <p className="section-sub">Visit our showroom in Lagos, Nigeria</p>
      </Reveal>

      <Reveal delay={100}>
        <div className="map-frame" style={{ marginTop: 46 }}>
          <iframe
            title="Lord Group Motors showroom location - Lagos, Nigeria"
            src="https://www.google.com/maps?q=Lagos%2C%20Nigeria&output=embed"
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
              <p style={{ fontSize: 13.5, color: "var(--text)", fontWeight: 500 }}>
                Showroom
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--muted)",
                  marginTop: 2,
                  lineHeight: 1.5,
                }}
              >
                Victoria Island
                <br />
                Lagos, Nigeria
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={220}>
          <div className="contact-card">
            <Phone size={17} color="var(--accent)" />
            <div style={{ width: "100%" }}>
              <p style={{ fontSize: 13.5, color: "var(--text)", fontWeight: 500 }}>
                +234 706 172 2513
              </p>
              <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
                Call the sales floor
              </p>
              <div style={{ height: 1, background: "var(--line)", margin: "12px 0" }} />
              <div className="flex items-center gap-2.5">
                <Mail size={16} color="var(--accent)" />
                <p style={{ fontSize: 13.5, color: "var(--text)" }}>
                  {ADMIN_EMAIL}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA                                                                */
/* ------------------------------------------------------------------ */

function CTA() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    interest: "car-sales",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const form = e.target;
      const formDataObj = new FormData(form);
      formDataObj.append("_captcha", "false");
      formDataObj.append("_subject", "New Contact Form Submission - Lord Group Autos");

      const response = await fetch(`https://formsubmit.co/${ADMIN_EMAIL}`, {
        method: "POST",
        body: formDataObj,
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "", interest: "car-sales" });
        setTimeout(() => setSubmitStatus(null), 6000);
      } else {
        setSubmitStatus("error");
        setTimeout(() => setSubmitStatus(null), 6000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 6000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="max-w-7xl mx-auto px-6 md:px-10"
      style={{ paddingTop: 130, paddingBottom: 40 }}
    >
      <Reveal className="text-center">
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(1.9rem, 4vw, 3rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.12,
            color: "var(--text)",
          }}
        >
          Ready to own your
          <br /> next car?
        </h2>
        <p className="section-sub" style={{ marginTop: 12 }}>
          Reach out and let's get you behind the wheel
        </p>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10" style={{ marginTop: 50 }}>
        <Reveal delay={100}>
          <div className="contact-form-wrapper">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234 800 000 0000"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">I'm interested in</label>
                <select
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="car-sales">Car Sales</option>
                  <option value="car-hire">Car Hire / Rental</option>
                  <option value="test-drive">Book a Test Drive</option>
                  <option value="financing">Financing Options</option>
                  <option value="spare-parts">Spare Parts</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what you're looking for..."
                  className="form-textarea"
                  rows="4"
                  required
                />
              </div>

              <button
                type="submit"
                className="contact-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Message</span>
                  </>
                )}
              </button>

              {submitStatus === "success" && (
                <div className="form-success">
                  <div className="form-success-content">
                    <div className="form-success-icon">✅</div>
                    <div>
                      <h4 className="form-success-title">Message Sent Successfully!</h4>
                      <p className="form-success-text">
                        Thank you for reaching out to Lord Group Autos. We've received your
                        message and will get back to you within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="form-error">
                  <div className="form-error-content">
                    <div className="form-error-icon">❌</div>
                    <div>
                      <h4 className="form-error-title">Something Went Wrong</h4>
                      <p className="form-error-text">
                        We couldn't send your message. Please try again or contact us directly
                        at <strong>+234 706 172 2513</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="contact-info-wrapper">
            <div className="contact-info-header">
              <h3
                className="font-display"
                style={{ fontSize: 22, fontWeight: 600, color: "var(--text)" }}
              >
                Get in Touch
              </h3>
              <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 6 }}>
                We're here to help you find the perfect vehicle or rental solution.
              </p>
            </div>

            <div className="contact-info-grid">
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <Phone size={18} color="var(--accent)" />
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>
                    Call Us
                  </p>
                  <p style={{ fontSize: 15, color: "var(--text)", fontWeight: 500 }}>
                    +234 706 172 2513
                  </p>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>Mon-Sat, 8am - 6pm</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <Mail size={18} color="var(--accent)" />
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>
                    Email Us
                  </p>
                  <p style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>
                    {ADMIN_EMAIL}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>We reply within 24hrs</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <MapPin size={18} color="var(--accent)" />
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>
                    Visit Us
                  </p>
                  <p style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>
                    Victoria Island
                  </p>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>Lagos, Nigeria</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <Clock size={18} color="var(--accent)" />
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>
                    Working Hours
                  </p>
                  <p style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>
                    Mon - Sat: 8am - 6pm
                  </p>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>
                    Sunday: By Appointment
                  </p>
                </div>
              </div>
            </div>

            <div className="contact-social">
              <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>
                Connect with us
              </p>
              <div className="contact-social-icons">
                <a href="#" className="social-link">
                  <FaFacebook size={18} color="var(--muted)" />
                </a>
                <a href="#" className="social-link">
                  <FaTwitter size={18} color="var(--muted)" />
                </a>
                <a href="#" className="social-link">
                  <FaInstagram size={18} color="var(--muted)" />
                </a>
                <a href="#" className="social-link">
                  <FaLinkedin size={18} color="var(--muted)" />
                </a>
              </div>
            </div>

            <div className="contact-cta-box">
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                  ✨ Quick Tip:
                </span>{" "}
                Book a test drive online and get a free vehicle inspection report.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        .spinner {
          display: inline-block;
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #ffffff;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .form-success {
          padding: 16px 20px;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid #22c55e;
          border-radius: 12px;
          margin-top: 4px;
          animation: slideDown 0.4s ease;
        }
        .form-success-content { display: flex; gap: 14px; align-items: flex-start; }
        .form-success-icon { font-size: 24px; flex-shrink: 0; margin-top: 2px; }
        .form-success-title {
          color: #22c55e; font-size: 16px; font-weight: 600;
          margin: 0 0 4px 0; font-family: 'Space Grotesk', sans-serif;
        }
        .form-success-text { color: #86efac; font-size: 14px; line-height: 1.5; margin: 0; }

        .form-error {
          padding: 16px 20px;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid #ef4444;
          border-radius: 12px;
          margin-top: 4px;
          animation: slideDown 0.4s ease;
        }
        .form-error-content { display: flex; gap: 14px; align-items: flex-start; }
        .form-error-icon { font-size: 24px; flex-shrink: 0; margin-top: 2px; }
        .form-error-title {
          color: #ef4444; font-size: 16px; font-weight: 600;
          margin: 0 0 4px 0; font-family: 'Space Grotesk', sans-serif;
        }
        .form-error-text { color: #fca5a5; font-size: 14px; line-height: 1.5; margin: 0; }
        .form-error-text strong { color: #ffffff; }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .contact-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .spare-part-order {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 5px 12px;
          border-radius: 999px;
          border: none;
          background: rgba(0,102,204,0.12);
          color: var(--accent);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.25s ease, transform 0.25s ease;
        }
        .spare-part-order:hover {
          background: rgba(0,102,204,0.22);
          transform: translateX(2px);
        }
        .spare-part-order:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FOOTER                                                             */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", marginTop: 70 }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <Logo size={26} />
        <p style={{ fontSize: 12.5, color: "var(--muted)" }} className="text-center">
          Victoria Island, Lagos, Nigeria
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
          <p style={{ fontSize: 11.5, color: "var(--muted)" }}>
            &copy; 2026 Lord Group Motors. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  GLOBAL STYLE                                                       */
/* ------------------------------------------------------------------ */

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

      :root {
        --bg: #0a0a0a;
        --surface: #1a1a1a;
        --surface-alt: #2a2a2a;
        --line: #333333;
        --line-strong: #444444;
        --text: #ffffff;
        --muted: #999999;
        --accent: #0066cc;
        --accent-deep: #004d99;
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

      .reveal {
        opacity: 0;
        transform: translateY(28px);
        transition: opacity 0.8s cubic-bezier(.22,.61,.36,1),
                    transform 0.8s cubic-bezier(.22,.61,.36,1);
      }
      .reveal-visible { opacity: 1; transform: translateY(0); }

      @media (prefers-reduced-motion: reduce) {
        .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
        * { animation: none !important; }
      }

      .section-title {
        font-size: clamp(1.6rem, 3vw, 2.3rem);
        font-weight: 700;
        letter-spacing: -0.02em;
        color: var(--text);
      }
      .section-sub { color: var(--muted); font-size: 14.5px; margin-top: 8px; }

      .nav-link { font-size: 14px; color: var(--muted); transition: color 0.25s ease; }
      .nav-link:hover { color: var(--text); }

      .icon-btn {
        width: 38px; height: 38px; border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        background: var(--surface); border: 1px solid var(--line);
        color: var(--text);
        transition: border-color 0.25s ease, background 0.25s ease;
        cursor: pointer;
      }
      .icon-btn:hover { border-color: var(--accent); background: var(--surface-alt); }

      .btn-primary {
        display: inline-flex; align-items: center; gap: 10px;
        padding: 14px 26px; border-radius: 999px; border: none; cursor: pointer;
        background: var(--accent); color: #ffffff; font-weight: 600; font-size: 14.5px;
        box-shadow: 0 10px 30px rgba(0,102,204,0.28);
        transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        text-decoration: none;
      }
      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 16px 36px rgba(0,102,204,0.4);
        background: #0080ff;
      }
      .btn-primary:disabled {
        opacity: 0.65;
        cursor: not-allowed;
        transform: none;
      }

      .btn-outline {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 12px 22px; border-radius: 999px;
        border: 1px solid var(--line-strong);
        font-size: 14px; color: var(--text);
        background: transparent; cursor: pointer;
        transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
        text-decoration: none;
      }
      .btn-outline:hover {
        border-color: var(--accent);
        background: rgba(0,102,204,0.15);
        transform: translateY(-1px);
      }
      .btn-outline:disabled {
        opacity: 0.65;
        cursor: not-allowed;
        transform: none;
      }

      .hero-frame {
        position: relative; border-radius: 26px; overflow: hidden;
        border: 1px solid var(--line); height: min(62vw, 520px);
        background: var(--surface);
      }
      .hero-image {
        width: 100%; height: 100%; object-fit: cover;
        display: block; transition: transform 0.6s ease; will-change: transform;
      }
      .hero-fade {
        position: absolute; inset: 0;
        background: linear-gradient(180deg, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.6) 100%);
      }
      .hero-tag {
        position: absolute; display: flex; align-items: center; gap: 8px;
        background: rgba(0,0,0,0.8); backdrop-filter: blur(10px);
        border: 1px solid var(--line-strong); border-radius: 999px;
        padding: 9px 16px; font-size: 12.5px; color: var(--text);
      }
      .hero-tag-left { left: 20px; bottom: 20px; }
      .hero-tag-right { right: 20px; top: 20px; }

      .marquee-mask {
        overflow: hidden;
        -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
        mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
      }
      .marquee-track {
        display: flex; gap: 56px; width: max-content;
        animation: marquee 26s linear infinite;
      }
      .marquee-item {
        font-size: 15px; letter-spacing: 0.08em; color: var(--muted);
        white-space: nowrap; opacity: 0.7;
        transition: opacity 0.25s ease, color 0.25s ease;
      }
      .marquee-item:hover { opacity: 1; color: var(--accent); }
      @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

      .car-card {
        background: var(--surface); border: 1px solid var(--line); border-radius: 20px;
        overflow: hidden;
        transition: transform 0.15s ease-out, border-color 0.3s ease, box-shadow 0.3s ease;
        transform-style: preserve-3d; will-change: transform; height: 100%;
      }
      .car-card:hover { border-color: var(--line-strong); box-shadow: 0 24px 50px rgba(0,0,0,0.5); }
      .car-card-media { position: relative; height: 210px; overflow: hidden; }
      .car-card-media img {
        width: 100%; height: 100%; object-fit: cover;
        transition: transform 0.5s ease;
      }
      .car-card:hover .car-card-media img { transform: scale(1.06); }
      .car-card-spot {
        position: absolute; inset: 0;
        transition: opacity 0.2s ease; pointer-events: none;
      }

      .car-card-body { padding: 18px 20px 20px; }
      .car-specs {
        display: flex; gap: 14px; margin-top: 14px; padding-top: 14px;
        border-top: 1px solid var(--line);
      }
      .car-specs span {
        display: flex; align-items: center; gap: 5px;
        font-size: 12px; color: var(--muted);
      }

      .spare-part-card {
        background: var(--surface); border: 1px solid var(--line); border-radius: 16px;
        overflow: hidden;
        transition: transform 0.3s ease, border-color 0.3s ease;
      }
      .spare-part-card:hover { transform: translateY(-4px); border-color: var(--line-strong); }
      .spare-part-image {
        position: relative; height: 160px; overflow: hidden; background: var(--surface-alt);
      }
      .spare-part-image img { width: 100%; height: 100%; object-fit: cover; }
      .spare-part-category {
        position: absolute; bottom: 10px; left: 10px;
        font-size: 10px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
        background: rgba(0,0,0,0.7); backdrop-filter: blur(6px);
        padding: 4px 12px; border-radius: 999px;
        color: var(--muted); border: 1px solid var(--line);
      }
      .spare-part-body { padding: 14px 16px 16px; }

      .trust-card {
        position: relative; border-radius: 20px; overflow: hidden; height: 340px;
        border: 1px solid var(--line);
      }
      .trust-card img {
        width: 100%; height: 100%; object-fit: cover;
        transition: transform 0.6s ease;
      }
      .trust-card:hover img { transform: scale(1.06); }
      .trust-card-overlay {
        position: absolute; inset: 0;
        background: linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.65) 100%);
      }
      .trust-panel {
        position: absolute; left: 16px; right: 16px;
        background: rgba(0,0,0,0.8); backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 16px 18px;
      }
      .trust-panel-top { top: 16px; }
      .trust-panel-bottom { bottom: 16px; }
      .trust-icon {
        width: 30px; height: 30px; border-radius: 9px;
        background: rgba(0,102,204,0.18);
        display: flex; align-items: center; justify-content: center;
        margin-bottom: 10px;
      }

      .review-card {
        background: var(--surface); border: 1px solid var(--line); border-radius: 18px;
        padding: 22px; transition: border-color 0.3s ease, transform 0.3s ease;
      }
      .review-card:hover { border-color: var(--line-strong); transform: translateY(-3px); }
      .avatar-dot {
        width: 34px; height: 34px; border-radius: 999px;
        background: linear-gradient(135deg, var(--accent), var(--accent-deep));
        display: flex; align-items: center; justify-content: center;
        font-size: 13px; font-weight: 600; color: #ffffff;
      }

      .article-card { display: block; }
      .article-media {
        position: relative; border-radius: 18px; overflow: hidden;
        height: 220px; border: 1px solid var(--line);
      }
      .article-media img {
        width: 100%; height: 100%; object-fit: cover;
        transition: transform 0.5s ease;
      }
      .article-card:hover .article-media img { transform: scale(1.07); }
      .article-arrow {
        position: absolute; top: 14px; right: 14px;
        width: 34px; height: 34px; border-radius: 999px;
        background: var(--accent);
        display: flex; align-items: center; justify-content: center;
        transition: transform 0.3s ease;
      }
      .article-card:hover .article-arrow { transform: rotate(45deg); }

      .map-frame { height: 360px; border-radius: 22px; overflow: hidden; border: 1px solid var(--line); }
      .contact-card {
        background: var(--surface); border: 1px solid var(--line); border-radius: 16px;
        padding: 20px; display: flex; gap: 14px; align-items: flex-start;
      }

      .founder-image-wrapper {
        position: relative; border-radius: 20px; overflow: hidden;
        border: 1px solid var(--line); background: var(--surface);
      }
      .founder-image { width: 100%; height: 500px; object-fit: cover; display: block; }
      .founder-image-overlay { position: absolute; bottom: 20px; left: 20px; }
      .founder-tag {
        display: inline-block; padding: 6px 16px; border-radius: 999px;
        background: var(--accent); color: #ffffff;
        font-size: 12px; font-weight: 600; letter-spacing: 0.06em;
      }
      .founder-content { display: flex; flex-direction: column; }
      .founder-services { display: flex; flex-direction: column; gap: 12px; }
      .founder-service-item {
        display: flex; align-items: flex-start; gap: 14px;
        padding: 14px 16px; border-radius: 12px;
        background: var(--surface); border: 1px solid var(--line);
        transition: border-color 0.3s ease;
      }
      .founder-service-item:hover { border-color: var(--accent); }
      .founder-service-icon {
        width: 36px; height: 36px; border-radius: 9px;
        background: rgba(0,102,204,0.12);
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }

      .contact-form-wrapper {
        background: var(--surface); border: 1px solid var(--line);
        border-radius: 20px; padding: 32px;
      }
      .contact-form { display: flex; flex-direction: column; gap: 18px; }
      .form-group { display: flex; flex-direction: column; gap: 6px; }
      .form-label {
        font-size: 13px; font-weight: 500; color: var(--text);
        letter-spacing: 0.02em;
      }
      .form-input,
      .form-select,
      .form-textarea {
        background: var(--bg); border: 1px solid var(--line); border-radius: 10px;
        padding: 12px 16px; color: var(--text); font-size: 14px;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
        font-family: 'Inter', sans-serif; width: 100%;
      }
      .form-input:focus,
      .form-select:focus,
      .form-textarea:focus {
        outline: none; border-color: var(--accent);
        box-shadow: 0 0 0 3px rgba(0,102,204,0.15);
      }
      .form-input::placeholder,
      .form-textarea::placeholder { color: var(--muted); }
      .form-select {
        appearance: none; cursor: pointer;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999999' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 16px center;
      }
      .form-textarea { resize: vertical; min-height: 100px; }
      .contact-submit-btn {
        display: flex; align-items: center; justify-content: center; gap: 10px;
        padding: 14px 28px; background: var(--accent); color: #ffffff;
        border: none; border-radius: 999px; font-weight: 600; font-size: 15px;
        cursor: pointer;
        transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        box-shadow: 0 8px 24px rgba(0,102,204,0.25);
        margin-top: 6px;
      }
      .contact-submit-btn:hover {
        background: #0080ff; transform: translateY(-2px);
        box-shadow: 0 12px 32px rgba(0,102,204,0.35);
      }

      .contact-info-wrapper {
        display: flex; flex-direction: column; gap: 28px; padding: 32px 0;
      }
      .contact-info-header h3 { margin-bottom: 4px; }
      .contact-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .contact-info-item {
        display: flex; align-items: flex-start; gap: 14px;
        padding: 16px; background: var(--surface);
        border: 1px solid var(--line); border-radius: 14px;
        transition: border-color 0.3s ease, transform 0.3s ease;
      }
      .contact-info-item:hover { border-color: var(--accent); transform: translateY(-2px); }
      .contact-info-icon {
        width: 38px; height: 38px; border-radius: 10px;
        background: rgba(0,102,204,0.12);
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      .contact-social { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
      .contact-social-icons { display: flex; gap: 12px; }
      .social-link {
        width: 40px; height: 40px; border-radius: 10px;
        background: var(--surface); border: 1px solid var(--line);
        display: flex; align-items: center; justify-content: center;
        transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
      }
      .social-link:hover {
        border-color: var(--accent); background: rgba(0,102,204,0.08);
        transform: translateY(-2px);
      }
      .contact-cta-box {
        padding: 16px 20px;
        background: rgba(0,102,204,0.06);
        border: 1px solid rgba(0,102,204,0.15);
        border-radius: 12px;
      }

      @media (max-width: 768px) {
        .contact-info-grid { grid-template-columns: 1fr; }
        .contact-form-wrapper { padding: 20px; }
      }
    `}</style>
  );
}

/* ------------------------------------------------------------------ */
/*  APP                                                                */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  return (
    <div className="app-root">
      <GlobalStyle />
      <NavBar />
      <Hero />
      <BrandStrip />
      <NewArrivals />
      <Gallery />
      <SpareParts />
      <TrustSection />
      <AboutSection />
      <Reviews />
      <Articles />
      <Visit />
      <CTA />
      <Footer />
    </div>
  );
}
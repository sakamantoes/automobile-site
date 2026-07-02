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
} from "lucide-react";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import images from "../src/assets/image.js";

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

// Use local images for cars
const CAR_IMAGES = [
  images.Car1, images.Car2, images.Car3, images.Car4, images.Car5,
  images.Car6, images.Car7, images.Car8, images.Car9, images.Car10,
  images.Car11, images.Car12, images.Car13, images.Car14, images.Car15,
  images.Car16, images.Car17, images.Car18, images.Car19, images.Car20,
  images.Car21, images.Car22, images.Car23, images.Car24, images.Car25,
  images.Car26, images.Car27,
];

// Spare parts images from local imports
const SPARE_PARTS_IMAGES = [
  images.AirFilter,
  images.brakePadSet,
  images.alternator,
  images.BatteryV12,
  images.engineOilFilter,
  images.fuelPump,
  images.OilPanGasket,
  images.RadiatorFan,
  images.ShockAbsorber,
  images.SparkPlug,
  images.TimingBelt,
  images.WiperBlades,
];

// Define image ranges for each car
const CAR_IMAGE_RANGES = {
  "Toyota Camry": { start: 0, end: 4 }, // Car1 to Car5
  "Mercedes-AMG": { start: 5, end: 7 }, // Car6 to Car8
  "Lexus": { start: 9, end: 13 }, // Car10 to Car14 (for 2013 ES 350)
  "Mercedes-Benz": { start: 14, end: 17 }, // Car15 to Car18
  "Lexus RX 2012": { start: 19, end: 20 }, // Car20 to Car21
  "Toyota Highlander": { start: 22, end: 23 }, // Car22 to Car24
  "Lexus RX 2018": { start: 25, end: 26 }, // Car25 to Car27
};

const CARS = [
  // Toyota Camry 2010 SE - cover: Car2 (index 1), range: Car1-Car5
  { name: "Toyota Camry", trim: "2010 SE", specs: ["Automatic", "Petrol", "45,000 mi"], img: CAR_IMAGES[1], imageRange: "Toyota Camry" },
  // Mercedes AMG G 63 - cover: Car6 (index 5), range: Car6-Car8
  { name: "Mercedes-AMG", trim: "G 63", specs: ["Automatic", "Petrol", "32,000 mi"], img: CAR_IMAGES[5], imageRange: "Mercedes-AMG" },
  // Lexus 2013 ES 350 - cover: Car10 (index 9), range: Car10-Car14
  { name: "Lexus", trim: "2013 ES 350", specs: ["Automatic", "Petrol", "28,000 mi"], img: CAR_IMAGES[9], imageRange: "Lexus" },
  // Mercedes Benz ML 350 4MATIC - cover: Car15 (index 14), range: Car15-Car18
  { name: "Mercedes-Benz", trim: "ML 350 4MATIC", specs: ["Automatic", "Diesel", "41,000 mi"], img: CAR_IMAGES[14], imageRange: "Mercedes-Benz" },
  // Lexus RX 2012 RX350 - cover: Car20 (index 19), range: Car20-Car21
  { name: "Lexus RX 2012", trim: "RX 350", specs: ["Automatic", "Petrol", "38,000 mi"], img: CAR_IMAGES[19], imageRange: "Lexus RX 2012" },
  // Toyota Highlander XLE SUV - cover: Car24 (index 23), range: Car22-Car24
  { name: "Toyota Highlander", trim: "XLE SUV", specs: ["Automatic", "Petrol", "52,000 mi"], img: CAR_IMAGES[23], imageRange: "Toyota Highlander" },
  // Lexus RX 2018 RX350 - cover: Car27 (index 26), range: Car25-Car27
  { name: "Lexus RX 2018", trim: "RX 350", specs: ["Automatic", "Petrol", "18,000 mi"], img: CAR_IMAGES[26], imageRange: "Lexus RX 2018" },
];

// Spare Parts Data with local images
const SPARE_PARTS = [
  { name: "Air Filter", category: "Filters", img: images.AirFilter },
  { name: "Brake Pad Set", category: "Brakes", img: images.BrakePadSet },
  { name: "Alternator", category: "Electrical", img: images.Alternator },
  { name: "Battery 12V", category: "Electrical", img: images.BatteryV12 },
  { name: "Engine Oil Filter", category: "Filters", img: images.EngineOilFilter },
  { name: "Fuel Pump", category: "Fuel System", img: images.FuelPump },
  { name: "Oil Pan Gasket", category: "Engine", img: images.OilPanGasket },
  { name: "Radiator Fan", category: "Cooling", img: images.RadiatorFan },
  { name: "Shock Absorber", category: "Suspension", img: images.ShockAbsorber },
  { name: "Spark Plug", category: "Ignition", img: images.SparkPlug },
  { name: "Timing Belt", category: "Engine", img: images.TimingBelt },
  { name: "Wiper Blades", category: "Exterior", img: images.WiperBlades },
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
    name: " Musa Bello",
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
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover",
            display: "block",
          }} 
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
          background: "rgba(0,0,0,0.98)",
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
          <p style={{ color: "var(--muted)", fontSize: 17, marginTop: 20, maxWidth: 460, marginInline: "auto" }}>
            Driven by Integrity — Browse a curated, fully inspected inventory with transparent pricing and financing built around you.
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
/*  CAR GALLERY — with click to open lightbox                          */
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
          <img src={car.img} alt={car.name} />
          <div
            className="car-card-spot"
            style={{
              opacity: tilt.active ? 1 : 0,
              background: `radial-gradient(circle at ${tilt.sx}% ${tilt.sy}%, rgba(255,255,255,0.08), transparent 45%)`,
            }}
          />
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

/* ------------------------------------------------------------------ */
/*  LIGHTBOX / MODAL                                                   */
/* ------------------------------------------------------------------ */

function CarLightbox({ car, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!car) return null;

  // Get the image range for this car
  const range = CAR_IMAGE_RANGES[car.imageRange];
  let carImages = [];
  
  if (range) {
    for (let i = range.start; i <= range.end; i++) {
      if (i < CAR_IMAGES.length) {
        carImages.push(CAR_IMAGES[i]);
      }
    }
  }
  
  // Fallback to all images if no range found
  if (carImages.length === 0) {
    carImages = CAR_IMAGES;
  }

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + carImages.length) % carImages.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % carImages.length);
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
        style={{
          animation: "slideUp 0.4s cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full shadow-lg hover:bg-black/70 transition-colors"
          style={{ color: "#ffffff" }}
        >
          <XCircle size={28} />
        </button>

        <div className="p-6">
          <h2 className="font-display text-2xl font-bold mb-2" style={{ color: "#ffffff" }}>
            {car.name}
          </h2>
          <p className="font-mono text-sm" style={{ color: "#999" }}>{car.trim}</p>

          {/* Gallery */}
          <div className="relative mt-4">
            <div className="relative overflow-hidden rounded-xl" style={{ background: "#0a0a0a", height: 400 }}>
              <img
                src={carImages[currentIndex] || car.img}
                alt={`${car.name} view ${currentIndex + 1}`}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Navigation */}
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full shadow-lg hover:bg-black/70 transition-colors"
              style={{ color: "#ffffff" }}
            >
              <ChevronRight className="rotate-180" size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full shadow-lg hover:bg-black/70 transition-colors"
              style={{ color: "#ffffff" }}
            >
              <ChevronRight size={24} />
            </button>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {carImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    i === currentIndex ? "border-[var(--accent)]" : "border-transparent"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="p-3 rounded-lg" style={{ background: "#0a0a0a" }}>
              <p className="text-xs font-mono" style={{ color: "#666" }}>Transmission</p>
              <p className="font-medium" style={{ color: "#ffffff" }}>{car.specs[0]}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: "#0a0a0a" }}>
              <p className="text-xs font-mono" style={{ color: "#666" }}>Fuel</p>
              <p className="font-medium" style={{ color: "#ffffff" }}>{car.specs[1]}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: "#0a0a0a" }}>
              <p className="text-xs font-mono" style={{ color: "#666" }}>Mileage</p>
              <p className="font-medium" style={{ color: "#ffffff" }}>{car.specs[2]}</p>
            </div>
          </div>

          <button className="w-full mt-4 btn-primary justify-center">
            Book a Test Drive
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

function Gallery() {
  const [selectedCar, setSelectedCar] = useState(null);

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
          <CarCard car={car} index={i} key={`${car.name}-${car.trim}`} onOpen={setSelectedCar} />
        ))}
      </div>

      {selectedCar && (
        <CarLightbox car={selectedCar} onClose={() => setSelectedCar(null)} />
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  SPARE PARTS SECTION                                               */
/* ------------------------------------------------------------------ */

function SpareParts() {
  return (
    <section id="spare-parts" className="max-w-7xl mx-auto px-6 md:px-10" style={{ paddingTop: 110 }}>
      <Reveal className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Wrench size={28} color="var(--accent)" />
          <h2 className="font-display section-title">Genuine Spare Parts</h2>
          <Wrench size={28} color="var(--accent)" />
        </div>
        <p className="section-sub">Quality parts for every vehicle — from filters to full engine components</p>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" style={{ marginTop: 46 }}>
        {SPARE_PARTS.map((part, index) => (
          <Reveal delay={(index % 4) * 80} key={index}>
            <div className="spare-part-card">
              <div className="spare-part-image">
                <img src={part.img} alt={part.name} />
                <span className="spare-part-category">{part.category}</span>
              </div>
              <div className="spare-part-body">
                <h3 className="font-display" style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>
                  {part.name}
                </h3>
                <div className="flex items-center justify-between" style={{ marginTop: 10 }}>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>In Stock</span>
                  <span className="spare-part-availability">✓ Available</span>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={100} className="text-center" style={{ marginTop: 40 }}>
        <a href="#visit" className="btn-outline">
          <Cog size={16} />
          Request Custom Parts
        </a>
      </Reveal>
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
        <h2 className="font-display section-title">Why buyers trust Lord Group Autos</h2>
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
/*  ABOUT / FOUNDER SECTION                                            */
/* ------------------------------------------------------------------ */

function AboutSection() {
  return (
    <section id="about" className="max-w-7xl mx-auto px-6 md:px-10" style={{ paddingTop: 120 }}>
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
            <h3 className="font-display" style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
              Obinna Ezichi Fidelis
            </h3>
            <p className="font-mono" style={{ fontSize: 14, color: "var(--accent)", marginTop: 4 }}>
              Founder, Lord Group Autos
            </p>

            <div style={{ height: 2, width: 60, background: "var(--accent)", marginTop: 20, marginBottom: 20 }} />

            <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.7 }}>
              Obinna Ezichi Fidelis is an entrepreneur based in Abia State, with roots in Ugwunagbo LGA. 
              He's a graduate of Urban and Regional Planning from Abia State University, and since 2023 
              he's been building a reputation in the auto industry.
            </p>

            <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.7, marginTop: 14 }}>
              With a planner's mindset and a service-first attitude, Obinna Ezichi leads a mobility business 
              focused on two things: <strong style={{ color: "var(--text)" }}>helping people own reliable cars</strong> and 
              <strong style={{ color: "var(--text)" }}> providing dependable car hire solutions</strong>.
            </p>

            <p style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.7, marginTop: 20, fontWeight: 500 }}>
              Driven by integrity and customer satisfaction, Obinna Ezichi believes trust is more valuable than a quick sale.
            </p>

            <div style={{ marginTop: 24 }}>
              <div className="founder-services">
                <div className="founder-service-item">
                  <div className="founder-service-icon">
                    <Car size={16} color="var(--accent)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Car Sales</h4>
                    <p style={{ fontSize: 12.5, color: "var(--muted)" }}>Sourcing verified, well-maintained vehicles</p>
                  </div>
                </div>
                <div className="founder-service-item">
                  <div className="founder-service-icon">
                    <Users size={16} color="var(--accent)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Car Hire / Rental</h4>
                    <p style={{ fontSize: 12.5, color: "var(--muted)" }}>Flexible rental for airport, business, events</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: "var(--surface)", border: "1px solid var(--line)" }}>
              <p style={{ fontSize: 13, color: "var(--muted)", fontStyle: "italic" }}>
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>Tagline:</span> Reliable Cars. Trusted Hire. Driven by Integrity.
              </p>
            </div>
          </div>
        </Reveal>
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
/*  VISIT / CONTACT — Nigeria map                                      */
/* ------------------------------------------------------------------ */

function Visit() {
  return (
    <section id="visit" className="max-w-7xl mx-auto px-6 md:px-10" style={{ paddingTop: 120 }}>
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
              <p style={{ fontSize: 13.5, color: "var(--text)", fontWeight: 500 }}>Showroom</p>
              <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 2, lineHeight: 1.5 }}>
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
              <p style={{ fontSize: 13.5, color: "var(--text)", fontWeight: 500 }}>+234 706 172 2513</p>
              <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>Call the sales floor</p>
              <div style={{ height: 1, background: "var(--line)", margin: "12px 0" }} />
              <div className="flex items-center gap-2.5">
                <Mail size={16} color="var(--accent)" />
                <p style={{ fontSize: 13.5, color: "var(--text)" }}>lordgroup.limited@gmail.com</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CONTACT / CTA SECTION                                              */
/* ------------------------------------------------------------------ */

function CTA() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    interest: "car-sales",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! We'll get back to you within 24 hours.");
    setFormData({ name: "", email: "", phone: "", message: "", interest: "car-sales" });
  };

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10" style={{ paddingTop: 130, paddingBottom: 40 }}>
      <Reveal className="text-center">
        <h2
          className="font-display"
          style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.12, color: "var(--text)" }}
        >
          Ready to own your
          <br /> next car?
        </h2>
        <p className="section-sub" style={{ marginTop: 12 }}>
          Reach out and let's get you behind the wheel
        </p>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10" style={{ marginTop: 50 }}>
        {/* Contact Form */}
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

              <button type="submit" className="contact-submit-btn">
                <Send size={18} />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </Reveal>

        {/* Contact Info & Quick Links */}
        <Reveal delay={200}>
          <div className="contact-info-wrapper">
            <div className="contact-info-header">
              <h3 className="font-display" style={{ fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
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
                  <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>Call Us</p>
                  <p style={{ fontSize: 15, color: "var(--text)", fontWeight: 500 }}>+234 706 172 2513</p>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>Mon-Sat, 8am - 6pm</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <Mail size={18} color="var(--accent)" />
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>Email Us</p>
                  <p style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>lordgroup.limited@gmail.com</p>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>We reply within 24hrs</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <MapPin size={18} color="var(--accent)" />
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>Visit Us</p>
                  <p style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>Victoria Island</p>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>Lagos, Nigeria</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <Clock size={18} color="var(--accent)" />
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>Working Hours</p>
                  <p style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>Mon - Sat: 8am - 6pm</p>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>Sunday: By Appointment</p>
                </div>
              </div>
            </div>

            <div className="contact-social">
              <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>Connect with us</p>
              <div className="contact-social-icons">
                <a href="#" className="social-link"><FaFacebook size={18} color="var(--muted)" /></a>
                <a href="#" className="social-link"><FaTwitter size={18} color="var(--muted)" /></a>
                <a href="#" className="social-link"><FaInstagram size={18} color="var(--muted)" /></a>
                <a href="#" className="social-link"><FaLinkedin size={18} color="var(--muted)" /></a>
              </div>
            </div>

            <div className="contact-cta-box">
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>✨ Quick Tip:</span> Book a test drive online and get a free vehicle inspection report.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
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
          <p style={{ fontSize: 11.5, color: "var(--muted)" }}>&copy; 2026 Lord Group Motors. All rights reserved.</p>
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
      .btn-outline:hover { border-color: var(--accent); background: rgba(0,102,204,0.15); transform: translateY(-1px); }

      .btn-primary {
        display: inline-flex; align-items: center; gap: 10px;
        padding: 14px 26px; border-radius: 999px; border: none; cursor: pointer;
        background: var(--accent); color: #ffffff; font-weight: 600; font-size: 14.5px;
        box-shadow: 0 10px 30px rgba(0,102,204,0.28);
        transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
      }
      .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 36px rgba(0,102,204,0.4); background: #0080ff; }

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
      .search-submit:hover { background: #0080ff; }

      .hero-frame {
        position: relative; border-radius: 26px; overflow: hidden;
        border: 1px solid var(--line); height: min(62vw, 520px);
        background: var(--surface);
      }
      .hero-image { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.6s ease; will-change: transform; }
      .hero-fade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.6) 100%); }
      .hero-tag {
        position: absolute; display: flex; align-items: center; gap: 8px;
        background: rgba(0,0,0,0.8); backdrop-filter: blur(10px);
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
      .car-card:hover { border-color: var(--line-strong); box-shadow: 0 24px 50px rgba(0,0,0,0.5); }
      .car-card-media { position: relative; height: 210px; overflow: hidden; }
      .car-card-media img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
      .car-card:hover .car-card-media img { transform: scale(1.06); }
      .car-card-spot { position: absolute; inset: 0; transition: opacity 0.2s ease; pointer-events: none; }

      .car-card-body { padding: 18px 20px 20px; }
      .car-specs { display: flex; gap: 14px; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--line); }
      .car-specs span { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--muted); }

      /* Spare Parts Styles */
      .spare-part-card {
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 16px;
        overflow: hidden;
        transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
      }
      .spare-part-card:hover {
        border-color: var(--accent);
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(0,0,0,0.3);
      }
      .spare-part-image {
        position: relative;
        height: 160px;
        overflow: hidden;
        background: var(--bg);
      }
      .spare-part-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }
      .spare-part-card:hover .spare-part-image img {
        transform: scale(1.05);
      }
      .spare-part-category {
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(0,0,0,0.8);
        backdrop-filter: blur(6px);
        padding: 4px 12px;
        border-radius: 999px;
        font-size: 10px;
        font-weight: 600;
        color: var(--text);
        border: 1px solid var(--line);
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .spare-part-body {
        padding: 14px 16px 16px;
      }
      .spare-part-availability {
        font-size: 12px;
        color: #22c55e;
        font-weight: 600;
      }

      .trust-card { position: relative; border-radius: 20px; overflow: hidden; height: 340px; border: 1px solid var(--line); }
      .trust-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
      .trust-card:hover img { transform: scale(1.06); }
      .trust-card-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.65) 100%); }
      .trust-panel {
        position: absolute; left: 16px; right: 16px; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 16px 18px;
      }
      .trust-panel-top { top: 16px; }
      .trust-panel-bottom { bottom: 16px; }
      .trust-icon { width: 30px; height: 30px; border-radius: 9px; background: rgba(0,102,204,0.18); display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }

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

      /* Founder / About Section Styles */
      .founder-image-wrapper {
        position: relative;
        border-radius: 20px;
        overflow: hidden;
        border: 1px solid var(--line);
        background: var(--surface);
      }
      .founder-image {
        width: 100%;
        height: 500px;
        object-fit: cover;
        display: block;
      }
      .founder-image-overlay {
        position: absolute;
        bottom: 20px;
        left: 20px;
      }
      .founder-tag {
        display: inline-block;
        padding: 6px 16px;
        border-radius: 999px;
        background: var(--accent);
        color: #ffffff;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.06em;
      }
      .founder-content {
        display: flex;
        flex-direction: column;
      }
      .founder-services {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .founder-service-item {
        display: flex;
        align-items: flex-start;
        gap: 14px;
        padding: 14px 16px;
        border-radius: 12px;
        background: var(--surface);
        border: 1px solid var(--line);
        transition: border-color 0.3s ease;
      }
      .founder-service-item:hover {
        border-color: var(--accent);
      }
      .founder-service-icon {
        width: 36px;
        height: 36px;
        border-radius: 9px;
        background: rgba(0,102,204,0.12);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      /* Contact Form Styles */
      .contact-form-wrapper {
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 20px;
        padding: 32px;
      }
      .contact-form {
        display: flex;
        flex-direction: column;
        gap: 18px;
      }
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .form-label {
        font-size: 13px;
        font-weight: 500;
        color: var(--text);
        letter-spacing: 0.02em;
      }
      .form-input,
      .form-select,
      .form-textarea {
        background: var(--bg);
        border: 1px solid var(--line);
        border-radius: 10px;
        padding: 12px 16px;
        color: var(--text);
        font-size: 14px;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
        font-family: 'Inter', sans-serif;
        width: 100%;
      }
      .form-input:focus,
      .form-select:focus,
      .form-textarea:focus {
        outline: none;
        border-color: var(--accent);
        box-shadow: 0 0 0 3px rgba(0,102,204,0.15);
      }
      .form-input::placeholder,
      .form-textarea::placeholder {
        color: var(--muted);
      }
      .form-select {
        appearance: none;
        cursor: pointer;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999999' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 16px center;
      }
      .form-textarea {
        resize: vertical;
        min-height: 100px;
      }
      .contact-submit-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 14px 28px;
        background: var(--accent);
        color: #ffffff;
        border: none;
        border-radius: 999px;
        font-weight: 600;
        font-size: 15px;
        cursor: pointer;
        transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        box-shadow: 0 8px 24px rgba(0,102,204,0.25);
        margin-top: 6px;
      }
      .contact-submit-btn:hover {
        background: #0080ff;
        transform: translateY(-2px);
        box-shadow: 0 12px 32px rgba(0,102,204,0.35);
      }

      .contact-info-wrapper {
        display: flex;
        flex-direction: column;
        gap: 28px;
        padding: 32px 0;
      }
      .contact-info-header h3 {
        margin-bottom: 4px;
      }
      .contact-info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      .contact-info-item {
        display: flex;
        align-items: flex-start;
        gap: 14px;
        padding: 16px;
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 14px;
        transition: border-color 0.3s ease, transform 0.3s ease;
      }
      .contact-info-item:hover {
        border-color: var(--accent);
        transform: translateY(-2px);
      }
      .contact-info-icon {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        background: rgba(0,102,204,0.12);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .contact-social {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
      .contact-social-icons {
        display: flex;
        gap: 12px;
      }
      .social-link {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: var(--surface);
        border: 1px solid var(--line);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
      }
      .social-link:hover {
        border-color: var(--accent);
        background: rgba(0,102,204,0.08);
        transform: translateY(-2px);
      }
      .contact-cta-box {
        padding: 16px 20px;
        background: rgba(0,102,204,0.06);
        border: 1px solid rgba(0,102,204,0.15);
        border-radius: 12px;
      }

      @media (max-width: 768px) {
        .contact-info-grid {
          grid-template-columns: 1fr;
        }
        .contact-form-wrapper {
          padding: 20px;
        }
      }
    `}</style>
  );
}

/* ------------------------------------------------------------------ */
/*  APP                                                                 */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  return (
    <div className="app-root">
      <GlobalStyle />
      <NavBar />
      <Hero />
      <BrandStrip />
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
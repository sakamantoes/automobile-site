import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Wrench,
  Cog,
  Battery,
  Fan,
  Gauge,
  Settings2,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
  Star,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Truck,
  CreditCard,
  Award,
  Menu,
  MessageCircle,
} from 'lucide-react';
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import images from '../assets/image.js';

// Spare parts data with local images - NO PRICES
const ALL_SPARE_PARTS = [
  // Engine Parts
  { 
    id: 1, 
    name: "Engine Oil Filter", 
    category: "Engine", 
    subcategory: "Filters",
    img: images.engineOilFilter || images.AirFilter,
    rating: 4.8,
    inStock: true,
    brand: "Genuine",
    compatibility: "Toyota, Honda, Nissan",
    description: "High-quality oil filter for optimal engine performance and longevity."
  },
  { 
    id: 2, 
    name: "Air Filter", 
    category: "Engine", 
    subcategory: "Filters",
    img: images.AirFilter,
    rating: 4.7,
    inStock: true,
    brand: "Genuine",
    compatibility: "Universal fit for most vehicles",
    description: "Premium air filter that ensures clean air intake for better fuel efficiency."
  },
  { 
    id: 3, 
    name: "Timing Belt", 
    category: "Engine", 
    subcategory: "Belts & Chains",
    img: images.TimingBelt,
    rating: 4.9,
    inStock: true,
    brand: "Genuine",
    compatibility: "Toyota, Honda, Nissan, Mercedes",
    description: "Durable timing belt designed for long-lasting performance and reliability."
  },
  { 
    id: 4, 
    name: "Oil Pan Gasket", 
    category: "Engine", 
    subcategory: "Gaskets",
    img: images.OilPanGasket,
    rating: 4.6,
    inStock: true,
    brand: "Genuine",
    compatibility: "Universal fit",
    description: "Premium oil pan gasket that prevents leaks and ensures proper sealing."
  },
  { 
    id: 5, 
    name: "Spark Plug", 
    category: "Engine", 
    subcategory: "Ignition",
    img: images.SparkPlug,
    rating: 4.7,
    inStock: true,
    brand: "NGK",
    compatibility: "Universal fit for most vehicles",
    description: "High-performance spark plug for efficient combustion and better fuel economy."
  },

  // Electrical Parts
  { 
    id: 6, 
    name: "Battery 12V", 
    category: "Electrical", 
    subcategory: "Batteries",
    img: images.BatteryV12,
    rating: 4.8,
    inStock: true,
    brand: "Genuine",
    compatibility: "Universal fit for most vehicles",
    description: "Reliable 12V battery with long-lasting performance and quick start capability."
  },
  { 
    id: 7, 
    name: "Alternator", 
    category: "Electrical", 
    subcategory: "Charging",
    img: images.alternator,
    rating: 4.9,
    inStock: true,
    brand: "Genuine",
    compatibility: "Toyota, Honda, Nissan, Mercedes",
    description: "High-output alternator that ensures reliable power delivery to all electrical systems."
  },

  // Brake Parts
  { 
    id: 8, 
    name: "Brake Pad Set", 
    category: "Brakes", 
    subcategory: "Brake Pads",
    img: images.brakePadSet,
    rating: 4.9,
    inStock: true,
    brand: "Genuine",
    compatibility: "Universal fit for most vehicles",
    description: "Premium ceramic brake pads for superior stopping power and reduced brake dust."
  },
  { 
    id: 9, 
    name: "Shock Absorber", 
    category: "Suspension", 
    subcategory: "Shocks",
    img: images.ShockAbsorber,
    rating: 4.7,
    inStock: true,
    brand: "Genuine",
    compatibility: "Universal fit for most vehicles",
    description: "High-performance shock absorber for improved ride comfort and vehicle stability."
  },

  // Fuel System
  { 
    id: 10, 
    name: "Fuel Pump", 
    category: "Fuel System", 
    subcategory: "Fuel Pumps",
    img: images.fuelPump,
    rating: 4.8,
    inStock: true,
    brand: "Genuine",
    compatibility: "Universal fit for most vehicles",
    description: "Reliable fuel pump that ensures consistent fuel delivery for optimal engine performance."
  },

  // Cooling System
  { 
    id: 11, 
    name: "Radiator Fan", 
    category: "Cooling", 
    subcategory: "Cooling Fans",
    img: images.RadiatorFan,
    rating: 4.6,
    inStock: true,
    brand: "Genuine",
    compatibility: "Universal fit for most vehicles",
    description: "High-efficiency radiator fan for optimal engine cooling and temperature regulation."
  },

  // Exterior Parts
  { 
    id: 12, 
    name: "Wiper Blades (Set)", 
    category: "Exterior", 
    subcategory: "Wipers",
    img: images.WiperBlades,
    rating: 4.5,
    inStock: true,
    brand: "Genuine",
    compatibility: "Universal fit for most vehicles",
    description: "Premium wiper blades for clear visibility in all weather conditions."
  },

  // Additional Parts
  { 
    id: 13, 
    name: "Engine Oil 5W-30", 
    category: "Engine", 
    subcategory: "Lubricants",
    img: images.engineOilFilter || images.AirFilter,
    rating: 4.8,
    inStock: true,
    brand: "Genuine",
    compatibility: "Universal fit for most vehicles",
    description: "Premium engine oil for superior engine protection and performance."
  },
  { 
    id: 14, 
    name: "Brake Fluid DOT 4", 
    category: "Brakes", 
    subcategory: "Fluids",
    img: images.brakePadSet || images.AirFilter,
    rating: 4.7,
    inStock: true,
    brand: "Genuine",
    compatibility: "Universal fit for most vehicles",
    description: "High-performance brake fluid for reliable braking in all conditions."
  },
  { 
    id: 15, 
    name: "Coolant/Antifreeze", 
    category: "Cooling", 
    subcategory: "Fluids",
    img: images.RadiatorFan || images.AirFilter,
    rating: 4.6,
    inStock: true,
    brand: "Genuine",
    compatibility: "Universal fit for most vehicles",
    description: "Premium coolant for optimal engine temperature regulation."
  },
];

// Categories for filtering
const categories = ["All", "Engine", "Electrical", "Brakes", "Suspension", "Fuel System", "Cooling", "Exterior"];
const brands = ["All", "Genuine", "NGK", "Bosch", "Denso"];

// Navbar Component
function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center"
            style={{
              width: 40,
              height: 40,
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
        <nav className="hidden lg:flex items-center gap-8">
          <a href="/" className="nav-link">Home</a>
          <a href="/gallery" className="nav-link">Gallery</a>
          <a href="/spare-parts" className="nav-link" style={{ color: "var(--accent)" }}>Spare Parts</a>
          <a href="/#about" className="nav-link">About</a>
          <a href="/#contact" className="nav-link">Contact</a>
        </nav>
        <button className="icon-btn lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={19} />
        </button>
      </div>

      {/* Mobile Menu */}
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
          <div className="flex items-center gap-3">
            <span
              className="flex items-center justify-center"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "linear-gradient(135deg, var(--accent), var(--accent-deep))",
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
            <span className="font-display" style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>
              Lord Group<span style={{ color: "var(--accent)" }}> AUTOS</span>
            </span>
          </div>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={19} />
          </button>
        </div>
        <nav className="flex flex-col px-8 pt-6 gap-1">
          <a href="/" onClick={() => setOpen(false)} className="font-display" style={{ fontSize: 28, padding: "14px 0", borderBottom: "1px solid var(--line)", color: "var(--text)" }}>Home</a>
          <a href="/gallery" onClick={() => setOpen(false)} className="font-display" style={{ fontSize: 28, padding: "14px 0", borderBottom: "1px solid var(--line)", color: "var(--text)" }}>Gallery</a>
          <a href="/spare-parts" onClick={() => setOpen(false)} className="font-display" style={{ fontSize: 28, padding: "14px 0", borderBottom: "1px solid var(--line)", color: "var(--accent)" }}>Spare Parts</a>
          <a href="/#about" onClick={() => setOpen(false)} className="font-display" style={{ fontSize: 28, padding: "14px 0", borderBottom: "1px solid var(--line)", color: "var(--text)" }}>About</a>
          <a href="/#contact" onClick={() => setOpen(false)} className="font-display" style={{ fontSize: 28, padding: "14px 0", borderBottom: "1px solid var(--line)", color: "var(--text)" }}>Contact</a>
        </nav>
      </div>
    </header>
  );
}

// Footer Component
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", marginTop: 70 }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, var(--accent), var(--accent-deep))",
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
          <span className="font-display" style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
            Lord Group<span style={{ color: "var(--accent)" }}> AUTOS</span>
          </span>
        </div>
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

// Spare Part Card Component - NO PRICE
function PartCard({ part, onRequestQuote }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="part-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="part-card-image">
        <img src={part.img} alt={part.name} loading="lazy" />
        {part.inStock && (
          <span className="part-badge in-stock">
            <CheckCircle size={12} /> In Stock
          </span>
        )}
        <div className="part-card-overlay" style={{ opacity: isHovered ? 1 : 0 }}>
         
        </div>
      </div>
      <div className="part-card-body">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="part-card-title">{part.name}</h3>
            <p className="part-card-subtitle">{part.brand} · {part.subcategory}</p>
          </div>
          <div className="flex items-center gap-1">
            <Star size={14} color="var(--accent)" fill="var(--accent)" />
            <span style={{ fontSize: 13, color: "var(--text)" }}>{part.rating}</span>
          </div>
        </div>
        <p className="part-card-description">{part.description}</p>
        <div className="part-card-footer">
          <span className="part-card-availability">✓ Available</span>
        </div>
      </div>
    </div>
  );
}


// Main Spare Parts Page
const SparePartsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPart, setSelectedPart] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState("name");

  // Filter and sort parts
  const filteredParts = ALL_SPARE_PARTS
    .filter(part => {
      const matchesCategory = selectedCategory === "All" || part.category === selectedCategory;
      const matchesBrand = selectedBrand === "All" || part.brand === selectedBrand;
      const matchesSearch = part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           part.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           part.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesBrand && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "rating") return parseFloat(b.rating) - parseFloat(a.rating);
      return 0;
    });

  const handleRequestQuote = (part) => {
    setSelectedPart(part);
    setShowModal(true);
  };

  const handleQuoteSubmit = () => {
    setShowModal(false);
  };

  return (
    <div className="app-root">
      <GlobalStyle />
      <NavBar />

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ paddingTop: 76 }}>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, rgba(0,102,204,0.15), transparent 60%), var(--bg)",
          }}
        />
        <div className="relative max-w-6xl mx-auto text-center px-6 pt-16 pb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wrench size={32} color="var(--accent)" />
            <h1
              className="font-display"
              style={{
                fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
                lineHeight: 1.04,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--text)",
              }}
            >
              Genuine
              <br />
              <span style={{ color: "var(--accent)" }}>Spare Parts</span>
            </h1>
            <Wrench size={32} color="var(--accent)" />
          </div>
          <p style={{ color: "var(--muted)", fontSize: 17, marginTop: 16, maxWidth: 520, marginInline: "auto" }}>
            Quality parts for every vehicle — request a quote and we'll get back to you
          </p>

          {/* Search Bar */}
          <div className="search-bar" style={{ marginTop: 30 }}>
            <Search size={18} color="var(--muted)" style={{ marginLeft: 10 }} />
            <input
              type="text"
              placeholder="Search parts by name, category..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-submit">
              <Search size={16} color="#ffffff" />
            </button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="filters-panel">
          <div className="filters-grid">
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <select
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Brand</label>
              <select
                className="filter-select"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          <div className="filters-actions">
            <span style={{ fontSize: 13, color: "var(--muted)" }}>
              {filteredParts.length} parts available
            </span>
            <button 
              className="btn-outline"
              onClick={() => {
                setSelectedCategory("All");
                setSelectedBrand("All");
                setSearchQuery("");
                setSortBy("name");
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </section>

      {/* Parts Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-10" style={{ paddingTop: 40 }}>
        {filteredParts.length === 0 ? (
          <div className="text-center" style={{ padding: 80 }}>
            <Wrench size={64} color="var(--muted)" />
            <h3 className="font-display" style={{ fontSize: 24, color: "var(--text)", marginTop: 20 }}>
              No parts found
            </h3>
            <p style={{ color: "var(--muted)", marginTop: 8 }}>
              Try adjusting your filters to find more options
            </p>
            <button 
              className="btn-outline" 
              onClick={() => {
                setSelectedCategory("All");
                setSelectedBrand("All");
                setSearchQuery("");
                setSortBy("name");
              }}
              style={{ marginTop: 16 }}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="parts-grid">
            {filteredParts.map(part => (
              <PartCard key={part.id} part={part} onRequestQuote={handleRequestQuote} />
            ))}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-10" style={{ paddingTop: 60 }}>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Truck size={24} color="var(--accent)" />
            </div>
            <div>
              <h3 className="stat-number">24/7</h3>
              <p className="stat-label">Fast Delivery</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <ShieldCheck size={24} color="var(--accent)" />
            </div>
            <div>
              <h3 className="stat-number">100%</h3>
              <p className="stat-label">Genuine Parts</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Award size={24} color="var(--accent)" />
            </div>
            <div>
              <h3 className="stat-number">1 Year</h3>
              <p className="stat-label">Warranty</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <MessageCircle size={24} color="var(--accent)" />
            </div>
            <div>
              <h3 className="stat-number">Get Quote</h3>
              <p className="stat-label">Request Pricing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Modal */}
      {showModal && selectedPart && (
        <QuoteModal 
          part={selectedPart} 
          onClose={() => setShowModal(false)}
          onSubmit={handleQuoteSubmit}
        />
      )}

      <Footer />

      <GlobalStyle />
    </div>
  );
};

// Global Style Component
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

      .nav-link {
        font-size: 14px;
        color: var(--muted);
        transition: color 0.25s ease;
        text-decoration: none;
      }
      .nav-link:hover { color: var(--text); }

      .icon-btn {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--surface);
        border: 1px solid var(--line);
        color: var(--text);
        transition: border-color 0.25s ease, background 0.25s ease;
        cursor: pointer;
      }
      .icon-btn:hover { border-color: var(--accent); background: var(--surface-alt); }

      .btn-outline {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        border-radius: 999px;
        border: 1px solid var(--line-strong);
        font-size: 13.5px;
        color: var(--text);
        transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
        background: transparent;
        cursor: pointer;
        text-decoration: none;
      }
      .btn-outline:hover {
        border-color: var(--accent);
        background: rgba(0,102,204,0.15);
        transform: translateY(-1px);
      }

      .search-bar {
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--surface);
        border: 1px solid var(--line-strong);
        border-radius: 999px;
        padding: 6px;
        max-width: 520px;
        margin-inline: auto;
      }
      .search-input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: var(--text);
        font-size: 14px;
        padding: 10px 4px;
      }
      .search-input::placeholder { color: var(--muted); }
      .search-submit {
        width: 40px;
        height: 40px;
        border-radius: 999px;
        border: none;
        cursor: pointer;
        background: var(--accent);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: background 0.25s ease;
      }
      .search-submit:hover { background: #0080ff; }

      .filters-panel {
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 20px 24px;
      }
      .filters-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
      }
      .filter-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .filter-label {
        font-size: 12px;
        font-weight: 600;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .filter-select {
        background: var(--bg);
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 8px 12px;
        color: var(--text);
        font-size: 14px;
        transition: border-color 0.3s ease;
        font-family: 'Inter', sans-serif;
        cursor: pointer;
      }
      .filter-select:focus {
        outline: none;
        border-color: var(--accent);
      }
      .filters-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--line);
      }

      .parts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 24px;
      }

      .part-card {
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 16px;
        overflow: hidden;
        transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      .part-card:hover {
        border-color: var(--accent);
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(0,0,0,0.3);
      }
      .part-card-image {
        position: relative;
        height: 200px;
        overflow: hidden;
        background: var(--bg);
        flex-shrink: 0;
      }
      .part-card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }
      .part-card:hover .part-card-image img {
        transform: scale(1.05);
      }
      .part-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 12px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 600;
        background: rgba(34, 197, 94, 0.9);
        color: #ffffff;
      }
      .part-card-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.3s ease;
      }
      .part-quick-view {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        background: var(--accent);
        border: none;
        border-radius: 999px;
        color: #ffffff;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        box-shadow: 0 8px 24px rgba(0,102,204,0.3);
      }
      .part-quick-view:hover {
        transform: scale(1.05);
        box-shadow: 0 12px 32px rgba(0,102,204,0.4);
      }
      .part-card-body {
        padding: 16px 18px 18px;
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .part-card-title {
        font-size: 15px;
        font-weight: 600;
        color: var(--text);
        margin: 0;
      }
      .part-card-subtitle {
        font-size: 12px;
        color: var(--muted);
        margin: 2px 0 0 0;
      }
      .part-card-description {
        font-size: 13px;
        color: var(--muted);
        margin: 10px 0 0 0;
        line-height: 1.5;
        flex: 1;
      }
      .part-card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 14px;
        padding-top: 14px;
        border-top: 1px solid var(--line);
      }
      .part-card-availability {
        font-size: 13px;
        color: #22c55e;
        font-weight: 600;
      }
      .part-card-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 8px 16px;
        border-radius: 999px;
        border: none;
        background: rgba(0,102,204,0.12);
        color: var(--accent);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s ease, transform 0.3s ease;
      }
      .part-card-btn:hover {
        background: rgba(0,102,204,0.2);
        transform: translateX(2px);
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
        margin-top: 20px;
      }
      .stat-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px;
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 14px;
        transition: border-color 0.3s ease, transform 0.3s ease;
      }
      .stat-card:hover {
        border-color: var(--accent);
        transform: translateY(-2px);
      }
      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: rgba(0,102,204,0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .stat-number {
        font-size: 20px;
        font-weight: 700;
        color: var(--text);
        margin: 0;
        font-family: 'Space Grotesk', sans-serif;
      }
      .stat-label {
        font-size: 13px;
        color: var(--muted);
        margin: 0;
      }

      .order-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-top: 16px;
      }
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .form-label {
        font-size: 13px;
        font-weight: 500;
        color: var(--text);
      }
      .form-input,
      .form-textarea {
        background: var(--bg);
        border: 1px solid var(--line);
        border-radius: 10px;
        padding: 10px 14px;
        color: var(--text);
        font-size: 14px;
        transition: border-color 0.3s ease;
        font-family: 'Inter', sans-serif;
        width: 100%;
      }
      .form-input:focus,
      .form-textarea:focus {
        outline: none;
        border-color: var(--accent);
      }
      .form-textarea {
        resize: vertical;
        min-height: 80px;
      }
      .order-submit-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 14px 24px;
        background: var(--accent);
        color: #ffffff;
        border: none;
        border-radius: 999px;
        font-weight: 600;
        font-size: 15px;
        cursor: pointer;
        transition: background 0.3s ease, transform 0.3s ease;
        margin-top: 8px;
      }
      .order-submit-btn:hover:not(:disabled) {
        background: #0080ff;
        transform: translateY(-2px);
      }
      .order-submit-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      @media (max-width: 768px) {
        .filters-grid {
          grid-template-columns: 1fr 1fr;
        }
        .filters-actions {
          flex-direction: column;
          gap: 12px;
          align-items: stretch;
        }
        .parts-grid {
          grid-template-columns: 1fr;
        }
        .stats-grid {
          grid-template-columns: 1fr 1fr;
        }
      }
    `}</style>
  );
}

export default SparePartsPage;
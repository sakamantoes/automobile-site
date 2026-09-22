import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Wrench,
  ShieldCheck,
  ArrowUpRight,
  Star,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Truck,
  Award,
  Menu,
  Send,
} from 'lucide-react';
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import images from '../assets/image.js';
import { getListings } from '../utils/api';

const categories = ['All', 'Engine', 'Electrical', 'Brakes', 'Suspension', 'Fuel System', 'Cooling', 'Exterior'];
const brands = ['All', 'Genuine', 'NGK', 'Bosch', 'Denso'];

const normalizePart = (part) => ({
  ...part,
  id: part._id,
  img: part.coverImage?.url || part.imageUrl || '',
  name: part.name || 'Untitled',
  category: part.category || 'Other',
  subcategory: part.subcategory || 'Parts',
  brand: part.brand || 'Genuine',
  rating: part.rating ?? 4.8,
  description: part.description || 'Quality replacement part for your vehicle.',
  inStock: part.inStock !== false,
});

const redirectToEmail = (part) => {
  const subject = encodeURIComponent(`Order / Quote Request — ${part.name}`);
  const body = encodeURIComponent(
    `Hello Lord Group Autos,\n\nI'd like to request a quote / place an order for:\n\n` +
      `Part: ${part.name}\n` +
      `Brand: ${part.brand || '—'}\n` +
      `Category: ${part.category || '—'}\n` +
      `Subcategory: ${part.subcategory || '—'}\n\n` +
      `Please get back to me with pricing and availability.\n\nThank you!`
  );
  window.location.href = `mailto:lordgroup.limited@gmail.com?subject=${subject}&body=${body}`;
};

/* ------------------------------------------------------------------ */
/*  Part card                                                          */
/* ------------------------------------------------------------------ */

function PartCard({ part }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="part-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="part-card-image">
        {part.img ? (
          <img src={part.img} alt={part.name} loading="lazy" />
        ) : (
          <div className="part-noimg"><Wrench size={32} /></div>
        )}
        {part.inStock && (
          <span className="part-badge in-stock">
            <CheckCircle size={12} /> In Stock
          </span>
        )}
        <div className="part-card-overlay" style={{ opacity: hovered ? 1 : 0 }}>
          <button className="part-quick-view" onClick={() => redirectToEmail(part)}>
            <MessageCircle size={16} /> Place Order
          </button>
        </div>
      </div>
      <div className="part-card-body">
        <div className="part-head">
          <div>
            <h3 className="part-card-title">{part.name}</h3>
            <p className="part-card-subtitle">{part.brand} · {part.subcategory}</p>
          </div>
          <div className="part-rating">
            <Star size={14} color="var(--accent)" fill="var(--accent)" />
            <span>{part.rating}</span>
          </div>
        </div>
        <p className="part-card-description">{part.description}</p>
        <div className="part-card-footer">
          <span className="part-card-availability">✓ Available</span>
          <button className="part-card-btn" onClick={() => redirectToEmail(part)}>
            Place Order <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const SparePartsPage = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    setLoading(true);
    getListings('spare-parts')
      .then((listings) => setParts((listings || []).map(normalizePart)))
      .catch(() => setParts([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredParts = parts
    .filter((part) => {
      const matchesCategory = selectedCategory === 'All' || part.category === selectedCategory;
      const matchesBrand = selectedBrand === 'All' || part.brand === selectedBrand;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        part.name.toLowerCase().includes(q) ||
        part.category.toLowerCase().includes(q) ||
        part.subcategory.toLowerCase().includes(q);
      return matchesCategory && matchesBrand && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  const clearAll = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSearchQuery('');
    setSortBy('name');
  };

  return (
    <div className="app-root">
      <GlobalStyle />
      <NavBar active="spare-parts" />

      <section className="page-hero">
        <div className="hero-head">
          <Wrench size={28} color="var(--accent)" />
          <h1 className="font-display hero-title">
            Genuine
            <br />
            <span style={{ color: 'var(--accent)' }}>Spare Parts</span>
          </h1>
          <Wrench size={28} color="var(--accent)" />
        </div>
        <p className="hero-sub">
          Quality parts for every vehicle — request a quote and we'll get back to you
        </p>

        <div className="search-bar">
          <Search size={18} color="var(--muted)" style={{ marginLeft: 10 }} />
          <input
            type="text"
            placeholder="Search parts by name, category..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-submit" aria-label="Search">
            <Search size={16} color="#fff" />
          </button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="filters-panel">
          <div className="filters-grid">
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <select className="filter-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Brand</label>
              <select className="filter-select" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="name">Name</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
          <div className="filters-actions">
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>
              {loading ? 'Loading parts…' : `${filteredParts.length} parts available`}
            </span>
            <button className="btn-outline" onClick={clearAll}>Clear Filters</button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10" style={{ paddingTop: 40 }}>
        {loading ? (
          <div className="parts-grid">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="part-skeleton" />)}
          </div>
        ) : filteredParts.length === 0 ? (
          <div className="empty-state">
            <Wrench size={64} color="var(--muted)" />
            <h3 className="font-display">No parts found</h3>
            <p>Try adjusting your filters to find more options</p>
            <button className="btn-outline" onClick={clearAll}>Clear All Filters</button>
          </div>
        ) : (
          <div className="parts-grid">
            {filteredParts.map((part) => <PartCard key={part.id} part={part} />)}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10" style={{ paddingTop: 60 }}>
        <div className="stats-grid">
          <StatCard icon={<Truck size={22} color="var(--accent)" />} title="24/7" label="Fast Delivery" />
          <StatCard icon={<ShieldCheck size={22} color="var(--accent)" />} title="100%" label="Genuine Parts" />
          <StatCard icon={<Award size={22} color="var(--accent)" />} title="1 Year" label="Warranty" />
          <StatCard icon={<MessageCircle size={22} color="var(--accent)" />} title="Place Order" label="Request Pricing" />
        </div>
      </section>

      <Footer />
    </div>
  );
};

function StatCard({ icon, title, label }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <h3 className="stat-number">{title}</h3>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  NavBar / Footer                                                    */
/* ------------------------------------------------------------------ */

function NavBar({ active }) {
  const [open, setOpen] = useState(false);
  const links = [
    { href: '/', label: 'Home', key: 'home' },
    { href: '/gallery', label: 'Gallery', key: 'gallery' },
    { href: '/spare-parts', label: 'Spare Parts', key: 'spare-parts' },
    { href: '/#about', label: 'About', key: 'about' },
    { href: '/#contact', label: 'Contact', key: 'contact' },
  ];

  return (
    <header className="site-nav">
      <div className="nav-inner">
        <a href="/" className="nav-logo">
          <span className="nav-logo-img">
            <img src={images.Logo2} alt="Lord Group Autos" />
          </span>
          <span className="font-display nav-logo-text">
            Lord Group<span style={{ color: 'var(--accent)' }}> AUTOS</span>
          </span>
        </a>
        <nav className="nav-links">
          {links.map((l) => (
            <a key={l.key} href={l.href} className={`nav-link ${active === l.key ? 'active' : ''}`}>
              {l.label}
            </a>
          ))}
        </nav>
        <button className="icon-btn nav-mobile-toggle" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={19} />
        </button>
      </div>
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        <div className="mobile-menu-head">
          <span className="font-display nav-logo-text">
            Lord Group<span style={{ color: 'var(--accent)' }}> AUTOS</span>
          </span>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={19} />
          </button>
        </div>
        <nav className="mobile-menu-links">
          {links.map((l) => (
            <a key={l.key} href={l.href} onClick={() => setOpen(false)} className={`mobile-link ${active === l.key ? 'active' : ''}`}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="nav-logo-img small">
            <img src={images.Logo2} alt="Lord Group Autos" />
          </span>
          <span className="font-display nav-logo-text">
            Lord Group<span style={{ color: 'var(--accent)' }}> AUTOS</span>
          </span>
        </div>
        <p className="footer-loc">Victoria Island, Lagos, Nigeria</p>
        <div className="footer-social">
          <FaFacebook size={16} />
          <FaTwitter size={16} />
          <FaInstagram size={16} />
          <FaLinkedin size={16} />
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Lord Group Motors. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Global styles                                                      */
/* ------------------------------------------------------------------ */

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

      :root {
        --bg: #0a0a0a;
        --surface: #1a1a1a;
        --surface-alt: #2a2a2a;
        --line: #333;
        --line-strong: #444;
        --text: #fff;
        --muted: #999;
        --accent: #0066cc;
        --accent-deep: #004d99;
      }
      * { box-sizing: border-box; }
      .font-display { font-family: 'Space Grotesk', sans-serif; }
      .font-mono { font-family: 'IBM Plex Mono', monospace; }

      .app-root {
        background: var(--bg); color: var(--text);
        font-family: 'Inter', sans-serif; min-height: 100vh; overflow-x: hidden;
      }

      /* Nav */
      .site-nav {
        position: fixed; top: 0; left: 0; right: 0; z-index: 60;
        background: rgba(0,0,0,0.92); backdrop-filter: blur(14px);
        border-bottom: 1px solid var(--line);
      }
      .nav-inner {
        max-width: 1280px; margin: 0 auto; padding: 0 24px;
        height: 76px; display: flex; align-items: center; justify-content: space-between;
      }
      .nav-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
      .nav-logo-img {
        width: 40px; height: 40px; border-radius: 10px; overflow: hidden;
        background: linear-gradient(135deg, var(--accent), var(--accent-deep));
        box-shadow: 0 4px 16px rgba(0,102,204,0.35); flex-shrink: 0;
      }
      .nav-logo-img.small { width: 32px; height: 32px; border-radius: 8px; }
      .nav-logo-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .nav-logo-text { font-size: 20px; font-weight: 700; letter-spacing: -0.02em; color: var(--text); }
      .nav-links { display: flex; gap: 28px; }
      .nav-link { font-size: 14px; color: var(--muted); text-decoration: none; transition: color .25s ease; }
      .nav-link:hover { color: var(--text); }
      .nav-link.active { color: var(--accent); }
      .nav-mobile-toggle { display: none; }
      .icon-btn {
        width: 38px; height: 38px; border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        background: var(--surface); border: 1px solid var(--line);
        color: var(--text); cursor: pointer;
        transition: border-color .25s ease, background .25s ease;
      }
      .icon-btn:hover { border-color: var(--accent); background: var(--surface-alt); }
      .mobile-menu {
        position: fixed; inset: 0; z-index: 90; background: #000;
        opacity: 0; pointer-events: none; transition: opacity .3s ease;
      }
      .mobile-menu.open { opacity: 1; pointer-events: auto; }
      .mobile-menu-head {
        height: 76px; padding: 0 24px;
        display: flex; align-items: center; justify-content: space-between;
      }
      .mobile-menu-links { display: flex; flex-direction: column; padding: 12px 32px; }
      .mobile-link {
        font-family: 'Space Grotesk', sans-serif; font-size: 26px;
        padding: 14px 0; color: var(--text);
        border-bottom: 1px solid var(--line); text-decoration: none;
      }
      .mobile-link.active { color: var(--accent); }

      /* Hero */
      .page-hero {
        padding: 76px 24px 40px; text-align: center;
        background: radial-gradient(60% 50% at 50% 0%, rgba(0,102,204,0.15), transparent 60%), var(--bg);
      }
      .hero-head { display: flex; align-items: center; justify-content: center; gap: 14px; margin-top: 40px; }
      .hero-title {
        font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.04;
        font-weight: 700; letter-spacing: -0.03em; margin: 0;
      }
      .hero-sub { color: var(--muted); font-size: 16px; margin-top: 14px; max-width: 520px; margin-inline: auto; }
      .search-bar {
        display: flex; align-items: center; gap: 8px;
        background: var(--surface); border: 1px solid var(--line-strong);
        border-radius: 999px; padding: 6px;
        max-width: 520px; margin: 26px auto 0;
      }
      .search-input { flex: 1; background: transparent; border: none; outline: none; color: var(--text); font-size: 14px; padding: 10px 4px; }
      .search-input::placeholder { color: var(--muted); }
      .search-submit {
        width: 40px; height: 40px; border-radius: 999px; border: none;
        background: var(--accent); cursor: pointer;
        display: flex; align-items: center; justify-content: center;
      }
      .search-submit:hover { background: #0080ff; }

      .btn-outline {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 10px 20px; border-radius: 999px;
        border: 1px solid var(--line-strong); font-size: 13.5px;
        color: var(--text); background: transparent; cursor: pointer;
        transition: border-color .25s ease, background .25s ease, transform .25s ease;
      }
      .btn-outline:hover { border-color: var(--accent); background: rgba(0,102,204,0.15); transform: translateY(-1px); }

      /* Filters */
      .filters-panel { background: var(--surface); border: 1px solid var(--line); border-radius: 16px; padding: 20px 24px; }
      .filters-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }
      .filter-group { display: flex; flex-direction: column; gap: 4px; }
      .filter-label { font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; }
      .filter-select {
        background: var(--bg); border: 1px solid var(--line); border-radius: 8px;
        padding: 8px 12px; color: var(--text); font-size: 14px;
        font-family: 'Inter', sans-serif; cursor: pointer;
      }
      .filter-select:focus { outline: none; border-color: var(--accent); }
      .filters-actions {
        display: flex; align-items: center; justify-content: space-between;
        margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--line);
      }

      /* Parts */
      .parts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
      .part-card {
        background: var(--surface); border: 1px solid var(--line); border-radius: 16px;
        overflow: hidden; display: flex; flex-direction: column; height: 100%;
        transition: border-color .3s ease, transform .3s ease, box-shadow .3s ease;
      }
      .part-card:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.3); }
      .part-card-image {
        position: relative; height: 200px; overflow: hidden;
        background: var(--bg); flex-shrink: 0;
      }
      .part-card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
      .part-card:hover .part-card-image img { transform: scale(1.05); }
      .part-noimg {
        width: 100%; height: 100%;
        display: flex; align-items: center; justify-content: center; color: var(--muted);
      }
      .part-badge {
        position: absolute; top: 10px; left: 10px;
        display: flex; align-items: center; gap: 4px;
        padding: 4px 12px; border-radius: 999px;
        font-size: 11px; font-weight: 600;
        background: rgba(34, 197, 94, 0.9); color: #fff;
      }
      .part-card-overlay {
        position: absolute; inset: 0; background: rgba(0,0,0,0.7);
        display: flex; align-items: center; justify-content: center;
        transition: opacity .3s ease;
      }
      .part-quick-view {
        display: flex; align-items: center; gap: 8px;
        padding: 12px 24px; background: var(--accent);
        border: none; border-radius: 999px; color: #fff;
        font-weight: 600; font-size: 14px; cursor: pointer;
        box-shadow: 0 8px 24px rgba(0,102,204,0.3);
      }
      .part-card-body { padding: 16px 18px 18px; display: flex; flex-direction: column; flex: 1; }
      .part-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
      .part-card-title { font-size: 15px; font-weight: 600; color: var(--text); margin: 0; }
      .part-card-subtitle { font-size: 12px; color: var(--muted); margin: 2px 0 0 0; }
      .part-rating { display: flex; align-items: center; gap: 4px; font-size: 13px; color: var(--text); }
      .part-card-description {
        font-size: 13px; color: var(--muted); margin: 10px 0 0 0;
        line-height: 1.5; flex: 1;
      }
      .part-card-footer {
        display: flex; align-items: center; justify-content: space-between;
        margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--line);
      }
      .part-card-availability { font-size: 13px; color: #22c55e; font-weight: 600; }
      .part-card-btn {
        display: flex; align-items: center; gap: 4px;
        padding: 8px 16px; border-radius: 999px; border: none;
        background: rgba(0,102,204,0.12); color: var(--accent);
        font-size: 13px; font-weight: 600; cursor: pointer;
        transition: background .3s ease, transform .3s ease;
      }
      .part-card-btn:hover { background: rgba(0,102,204,0.2); transform: translateX(2px); }

      .part-skeleton {
        height: 320px; border-radius: 16px;
        background: linear-gradient(90deg, #141414, #1c1c1c, #141414);
        background-size: 200% 100%; animation: shimmer 1.4s linear infinite;
        border: 1px solid var(--line);
      }
      @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

      /* Stats */
      .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }
      .stat-card {
        display: flex; align-items: center; gap: 16px;
        padding: 20px; background: var(--surface);
        border: 1px solid var(--line); border-radius: 14px;
        transition: border-color .3s ease, transform .3s ease;
      }
      .stat-card:hover { border-color: var(--accent); transform: translateY(-2px); }
      .stat-icon {
        width: 48px; height: 48px; border-radius: 12px;
        background: rgba(0,102,204,0.08);
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      }
      .stat-number { font-size: 20px; font-weight: 700; color: var(--text); margin: 0; font-family: 'Space Grotesk', sans-serif; }
      .stat-label { font-size: 13px; color: var(--muted); margin: 0; }

      /* Empty */
      .empty-state {
        text-align: center; padding: 80px 20px;
        display: flex; flex-direction: column; align-items: center; gap: 12px;
        color: var(--muted);
      }
      .empty-state h3 { font-size: 22px; color: var(--text); margin: 8px 0 0; }

      /* Footer */
      .site-footer { border-top: 1px solid var(--line); margin-top: 80px; }
      .footer-inner {
        max-width: 1280px; margin: 0 auto; padding: 40px 24px;
        display: flex; align-items: center; justify-content: space-between;
        gap: 24px; flex-wrap: wrap;
      }
      .footer-brand { display: flex; align-items: center; gap: 12px; }
      .footer-loc { font-size: 12.5px; color: var(--muted); }
      .footer-social { display: flex; gap: 16px; color: var(--muted); }
      .footer-social svg { cursor: pointer; transition: color .25s ease; }
      .footer-social svg:hover { color: var(--accent); }
      .footer-bottom { border-top: 1px solid var(--line); padding: 20px 24px; text-align: center; }
      .footer-bottom p { font-size: 11.5px; color: var(--muted); margin: 0; }

      /* Responsive */
      @media (max-width: 900px) {
        .nav-links { display: none; }
        .nav-mobile-toggle { display: flex; }
      }
      @media (max-width: 768px) {
        .filters-grid { grid-template-columns: 1fr 1fr; }
        .filters-actions { flex-direction: column; gap: 12px; align-items: stretch; }
        .parts-grid { grid-template-columns: 1fr; }
        .stats-grid { grid-template-columns: 1fr 1fr; }
      }

      @media (prefers-reduced-motion: reduce) {
        .part-card, .part-skeleton, .stat-card { animation: none !important; transition: none !important; }
      }
    `}</style>
  );
}

export default SparePartsPage;
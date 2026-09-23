import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Wrench,
  ShieldCheck,
  ArrowUpRight,
  Star,
  MessageCircle,
  CheckCircle,
  Truck,
  Award,
  Menu,
  Send,
  Mail,
  XCircle,
} from 'lucide-react';
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import images from '../assets/image.js';
import { getListings } from '../utils/api';

/* ------------------------------------------------------------------ */
/*  Config + helpers                                                   */
/* ------------------------------------------------------------------ */

const ADMIN_EMAIL = 'chinwekeleuchenna@gmail.com';

const categories = [
  'All',
  'Engine',
  'Electrical',
  'Brakes',
  'Suspension',
  'Fuel System',
  'Cooling',
  'Exterior',
];

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
  price: part.price || '',
  description:
    part.description || 'Quality replacement part for your vehicle.',
  inStock: part.inStock !== false,
});

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((value || '').trim());
}

async function sendEmailNotification({ subject, fields, replyTo }) {
  try {
    const payload = {
      _subject: subject,
      _template: 'table',
      _captcha: 'false',
      ...fields,
    };
    if (replyTo) payload._replyto = replyTo;

    const response = await fetch(
      `https://formsubmit.co/ajax/${ADMIN_EMAIL}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Email notification error:', error);
    return false;
  }
}

async function orderPartByEmail(part, customerEmail = '') {
  const fields = {
    Part: part.name || '',
    Request: 'Place Order',
  };

  if (part.brand) fields.Brand = part.brand;
  if (part.category) fields.Category = part.category;
  if (part.subcategory) fields.Subcategory = part.subcategory;
  if (part.price) fields.Price = part.price;
  if (customerEmail) fields['Customer Email'] = customerEmail;

  const ok = await sendEmailNotification({
    subject: `Order Request — ${part.name || 'Part'}`,
    fields,
    replyTo: customerEmail,
  });

  if (ok) {
    window.alert(
      "Your order request has been sent! We'll be in touch shortly."
    );
  } else {
    window.alert(
      "We couldn't send your order. Please try again or call us at +234 706 172 2513."
    );
  }
}

/* ------------------------------------------------------------------ */
/*  Email-capture modal                                                */
/* ------------------------------------------------------------------ */

function EmailCaptureModal({ open, title, description, sending, onSubmit, onClose }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setEmail('');
      setError('');
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    onSubmit(email.trim());
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 120,
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(12px)',
        animation: 'fadeIn 0.25s ease',
      }}
      onClick={sending ? undefined : onClose}
    >
      <div
        className="relative w-full max-w-sm mx-4 rounded-2xl"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          padding: 26,
          animation: 'slideUp 0.35s cubic-bezier(0.22, 0.61, 0.36, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {!sending && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/10 transition-colors"
            style={{ color: '#999' }}
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
            background: 'rgba(0,102,204,0.15)',
            marginBottom: 16,
          }}
        >
          <Mail size={20} color="var(--accent)" />
        </div>

        <h3
          className="font-display"
          style={{ fontSize: 19, fontWeight: 600, color: '#fff' }}
        >
          {title}
        </h3>
        <p style={{ fontSize: 13.5, color: '#999', marginTop: 6, lineHeight: 1.5 }}>
          {description ||
            'Enter your email so our team can reach you about this request.'}
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
          <label
            style={{
              display: 'block',
              marginBottom: 6,
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--text)',
            }}
          >
            Your Email Address
          </label>
          <input
            ref={inputRef}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={sending}
            required
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--line)',
              borderRadius: 10,
              padding: '12px 16px',
              color: 'var(--text)',
              fontSize: 14,
              fontFamily: 'Inter, sans-serif',
              width: '100%',
              outline: 'none',
            }}
          />
          {error && (
            <p style={{ fontSize: 12.5, color: '#ef4444', marginTop: 8 }}>
              {error}
            </p>
          )}

          <div className="flex gap-3" style={{ marginTop: 18 }}>
            <button
              type="button"
              className="btn-outline justify-center flex-1"
              onClick={onClose}
              disabled={sending}
              style={{ justifyContent: 'center', flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary justify-center flex-1"
              disabled={sending}
              style={{ justifyContent: 'center', flex: 1 }}
            >
              {sending ? 'Sending...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Part card                                                          */
/* ------------------------------------------------------------------ */

function PartCard({ part }) {
  const [hovered, setHovered] = useState(false);
  const [emailPromptOpen, setEmailPromptOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const handleOrder = () => {
    if (sending) return;
    setEmailPromptOpen(true);
  };

  const handleEmailSubmit = async (customerEmail) => {
    setSending(true);
    await orderPartByEmail(part, customerEmail);
    setSending(false);
    setEmailPromptOpen(false);
  };

  return (
    <>
      <div
        className="part-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="part-card-image">
          {part.img ? (
            <img src={part.img} alt={part.name} loading="lazy" />
          ) : (
            <div className="part-noimg">
              <Wrench size={32} />
            </div>
          )}

          {part.inStock && (
            <span className="part-badge in-stock">
              <CheckCircle size={12} />
              In Stock
            </span>
          )}

          {part.price && (
            <span className="part-price-badge">{part.price}</span>
          )}

          <div
            className="part-card-overlay"
            style={{ opacity: hovered ? 1 : 0 }}
          >
            <button
              className="part-quick-view"
              onClick={handleOrder}
              type="button"
              disabled={sending}
            >
              <MessageCircle size={16} />
              {sending ? 'Sending...' : 'Place Order'}
            </button>
          </div>
        </div>

        <div className="part-card-body">
          <div className="part-head">
            <div>
              <h3 className="part-card-title">{part.name}</h3>
              <p className="part-card-subtitle">
                {part.brand} · {part.subcategory}
              </p>
            </div>

            <div className="part-rating">
              <Star size={14} color="var(--accent)" fill="var(--accent)" />
              <span>{part.rating}</span>
            </div>
          </div>

          <p className="part-card-description">{part.description}</p>

          <div className="part-card-footer">
            <span className="part-card-price">
              {part.price ? part.price : '✓ Available'}
            </span>

            <button
              className="part-card-btn"
              onClick={handleOrder}
              type="button"
              disabled={sending}
            >
              {sending ? 'Sending...' : 'Place Order'}
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <EmailCaptureModal
        open={emailPromptOpen}
        title="Place an Order"
        description={`Enter your email and we'll process your order for ${part.name}${
          part.price ? ` (${part.price})` : ''
        }.`}
        sending={sending}
        onSubmit={handleEmailSubmit}
        onClose={() => setEmailPromptOpen(false)}
      />
    </>
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
      const matchesCategory =
        selectedCategory === 'All' || part.category === selectedCategory;

      const matchesBrand =
        selectedBrand === 'All' || part.brand === selectedBrand;

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
          Quality parts for every vehicle — place an order and we'll get back to you
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
              <select
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
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
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
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
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>
              {loading
                ? 'Loading parts…'
                : `${filteredParts.length} parts available`}
            </span>

            <button className="btn-outline" onClick={clearAll}>
              Clear Filters
            </button>
          </div>
        </div>
      </section>

      <section
        className="max-w-7xl mx-auto px-6 md:px-10"
        style={{ paddingTop: 40 }}
      >
        {loading ? (
          <div className="parts-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="part-skeleton" />
            ))}
          </div>
        ) : filteredParts.length === 0 ? (
          <div className="empty-state">
            <Wrench size={64} color="var(--muted)" />
            <h3 className="font-display">No parts found</h3>
            <p>Try adjusting your filters to find more options</p>
            <button className="btn-outline" onClick={clearAll}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="parts-grid">
            {filteredParts.map((part) => (
              <PartCard key={part.id} part={part} />
            ))}
          </div>
        )}
      </section>

      <section
        className="max-w-7xl mx-auto px-6 md:px-10"
        style={{ paddingTop: 60 }}
      >
        <div className="stats-grid">
          <StatCard
            icon={<Truck size={22} color="var(--accent)" />}
            title="24/7"
            label="Fast Delivery"
          />
          <StatCard
            icon={<ShieldCheck size={22} color="var(--accent)" />}
            title="100%"
            label="Genuine Parts"
          />
          <StatCard
            icon={<Award size={22} color="var(--accent)" />}
            title="1 Year"
            label="Warranty"
          />
          <StatCard
            icon={<MessageCircle size={22} color="var(--accent)" />}
            title="Place Order"
            label="Request Pricing"
          />
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
    // Solid background is forced here as an inline style, in addition
    // to the .site-nav class, so nothing (a stray utility class, a
    // stacking/compositing quirk, etc.) can make the bar render
    // see-through. z-index bumped well above modals/lightboxes too.
    <header className="site-nav" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="nav-inner">
        <a href="/" className="nav-logo">
          <span className="nav-logo-img">
            <img src={images.Logo2} alt="Lord Group Autos" />
          </span>
          <span className="font-display nav-logo-text">
            Lord Group
            <span style={{ color: 'var(--accent)' }}> AUTOS</span>
          </span>
        </a>

        <nav className="nav-links">
          {links.map((l) => (
            <a
              key={l.key}
              href={l.href}
              className={`nav-link ${active === l.key ? 'active' : ''}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button
          className="icon-btn nav-mobile-toggle"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={19} />
        </button>
      </div>

      <div
        className={`mobile-menu ${open ? 'open' : ''}`}
        style={{ backgroundColor: '#0a0a0a' }}
      >
        <div className="mobile-menu-head">
          <span className="font-display nav-logo-text">
            Lord Group
            <span style={{ color: 'var(--accent)' }}> AUTOS</span>
          </span>
          <button
            className="icon-btn"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        <nav className="mobile-menu-links">
          {links.map((l) => (
            <a
              key={l.key}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`mobile-link ${active === l.key ? 'active' : ''}`}
            >
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
            Lord Group
            <span style={{ color: 'var(--accent)' }}> AUTOS</span>
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
        background: var(--bg);
        color: var(--text);
        font-family: 'Inter', sans-serif;
        min-height: 100vh;
        overflow-x: hidden;
      }

      /* ---------- Nav: fully opaque, no transparency ---------- */
      .site-nav {
        position: fixed;
        top: 0; left: 0; right: 0;
        z-index: 999;
        background-color: #0a0a0a;
        border-bottom: 1px solid var(--line);
        box-shadow: 0 1px 0 rgba(0,0,0,0.4);
      }

      .nav-inner {
        max-width: 1280px; margin: 0 auto;
        padding: 0 24px; height: 76px;
        display: flex; align-items: center; justify-content: space-between;
      }
      .nav-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
      .nav-logo-img {
        width: 40px; height: 40px; border-radius: 10px; overflow: hidden;
        background: linear-gradient(135deg, var(--accent), var(--accent-deep));
        box-shadow: 0 4px 16px rgba(0,102,204,0.35);
        flex-shrink: 0;
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

      /* ---------- Mobile menu: fully opaque ---------- */
      .mobile-menu {
        position: fixed; inset: 0; z-index: 998;
        background-color: #0a0a0a;
        opacity: 0; pointer-events: none;
        transition: opacity .3s ease;
      }
      .mobile-menu.open { opacity: 1; pointer-events: auto; }
      .mobile-menu-head {
        height: 76px; padding: 0 24px;
        display: flex; align-items: center; justify-content: space-between;
      }
      .mobile-menu-links { display: flex; flex-direction: column; padding: 12px 32px; }
      .mobile-link {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 26px; padding: 14px 0; color: var(--text);
        border-bottom: 1px solid var(--line); text-decoration: none;
      }
      .mobile-link.active { color: var(--accent); }

      /* Hero */
      .page-hero {
        padding: 116px 24px 40px;
        text-align: center;
        background: radial-gradient(60% 50% at 50% 0%, rgba(0,102,204,0.15), transparent 60%), var(--bg);
      }
      .hero-head {
        display: flex; align-items: center; justify-content: center;
        gap: 14px; margin-top: 0;
      }
      .hero-title {
        font-size: clamp(2rem, 5vw, 3.5rem);
        line-height: 1.04; font-weight: 700; letter-spacing: -0.03em;
        margin: 0;
      }
      .hero-sub { color: var(--muted); font-size: 16px; margin-top: 14px; max-width: 520px; margin-inline: auto; }

      .search-bar {
        display: flex; align-items: center; gap: 8px;
        background: var(--surface); border: 1px solid var(--line-strong);
        border-radius: 999px; padding: 6px;
        max-width: 520px; margin: 26px auto 0;
      }
      .search-input {
        flex: 1; background: transparent; border: none; outline: none;
        color: var(--text); font-size: 14px; padding: 10px 4px;
      }
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
        border: 1px solid var(--line-strong);
        font-size: 13.5px; color: var(--text);
        background: transparent; cursor: pointer;
        transition: border-color .25s ease, background .25s ease, transform .25s ease;
      }
      .btn-outline:hover:not(:disabled) { border-color: var(--accent); background: rgba(0,102,204,0.15); transform: translateY(-1px); }
      .btn-outline:disabled { opacity: .6; cursor: not-allowed; }

      .btn-primary {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 12px 20px; border-radius: 999px; border: none;
        background: var(--accent); color: #fff;
        font-weight: 600; font-size: 14px; font-family: 'Inter', sans-serif;
        cursor: pointer; box-shadow: 0 8px 22px rgba(0,102,204,0.28);
        transition: background .25s ease, transform .25s ease, opacity .25s ease;
      }
      .btn-primary:hover:not(:disabled) { background: #0080ff; transform: translateY(-1px); }
      .btn-primary:disabled { opacity: .6; cursor: not-allowed; transform: none; }

      /* Filters */
      .filters-panel {
        background: var(--surface); border: 1px solid var(--line);
        border-radius: 16px; padding: 20px 24px;
      }
      .filters-grid {
        display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
      }
      .filter-group { display: flex; flex-direction: column; gap: 4px; }
      .filter-label {
        font-size: 12px; font-weight: 600; color: var(--muted);
        text-transform: uppercase; letter-spacing: 0.04em;
      }
      .filter-select {
        background: var(--bg); border: 1px solid var(--line);
        border-radius: 8px; padding: 8px 12px; color: var(--text);
        font-size: 14px; font-family: 'Inter', sans-serif; cursor: pointer;
      }
      .filter-select:focus { outline: none; border-color: var(--accent); }
      .filters-actions {
        display: flex; align-items: center; justify-content: space-between;
        margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--line);
      }

      /* Parts */
      .parts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 24px;
      }
      .part-card {
        background: var(--surface); border: 1px solid var(--line);
        border-radius: 16px; overflow: hidden;
        display: flex; flex-direction: column; height: 100%;
        transition: border-color .3s ease, transform .3s ease, box-shadow .3s ease;
      }
      .part-card:hover {
        border-color: var(--accent); transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(0,0,0,0.3);
      }
      .part-card-image {
        position: relative; height: 200px; overflow: hidden;
        background: var(--bg); flex-shrink: 0;
      }
      .part-card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
      .part-card:hover .part-card-image img { transform: scale(1.05); }
      .part-noimg {
        width: 100%; height: 100%;
        display: flex; align-items: center; justify-content: center;
        color: var(--muted);
      }
      .part-badge {
        position: absolute; top: 10px; left: 10px;
        display: flex; align-items: center; gap: 4px;
        padding: 4px 12px; border-radius: 999px;
        font-size: 11px; font-weight: 600;
        background: rgba(34, 197, 94, 0.9); color: #fff;
      }
      .part-price-badge {
        position: absolute; top: 10px; right: 10px;
        padding: 4px 12px; border-radius: 999px;
        font-size: 12px; font-weight: 700;
        background: var(--accent); color: #fff;
        box-shadow: 0 4px 12px rgba(0,102,204,0.35);
      }
      .part-card-overlay {
        position: absolute; inset: 0; background: rgba(0,0,0,0.7);
        display: flex; align-items: center; justify-content: center;
        transition: opacity .3s ease;
      }
      .part-quick-view {
        display: flex; align-items: center; gap: 8px;
        padding: 12px 24px; background: var(--accent);
        border: none; border-radius: 999px;
        color: #fff; font-weight: 600; font-size: 14px;
        cursor: pointer; box-shadow: 0 8px 24px rgba(0,102,204,0.3);
      }
      .part-quick-view:disabled { opacity: .65; cursor: not-allowed; }
      .part-card-body { padding: 16px 18px 18px; display: flex; flex-direction: column; flex: 1; }
      .part-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
      .part-card-title { font-size: 15px; font-weight: 600; color: var(--text); margin: 0; }
      .part-card-subtitle { font-size: 12px; color: var(--muted); margin: 2px 0 0 0; }
      .part-rating { display: flex; align-items: center; gap: 4px; font-size: 13px; color: var(--text); }
      .part-card-description { font-size: 13px; color: var(--muted); margin: 10px 0 0 0; line-height: 1.5; flex: 1; }
      .part-card-footer {
        display: flex; align-items: center; justify-content: space-between;
        margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--line);
      }
      .part-card-availability { font-size: 13px; color: #22c55e; font-weight: 600; }
      .part-card-price {
        font-size: 15px; color: var(--accent); font-weight: 700;
        font-family: 'Space Grotesk', sans-serif;
        letter-spacing: -0.01em;
      }
      .part-card-btn {
        display: flex; align-items: center; gap: 4px;
        padding: 8px 16px; border-radius: 999px; border: none;
        background: rgba(0,102,204,0.12); color: var(--accent);
        font-size: 13px; font-weight: 600; cursor: pointer;
        transition: background .3s ease, transform .3s ease;
      }
      .part-card-btn:hover:not(:disabled) { background: rgba(0,102,204,0.2); transform: translateX(2px); }
      .part-card-btn:disabled { opacity: .6; cursor: not-allowed; }

      .part-skeleton {
        height: 320px; border-radius: 16px;
        background: linear-gradient(90deg, #141414, #1c1c1c, #141414);
        background-size: 200% 100%;
        animation: shimmer 1.4s linear infinite;
        border: 1px solid var(--line);
      }
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      /* Stats */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
      }
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
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      .stat-number {
        font-size: 20px; font-weight: 700; color: var(--text);
        margin: 0; font-family: 'Space Grotesk', sans-serif;
      }
      .stat-label { font-size: 13px; color: var(--muted); margin: 0; }

      /* Empty */
      .empty-state {
        text-align: center; padding: 80px 20px;
        display: flex; flex-direction: column; align-items: center;
        gap: 12px; color: var(--muted);
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
        .part-card, .part-skeleton, .stat-card {
          animation: none !important; transition: none !important;
        }
      }

      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp {
        from { opacity: 0; transform: scale(0.95) translateY(20px); }
        to   { opacity: 1; transform: scale(1) translateY(0); }
      }
    `}</style>
  );
}

export default SparePartsPage;
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  ArrowUpRight,
  Gauge,
  Fuel,
  Settings2,
  Star,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Car,
  Wrench,
  Menu,
  MessageCircle,
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

const normalizeCar = (car) => ({
  ...car,
  id: car._id,
  img: car.coverImage?.url || car.imageUrl || '',
  name: car.name || `${car.make || ''} ${car.model || ''}`.trim() || 'Untitled',
  specs: [
    car.transmission || 'Automatic',
    car.fuel || 'Petrol',
    car.mileage ? `${car.mileage} mi` : 'Contact us',
  ],
  inStock: car.inStock !== false,
  rating: car.rating ?? 4.8,
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

    const response = await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch (error) {
    console.error('Email notification error:', error);
    return false;
  }
}

async function quoteByEmail(car, customerEmail = '') {
  const fields = {
    Vehicle: `${car.name || ''} ${car.year ? `(${car.year})` : ''}`.trim(),
    Request: 'Quote',
  };
  if (car.make || car.model)
    fields['Make / Model'] = `${car.make || ''} ${car.model || ''}`.trim();
  if (car.trim) fields.Trim = car.trim;
  if (car.color) fields.Color = car.color;
  if (car.price) fields.Price = car.price;
  if (customerEmail) fields['Customer Email'] = customerEmail;

  const ok = await sendEmailNotification({
    subject: `Quote Request — ${car.name || 'Vehicle'}`,
    fields,
    replyTo: customerEmail,
  });

  if (ok) window.alert("Your quote request has been sent! We'll be in touch shortly.");
  else
    window.alert(
      "We couldn't send your quote request. Please try again or call us at +234 706 172 2513."
    );
}

async function bookTestDriveByEmail(car, customerEmail = '') {
  const fields = {
    Vehicle: `${car.name || ''} ${car.year ? `(${car.year})` : ''}`.trim(),
    Request: 'Book a Test Drive',
  };
  if (car.make || car.model)
    fields['Make / Model'] = `${car.make || ''} ${car.model || ''}`.trim();
  if (car.color) fields.Color = car.color;
  if (car.location) fields.Location = car.location;
  if (customerEmail) fields['Customer Email'] = customerEmail;

  const ok = await sendEmailNotification({
    subject: `Test Drive Booking — ${car.name || 'Vehicle'}`,
    fields,
    replyTo: customerEmail,
  });

  if (ok)
    window.alert("Your test drive request has been sent! We'll be in touch shortly.");
  else
    window.alert(
      "We couldn't send your test drive request. Please try again or call us at +234 706 172 2513."
    );
}

async function orderByEmail(car, customerEmail = '') {
  const fields = {
    Vehicle: `${car.name || ''} ${car.year ? `(${car.year})` : ''}`.trim(),
    Request: 'Place Order',
  };
  if (car.make || car.model)
    fields['Make / Model'] = `${car.make || ''} ${car.model || ''}`.trim();
  if (car.trim) fields.Trim = car.trim;
  if (car.color) fields.Color = car.color;
  if (car.transmission) fields.Transmission = car.transmission;
  if (car.fuel) fields.Fuel = car.fuel;
  if (car.mileage)
    fields.Mileage = `${Number(car.mileage).toLocaleString()} mi`;
  if (car.price) fields.Price = car.price;
  if (car.location) fields.Location = car.location;
  if (customerEmail) fields['Customer Email'] = customerEmail;

  const ok = await sendEmailNotification({
    subject: `Order Request — ${car.name || 'Vehicle'}`,
    fields,
    replyTo: customerEmail,
  });

  if (ok) window.alert("Your order request has been sent! We'll be in touch shortly.");
  else
    window.alert(
      "We couldn't send your order request. Please try again or call us at +234 706 172 2513."
    );
}

/* ------------------------------------------------------------------ */
/*  EmailCaptureModal                                                  */
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
          background: '#1a1a1a',
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

        <h3 className="font-display" style={{ fontSize: 19, fontWeight: 600, color: '#fff' }}>
          {title}
        </h3>
        <p style={{ fontSize: 13.5, color: '#999', marginTop: 6, lineHeight: 1.5 }}>
          {description || 'Enter your email so our team can reach you about this request.'}
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
          <label className="form-label" style={{ display: 'block', marginBottom: 6 }}>
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
            <p style={{ fontSize: 12.5, color: '#ef4444', marginTop: 8 }}>{error}</p>
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
              {sending ? 'Sending...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  useScrollY — detects whether the page has been scrolled            */
/* ------------------------------------------------------------------ */

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
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return y;
}

/* ------------------------------------------------------------------ */
/*  Lightbox                                                           */
/* ------------------------------------------------------------------ */

function CarLightbox({ car, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sending, setSending] = useState(null);
  const [emailPromptType, setEmailPromptType] = useState(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => { setCurrentIndex(0); }, [car?._id, car?.id]);

  if (!car) return null;

  const gallery = [
    car.coverImage?.url,
    ...(car.subImages || []).map((s) => s.url),
  ].filter(Boolean);

  const safeGallery = gallery.length ? gallery : [car.img].filter(Boolean);
  const currentSrc = safeGallery[currentIndex] || safeGallery[0] || '';

  const handlePrev = (e) => {
    e.stopPropagation();
    if (safeGallery.length < 2) return;
    setCurrentIndex((prev) => (prev - 1 + safeGallery.length) % safeGallery.length);
  };
  const handleNext = (e) => {
    e.stopPropagation();
    if (safeGallery.length < 2) return;
    setCurrentIndex((prev) => (prev + 1) % safeGallery.length);
  };

  const openEmailPrompt = (type) => (e) => {
    e.stopPropagation();
    if (sending) return;
    setEmailPromptType(type);
  };

  const handleEmailSubmit = async (customerEmail) => {
    const type = emailPromptType;
    if (!type) return;
    setSending(type);
    if (type === 'test-drive') await bookTestDriveByEmail(car, customerEmail);
    else if (type === 'quote') await quoteByEmail(car, customerEmail);
    else if (type === 'order') await orderByEmail(car, customerEmail);
    setSending(null);
    setEmailPromptType(null);
  };

  const EMAIL_PROMPT_COPY = {
    'test-drive': {
      title: 'Book a Test Drive',
      description: `Enter your email and we'll confirm a test drive time for the ${car.name}.`,
    },
    quote: {
      title: 'Request a Quote',
      description: `Enter your email and we'll send pricing details for the ${car.name}.`,
    },
    order: {
      title: 'Place an Order',
      description: `Enter your email so we can process your order for the ${car.name}.`,
    },
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={22} />
        </button>

        <div className="modal-head">
          <div>
            <h2 className="modal-title">{car.name}</h2>
            <p className="modal-sub">
              {car.year ? `${car.year} · ` : ''}{car.color || ''}
              {car.price ? ` · ${car.price}` : ''}
            </p>
          </div>
          {car.location && <span className="modal-badge">{car.location}</span>}
        </div>

        <div className="modal-gallery">
          {currentSrc ? (
            <img src={currentSrc} alt={car.name} className="modal-img" />
          ) : (
            <div className="modal-noimg"><Car size={64} /></div>
          )}
          {safeGallery.length > 1 && (
            <>
              <button className="modal-arrow left" onClick={handlePrev} aria-label="Previous">
                <ChevronLeft size={22} />
              </button>
              <button className="modal-arrow right" onClick={handleNext} aria-label="Next">
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </div>

        {safeGallery.length > 1 && (
          <div className="modal-thumbs">
            {safeGallery.map((src, i) => (
              <button
                key={`${src}-${i}`}
                onClick={() => setCurrentIndex(i)}
                className={`modal-thumb ${i === currentIndex ? 'active' : ''}`}
                aria-label={`View image ${i + 1}`}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        )}

        <div className="modal-specs">
          <div className="spec">
            <span>Transmission</span>
            <strong>{car.transmission || '—'}</strong>
          </div>
          <div className="spec">
            <span>Fuel</span>
            <strong>{car.fuel || '—'}</strong>
          </div>
          <div className="spec">
            <span>Mileage</span>
            <strong>{car.mileage ? `${Number(car.mileage).toLocaleString()} mi` : '—'}</strong>
          </div>
          <div className="spec">
            <span>Year</span>
            <strong>{car.year || '—'}</strong>
          </div>
        </div>

        {(car.fullDescription || car.description) && (
          <div className="modal-desc">
            <p>{car.fullDescription || car.description}</p>
          </div>
        )}

        <div className="modal-actions">
          <button
            className="btn-primary"
            onClick={openEmailPrompt('test-drive')}
            type="button"
            disabled={sending !== null}
          >
            <Calendar size={16} />
            {sending === 'test-drive' ? 'Sending...' : 'Book a Test Drive'}
          </button>
          <button
            className="btn-outline"
            onClick={openEmailPrompt('quote')}
            type="button"
            disabled={sending !== null}
          >
            <MessageCircle size={16} />
            {sending === 'quote' ? 'Sending...' : 'Request Quote'}
          </button>
          <button
            className="btn-primary"
            onClick={openEmailPrompt('order')}
            type="button"
            disabled={sending !== null}
          >
            <Send size={16} />
            {sending === 'order' ? 'Sending...' : 'Place Order'}
          </button>
        </div>
      </div>

      <EmailCaptureModal
        open={emailPromptType !== null}
        title={EMAIL_PROMPT_COPY[emailPromptType]?.title || 'Enter your email'}
        description={EMAIL_PROMPT_COPY[emailPromptType]?.description}
        sending={sending !== null}
        onSubmit={handleEmailSubmit}
        onClose={() => setEmailPromptType(null)}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Car Card                                                           */
/* ------------------------------------------------------------------ */

function CarCard({ car, onOpen }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, sx: 50, sy: 50, active: false });
  const [sendingQuote, setSendingQuote] = useState(false);
  const [emailPromptOpen, setEmailPromptOpen] = useState(false);

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * 8,
      ry: (px - 0.5) * 10,
      sx: px * 100,
      sy: py * 100,
      active: true,
    });
  }, []);

  const onLeave = useCallback(() => {
    setTilt((t) => ({ ...t, rx: 0, ry: 0, active: false }));
  }, []);

  const handleCardClick = (e) => {
    if (e.target.closest('.request-quote-btn')) return;
    onOpen(car);
  };

  const handleRequestQuoteClick = (e) => {
    e.stopPropagation();
    if (sendingQuote) return;
    setEmailPromptOpen(true);
  };

  const handleEmailSubmit = async (customerEmail) => {
    setSendingQuote(true);
    await quoteByEmail(car, customerEmail);
    setSendingQuote(false);
    setEmailPromptOpen(false);
  };

  return (
    <>
      <article
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="car-card cursor-pointer"
        onClick={handleCardClick}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) ${
            tilt.active ? 'scale3d(1.015,1.015,1.015)' : 'scale3d(1,1,1)'
          }`,
        }}
      >
        <div className="car-card-media">
          {car.img ? (
            <img src={car.img} alt={car.name} loading="lazy" />
          ) : (
            <div className="car-card-noimg"><Car size={32} /></div>
          )}
          <div
            className="car-card-spot"
            style={{
              opacity: tilt.active ? 1 : 0,
              background: `radial-gradient(circle at ${tilt.sx}% ${tilt.sy}%, rgba(255,255,255,0.08), transparent 45%)`,
            }}
          />
          {car.featured && <span className="car-badge featured">Featured</span>}
          {car.newArrival && <span className="car-badge new">New</span>}
          {!car.inStock && <span className="car-badge sold">Sold</span>}
        </div>
        <div className="car-card-body">
          <div className="flex items-baseline justify-between">
            <h3 className="font-display" style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)' }}>
              {car.name}
            </h3>
            <div className="flex items-center gap-1">
              <Star size={14} color="var(--accent)" fill="var(--accent)" />
              <span style={{ fontSize: 13, color: 'var(--text)' }}>{car.rating}</span>
            </div>
          </div>
          <p className="font-mono" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
            {car.year ? `${car.year} · ` : ''}{car.color || ''}
          </p>
          <div className="car-specs">
            <span><Settings2 size={13} /> {car.transmission || 'Automatic'}</span>
            <span><Fuel size={13} /> {car.fuel || 'Petrol'}</span>
            <span><Gauge size={13} /> {car.mileage ? `${car.mileage} mi` : '—'}</span>
          </div>
          <div className="car-card-foot">
            <button
              className="request-quote-btn"
              onClick={handleRequestQuoteClick}
              disabled={sendingQuote}
              type="button"
            >
              <MessageCircle size={14} />
              {sendingQuote ? 'Sending...' : 'Request Quote'}
            </button>
            <span className="car-card-view">
              View Details <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </article>

      <EmailCaptureModal
        open={emailPromptOpen}
        title="Request a Quote"
        description={`Enter your email and we'll send pricing details for the ${car.name}.`}
        sending={sendingQuote}
        onSubmit={handleEmailSubmit}
        onClose={() => setEmailPromptOpen(false)}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const GalleryPage = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    make: '', year: '', color: '', transmission: '', fuel: '', search: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 12;

  useEffect(() => {
    setLoading(true);
    getListings('gallery')
      .then((listings) => setCars((listings || []).map(normalizeCar)))
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, []);

  const filterOptions = {
    makes: [...new Set(cars.map((c) => c.make).filter(Boolean))].sort(),
    years: [...new Set(cars.map((c) => c.year).filter(Boolean))].sort().reverse(),
    colors: [...new Set(cars.map((c) => c.color).filter(Boolean))].sort(),
    transmissions: [...new Set(cars.map((c) => c.transmission).filter(Boolean))].sort(),
    fuelTypes: [...new Set(cars.map((c) => c.fuel).filter(Boolean))].sort(),
  };

  const filteredCars = cars.filter((car) => {
    const q = filters.search.toLowerCase();
    if (q) {
      const hay = `${car.name} ${car.make} ${car.model}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filters.make && car.make !== filters.make) return false;
    if (filters.year && car.year !== filters.year) return false;
    if (filters.color && car.color !== filters.color) return false;
    if (filters.transmission && car.transmission !== filters.transmission) return false;
    if (filters.fuel && car.fuel !== filters.fuel) return false;
    return true;
  });

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () =>
    setFilters({ make: '', year: '', color: '', transmission: '', fuel: '', search: '' });

  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  const startIndex = (currentPage - 1) * carsPerPage;
  const currentCars = filteredCars.slice(startIndex, startIndex + carsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => { setCurrentPage(1); }, [filters]);

  return (
    <div className="app-root">
      <GlobalStyle />
      <NavBar active="gallery" />

      <section className="page-hero">
        <h1 className="font-display hero-title">
          Explore Our
          <br />
          <span style={{ color: 'var(--accent)' }}>Premium Collection</span>
        </h1>
        <p className="hero-sub">
          {loading ? 'Loading vehicles…' : `${filteredCars.length} vehicles available — each thoroughly inspected and ready for delivery`}
        </p>

        <div className="search-bar">
          <Search size={18} color="var(--muted)" style={{ marginLeft: 10 }} />
          <input
            type="text"
            placeholder="Search by make, model..."
            className="search-input"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          <button className="search-submit" onClick={() => setShowFilters(!showFilters)} aria-label="Toggle filters">
            <Filter size={16} color="#fff" />
          </button>
        </div>

        <button className="btn-outline" onClick={() => setShowFilters(!showFilters)} style={{ marginTop: 16 }}>
          <Filter size={16} />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </section>

      {showFilters && (
        <section className="max-w-7xl mx-auto px-6 md:px-10" style={{ marginTop: 20 }}>
          <div className="filters-panel">
            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">Make</label>
                <select className="filter-select" value={filters.make} onChange={(e) => handleFilterChange('make', e.target.value)}>
                  <option value="">All Makes</option>
                  {filterOptions.makes.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="filter-group">
                <label className="filter-label">Year</label>
                <select className="filter-select" value={filters.year} onChange={(e) => handleFilterChange('year', e.target.value)}>
                  <option value="">All Years</option>
                  {filterOptions.years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="filter-group">
                <label className="filter-label">Color</label>
                <select className="filter-select" value={filters.color} onChange={(e) => handleFilterChange('color', e.target.value)}>
                  <option value="">All Colors</option>
                  {filterOptions.colors.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="filter-group">
                <label className="filter-label">Transmission</label>
                <select className="filter-select" value={filters.transmission} onChange={(e) => handleFilterChange('transmission', e.target.value)}>
                  <option value="">All</option>
                  {filterOptions.transmissions.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="filter-group">
                <label className="filter-label">Fuel Type</label>
                <select className="filter-select" value={filters.fuel} onChange={(e) => handleFilterChange('fuel', e.target.value)}>
                  <option value="">All</option>
                  {filterOptions.fuelTypes.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div className="filters-actions">
              <button className="btn-outline" onClick={clearFilters}>Clear All</button>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>{filteredCars.length} vehicles found</span>
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-6 md:px-10" style={{ paddingTop: 50 }}>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="car-skeleton" />)}
          </div>
        ) : currentCars.length === 0 ? (
          <div className="empty-state">
            <Car size={64} color="var(--muted)" />
            <h3 className="font-display">No vehicles found</h3>
            <p>Try adjusting your filters to find more options</p>
            <button className="btn-outline" onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentCars.map((car) => (
              <CarCard key={car.id} car={car} onOpen={setSelectedCar} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button className="pagination-btn" onClick={() => goToPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              return (
                <button
                  key={pageNum}
                  className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            <button className="pagination-btn" onClick={() => goToPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </section>

      {selectedCar && <CarLightbox car={selectedCar} onClose={() => setSelectedCar(null)} />}

      <Footer />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  NavBar — now scroll-aware (transparent → solid)                    */
/* ------------------------------------------------------------------ */

function NavBar({ active }) {
  const y = useScrollY();
  const [open, setOpen] = useState(false);
  const scrolled = y > 24;

  const links = [
    { href: '/', label: 'Home', key: 'home' },
    { href: '/gallery', label: 'Gallery', key: 'gallery' },
    { href: '/spare-parts', label: 'Spare Parts', key: 'spare-parts' },
    { href: '/#about', label: 'About', key: 'about' },
    { href: '/#contact', label: 'Contact', key: 'contact' },
  ];

  return (
    <header
      className="site-nav"
      style={{
        background: scrolled ? 'rgba(0,0,0,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--line)' : 'transparent'}`,
      }}
    >
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
        background: var(--bg);
        color: var(--text);
        font-family: 'Inter', sans-serif;
        min-height: 100vh;
        overflow-x: hidden;
      }

      /* Nav — base styles. Background/border are driven inline by NavBar so
         the bar can fade between transparent and solid as the user scrolls. */
      .site-nav {
        position: fixed; top: 0; left: 0; right: 0; z-index: 60;
        transition: background .35s ease, backdrop-filter .35s ease, border-color .35s ease;
      }
      .nav-inner {
        max-width: 1280px; margin: 0 auto; padding: 0 24px;
        height: 76px; display: flex; align-items: center; justify-content: space-between;
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

      .mobile-menu {
        position: fixed; inset: 0; z-index: 90;
        background: #000;
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
        padding: 76px 24px 40px;
        text-align: center;
        background: radial-gradient(60% 50% at 50% 0%, rgba(0,102,204,0.15), transparent 60%), var(--bg);
      }
      .hero-title {
        font-size: clamp(2rem, 5vw, 3.5rem);
        line-height: 1.04; font-weight: 700; letter-spacing: -0.03em;
        margin: 40px 0 0;
      }
      .hero-sub { color: var(--muted); font-size: 16px; margin-top: 16px; max-width: 520px; margin-inline: auto; }

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
        display: inline-flex; align-items: center; gap: 10px;
        padding: 13px 24px; border-radius: 999px; border: none;
        background: var(--accent); color: #fff; font-weight: 600; font-size: 14px;
        cursor: pointer; box-shadow: 0 10px 30px rgba(0,102,204,0.28);
        transition: transform .25s ease, box-shadow .25s ease, background .25s ease;
      }
      .btn-primary:hover:not(:disabled) { transform: translateY(-2px); background: #0080ff; }
      .btn-primary:disabled { opacity: .65; cursor: not-allowed; transform: none; }

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

      /* Car card */
      .car-card {
        background: var(--surface); border: 1px solid var(--line);
        border-radius: 20px; overflow: hidden;
        transition: transform .15s ease-out, border-color .3s ease, box-shadow .3s ease;
        transform-style: preserve-3d; will-change: transform;
        height: 100%; display: flex; flex-direction: column;
      }
      .car-card:hover { border-color: var(--line-strong); box-shadow: 0 24px 50px rgba(0,0,0,0.5); }
      .car-card-media { position: relative; height: 200px; overflow: hidden; background: var(--bg); }
      .car-card-media img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
      .car-card:hover .car-card-media img { transform: scale(1.06); }
      .car-card-noimg {
        width: 100%; height: 100%;
        display: flex; align-items: center; justify-content: center;
        color: var(--muted);
      }
      .car-card-spot { position: absolute; inset: 0; transition: opacity .2s ease; pointer-events: none; }
      .car-card-body { padding: 16px 18px 18px; display: flex; flex-direction: column; flex: 1; }
      .car-specs {
        display: flex; gap: 12px; margin-top: 10px;
        padding-top: 10px; border-top: 1px solid var(--line);
      }
      .car-specs span { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--muted); }
      .car-card-foot {
        display: flex; align-items: center; justify-content: space-between;
        margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--line);
      }
      .car-card-view { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--muted); }

      .request-quote-btn {
        display: flex; align-items: center; gap: 6px;
        padding: 6px 14px; border-radius: 999px; border: none;
        background: rgba(0,102,204,0.12); color: var(--accent);
        font-size: 13px; font-weight: 600; cursor: pointer;
        transition: background .3s ease, transform .3s ease;
      }
      .request-quote-btn:hover:not(:disabled) { background: rgba(0,102,204,0.2); transform: translateX(2px); }
      .request-quote-btn:disabled { opacity: .6; cursor: not-allowed; }

      .car-badge {
        position: absolute; top: 10px; right: 10px;
        padding: 4px 12px; border-radius: 999px;
        font-size: 10px; font-weight: 600; text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .car-badge.featured { background: var(--accent); color: #fff; }
      .car-badge.new { background: #22c55e; color: #fff; }
      .car-badge.sold { background: #ef4444; color: #fff; }

      .car-skeleton {
        height: 320px; border-radius: 20px;
        background: linear-gradient(90deg, #141414, #1c1c1c, #141414);
        background-size: 200% 100%;
        animation: shimmer 1.4s linear infinite;
        border: 1px solid var(--line);
      }
      @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

      /* Pagination */
      .pagination { display: flex; justify-content: center; gap: 8px; margin-top: 40px; }
      .pagination-btn {
        width: 40px; height: 40px; border-radius: 10px;
        border: 1px solid var(--line); background: transparent;
        color: var(--text); cursor: pointer; font-size: 14px;
        display: flex; align-items: center; justify-content: center;
        transition: all .25s ease;
      }
      .pagination-btn:hover:not(:disabled) { border-color: var(--accent); background: rgba(0,102,204,0.1); }
      .pagination-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; }
      .pagination-btn:disabled { opacity: .3; cursor: not-allowed; }

      /* Empty */
      .empty-state {
        text-align: center; padding: 80px 20px;
        display: flex; flex-direction: column; align-items: center; gap: 12px;
        color: var(--muted);
      }
      .empty-state h3 { font-size: 22px; color: var(--text); margin: 8px 0 0; }

      /* Modal */
      .modal-overlay {
        position: fixed; inset: 0; z-index: 100;
        display: flex; align-items: center; justify-content: center;
        background: rgba(0,0,0,0.92); backdrop-filter: blur(16px);
        padding: 20px;
      }
      .modal {
        position: relative; background: #1a1a1a;
        border: 1px solid var(--line); border-radius: 20px;
        max-width: 960px; width: 100%; max-height: 92vh; overflow-y: auto;
        padding: 28px;
      }
      .modal-close {
        position: absolute; top: 16px; right: 16px;
        background: rgba(0,0,0,0.6); border: none; color: #fff;
        width: 38px; height: 38px; border-radius: 999px; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
      }
      .modal-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding-right: 50px; }
      .modal-title { font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 700; margin: 0; }
      .modal-sub { font-size: 13px; color: var(--muted); margin-top: 4px; font-family: 'IBM Plex Mono', monospace; }
      .modal-badge {
        font-size: 11px; padding: 5px 12px; border-radius: 999px;
        background: var(--surface); border: 1px solid var(--line); color: var(--muted);
        white-space: nowrap;
      }
      .modal-gallery { position: relative; margin-top: 18px; border-radius: 14px; overflow: hidden; background: #0a0a0a; height: 420px; }
      .modal-img { width: 100%; height: 100%; object-fit: contain; display: block; }
      .modal-noimg {
        width: 100%; height: 100%;
        display: flex; align-items: center; justify-content: center; color: #555;
      }
      .modal-arrow {
        position: absolute; top: 50%; transform: translateY(-50%);
        background: rgba(0,0,0,0.65); border: none; color: #fff;
        width: 42px; height: 42px; border-radius: 999px; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: background .2s ease;
      }
      .modal-arrow:hover { background: rgba(0,0,0,0.9); }
      .modal-arrow.left { left: 12px; }
      .modal-arrow.right { right: 12px; }

      .modal-thumbs { display: flex; gap: 8px; margin-top: 12px; overflow-x: auto; padding-bottom: 4px; }
      .modal-thumb {
        width: 68px; height: 68px; border-radius: 10px; overflow: hidden;
        border: 2px solid transparent; cursor: pointer; flex-shrink: 0;
        background: transparent; padding: 0;
      }
      .modal-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .modal-thumb.active { border-color: var(--accent); }

      .modal-specs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 18px; }
      .modal-specs .spec { background: #0a0a0a; padding: 12px; border-radius: 10px; }
      .modal-specs .spec span { display: block; font-size: 11px; color: var(--muted); font-family: 'IBM Plex Mono', monospace; }
      .modal-specs .spec strong { font-size: 14px; color: #fff; font-weight: 600; }

      .modal-desc { margin-top: 16px; padding: 16px; background: #0a0a0a; border-radius: 12px; }
      .modal-desc p { font-size: 13.5px; color: #ccc; line-height: 1.6; white-space: pre-wrap; margin: 0; }

      .modal-actions { display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap; }
      .modal-actions > * { flex: 1 1 180px; justify-content: center; }

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
        .modal-specs { grid-template-columns: 1fr 1fr; }
        .modal { padding: 20px; border-radius: 16px; }
        .modal-gallery { height: 260px; }
        .modal-title { font-size: 20px; }
        .modal-actions { flex-direction: column; }
      }

      @media (prefers-reduced-motion: reduce) {
        .car-card, .car-skeleton, .pagination-btn, .btn-primary, .btn-outline { animation: none !important; transition: none !important; }
      }

      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp {
        from { opacity: 0; transform: scale(0.95) translateY(20px); }
        to   { opacity: 1; transform: scale(1) translateY(0); }
      }
    `}</style>
  );
}

export default GalleryPage;
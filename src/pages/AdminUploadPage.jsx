import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Car, Wrench, Upload, X, Plus, Loader2, ArrowLeft } from 'lucide-react';
import { uploadImage } from '../service/cloudinary.service';
import { carService } from '../service/carUpload.service';
import { sparePartService } from '../service/sparePart.service';

const emptyCar = {
  name: '', make: '', model: '', trim: '', year: '', color: '',
  transmission: 'Automatic', fuel: 'Petrol', mileage: '',
  price: '', location: '', status: '', grade: '',
  description: '', fullDescription: '',
  section: 'new-arrivals',
  featured: false, newArrival: true, inStock: true,
};

const emptyPart = {
  name: '', brand: 'Genuine', category: 'Engine', subcategory: 'Filters',
  description: '', rating: 4.8, inStock: true, price:''
};

export default function AdminUploadPage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'part' ? 'part' : 'car';
  const [tab, setTab] = useState(initialTab);
  const navigate = useNavigate();

  return (
    <div className="admin-upload-root">
      <Style />

      {/* ← Back to Dashboard (floating pill) */}
      <button
        type="button"
        className="back-link"
        onClick={() => navigate('/admin/dashboard')}
      >
        <ArrowLeft size={15} />
        <span>Back to Dashboard</span>
      </button>

      <header className="head">
        <div className="head-left">
          <h1>Upload to Catalog</h1>
          <p className="head-sub">
            Publish a new vehicle with sub-images, or add a spare part.
          </p>
        </div>
        <div className="tabs">
          <button
            className={tab === 'car' ? 'active' : ''}
            onClick={() => setTab('car')}
          >
            <Car size={16} /> Car
          </button>
          <button
            className={tab === 'part' ? 'active' : ''}
            onClick={() => setTab('part')}
          >
            <Wrench size={16} /> Spare Part
          </button>
        </div>
      </header>

      {tab === 'car' ? (
        <CarForm initialSection={searchParams.get('section') || 'new-arrivals'} />
      ) : (
        <PartForm />
      )}
    </div>
  );
}

/* ================================================================== */
/*  Car form                                                           */
/* ================================================================== */

function CarForm({ initialSection = 'new-arrivals' }) {
  const [form, setForm] = useState({ ...emptyCar, section: initialSection });
  const [cover, setCover] = useState(null);         // { url, publicId }
  const [subImages, setSubImages] = useState([]);   // [{ url, publicId, label }]
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleCover = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const r = await uploadImage(file, { folder: 'lordgroup/cars' });
      setCover({ url: r.url, publicId: r.publicId });
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  const handleSubImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const r = await uploadImage(file, { folder: 'lordgroup/cars/sub' });
        uploaded.push({ url: r.url, publicId: r.publicId, label: '' });
      }
      setSubImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  const removeSub = (i) =>
    setSubImages((prev) => prev.filter((_, idx) => idx !== i));

  const setLabel = (i, label) =>
    setSubImages((prev) =>
      prev.map((img, idx) => (idx === i ? { ...img, label } : img))
    );

  const submit = async (e) => {
    e.preventDefault();
    if (!cover) return setMsg({ type: 'error', text: 'Cover image is required' });
    setBusy(true);
    setMsg(null);
    try {
      await carService.create({
        ...form,
        mileage: Number(form.mileage) || 0,
        coverImage: cover,
        subImages,
      });
      setMsg({ type: 'success', text: 'Car uploaded successfully!' });
      setForm({ ...emptyCar, section: initialSection });
      setCover(null);
      setSubImages([]);
      setTimeout(() => navigate('/admin/dashboard'), 1200);
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="grid" onSubmit={submit}>
      <section className="col">
        <h2>Basic</h2>
        <Field label="Name *">
          <input
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            required
          />
        </Field>
        <Row>
          <Field label="Make">
            <input value={form.make} onChange={(e) => update('make', e.target.value)} />
          </Field>
          <Field label="Model">
            <input value={form.model} onChange={(e) => update('model', e.target.value)} />
          </Field>
        </Row>
        <Row>
          <Field label="Trim">
            <input value={form.trim} onChange={(e) => update('trim', e.target.value)} />
          </Field>
          <Field label="Year">
            <input value={form.year} onChange={(e) => update('year', e.target.value)} />
          </Field>
        </Row>
        <Row>
          <Field label="Color">
            <input value={form.color} onChange={(e) => update('color', e.target.value)} />
          </Field>
          <Field label="Transmission">
            <select
              value={form.transmission}
              onChange={(e) => update('transmission', e.target.value)}
            >
              {['Automatic', 'Manual', 'CVT'].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </Field>
        </Row>
        <Row>
          <Field label="Fuel">
            <select value={form.fuel} onChange={(e) => update('fuel', e.target.value)}>
              {['Petrol', 'Diesel', 'Hybrid', 'Electric'].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </Field>
          <Field label="Mileage">
            <input
              type="number"
              value={form.mileage}
              onChange={(e) => update('mileage', e.target.value)}
            />
          </Field>
        </Row>
        <Row>
          <Field label="Price">
            <input
              value={form.price}
              onChange={(e) => update('price', e.target.value)}
              placeholder="e.g. 17M"
            />
          </Field>
          <Field label="Location">
            <input value={form.location} onChange={(e) => update('location', e.target.value)} />
          </Field>
        </Row>
        <Row>
          <Field label="Status">
            <input
              value={form.status}
              onChange={(e) => update('status', e.target.value)}
              placeholder="Toks Standard"
            />
          </Field>
          <Field label="Grade">
            <input
              value={form.grade}
              onChange={(e) => update('grade', e.target.value)}
              placeholder="A+++"
            />
          </Field>
        </Row>
        <Field label="Short Description">
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </Field>
        <Field label="Full Description">
          <textarea
            rows={5}
            value={form.fullDescription}
            onChange={(e) => update('fullDescription', e.target.value)}
          />
        </Field>
      </section>

      <section className="col">
        <h2>Placement</h2>
        <Field label="Section">
          <select
            value={form.section}
            onChange={(e) => update('section', e.target.value)}
          >
            <option value="new-arrivals">New Arrivals (homepage)</option>
            <option value="gallery">Gallery / Inventory</option>
          </select>
        </Field>
        <Check label="Featured" checked={form.featured} onChange={(v) => update('featured', v)} />
        <Check label="New Arrival" checked={form.newArrival} onChange={(v) => update('newArrival', v)} />
        <Check label="In Stock" checked={form.inStock} onChange={(v) => update('inStock', v)} />

        <h2>Cover Image *</h2>
        {cover ? (
          <div className="thumb-lg">
            <img src={cover.url} alt="cover" />
            <button type="button" onClick={() => setCover(null)}>
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="drop">
            <Upload size={18} />
            <span>Choose cover</span>
            <input type="file" accept="image/*" onChange={handleCover} hidden />
          </label>
        )}

        <h2>Sub Images (interior, engine, etc.)</h2>
        <label className="drop">
          <Plus size={18} />
          <span>Add sub images</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleSubImages}
            hidden
          />
        </label>

        {!!subImages.length && (
          <div className="thumbs">
            {subImages.map((img, i) => (
              <div key={img.publicId} className="thumb">
                <img src={img.url} alt="" />
                <button type="button" className="x" onClick={() => removeSub(i)}>
                  <X size={12} />
                </button>
                <input
                  className="label"
                  placeholder="label (engine…)"
                  value={img.label}
                  onChange={(e) => setLabel(i, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="form-actions">
          <button className="submit" disabled={busy}>
            {busy ? <Loader2 className="spin" size={16} /> : <Upload size={16} />}
            {busy ? 'Uploading…' : 'Publish Car'}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/admin/dashboard')}
            disabled={busy}
          >
            Cancel
          </button>
        </div>

        {msg && <div className={`msg ${msg.type}`}>{msg.text}</div>}
      </section>
    </form>
  );
}

/* ================================================================== */
/*  Spare Part form                                                    */
/* ================================================================== */

function PartForm() {
  const [form, setForm] = useState(emptyPart);
  const [cover, setCover] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleCover = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const r = await uploadImage(file, { folder: 'lordgroup/spare-parts' });
      setCover({ url: r.url, publicId: r.publicId });
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!cover) return setMsg({ type: 'error', text: 'Image is required' });
    setBusy(true);
    setMsg(null);
    try {
      await sparePartService.create({ ...form, coverImage: cover });
      setMsg({ type: 'success', text: 'Spare part uploaded!' });
      setForm(emptyPart);
      setCover(null);
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="grid" onSubmit={submit}>
      <section className="col">
        <Field label="Name *">
          <input
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            required
          />
        </Field>
        <Row>
          <Field label="Brand">
            <input value={form.brand} onChange={(e) => update('brand', e.target.value)} />
          </Field>
          <Field label="Category">
            <input value={form.category} onChange={(e) => update('category', e.target.value)} />
          </Field>
        </Row>
        <Field label="Subcategory">
          <input
            value={form.subcategory}
            onChange={(e) => update('subcategory', e.target.value)}
          />
        </Field>
        <Field label="Price">
  <input
    value={form.price}
    onChange={(e) => update('price', e.target.value)}
    placeholder="e.g. 17M"
  />
</Field>
        <Field label="Description">
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </Field>
        <Check label="In Stock" checked={form.inStock} onChange={(v) => update('inStock', v)} />
      </section>

      <section className="col">
        <h2>Image *</h2>
        {cover ? (
          <div className="thumb-lg">
            <img src={cover.url} alt="cover" />
            <button type="button" onClick={() => setCover(null)}>
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="drop">
            <Upload size={18} />
            <span>Choose image</span>
            <input type="file" accept="image/*" onChange={handleCover} hidden />
          </label>
        )}

        <div className="form-actions">
          <button className="submit" disabled={busy}>
            {busy ? <Loader2 className="spin" size={16} /> : <Upload size={16} />}
            {busy ? 'Uploading…' : 'Publish Spare Part'}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/admin/dashboard')}
            disabled={busy}
          >
            Cancel
          </button>
        </div>

        {msg && <div className={`msg ${msg.type}`}>{msg.text}</div>}
      </section>
    </form>
  );
}

/* ================================================================== */
/*  Tiny helpers                                                       */
/* ================================================================== */

const Field = ({ label, children }) => (
  <label className="field">
    <span>{label}</span>
    {children}
  </label>
);

const Row = ({ children }) => <div className="row">{children}</div>;

const Check = ({ label, checked, onChange }) => (
  <label className="check">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span>{label}</span>
  </label>
);

/* ================================================================== */
/*  Styles                                                             */
/* ================================================================== */

function Style() {
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

      .font-display { font-family: 'Space Grotesk', sans-serif; }
      .font-mono { font-family: 'IBM Plex Mono', monospace; }

      .admin-upload-root {
        position: relative;
        min-height: 100vh;
        background: var(--bg);
        color: var(--text);
        font-family: 'Inter', sans-serif;
        padding: 84px 24px 64px;
        max-width: 1120px;
        margin: 0 auto;
      }

      /* ---------- Back to Dashboard pill ---------- */
      .back-link {
        position: absolute;
        top: 24px;
        left: 24px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 9px 16px;
        border-radius: 999px;
        border: 1px solid var(--line);
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(10px);
        color: var(--muted);
        font-size: 13px;
        font-family: 'Inter', sans-serif;
        cursor: pointer;
        transition: color .25s ease, border-color .25s ease, transform .25s ease;
        z-index: 5;
      }
      .back-link:hover {
        color: var(--text);
        border-color: var(--accent);
        transform: translateX(-2px);
      }

      /* ---------- Header ---------- */
      .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        margin-bottom: 24px;
        flex-wrap: wrap;
      }
      .head-left h1 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 26px;
        font-weight: 700;
        letter-spacing: -0.02em;
        margin: 0;
      }
      .head-sub {
        font-size: 13.5px;
        color: var(--muted);
        margin-top: 4px;
      }
      .tabs {
        display: flex;
        gap: 4px;
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 4px;
      }
      .tabs button {
        display: flex;
        gap: 6px;
        align-items: center;
        background: transparent;
        border: none;
        color: var(--muted);
        padding: 8px 16px;
        border-radius: 999px;
        cursor: pointer;
        font-size: 13.5px;
        font-family: 'Inter', sans-serif;
        transition: background .2s ease, color .2s ease;
      }
      .tabs button:hover { color: var(--text); }
      .tabs button.active {
        background: var(--accent);
        color: #fff;
      }

      /* ---------- Layout ---------- */
      .grid {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: 28px;
      }
      @media (max-width: 900px) {
        .grid { grid-template-columns: 1fr; }
      }

      .col {
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 22px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .col h2 {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--accent);
        font-family: 'IBM Plex Mono', monospace;
        margin: 4px 0;
      }

      .row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      @media (max-width: 480px) {
        .row { grid-template-columns: 1fr; }
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 12.5px;
        color: var(--muted);
      }
      .field input,
      .field select,
      .field textarea {
        background: var(--bg);
        border: 1px solid var(--line);
        border-radius: 10px;
        padding: 10px 12px;
        color: var(--text);
        font-size: 14px;
        font-family: 'Inter', sans-serif;
        transition: border-color .2s ease, box-shadow .2s ease;
      }
      .field input:focus,
      .field select:focus,
      .field textarea:focus {
        outline: none;
        border-color: var(--accent);
        box-shadow: 0 0 0 3px rgba(0,102,204,0.15);
      }
      .field textarea { resize: vertical; }

      .check {
        display: flex;
        gap: 8px;
        align-items: center;
        font-size: 13.5px;
        color: var(--text);
        cursor: pointer;
      }
      .check input { accent-color: var(--accent); }

      /* ---------- Uploads ---------- */
      .drop {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 24px;
        border: 1px dashed var(--line);
        border-radius: 12px;
        color: var(--muted);
        font-size: 13px;
        cursor: pointer;
        transition: border-color .2s ease, color .2s ease, background .2s ease;
      }
      .drop:hover {
        border-color: var(--accent);
        color: var(--accent);
        background: rgba(0,102,204,0.04);
      }

      .thumb-lg {
        position: relative;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid var(--line);
      }
      .thumb-lg img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        display: block;
      }
      .thumb-lg button {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(0,0,0,0.7);
        border: none;
        color: #fff;
        border-radius: 999px;
        width: 26px;
        height: 26px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .thumbs {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 10px;
      }
      .thumb {
        position: relative;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid var(--line);
        background: var(--bg);
      }
      .thumb img {
        width: 100%;
        height: 90px;
        object-fit: cover;
        display: block;
      }
      .thumb .x {
        position: absolute;
        top: 4px;
        right: 4px;
        background: rgba(0,0,0,0.7);
        border: none;
        color: #fff;
        width: 20px;
        height: 20px;
        border-radius: 999px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .thumb .label {
        width: 100%;
        border: none;
        background: var(--surface);
        color: var(--text);
        font-size: 11px;
        padding: 5px 6px;
        border-top: 1px solid var(--line);
        outline: none;
      }
      .thumb .label:focus { background: var(--surface-alt); }

      /* ---------- Actions ---------- */
      .form-actions {
        display: flex;
        gap: 10px;
        margin-top: 6px;
      }
      .submit {
        flex: 1;
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: center;
        padding: 13px 22px;
        border-radius: 999px;
        background: var(--accent);
        color: #fff;
        border: none;
        cursor: pointer;
        font-weight: 600;
        font-size: 14.5px;
        font-family: 'Inter', sans-serif;
        box-shadow: 0 10px 30px rgba(0,102,204,0.28);
        transition: background .25s ease, transform .25s ease, box-shadow .25s ease, opacity .25s ease;
      }
      .submit:hover:not(:disabled) {
        background: #0080ff;
        transform: translateY(-2px);
        box-shadow: 0 16px 40px rgba(0,102,204,0.42);
      }
      .submit:disabled { opacity: 0.6; cursor: not-allowed; }

      .cancel-btn {
        padding: 13px 22px;
        border-radius: 999px;
        border: 1px solid var(--line);
        background: transparent;
        color: var(--muted);
        cursor: pointer;
        font-size: 14px;
        font-family: 'Inter', sans-serif;
        transition: border-color .25s ease, color .25s ease, background .25s ease;
      }
      .cancel-btn:hover:not(:disabled) {
        border-color: var(--accent);
        color: var(--text);
        background: rgba(0,102,204,0.06);
      }
      .cancel-btn:disabled { opacity: 0.5; cursor: not-allowed; }

      /* ---------- Messages ---------- */
      .msg {
        padding: 10px 14px;
        border-radius: 10px;
        font-size: 13px;
      }
      .msg.success {
        background: rgba(34,197,94,0.1);
        border: 1px solid #22c55e;
        color: #86efac;
      }
      .msg.error {
        background: rgba(239,68,68,0.1);
        border: 1px solid #ef4444;
        color: #fca5a5;
      }

      .spin { animation: spin 0.9s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }

      @media (max-width: 720px) {
        .admin-upload-root { padding: 76px 16px 48px; }
        .back-link { top: 16px; left: 16px; font-size: 12px; }
        .head { flex-direction: column; align-items: flex-start; }
      }

      @media (prefers-reduced-motion: reduce) {
        .back-link, .submit, .cancel-btn, .spin, .drop, .tabs button {
          animation: none !important;
          transition: none !important;
        }
      }
    `}</style>
  );
}
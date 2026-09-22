import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Loader2,
  Save,
  AlertCircle,
  Image as ImageIcon,
  Info,
} from 'lucide-react';
import { uploadImage } from '../service/cloudinary.service';
import { carService } from '../service/carUpload.service';
import { sparePartService } from '../service/sparePart.service';

/* ================================================================== */
/*  Page shell                                                         */
/* ================================================================== */

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await carService.get(id);
        if (!cancelled) setListing(data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Listing not found');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  return (
    <div className="edit-root">
      <Style />

      {/* ---- Sticky top bar ---- */}
      <header className="topbar">
        <button
          type="button"
          className="back-link"
          onClick={() => navigate('/admin/manage')}
        >
          <ArrowLeft size={15} />
          <span>Back to listings</span>
        </button>

        <div className="topbar-title">
          <h1 className="font-display">
            {listing?.type === 'spare-part' ? 'Edit Spare Part' : 'Edit Car'}
          </h1>
          {listing?.name && (
            <p className="topbar-sub">{listing.name}</p>
          )}
        </div>

        <div className="topbar-spacer" />
      </header>

      {/* ---- Body ---- */}
      <main className="edit-body">
        {loading && (
          <div className="state">
            <Loader2 className="spin" size={26} />
            <p>Loading listing…</p>
          </div>
        )}

        {!loading && (error || !listing) && (
          <div className="state">
            <AlertCircle size={26} color="#f87171" />
            <p>{error || 'Listing not found'}</p>
          </div>
        )}

        {!loading && listing && (
          listing.type === 'spare-part' ? (
            <PartEdit listing={listing} onSaved={() => navigate('/admin/manage')} />
          ) : (
            <CarEdit listing={listing} onSaved={() => navigate('/admin/manage')} />
          )
        )}
      </main>
    </div>
  );
}

/* ================================================================== */
/*  Car edit                                                           */
/* ================================================================== */

function CarEdit({ listing, onSaved }) {
  const [form, setForm] = useState({
    name: listing.name || '',
    make: listing.make || '',
    model: listing.model || '',
    trim: listing.trim || '',
    year: listing.year || '',
    color: listing.color || '',
    transmission: listing.transmission || 'Automatic',
    fuel: listing.fuel || 'Petrol',
    mileage: listing.mileage || '',
    price: listing.price || '',
    location: listing.location || '',
    status: listing.status || '',
    grade: listing.grade || '',
    description: listing.description || '',
    fullDescription: listing.fullDescription || '',
    section: listing.section || 'new-arrivals',
    featured: !!listing.featured,
    newArrival: !!listing.newArrival,
    inStock: listing.inStock !== false,
  });

  const [cover, setCover] = useState(listing.coverImage || null);
  const [subImages, setSubImages] = useState(listing.subImages || []);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

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
      await carService.update(listing._id, {
        ...form,
        mileage: Number(form.mileage) || 0,
        coverImage: cover,
        subImages,
      });
      setMsg({ type: 'success', text: 'Changes saved!' });
      setTimeout(onSaved, 900);
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="layout" onSubmit={submit}>
      {/* ============ LEFT: details ============ */}
      <div className="layout-main">
        <Panel title="Basic Information" icon={<Info size={14} />}>
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
            <Field label="Mileage (mi)">
              <input
                type="number"
                value={form.mileage}
                onChange={(e) => update('mileage', e.target.value)}
              />
            </Field>
          </Row>
          <Row>
            <Field label="Price">
              <input value={form.price} onChange={(e) => update('price', e.target.value)} />
            </Field>
            <Field label="Location">
              <input value={form.location} onChange={(e) => update('location', e.target.value)} />
            </Field>
          </Row>
          <Row>
            <Field label="Status">
              <input value={form.status} onChange={(e) => update('status', e.target.value)} />
            </Field>
            <Field label="Grade">
              <input value={form.grade} onChange={(e) => update('grade', e.target.value)} />
            </Field>
          </Row>
        </Panel>

        <Panel title="Description">
          <Field label="Short Description">
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="One-line summary shown on cards"
            />
          </Field>
          <Field label="Full Description">
            <textarea
              rows={6}
              value={form.fullDescription}
              onChange={(e) => update('fullDescription', e.target.value)}
              placeholder="Full listing details shown in the modal"
            />
          </Field>
        </Panel>
      </div>

      {/* ============ RIGHT: images + placement ============ */}
      <aside className="layout-side">
        <Panel title="Cover Image" icon={<ImageIcon size={14} />}>
          {cover ? (
            <div className="thumb-lg">
              <img src={cover.url} alt="cover" />
              <button type="button" onClick={() => setCover(null)} aria-label="Remove cover">
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
        </Panel>

        <Panel title="Sub Images">
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
                  <button
                    type="button"
                    className="x"
                    onClick={() => removeSub(i)}
                    aria-label="Remove image"
                  >
                    <X size={12} />
                  </button>
                  <input
                    className="label"
                    placeholder="label (engine…)"
                    value={img.label || ''}
                    onChange={(e) => setLabel(i, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Placement">
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
          <Check label="New Arrival badge" checked={form.newArrival} onChange={(v) => update('newArrival', v)} />
          <Check label="In Stock" checked={form.inStock} onChange={(v) => update('inStock', v)} />
        </Panel>

        {msg && <div className={`msg ${msg.type}`}>{msg.text}</div>}

        <div className="sticky-actions">
          <button className="submit" disabled={busy}>
            {busy ? <Loader2 className="spin" size={16} /> : <Save size={16} />}
            {busy ? 'Saving…' : 'Save Changes'}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={onSaved}
            disabled={busy}
          >
            Cancel
          </button>
        </div>
      </aside>
    </form>
  );
}

/* ================================================================== */
/*  Spare part edit                                                    */
/* ================================================================== */

function PartEdit({ listing, onSaved }) {
  const [form, setForm] = useState({
    name: listing.name || '',
    brand: listing.brand || 'Genuine',
    category: listing.category || 'Engine',
    subcategory: listing.subcategory || '',
    price: listing.price || '',              // ← NEW
    description: listing.description || '',
    inStock: listing.inStock !== false,
  });
  const [cover, setCover] = useState(listing.coverImage || null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

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
      await sparePartService.update(listing._id, { ...form, coverImage: cover });
      setMsg({ type: 'success', text: 'Changes saved!' });
      setTimeout(onSaved, 900);
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="layout" onSubmit={submit}>
      <div className="layout-main">
        <Panel title="Basic Information" icon={<Info size={14} />}>
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
          <Row>
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
          </Row>
          <Field label="Description">
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
            />
          </Field>
          <Check label="In Stock" checked={form.inStock} onChange={(v) => update('inStock', v)} />
        </Panel>
      </div>

      <aside className="layout-side">
        <Panel title="Image" icon={<ImageIcon size={14} />}>
          {cover ? (
            <div className="thumb-lg">
              <img src={cover.url} alt="cover" />
              <button type="button" onClick={() => setCover(null)} aria-label="Remove image">
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
        </Panel>

        {msg && <div className={`msg ${msg.type}`}>{msg.text}</div>}

        <div className="sticky-actions">
          <button className="submit" disabled={busy}>
            {busy ? <Loader2 className="spin" size={16} /> : <Save size={16} />}
            {busy ? 'Saving…' : 'Save Changes'}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={onSaved}
            disabled={busy}
          >
            Cancel
          </button>
        </div>
      </aside>
    </form>
  );
}

/* ================================================================== */
/*  Building blocks                                                    */
/* ================================================================== */

const Panel = ({ title, icon, children }) => (
  <section className="panel">
    <header className="panel-head">
      {icon && <span className="panel-icon">{icon}</span>}
      <h2 className="panel-title">{title}</h2>
    </header>
    <div className="panel-body">{children}</div>
  </section>
);

const Field = ({ label, children }) => (
  <label className="field">
    <span className="field-label">{label}</span>
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

      .edit-root {
        min-height: 100vh;
        background: var(--bg);
        color: var(--text);
        font-family: 'Inter', sans-serif;
      }

      /* ---------- Top bar ---------- */
      .topbar {
        position: sticky;
        top: 0;
        z-index: 30;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        gap: 16px;
        padding: 14px 28px;
        background: rgba(0,0,0,0.85);
        backdrop-filter: blur(14px);
        border-bottom: 1px solid var(--line);
      }
      .topbar-title { text-align: center; }
      .topbar-title h1 {
        font-size: 20px;
        font-weight: 700;
        letter-spacing: -0.02em;
        margin: 0;
      }
      .topbar-sub {
        font-size: 12.5px;
        color: var(--muted);
        margin-top: 2px;
      }
      .topbar-spacer { min-height: 1px; }

      .back-link {
        justify-self: start;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 9px 16px;
        border-radius: 999px;
        border: 1px solid var(--line);
        background: rgba(0,0,0,0.5);
        color: var(--muted);
        font-size: 13px;
        font-family: 'Inter', sans-serif;
        cursor: pointer;
        transition: color .25s ease, border-color .25s ease, transform .25s ease;
      }
      .back-link:hover {
        color: var(--text);
        border-color: var(--accent);
        transform: translateX(-2px);
      }

      /* ---------- Body ---------- */
      .edit-body {
        max-width: 1180px;
        margin: 0 auto;
        padding: 32px 28px 80px;
      }

      .state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 14px;
        min-height: 55vh;
        color: var(--muted);
      }

      /* ---------- Two-column layout ---------- */
      .layout {
        display: grid;
        grid-template-columns: minmax(0, 1.5fr) minmax(320px, 1fr);
        gap: 24px;
        align-items: start;
      }
      .layout-main,
      .layout-side {
        display: flex;
        flex-direction: column;
        gap: 20px;
        min-width: 0;
      }

      @media (max-width: 960px) {
        .layout { grid-template-columns: 1fr; }
      }

      /* ---------- Panels ---------- */
      .panel {
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 16px;
        overflow: hidden;
      }
      .panel-head {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 16px 20px;
        border-bottom: 1px solid var(--line);
        background: rgba(255,255,255,0.015);
      }
      .panel-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 6px;
        background: rgba(0,102,204,0.14);
        color: var(--accent);
      }
      .panel-title {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--text);
        font-family: 'IBM Plex Mono', monospace;
        font-weight: 500;
        margin: 0;
      }
      .panel-body {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 20px;
      }

      /* ---------- Fields ---------- */
      .row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
      }
      @media (max-width: 480px) {
        .row { grid-template-columns: 1fr; }
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
      }
      .field-label {
        font-size: 12px;
        font-weight: 500;
        color: var(--muted);
        letter-spacing: 0.02em;
      }
      .field input,
      .field select,
      .field textarea {
        background: var(--bg);
        border: 1px solid var(--line);
        border-radius: 10px;
        padding: 11px 13px;
        color: var(--text);
        font-size: 14px;
        font-family: 'Inter', sans-serif;
        transition: border-color .2s ease, box-shadow .2s ease;
        width: 100%;
      }
      .field input:focus,
      .field select:focus,
      .field textarea:focus {
        outline: none;
        border-color: var(--accent);
        box-shadow: 0 0 0 3px rgba(0,102,204,0.15);
      }
      .field textarea {
        resize: vertical;
        min-height: 60px;
        line-height: 1.55;
      }

      .check {
        display: flex;
        gap: 10px;
        align-items: center;
        font-size: 13.5px;
        color: var(--text);
        cursor: pointer;
        padding: 6px 0;
      }
      .check input {
        accent-color: var(--accent);
        width: 16px;
        height: 16px;
      }

      /* ---------- Uploads ---------- */
      .drop {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 32px 20px;
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
        height: 220px;
        object-fit: cover;
        display: block;
      }
      .thumb-lg button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0,0,0,0.75);
        border: none;
        color: #fff;
        width: 28px;
        height: 28px;
        border-radius: 999px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .thumbs {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
        gap: 10px;
      }
      .thumb {
        position: relative;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid var(--line);
        background: var(--bg);
        display: flex;
        flex-direction: column;
      }
      .thumb img {
        width: 100%;
        height: 84px;
        object-fit: cover;
        display: block;
      }
      .thumb .x {
        position: absolute;
        top: 4px;
        right: 4px;
        background: rgba(0,0,0,0.75);
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
        padding: 6px 8px;
        border-top: 1px solid var(--line);
        outline: none;
      }
      .thumb .label:focus {
        background: var(--surface-alt);
      }

      /* ---------- Sticky actions ---------- */
      .sticky-actions {
        position: sticky;
        bottom: 20px;
        display: flex;
        gap: 10px;
        padding: 12px;
        background: rgba(10,10,10,0.9);
        backdrop-filter: blur(14px);
        border: 1px solid var(--line);
        border-radius: 999px;
      }
      .submit {
        flex: 1;
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: center;
        padding: 12px 20px;
        border-radius: 999px;
        background: var(--accent);
        color: #fff;
        border: none;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
        font-family: 'Inter', sans-serif;
        box-shadow: 0 10px 30px rgba(0,102,204,0.28);
        transition: background .25s ease, transform .25s ease, box-shadow .25s ease, opacity .25s ease;
      }
      .submit:hover:not(:disabled) {
        background: #0080ff;
        transform: translateY(-1px);
        box-shadow: 0 14px 34px rgba(0,102,204,0.42);
      }
      .submit:disabled { opacity: 0.6; cursor: not-allowed; }

      .cancel-btn {
        padding: 12px 20px;
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
        padding: 12px 16px;
        border-radius: 12px;
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

      .spin { animation: spin .9s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }

      /* ---------- Responsive ---------- */
      @media (max-width: 720px) {
        .topbar {
          grid-template-columns: auto 1fr auto;
          padding: 12px 16px;
        }
        .topbar-title h1 { font-size: 16px; }
        .back-link span { display: none; }
        .back-link { padding: 9px 12px; }
        .edit-body { padding: 24px 16px 60px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .back-link, .submit, .cancel-btn, .spin, .drop {
          animation: none !important;
          transition: none !important;
        }
      }
    `}</style>
  );
}
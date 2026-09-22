import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Plus,
  Car,
  Wrench,
  AlertTriangle,
  Loader2,
  Search,
  RefreshCw,
} from 'lucide-react';
import { carService } from '../services/carUpload.service';
import { sparePartService } from '../services/sparePart.service';

export default function ManageListingsPage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all | car | spare-part
  const [query, setQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  /* ---------- load ---------- */
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const all = await carService.list();
      setListings(Array.isArray(all) ? all : []);
    } catch (err) {
      setError(err.message || 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* ---------- derived ---------- */
  const visible = listings
    .filter((l) => (filter === 'all' ? true : l.type === filter))
    .filter((l) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        (l.name || '').toLowerCase().includes(q) ||
        (l.brand || '').toLowerCase().includes(q) ||
        (l.make || '').toLowerCase().includes(q) ||
        (l.model || '').toLowerCase().includes(q)
      );
    });

  /* ---------- delete ---------- */
  const handleDelete = async (listing) => {
    setDeletingId(listing._id);
    try {
      if (listing.type === 'spare-part') {
        await sparePartService.remove(listing._id);
      } else {
        await carService.remove(listing._id);
      }
      setListings((prev) => prev.filter((l) => l._id !== listing._id));
      setConfirmDelete(null);
    } catch (err) {
      setError(err.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="manage-root">
      <Style />

      {/* Back to Dashboard */}
      <button
        type="button"
        className="back-link"
        onClick={() => navigate('/admin/dashboard')}
      >
        <ArrowLeft size={15} />
        <span>Back to Dashboard</span>
      </button>

      <header className="head">
        <div>
          <h1 className="font-display">Manage Listings</h1>
          <p className="head-sub">
            Edit or delete cars and spare parts. Deleting removes the images from Cloudinary too.
          </p>
        </div>
        <button className="primary-btn" onClick={() => navigate('/admin/upload')}>
          <Plus size={16} strokeWidth={2.4} />
          <span>New Listing</span>
        </button>
      </header>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="tabs">
          {[
            { key: 'all', label: 'All' },
            { key: 'car', label: 'Cars', icon: <Car size={14} /> },
            { key: 'spare-part', label: 'Spare Parts', icon: <Wrench size={14} /> },
          ].map((t) => (
            <button
              key={t.key}
              className={filter === t.key ? 'active' : ''}
              onClick={() => setFilter(t.key)}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <div className="search-wrap">
          <Search size={15} className="search-icon" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, make, brand…"
          />
        </div>

        <button className="icon-btn" onClick={load} title="Refresh">
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
        </button>
      </div>

      {error && <div className="msg error">{error}</div>}

      {/* Table */}
      {loading ? (
        <div className="empty">
          <Loader2 className="spin" size={22} />
          <p>Loading listings…</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="empty">
          <p>No listings found.</p>
          <button className="primary-btn" onClick={() => navigate('/admin/upload')}>
            <Plus size={16} /> Upload your first listing
          </button>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 90 }}>Image</th>
                <th>Name</th>
                <th style={{ width: 140 }}>Type</th>
                <th style={{ width: 140 }}>Section</th>
                <th style={{ width: 120 }}>Price</th>
                <th style={{ width: 100 }}>Stock</th>
                <th style={{ width: 180 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((l) => (
                <tr key={l._id}>
                  <td>
                    <div className="thumb">
                      {l.coverImage?.url ? (
                        <img src={l.coverImage.url} alt={l.name} />
                      ) : (
                        <div className="thumb-placeholder">–</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="name">{l.name}</div>
                    <div className="sub">
                      {l.make || l.brand || ''} {l.model || ''} {l.year ? `· ${l.year}` : ''}
                    </div>
                  </td>
                  <td>
                    <span className={`pill ${l.type === 'car' ? 'blue' : 'violet'}`}>
                      {l.type === 'car' ? 'Car' : 'Spare Part'}
                    </span>
                  </td>
                  <td className="mono">{l.section}</td>
                  <td>{l.price || '—'}</td>
                  <td>
                    <span className={`pill ${l.inStock ? 'green' : 'red'}`}>
                      {l.inStock ? 'In Stock' : 'Out'}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="row-btn edit"
                        onClick={() => navigate(`/admin/edit/${l._id}`)}
                        title="Edit"
                      >
                        <Pencil size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        className="row-btn delete"
                        onClick={() => setConfirmDelete(l)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <AlertTriangle size={22} color="#f59e0b" />
            </div>
            <h3 className="font-display">Delete this listing?</h3>
            <p className="modal-sub">
              <strong>{confirmDelete.name}</strong> will be removed from the database, and its
              images will be deleted permanently. This cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                className="btn-ghost"
                onClick={() => setConfirmDelete(null)}
                disabled={!!deletingId}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={() => handleDelete(confirmDelete)}
                disabled={deletingId === confirmDelete._id}
              >
                {deletingId === confirmDelete._id ? (
                  <>
                    <Loader2 className="spin" size={14} /> Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 size={14} /> Yes, delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Styles                                                             */
/* ================================================================== */

function Style() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

      :root {
        --bg:#0a0a0a; --surface:#1a1a1a; --surface-alt:#2a2a2a;
        --line:#333; --line-strong:#444; --text:#fff; --muted:#999;
        --accent:#0066cc; --accent-deep:#004d99;
      }
      .font-display { font-family: 'Space Grotesk', sans-serif; }
      .font-mono { font-family: 'IBM Plex Mono', monospace; }

      .manage-root {
        position: relative;
        min-height: 100vh;
        background: var(--bg);
        color: var(--text);
        font-family: 'Inter', sans-serif;
        padding: 84px 24px 64px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .back-link {
        position: absolute;
        top: 24px; left: 24px;
        display: inline-flex; align-items: center; gap: 8px;
        padding: 9px 16px; border-radius: 999px;
        border: 1px solid var(--line);
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(10px);
        color: var(--muted); font-size: 13px;
        cursor: pointer;
        transition: color .25s ease, border-color .25s ease, transform .25s ease;
        z-index: 5;
      }
      .back-link:hover { color: var(--text); border-color: var(--accent); transform: translateX(-2px); }

      .head {
        display: flex; justify-content: space-between; align-items: flex-end;
        gap: 16px; margin-bottom: 22px; flex-wrap: wrap;
      }
      .head h1 { font-size: 26px; font-weight: 700; letter-spacing: -0.02em; margin: 0; }
      .head-sub { font-size: 13.5px; color: var(--muted); margin-top: 4px; max-width: 560px; }

      .primary-btn {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 11px 20px; border-radius: 999px;
        background: var(--accent); color: #fff;
        font-weight: 600; font-size: 14px;
        border: none; cursor: pointer;
        box-shadow: 0 10px 30px rgba(0,102,204,0.3);
        transition: background .25s ease, transform .25s ease, box-shadow .25s ease;
        white-space: nowrap;
      }
      .primary-btn:hover { background: #0080ff; transform: translateY(-2px); box-shadow: 0 16px 40px rgba(0,102,204,0.42); }

      .toolbar {
        display: flex; align-items: center; gap: 12px;
        margin-bottom: 20px; flex-wrap: wrap;
      }
      .tabs {
        display: flex; gap: 4px;
        background: var(--surface); border: 1px solid var(--line);
        border-radius: 999px; padding: 4px;
      }
      .tabs button {
        display: flex; gap: 6px; align-items: center;
        background: transparent; border: none;
        color: var(--muted); padding: 8px 14px;
        border-radius: 999px; cursor: pointer; font-size: 13px;
        font-family: 'Inter', sans-serif;
        transition: background .2s ease, color .2s ease;
        white-space: nowrap;
      }
      .tabs button:hover { color: var(--text); }
      .tabs button.active { background: var(--accent); color: #fff; }

      .search-wrap {
        position: relative; flex: 1; min-width: 220px; max-width: 360px;
      }
      .search-wrap .search-icon {
        position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
        color: var(--muted); pointer-events: none;
      }
      .search-wrap input {
        width: 100%;
        background: var(--surface); border: 1px solid var(--line);
        border-radius: 999px;
        padding: 10px 14px 10px 36px;
        color: var(--text); font-size: 13.5px;
        font-family: 'Inter', sans-serif;
        transition: border-color .2s ease, box-shadow .2s ease;
      }
      .search-wrap input:focus {
        outline: none; border-color: var(--accent);
        box-shadow: 0 0 0 3px rgba(0,102,204,0.15);
      }

      .icon-btn {
        width: 38px; height: 38px; border-radius: 999px;
        display: flex; align-items: center; justify-content: center;
        background: var(--surface); border: 1px solid var(--line);
        color: var(--text); cursor: pointer;
        transition: border-color .25s ease, background .25s ease;
        flex-shrink: 0;
      }
      .icon-btn:hover { border-color: var(--accent); background: var(--surface-alt); }

      /* ---------- Table (horizontal scroll on mobile) ---------- */
      .table-wrap {
        border: 1px solid var(--line);
        border-radius: 16px;
        background: var(--surface);
        overflow-x: auto;              /* ← enables horizontal scroll */
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
      }
      .table-wrap::-webkit-scrollbar { height: 8px; }
      .table-wrap::-webkit-scrollbar-track { background: #111; border-radius: 0 0 16px 16px; }
      .table-wrap::-webkit-scrollbar-thumb {
        background: var(--line-strong);
        border-radius: 999px;
      }
      .table-wrap::-webkit-scrollbar-thumb:hover { background: #555; }

      .table {
        width: 100%;
        min-width: 860px;              /* forces scroll instead of squishing */
        border-collapse: collapse;
      }
      .table th {
        text-align: left;
        font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
        color: var(--muted); font-family: 'IBM Plex Mono', monospace;
        padding: 14px 16px;
        background: #111; border-bottom: 1px solid var(--line);
        white-space: nowrap;
      }
      .table td {
        padding: 14px 16px;
        border-bottom: 1px solid var(--line);
        font-size: 13.5px;
        vertical-align: middle;
        white-space: nowrap;
      }
      .table tr:last-child td { border-bottom: none; }
      .table tr:hover td { background: #161616; }

      .thumb {
        width: 62px; height: 44px; border-radius: 8px; overflow: hidden;
        background: var(--bg); border: 1px solid var(--line);
        display: flex; align-items: center; justify-content: center;
      }
      .thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .thumb-placeholder { color: var(--muted); font-size: 12px; }

      .name { font-weight: 600; color: var(--text); }
      .sub { font-size: 12px; color: var(--muted); margin-top: 2px; }
      .mono { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; color: var(--muted); }

      .pill {
        display: inline-flex; align-items: center;
        padding: 4px 10px; border-radius: 999px;
        font-size: 11px; font-weight: 600; letter-spacing: 0.02em;
        white-space: nowrap;
      }
      .pill.blue { background: rgba(0,102,204,0.14); color: var(--accent); border: 1px solid rgba(0,102,204,0.3); }
      .pill.violet { background: rgba(139,92,246,0.14); color: #a78bfa; border: 1px solid rgba(139,92,246,0.3); }
      .pill.green { background: rgba(34,197,94,0.14); color: #4ade80; border: 1px solid rgba(34,197,94,0.3); }
      .pill.red { background: rgba(239,68,68,0.14); color: #f87171; border: 1px solid rgba(239,68,68,0.3); }

      .actions { display: flex; gap: 8px; }
      .row-btn {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 7px 12px; border-radius: 999px;
        border: 1px solid var(--line);
        background: transparent;
        font-size: 12.5px; font-weight: 600;
        cursor: pointer;
        transition: all .2s ease;
        white-space: nowrap;
      }
      .row-btn.edit { color: var(--accent); border-color: rgba(0,102,204,0.35); }
      .row-btn.edit:hover { background: rgba(0,102,204,0.12); border-color: var(--accent); }
      .row-btn.delete { color: #f87171; border-color: rgba(239,68,68,0.35); }
      .row-btn.delete:hover { background: rgba(239,68,68,0.12); border-color: #ef4444; }

      /* Empty */
      .empty {
        display: flex; flex-direction: column; align-items: center; gap: 12px;
        padding: 60px 20px;
        background: var(--surface); border: 1px solid var(--line);
        border-radius: 16px; color: var(--muted);
      }

      /* Modal */
      .modal-overlay {
        position: fixed; inset: 0; z-index: 100;
        display: flex; align-items: center; justify-content: center;
        background: rgba(0,0,0,0.75); backdrop-filter: blur(8px);
        padding: 20px;
        animation: fadeIn .25s ease;
      }
      .modal {
        background: var(--surface); border: 1px solid var(--line);
        border-radius: 18px; padding: 28px;
        max-width: 440px; width: 100%;
        animation: slideUp .3s cubic-bezier(.22,.61,.36,1);
      }
      .modal-icon {
        width: 48px; height: 48px; border-radius: 12px;
        background: rgba(245,158,11,0.12);
        display: flex; align-items: center; justify-content: center;
        margin-bottom: 14px;
      }
      .modal h3 { font-size: 19px; font-weight: 700; margin: 0 0 8px; }
      .modal-sub { font-size: 13.5px; color: var(--muted); line-height: 1.6; }
      .modal-sub strong { color: var(--text); }
      .modal-actions { display: flex; gap: 10px; margin-top: 20px; }
      .btn-ghost, .btn-danger {
        flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
        padding: 12px 18px; border-radius: 999px;
        font-weight: 600; font-size: 13.5px;
        cursor: pointer;
        transition: all .2s ease;
      }
      .btn-ghost {
        background: transparent; border: 1px solid var(--line); color: var(--muted);
      }
      .btn-ghost:hover:not(:disabled) { border-color: var(--line-strong); color: var(--text); }
      .btn-danger { background: #dc2626; border: none; color: #fff; }
      .btn-danger:hover:not(:disabled) { background: #ef4444; }
      .btn-ghost:disabled, .btn-danger:disabled { opacity: .6; cursor: not-allowed; }

      /* Messages */
      .msg { padding: 10px 14px; border-radius: 10px; font-size: 13px; margin-bottom: 14px; }
      .msg.error { background: rgba(239,68,68,0.1); border: 1px solid #ef4444; color: #fca5a5; }

      .spin { animation: spin .9s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp { from { opacity: 0; transform: translateY(16px) scale(.98); } to { opacity: 1; transform: none; } }

      /* ---------- Mobile ---------- */
      @media (max-width: 760px) {
        .manage-root { padding: 76px 14px 48px; }
        .back-link { top: 16px; left: 16px; font-size: 12px; }
        .head h1 { font-size: 22px; }
        .head-sub { font-size: 12.5px; }
        .toolbar { gap: 10px; }
        .tabs { flex: 1; }
        .tabs button { flex: 1; justify-content: center; padding: 8px 10px; font-size: 12.5px; }
        .search-wrap { min-width: 100%; max-width: none; order: 3; }
        .primary-btn { padding: 10px 16px; font-size: 13px; }
        .row-btn span { display: none; }
        .row-btn { padding: 8px 10px; }
        .table th, .table td { padding: 12px; font-size: 13px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .spin, .modal, .modal-overlay { animation: none !important; transition: none !important; }
      }
    `}</style>
  );
}
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  ShieldCheck,
  LayoutGrid,
  Package,
  Wrench,
  Upload,
  ArrowUpRight,
  Layers,
} from "lucide-react";
import { adminService } from "../service/admin.service.js";
import images from "../assets/image.js";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    adminService
      .me()
      .then(setAdmin)
      .catch(() => navigate("/admin/login", { replace: true }));
  }, [navigate]);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      adminService.logout();
      navigate("/admin/login", { replace: true });
    }, 250);
  };

  return (
    <div className="admin-root">
      <GlobalStyle />

      {/* ---------- Top bar ---------- */}
      <header className="admin-topbar">
        <div className="topbar-left">
          <div className="topbar-logo">
            <img src={images.Logo2} alt="Lord Group Autos" />
          </div>
          <div className="topbar-brand">
            <span className="font-display">Lord Group</span>
            <span className="accent font-display"> AUTOS</span>
            <span className="admin-badge">ADMIN</span>
          </div>
        </div>

        <div className="topbar-right">
          <div className="admin-chip">
            <ShieldCheck size={14} color="var(--accent)" />
            <span>{admin ? "Authenticated" : "Checking…"}</span>
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <>
                <span className="spinner" />
                <span>Signing out…</span>
              </>
            ) : (
              <>
                <LogOut size={15} strokeWidth={2.4} />
                <span>Logout</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ---------- Body ---------- */}
      <main className="admin-main">
        <div className="admin-hero">
          <h1 className="font-display admin-title">Welcome back</h1>
          <p className="admin-sub">
            Manage inventory, new arrivals, and spare parts from one place.
          </p>
        </div>

        {/* Primary action */}
        <div className="primary-action">
          <div>
            <h2 className="font-display primary-title">Add something new</h2>
            <p className="primary-sub">
              Upload a vehicle with interior / engine sub-images, or list a
              spare part.
            </p>
          </div>
          <button
            className="primary-btn"
            onClick={() => navigate("/admin/upload")}
          >
            <Upload size={16} strokeWidth={2.4} />
            <span>Upload Listing</span>
          </button>
        </div>

        {/* Admin cards */}
        <div className="admin-cards">
          <AdminCard
            icon={<Layers size={18} color="var(--accent)" />}
            title="Manage Listings"
            body="Edit or delete any car or spare part already uploaded."
            onClick={() => navigate("/admin/manage")}
          />
          <AdminCard
            icon={<LayoutGrid size={18} color="var(--accent)" />}
            title="Inventory"
            body="Add, edit, or remove vehicles from the main gallery."
            onClick={() => navigate("/admin/upload")}
          />
          <AdminCard
            icon={<Package size={18} color="var(--accent)" />}
            title="New Arrivals"
            body="Publish freshly landed vehicles with full descriptions."
            onClick={() => navigate("/admin/upload")}
          />
          <AdminCard
            icon={<Wrench size={18} color="var(--accent)" />}
            title="Spare Parts"
            body="Update stock for filters, brakes, electricals and more."
            onClick={() => navigate("/admin/upload")}
          />
        </div>
      </main>
    </div>
  );
};

function AdminCard({ icon, title, body, onClick }) {
  return (
    <button
      type="button"
      className="admin-card"
      onClick={onClick}
      aria-label={title}
    >
      <div className="admin-card-icon">{icon}</div>
      <h3 className="font-display admin-card-title">{title}</h3>
      <p className="admin-card-body">{body}</p>
      <span className="admin-card-cta">
        Open <ArrowUpRight size={14} />
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Scoped styles matching homepage + login tokens                     */
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

      .font-display { font-family: 'Space Grotesk', sans-serif; }
      .font-mono { font-family: 'IBM Plex Mono', monospace; }

      .admin-root {
        min-height: 100vh;
        background: var(--bg);
        color: var(--text);
        font-family: 'Inter', sans-serif;
        display: flex;
        flex-direction: column;
      }

      /* ---------- Topbar ---------- */
      .admin-topbar {
        position: sticky;
        top: 0;
        z-index: 40;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 14px 28px;
        background: rgba(0,0,0,0.85);
        backdrop-filter: blur(14px);
        border-bottom: 1px solid var(--line);
      }
      .topbar-left { display: flex; align-items: center; gap: 14px; }
      .topbar-logo {
        width: 36px; height: 36px;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 4px 14px rgba(0,102,204,0.3);
      }
      .topbar-logo img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .topbar-brand {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 17px;
        font-weight: 700;
        letter-spacing: -0.02em;
      }
      .topbar-brand .accent { color: var(--accent); }
      .admin-badge {
        margin-left: 8px;
        font-family: 'IBM Plex Mono', monospace;
        font-size: 10px;
        letter-spacing: 0.12em;
        padding: 3px 8px;
        border-radius: 999px;
        background: rgba(0,102,204,0.16);
        color: var(--accent);
        border: 1px solid rgba(0,102,204,0.32);
      }
      .topbar-right { display: flex; align-items: center; gap: 12px; }
      .admin-chip {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 7px 12px;
        border-radius: 999px;
        border: 1px solid var(--line);
        background: var(--surface);
        color: var(--muted);
        font-size: 12px;
      }

      /* ---------- Logout ---------- */
      .logout-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 9px 18px;
        border-radius: 999px;
        border: 1px solid rgba(239,68,68,0.35);
        background: rgba(239,68,68,0.06);
        color: #fca5a5;
        font-size: 13px;
        font-weight: 600;
        font-family: 'Inter', sans-serif;
        cursor: pointer;
        transition: background .25s ease, border-color .25s ease, color .25s ease, transform .25s ease;
      }
      .logout-btn:hover:not(:disabled) {
        background: rgba(239,68,68,0.14);
        border-color: #ef4444;
        color: #ffffff;
        transform: translateY(-1px);
      }
      .logout-btn:disabled { opacity: .7; cursor: not-allowed; }

      .spinner {
        display: inline-block;
        width: 14px; height: 14px;
        border: 2px solid rgba(255,255,255,0.3);
        border-top-color: #ffffff;
        border-radius: 50%;
        animation: spin .8s linear infinite;
      }
      @keyframes spin { to { transform: rotate(360deg); } }

      /* ---------- Body ---------- */
      .admin-main {
        flex: 1;
        padding: 48px 28px 64px;
        max-width: 1120px;
        width: 100%;
        margin: 0 auto;
      }

      .admin-hero { margin-bottom: 32px; }
      .admin-title {
        font-size: clamp(1.8rem, 3.5vw, 2.4rem);
        font-weight: 700;
        letter-spacing: -0.02em;
      }
      .admin-sub { color: var(--muted); font-size: 14.5px; margin-top: 8px; }

      /* ---------- Primary action banner ---------- */
      .primary-action {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        padding: 22px 24px;
        margin-bottom: 28px;
        border-radius: 18px;
        background:
          radial-gradient(120% 80% at 0% 0%, rgba(0,102,204,0.22), transparent 60%),
          var(--surface);
        border: 1px solid rgba(0,102,204,0.28);
      }
      .primary-title {
        font-size: 20px;
        font-weight: 700;
        letter-spacing: -0.01em;
      }
      .primary-sub {
        font-size: 13.5px;
        color: var(--muted);
        margin-top: 4px;
        max-width: 460px;
      }
      .primary-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 22px;
        border-radius: 999px;
        background: var(--accent);
        color: #ffffff;
        font-weight: 600;
        font-size: 14px;
        border: none;
        cursor: pointer;
        box-shadow: 0 10px 30px rgba(0,102,204,0.35);
        transition: background .25s ease, transform .25s ease, box-shadow .25s ease;
        white-space: nowrap;
      }
      .primary-btn:hover {
        background: #0080ff;
        transform: translateY(-2px);
        box-shadow: 0 16px 40px rgba(0,102,204,0.45);
      }

      /* ---------- Cards ---------- */
      .admin-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 18px;
      }
      .admin-card {
        display: flex;
        flex-direction: column;
        text-align: left;
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 18px;
        padding: 24px;
        cursor: pointer;
        color: inherit;
        font-family: inherit;
        transition: border-color .3s ease, transform .3s ease, box-shadow .3s ease;
      }
      .admin-card:hover {
        border-color: var(--accent);
        transform: translateY(-3px);
        box-shadow: 0 24px 50px rgba(0,0,0,0.5);
      }
      .admin-card-icon {
        width: 38px; height: 38px;
        border-radius: 10px;
        background: rgba(0,102,204,0.14);
        display: flex; align-items: center; justify-content: center;
        margin-bottom: 14px;
      }
      .admin-card-title { font-size: 16.5px; font-weight: 600; }
      .admin-card-body {
        color: var(--muted);
        font-size: 13.5px;
        margin-top: 6px;
        line-height: 1.55;
        flex: 1;
      }
      .admin-card-cta {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-top: 16px;
        color: var(--accent);
        font-size: 13px;
        font-weight: 600;
        transition: gap .25s ease;
      }
      .admin-card:hover .admin-card-cta { gap: 10px; }

      /* ---------- Responsive ---------- */
      @media (max-width: 720px) {
        .admin-topbar { padding: 12px 16px; }
        .topbar-brand { font-size: 15px; }
        .admin-chip { display: none; }
        .logout-btn span:not(.spinner) { display: none; }
        .logout-btn { padding: 9px 12px; }
        .admin-main { padding: 32px 16px 48px; }
        .primary-action { flex-direction: column; align-items: stretch; text-align: center; }
        .primary-btn { justify-content: center; }
      }

      @media (prefers-reduced-motion: reduce) {
        .admin-card, .logout-btn, .spinner, .primary-btn { animation: none !important; transition: none !important; }
      }
    `}</style>
  );
}

export default AdminDashboard;

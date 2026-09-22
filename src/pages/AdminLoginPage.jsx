import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, ArrowRight, ShieldCheck, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { adminService } from "../service/admin.service.js";
import images from "../assets/image.js";

const AdminLoginPage = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("adminToken")) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminService.login(password);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-root">
      <Style />

      <Link to="/" className="back-link">
        <ArrowLeft size={15} />
        <span>Back to site</span>
      </Link>

      <div className="login-shell">
        {/* Brand panel */}
        <aside className="brand-panel">
          <div className="brand-logo">
            <img src={images.Logo2} alt="Lord Group Autos" />
          </div>
          <h1 className="font-display brand-title">
            Lord Group<span style={{ color: "var(--accent)" }}> AUTOS</span>
          </h1>
          <p className="brand-sub">Admin Control Center</p>

          <div className="brand-point">
            <ShieldCheck size={16} color="var(--accent)" />
            <span>Secure, JWT-protected access</span>
          </div>

          <p className="brand-note">
            Authorized personnel only. All access attempts are logged.
          </p>
        </aside>

        {/* Form panel */}
        <section className="form-panel">
          <span className="eyebrow">Restricted area</span>
          <h2 className="font-display heading">Admin Access</h2>
          <p className="sub">
            Enter the access password to manage inventory, arrivals, and spare parts.
          </p>

          <form onSubmit={handleSubmit} className="form">
            <label className="label" htmlFor="password">Access Password</label>
            <div className={`input-wrap ${error ? "input-error" : ""}`}>
              <Lock size={15} className="input-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                autoFocus
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <button type="submit" className="submit" disabled={loading || !password}>
              {loading ? (
                <>
                  <span className="spinner" />
                  <span>Verifying…</span>
                </>
              ) : (
                <>
                  <span>Unlock Dashboard</span>
                  <ArrowRight size={16} strokeWidth={2.4} />
                </>
              )}
            </button>

            {error && (
              <div className="error" role="alert">
                <span className="dot" />
                <span>{error}</span>
              </div>
            )}
          </form>

          <p className="footnote">
            Trouble signing in? Contact{" "}
            <span style={{ color: "var(--accent)" }}>lordgroup.limited@gmail.com</span>
          </p>
        </section>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- */
/*  Styles                                                          */
/* ---------------------------------------------------------------- */

function Style() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

      :root {
        --bg: #0a0a0a;
        --surface: #1a1a1a;
        --line: #333;
        --line-strong: #444;
        --text: #fff;
        --muted: #999;
        --accent: #0066cc;
      }

      .font-display { font-family: 'Space Grotesk', sans-serif; }

      .admin-login-root {
        position: relative;
        min-height: 100vh;
        background:
          radial-gradient(50% 40% at 50% 0%, rgba(0,102,204,0.20), transparent 65%),
          var(--bg);
        color: var(--text);
        font-family: 'Inter', sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
      }

      /* Grid overlay */
      .admin-login-root::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
        background-size: 44px 44px;
        -webkit-mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
        mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
        pointer-events: none;
      }

      /* Back link */
      .back-link {
        position: absolute;
        top: 24px;
        left: 24px;
        z-index: 5;
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
        transition: color .25s ease, border-color .25s ease, transform .25s ease;
      }
      .back-link:hover {
        color: var(--text);
        border-color: var(--accent);
        transform: translateX(-2px);
      }

      /* Shell */
      .login-shell {
        position: relative;
        z-index: 2;
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 100%;
        max-width: 920px;
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 24px;
        overflow: hidden;
        box-shadow: 0 40px 100px rgba(0,0,0,0.6);
        animation: loginIn .55s cubic-bezier(.22,.61,.36,1);
      }
      @keyframes loginIn {
        from { opacity: 0; transform: translateY(18px) scale(.98); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }

      /* Brand panel */
      .brand-panel {
        padding: 44px 36px;
        background:
          radial-gradient(120% 80% at 0% 0%, rgba(0,102,204,0.22), transparent 60%),
          linear-gradient(160deg, #101010 0%, #0a0a0a 100%);
        border-right: 1px solid var(--line);
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 16px;
      }
      .brand-logo {
        width: 56px; height: 56px;
        border-radius: 14px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 8px 24px rgba(0,102,204,0.35);
      }
      .brand-logo img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .brand-title {
        font-size: 26px;
        font-weight: 700;
        letter-spacing: -0.02em;
        line-height: 1.15;
      }
      .brand-sub {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 12px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--accent);
      }
      .brand-point {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 6px;
        padding: 10px 14px;
        border-radius: 10px;
        background: rgba(255,255,255,0.02);
        border: 1px solid var(--line);
        font-size: 13.5px;
        color: var(--muted);
      }
      .brand-note {
        margin-top: 8px;
        font-size: 12px;
        color: #666;
        line-height: 1.6;
      }

      /* Form panel */
      .form-panel {
        padding: 48px 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10px;
      }
      .eyebrow {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 11px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--accent);
      }
      .heading {
        font-size: 30px;
        font-weight: 700;
        letter-spacing: -0.02em;
        line-height: 1.1;
      }
      .sub {
        font-size: 14px;
        color: var(--muted);
        line-height: 1.6;
        margin-bottom: 6px;
      }

      .form { display: flex; flex-direction: column; gap: 14px; }
      .label {
        font-size: 12.5px;
        font-weight: 500;
        color: var(--text);
        margin-bottom: -6px;
      }

      .input-wrap {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 14px;
        background: var(--bg);
        border: 1px solid var(--line);
        border-radius: 12px;
        transition: border-color .25s ease, box-shadow .25s ease;
      }
      .input-wrap:focus-within {
        border-color: var(--accent);
        box-shadow: 0 0 0 4px rgba(0,102,204,0.15);
      }
      .input-wrap.input-error {
        border-color: #ef4444;
        box-shadow: 0 0 0 4px rgba(239,68,68,0.12);
      }
      .input-icon { color: var(--muted); flex-shrink: 0; }

      .input-wrap input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: var(--text);
        font-size: 15px;
        letter-spacing: 0.06em;
        padding: 14px 0;
        font-family: 'Inter', sans-serif;
      }
      .input-wrap input::placeholder { color: #555; letter-spacing: 0.14em; }
      .input-wrap input:disabled { opacity: .6; }

      .toggle {
        background: transparent;
        border: none;
        padding: 6px;
        color: var(--muted);
        cursor: pointer;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color .2s ease, background .2s ease;
      }
      .toggle:hover { color: var(--text); background: rgba(255,255,255,0.05); }

      .submit {
        margin-top: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 15px 26px;
        border-radius: 999px;
        border: none;
        cursor: pointer;
        background: var(--accent);
        color: #fff;
        font-weight: 600;
        font-size: 14.5px;
        font-family: 'Inter', sans-serif;
        box-shadow: 0 12px 32px rgba(0,102,204,0.28);
        transition: transform .25s ease, box-shadow .25s ease, background .25s ease, opacity .25s ease;
      }
      .submit:hover:not(:disabled) {
        background: #0080ff;
        transform: translateY(-2px);
        box-shadow: 0 16px 40px rgba(0,102,204,0.42);
      }
      .submit:disabled { opacity: .55; cursor: not-allowed; }

      .spinner {
        display: inline-block;
        width: 16px; height: 16px;
        border: 2px solid rgba(255,255,255,0.35);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin .8s linear infinite;
      }
      @keyframes spin { to { transform: rotate(360deg); } }

      .error {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
        border-radius: 10px;
        background: rgba(239,68,68,0.08);
        border: 1px solid rgba(239,68,68,0.35);
        color: #fca5a5;
        font-size: 13px;
        animation: shake .35s ease;
      }
      .error .dot {
        width: 7px; height: 7px;
        border-radius: 999px;
        background: #ef4444;
        box-shadow: 0 0 0 4px rgba(239,68,68,0.18);
        flex-shrink: 0;
      }
      @keyframes shake {
        0%,100% { transform: translateX(0); }
        25%     { transform: translateX(-4px); }
        75%     { transform: translateX(4px); }
      }

      .footnote {
        margin-top: 10px;
        font-size: 12px;
        color: #666;
        text-align: center;
        line-height: 1.6;
      }

      /* Responsive */
      @media (max-width: 820px) {
        .login-shell { grid-template-columns: 1fr; max-width: 460px; }
        .brand-panel {
          border-right: none;
          border-bottom: 1px solid var(--line);
          padding: 28px 24px;
          gap: 12px;
        }
        .brand-point, .brand-note { display: none; }
        .form-panel { padding: 32px 24px; }
        .heading { font-size: 24px; }
      }
      @media (max-width: 480px) {
        .admin-login-root { padding: 12px; }
        .back-link { top: 14px; left: 14px; font-size: 12px; }
        .form-panel { padding: 24px 18px; }
      }

      @media (prefers-reduced-motion: reduce) {
        .login-shell, .error, .spinner { animation: none !important; }
      }
    `}</style>
  );
}

export default AdminLoginPage;
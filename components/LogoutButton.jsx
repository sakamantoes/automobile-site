import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { adminService } from "../services/admin.service.js";

const LogoutButton = ({ className = "logout-btn", label = "Logout" }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      adminService.logout();
      navigate("/admin/login", { replace: true });
    }, 200);
  };

  return (
    <button className={className} onClick={handleLogout} disabled={loading}>
      {loading ? <span className="spinner" /> : <LogOut size={15} strokeWidth={2.4} />}
      <span>{loading ? "Signing out…" : label}</span>
    </button>
  );
};

export default LogoutButton;
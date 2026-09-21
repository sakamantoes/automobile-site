import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenStore } from '../services/api';

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => {
      if (!tokenStore.get()) navigate('/admin/login', { replace: true });
    };
    window.addEventListener('storage', handler);      // cross-tab logout
    window.addEventListener('admin:logout', handler); // same-tab
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('admin:logout', handler);
    };
  }, [navigate]);
};
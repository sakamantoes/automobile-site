import { useEffect, useState } from 'react';
import { createListing, deleteListing, getListings, imageUrl, loginAdmin, uploadImageToCloudinary } from '../utils/api';

const emptyForm = {
  type: 'gallery', name: '', make: '', model: '', year: '', trim: '', category: '',
  subcategory: '', brand: '', description: '', fullDescription: '', price: '',
  location: '', status: '', grade: '', color: '', transmission: 'Automatic',
  fuel: 'Petrol', mileage: '', compatibility: '', rating: '4.8', inStock: 'true',
};

function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadListings = async () => {
    const data = await getListings();
    setListings(data);
  };

  useEffect(() => {
    if (token) loadListings().catch(() => setError('Could not load listings'));
  }, [token]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const result = await loginAdmin(credentials);
      localStorage.setItem('adminToken', result.token);
      setToken(result.token);
    } catch (loginError) {
      setError(loginError.message);
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!image) return setError('Choose an image before uploading');
    setError('');
    setMessage('');
    try {
      setMessage('Uploading image...');
      const uploadedImageUrl = await uploadImageToCloudinary(image);
      await createListing(token, { ...form, imageUrl: uploadedImageUrl });
      setForm(emptyForm);
      setImage(null);
      event.target.reset();
      setMessage('Listing uploaded successfully');
      await loadListings();
    } catch (uploadError) {
      setError(uploadError.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteListing(token, id);
      await loadListings();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  if (!token) {
    return (
      <main className="admin-shell">
        <form className="admin-panel admin-login" onSubmit={handleLogin}>
          <p className="admin-kicker">LORD GROUP AUTOS</p>
          <h1>Admin sign in</h1>
          <p className="admin-muted">Manage public vehicle and parts listings.</p>
          <input placeholder="Username" value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} required />
          <input type="password" placeholder="Password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} required />
          {error && <p className="admin-error">{error}</p>}
          <button type="submit">Sign in</button>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <div className="admin-layout">
        <section className="admin-panel">
          <div className="admin-header">
            <div><p className="admin-kicker">CONTENT CONTROL</p><h1>Upload listing</h1></div>
            <button className="admin-quiet" onClick={() => { localStorage.removeItem('adminToken'); setToken(null); }}>Sign out</button>
          </div>
          <form className="admin-form" onSubmit={handleUpload}>
            <label>Collection<select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}><option value="gallery">Car gallery</option><option value="new-arrivals">New arrivals</option><option value="spare-parts">Spare parts</option></select></label>
            <label>Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
            <div className="admin-grid"><label>Make<input value={form.make} onChange={(event) => setForm({ ...form, make: event.target.value })} /></label><label>Model<input value={form.model} onChange={(event) => setForm({ ...form, model: event.target.value })} /></label><label>Year<input value={form.year} onChange={(event) => setForm({ ...form, year: event.target.value })} /></label><label>Trim<input value={form.trim} onChange={(event) => setForm({ ...form, trim: event.target.value })} /></label></div>
            <div className="admin-grid"><label>Category<input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} /></label><label>Brand<input value={form.brand} onChange={(event) => setForm({ ...form, brand: event.target.value })} /></label><label>Fuel<input value={form.fuel} onChange={(event) => setForm({ ...form, fuel: event.target.value })} /></label><label>Transmission<input value={form.transmission} onChange={(event) => setForm({ ...form, transmission: event.target.value })} /></label></div>
            <div className="admin-grid"><label>Price<input value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></label><label>Mileage<input value={form.mileage} onChange={(event) => setForm({ ...form, mileage: event.target.value })} /></label><label>Status<input value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} /></label><label>Rating<input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(event) => setForm({ ...form, rating: event.target.value })} /></label></div>
            <label>Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
            <label>Image<input type="file" accept="image/*" onChange={(event) => setImage(event.target.files[0])} required /></label>
            {error && <p className="admin-error">{error}</p>}{message && <p className="admin-success">{message}</p>}
            <button type="submit">Upload to site</button>
          </form>
        </section>
        <section className="admin-panel"><div className="admin-header"><div><p className="admin-kicker">LIVE INVENTORY</p><h2>Published listings</h2></div><span className="admin-count">{listings.length}</span></div><div className="admin-list">{listings.map((listing) => <article className="admin-item" key={listing._id}><img src={imageUrl(listing.imageUrl)} alt="" /><div><strong>{listing.name}</strong><small>{listing.type}</small></div><button className="admin-delete" onClick={() => handleDelete(listing._id)} aria-label={`Delete ${listing.name}`}>Delete</button></article>)}</div></section>
      </div>
      <style>{`.admin-shell{min-height:100vh;background:#0b0d10;color:#f6f7f8;padding:48px 24px;font-family:Inter,sans-serif}.admin-layout{max-width:1180px;margin:auto;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:24px}.admin-panel{background:#15191f;border:1px solid #303640;border-radius:14px;padding:28px}.admin-login{max-width:420px;margin:12vh auto;display:flex;flex-direction:column;gap:16px}.admin-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:24px}.admin-kicker{font-size:11px;letter-spacing:.16em;color:#6ea8fe;margin:0 0 8px}.admin-panel h1,.admin-panel h2{margin:0;font-family:Georgia,serif}.admin-panel h1{font-size:32px}.admin-panel h2{font-size:24px}.admin-muted,.admin-panel small{color:#9199a5}.admin-form{display:flex;flex-direction:column;gap:14px}.admin-form label{font-size:12px;color:#b5bdc9;display:flex;flex-direction:column;gap:6px}.admin-form input,.admin-form select,.admin-form textarea,.admin-login input{background:#0d1014;border:1px solid #363d47;border-radius:7px;color:#fff;padding:11px 12px;font:inherit}.admin-form textarea{min-height:90px;resize:vertical}.admin-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.admin-form button,.admin-login button{background:#3e8cff;border:0;border-radius:7px;color:#fff;padding:12px 16px;font-weight:700;cursor:pointer}.admin-quiet,.admin-delete{background:transparent;border:1px solid #444d59;border-radius:6px;color:#d7dce3;padding:8px 10px;cursor:pointer}.admin-list{display:flex;flex-direction:column;gap:10px}.admin-item{display:flex;align-items:center;gap:12px;border-bottom:1px solid #2b313a;padding:10px 0}.admin-item img{width:58px;height:48px;object-fit:cover;border-radius:5px;background:#0d1014}.admin-item div{display:flex;flex-direction:column;gap:4px;flex:1}.admin-delete{font-size:11px}.admin-count{background:#253c62;color:#8ab9ff;padding:5px 9px;border-radius:999px}.admin-error{color:#ff8e8e;font-size:13px}.admin-success{color:#74e0a0;font-size:13px}@media(max-width:800px){.admin-layout{grid-template-columns:1fr}.admin-shell{padding:20px 12px}.admin-panel{padding:20px}}`}</style>
    </main>
  );
}

export default AdminPage;

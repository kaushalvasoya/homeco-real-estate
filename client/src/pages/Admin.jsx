// client/src/pages/Admin.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { api } from '../utils/api';

const API_BASE =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : '';

function api(path) {
  return `${API_BASE}/api${path.startsWith('/') ? path : '/' + path}`;
}

const CATEGORY_OPTIONS = ['Commercial', 'House', 'Apartment', 'Land'];

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    contactPhone: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    category: 'House',
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [myListings, setMyListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);

  const [editingId, setEditingId] = useState(null);

  function showMsg(type, text) {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 5000);
  }

  async function handleLogin(e) {
    e?.preventDefault();
    if (!email || !password) return showMsg('error', 'Enter email & password');
    try {
      setLoading(true);
      const res = await axios.post(api('/auth/login'), { email, password });
      const t = res.data?.token;
      if (!t) throw new Error('No token received');
      localStorage.setItem('token', t);
      setToken(t);
      showMsg('success', 'Logged in');
      setEmail('');
      setPassword('');
    } catch (err) {
      const text = err?.response?.data?.msg || err.message || 'Login failed';
      showMsg('error', text);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('token');
    setToken('');
    setEditingId(null);
    showMsg('info', 'Logged out');
  }

  async function fetchListings() {
    try {
      setLoadingListings(true);
      const res = await axios.get(api('/properties'));
      setMyListings(res.data || []);
    } catch {
      showMsg('error', 'Could not load listings');
    } finally {
      setLoadingListings(false);
    }
  }

  useEffect(() => {
    if (token) fetchListings();
    else setMyListings([]);
  }, [token]);

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function resetForm() {
    setForm({
      title: '',
      description: '',
      price: '',
      location: '',
      contactPhone: '',
      bedrooms: '',
      bathrooms: '',
      area: '',
      category: 'House',
    });
    setImages([]);
    setPreviews([]);
    setEditingId(null);
  }

  async function submitProperty(e) {
    e?.preventDefault();
    if (!form.title || !form.price) return showMsg('error', 'Title and price required');
    if (!token) return showMsg('error', 'You must be logged in');

    try {
      setLoading(true);

      if (editingId) {
        const payload = {
          ...form,
          price: Number(form.price) || 0,
          bedrooms: Number(form.bedrooms) || 0,
          bathrooms: Number(form.bathrooms) || 0,
          area: Number(form.area) || 0,
        };

        const res = await axios.put(api(`/properties/${editingId}`), payload, {
          headers: { 'x-auth-token': token },
        });

        showMsg('success', 'Property updated');
        setMyListings(list => list.map(p => (p._id === editingId ? res.data : p)));
        resetForm();
      } else {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (images.length) images.forEach(f => fd.append('images', f));

        const res = await axios.post(api('/properties'), fd, {
          headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' },
        });

        showMsg('success', 'Property uploaded');
        setMyListings(list => [res.data, ...list]);
        resetForm();
      }
    } catch (err) {
      const text = err?.response?.data?.msg || err.message || 'Save failed';
      showMsg('error', text);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(prop) {
    setEditingId(prop._id);
    setForm({
      title: prop.title || '',
      description: prop.description || '',
      price: prop.price != null ? String(prop.price) : '',
      location: prop.location || '',
      contactPhone: prop.contactPhone || '',
      bedrooms: prop.bedrooms != null ? String(prop.bedrooms) : '',
      bathrooms: prop.bathrooms != null ? String(prop.bathrooms) : '',
      area: prop.area != null ? String(prop.area) : '',
      category: prop.category || 'House',
    });
    setImages([]);
    setPreviews([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteListing(id) {
    if (!token) return showMsg('error', 'You must be logged in');
    if (!window.confirm('Delete this property?')) return;

    try {
      await axios.delete(api(`/properties/${id}`), {
        headers: { 'x-auth-token': token },
      });
      setMyListings(list => list.filter(p => p._id !== id));
      if (editingId === id) resetForm();
      showMsg('success', 'Deleted');
    } catch {
      showMsg('error', 'Delete failed');
    }
  }

  function fillDemo() {
    setEmail('admin@example.com');
    setPassword('Admin@123');
  }

  if (!token) {
    return (
      <>
        <Navbar />
        <main className="container-lg py-12">
          <div className="max-w-md mx-auto card bg-deep-800">
            <h2 className="text-xl font-semibold mb-4 text-white">Admin Login</h2>
            {msg && (
              <div
                className={`p-3 rounded mb-3 text-sm ${
                  msg.type === 'error'
                    ? 'bg-red-500/10 text-red-300'
                    : 'bg-emerald-500/10 text-emerald-300'
                }`}
              >
                {msg.text}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-3">
              <input className="input-dark" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
              <input className="input-dark" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary text-sm" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
                <button type="button" className="btn btn-ghost text-sm" onClick={fillDemo}>
                  Fill demo
                </button>
              </div>
            </form>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container-lg py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Admin dashboard</h2>
            <p className="text-sm text-gray-400">Upload new properties and manage your inventory.</p>
          </div>
          <button className="btn btn-ghost text-sm" onClick={logout}>Logout</button>
        </div>

        {msg && (
          <div
            className={`p-3 rounded mb-4 text-sm ${
              msg.type === 'error'
                ? 'bg-red-500/10 text-red-300'
                : 'bg-emerald-500/10 text-emerald-300'
            }`}
          >
            {msg.text}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <section className="card bg-deep-800">
            <h3 className="text-lg font-semibold mb-4 text-white">
              {editingId ? 'Edit property' : 'Upload property'}
            </h3>

            <form onSubmit={submitProperty} className="space-y-3 admin-form">
              <div className="grid gap-3">
                <input className="input-dark" placeholder="Title" value={form.title} onChange={e => handleChange('title', e.target.value)} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input className="input-dark" placeholder="Location" value={form.location} onChange={e => handleChange('location', e.target.value)} />
                  <select className="input-dark" value={form.category} onChange={e => handleChange('category', e.target.value)}>
                    {CATEGORY_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                </div>

                <input className="input-dark" placeholder="Price (number)" value={form.price} onChange={e => handleChange('price', e.target.value)} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input className="input-dark" placeholder="Bedrooms" value={form.bedrooms} onChange={e => handleChange('bedrooms', e.target.value)} />
                  <input className="input-dark" placeholder="Bathrooms" value={form.bathrooms} onChange={e => handleChange('bathrooms', e.target.value)} />
                  <input className="input-dark" placeholder="Area (sqft)" value={form.area} onChange={e => handleChange('area', e.target.value)} />
                </div>

                <input className="input-dark" placeholder="Contact phone" value={form.contactPhone} onChange={e => handleChange('contactPhone', e.target.value)} />

                <textarea className="input-dark min-h-[100px]" placeholder="Description" value={form.description} onChange={e => handleChange('description', e.target.value)} />

                {/* 🔥 Image Upload with Remove Preview */}
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Images (optional)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setImages(files);
                    setPreviews(files.map((file) => URL.createObjectURL(file)));
                  }}
                />
                {previews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                    {previews.map((src, index) => (
                      <div key={index} className="relative group">
                        <img src={src} className="w-full h-20 object-cover rounded-lg border border-deep-700" />
                        <button
                          type="button"
                          onClick={() => {
                            const newPrev = previews.filter((_, i) => i !== index);
                            const newFiles = Array.from(images).filter((_, i) => i !== index);
                            setPreviews(newPrev);
                            setImages(newFiles);
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded opacity-90 hover:opacity-100"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn btn-primary text-sm" disabled={loading}>
                  {loading ? (editingId ? 'Saving...' : 'Uploading...') : editingId ? 'Save changes' : 'Upload property'}
                </button>
                <button type="button" className="btn btn-ghost text-sm" onClick={resetForm}>Reset</button>
              </div>
            </form>
          </section>

          <section className="card bg-deep-800">
            <h3 className="text-lg font-semibold mb-4 text-white">Tips</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>Use high quality photos.</li>
              <li>Make sure category is correct.</li>
              <li>Keep titles short.</li>
              <li>Double check price & contact.</li>
            </ul>
          </section>
        </div>

        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white">Your listings</h3>
            <button onClick={fetchListings} className="text-xs text-gray-400 hover:text-gray-200">Refresh</button>
          </div>

          {loadingListings ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : myListings.length === 0 ? (
            <p className="text-sm text-gray-400">No properties yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-200">
                <thead className="bg-deep-800/80 text-xs uppercase text-gray-400">
                  <tr>
                    <th className="px-3 py-2 text-left">Title</th>
                    <th className="px-3 py-2 text-left">Category</th>
                    <th className="px-3 py-2 text-left hidden md:table-cell">Location</th>
                    <th className="px-3 py-2 text-left">Price</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-deep-700">
                  {myListings.map(p => (
                    <tr key={p._id} className="bg-deep-900/60">
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          {p.images?.[0]?.url && (
                            <img src={p.images[0].url} className="w-10 h-10 rounded-md object-cover hidden sm:block" />
                          )}
                          <span className="font-medium">{p.title}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">{p.category}</td>
                      <td className="px-3 py-2 hidden md:table-cell">{p.location}</td>
                      <td className="px-3 py-2">
                        ₹{p.price?.toLocaleString?.() ?? p.price}
                      </td>
                      <td className="px-3 py-2 text-right space-x-2">
                        <button onClick={() => startEdit(p)} className="text-xs text-indigo-300 hover:text-indigo-100">
                          Edit
                        </button>
                        <button onClick={() => deleteListing(p._id)} className="text-xs text-red-300 hover:text-red-100">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

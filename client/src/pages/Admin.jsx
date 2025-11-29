// client/src/pages/Admin.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API_BASE =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://homeco-real-estate.vercel.app/';

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

  // contacts state
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

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

  async function fetchContacts(filterUnread = showOnlyUnread) {
    try {
      setLoadingContacts(true);
      const res = await axios.get(api('/contact'), {
        params: filterUnread ? { onlyUnread: 'true' } : {},
      });
      setContacts(res.data?.items || []);
    } catch (err) {
      console.error(err);
      showMsg('error', 'Could not load contact messages');
    } finally {
      setLoadingContacts(false);
    }
  }

  useEffect(() => {
    if (token) {
      fetchListings();
      fetchContacts();
    } else {
      setMyListings([]);
      setContacts([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (!form.title || !form.price)
      return showMsg('error', 'Title and price required');
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
        setMyListings(list =>
          list.map(p => (p._id === editingId ? res.data : p))
        );
        resetForm();
      } else {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (images.length) images.forEach(f => fd.append('images', f));

        const res = await axios.post(api('/properties'), fd, {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'multipart/form-data',
          },
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

  async function toggleContactRead(contact, nextRead) {
    try {
      await axios.patch(api(`/contact/${contact.id}/read`), { read: nextRead });
      setContacts(list =>
        list.map(c => (c.id === contact.id ? { ...c, read: nextRead } : c))
      );
    } catch (err) {
      console.error(err);
      showMsg('error', 'Could not update message status');
    }
  }

  // NEW: delete contact
  async function deleteContact(contact) {
    if (!window.confirm('Delete this message?')) return;
    try {
      await axios.delete(api(`/contact/${contact.id}`));
      setContacts(list => list.filter(c => c.id !== contact.id));
      showMsg('success', 'Message deleted');
    } catch (err) {
      console.error(err);
      showMsg('error', 'Could not delete message');
    }
  }

  function fillDemo() {
    setEmail('admin@example.com');
    setPassword('Admin@123');
  }

  // analytics
  const totalProperties = myListings.length;

  const totalValue = myListings.reduce(
    (sum, p) => sum + (Number(p.price) || 0),
    0
  );

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last7DaysCount = myListings.filter(p => {
    if (!p.createdAt) return false;
    const created = new Date(p.createdAt);
    return created >= sevenDaysAgo;
  }).length;

  const categoryStats = CATEGORY_OPTIONS.map(name => ({
    name,
    count: myListings.filter(
      p => (p.category || '').toLowerCase() === name.toLowerCase()
    ).length,
  }));

  const maxCategoryCount = Math.max(1, ...categoryStats.map(c => c.count));

  const latestActivities = [...myListings]
    .filter(p => p.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  // LOGIN SCREEN
  if (!token) {
    return (
      <>
        <Navbar />

        <main className="min-h-[calc(100vh-72px)] bg-gradient-to-b from-deep-900 via-slate-950 to-deep-900 flex items-center">
          <div className="container-lg w-full px-4 py-12">
            <div className="grid gap-10 md:grid-cols-[1.2fr,1fr] items-center">
              {/* Left side copy */}
              <div className="space-y-4 text-slate-100">
                <p className="text-xs uppercase tracking-[0.25em] text-indigo-300">
                  HomeCo Admin
                </p>
                <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
                  Sign in to manage your{' '}
                  <span className="text-indigo-300">property listings</span>.
                </h1>
                <p className="text-sm text-slate-300 max-w-md">
                  Upload new homes, update prices and keep your inventory fresh
                  all from a focused dashboard built for speed.
                </p>

                <div className="grid gap-3 text-sm text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="mt-[2px] text-indigo-300">●</span>
                    <span>
                      Secure admin only access with email and password.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-[2px] text-indigo-300">●</span>
                    <span>Attach photos, set categories and contact details.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-[2px] text-indigo-300">●</span>
                    <span>Changes sync instantly to the public site.</span>
                  </div>
                </div>
              </div>

              {/* Right side: login card */}
              <div className="max-w-md w-full mx-auto">
                <div className="rounded-2xl bg-slate-900/80 border border-slate-700/60 shadow-2xl shadow-indigo-900/30 px-6 py-7 backdrop-blur">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        Admin Login
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Use your admin credentials to continue.
                      </p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <span className="text-xs text-indigo-300 font-semibold">
                        ADM
                      </span>
                    </div>
                  </div>

                  {msg && (
                    <div
                      className={`p-3 rounded-lg mb-4 text-xs ${
                        msg.type === 'error'
                          ? 'bg-red-500/10 text-red-300 border border-red-500/40'
                          : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-4">
                    {/* EMAIL */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">
                        Email
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded-lg border border-slate-700 bg-deep-900/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/70 transition"
                          placeholder="admin@example.com"
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* PASSWORD */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded-lg border border-slate-700 bg-deep-900/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/70 transition"
                          placeholder="••••••••"
                          type="password"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="submit"
                        className="btn btn-primary text-sm px-6"
                        disabled={loading}
                      >
                        {loading ? 'Logging in...' : 'Login'}
                      </button>

                      <button
                        type="button"
                        className="text-xs text-slate-300 hover:text-white underline underline-offset-4"
                        onClick={fillDemo}
                      >
                        Fill demo
                      </button>
                    </div>
                  </form>

                  <p className="mt-4 text-[11px] text-slate-500 leading-relaxed">
                    Tip: Use the{' '}
                    <span className="text-slate-300">Fill demo</span> button if
                    you just want to explore the dashboard with the preset admin
                    account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  // DASHBOARD
  return (
    <>
      <Navbar />
      <main className="container-lg py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Admin dashboard</h2>
            <p className="text-sm text-gray-400">
              Upload new properties and manage your inventory.
            </p>
          </div>
          <button className="btn btn-ghost text-sm" onClick={logout}>
            Logout
          </button>
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

        {/* analytics cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="card bg-deep-800/90 border border-deep-700">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
              Total listings
            </p>
            <p className="text-2xl font-semibold text-white">
              {totalProperties}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              All active properties in your inventory.
            </p>
          </div>

          <div className="card bg-deep-800/90 border border-deep-700">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
              Total value
            </p>
            <p className="text-2xl font-semibold text-indigo-300">
              ₹{totalValue.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Sum of listing prices.
            </p>
          </div>

          <div className="card bg-deep-800/90 border border-deep-700">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
              New this week
            </p>
            <p className="text-2xl font-semibold text-white">
              {last7DaysCount}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Added in the last 7 days.
            </p>
          </div>

          <div className="card bg-deep-800/90 border border-deep-700">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
              By category
            </p>
            <div className="space-y-1.5 text-xs text-gray-300">
              {categoryStats.map(cat => (
                <div
                  key={cat.name}
                  className="flex items-center justify-between"
                >
                  <span>{cat.name}</span>
                  <span className="text-gray-100 font-medium">
                    {cat.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* chart + latest activity */}
        <section className="grid gap-4 lg:grid-cols-[2fr,1.4fr] mb-8">
          <div className="card bg-deep-800/90 border border-deep-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">
                Category distribution
              </h3>
              <span className="text-[11px] text-gray-500">
                Simple bar chart
              </span>
            </div>

            {totalProperties === 0 ? (
              <p className="text-xs text-gray-500">
                No data yet. Add a property to see chart.
              </p>
            ) : (
              <div className="space-y-3 mt-2">
                {categoryStats.map(cat => (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
                      <span>{cat.name}</span>
                      <span>{cat.count}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-deep-900 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{
                          width: `${(cat.count / maxCategoryCount) * 100}%`,
                          transition: 'width 300ms ease',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card bg-deep-800/90 border border-deep-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">
                Latest activity
              </h3>
              <span className="text-[11px] text-gray-500">
                Recent listing updates
              </span>
            </div>

            {latestActivities.length === 0 ? (
              <p className="text-xs text-gray-500">
                No activity yet. Upload your first property.
              </p>
            ) : (
              <ul className="space-y-2 text-xs">
                {latestActivities.map(item => {
                  const created = item.createdAt
                    ? new Date(item.createdAt)
                    : null;
                  const dateLabel = created
                    ? created.toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Unknown date';

                  return (
                    <li
                      key={item._id}
                      className="flex items-start justify-between gap-3 rounded-lg bg-deep-900/80 border border-deep-700 px-3 py-2"
                    >
                      <div className="flex-1">
                        <p className="text-gray-100 font-medium truncate">
                          {item.title || 'Untitled property'}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {item.category || 'Uncategorized'}
                          {item.location ? ` • ${item.location}` : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-gray-400">
                          {dateLabel}
                        </p>
                        {item.price != null && (
                          <p className="text-[11px] text-indigo-300 mt-0.5">
                            ₹{Number(item.price).toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        {/* property form + tips */}
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <section className="card bg-deep-800">
            <h3 className="text-lg font-semibold mb-4 text-white">
              {editingId ? 'Edit property' : 'Upload property'}
            </h3>

            <form onSubmit={submitProperty} className="space-y-3 admin-form">
              <div className="grid gap-3">
                <input
                  className="input-dark"
                  placeholder="Title"
                  value={form.title}
                  onChange={e => handleChange('title', e.target.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    className="input-dark"
                    placeholder="Location"
                    value={form.location}
                    onChange={e => handleChange('location', e.target.value)}
                  />
                  <select
                    className="input-dark"
                    value={form.category}
                    onChange={e => handleChange('category', e.target.value)}
                  >
                    {CATEGORY_OPTIONS.map(opt => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <input
                  className="input-dark"
                  placeholder="Price (number)"
                  value={form.price}
                  onChange={e => handleChange('price', e.target.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    className="input-dark"
                    placeholder="Bedrooms"
                    value={form.bedrooms}
                    onChange={e => handleChange('bedrooms', e.target.value)}
                  />
                  <input
                    className="input-dark"
                    placeholder="Bathrooms"
                    value={form.bathrooms}
                    onChange={e => handleChange('bathrooms', e.target.value)}
                  />
                  <input
                    className="input-dark"
                    placeholder="Area (sqft)"
                    value={form.area}
                    onChange={e => handleChange('area', e.target.value)}
                  />
                </div>

                <input
                  className="input-dark"
                  placeholder="Contact phone"
                  value={form.contactPhone}
                  onChange={e => handleChange('contactPhone', e.target.value)}
                />

                <textarea
                  className="input-dark min-h-[100px]"
                  placeholder="Description"
                  value={form.description}
                  onChange={e => handleChange('description', e.target.value)}
                />

                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Images (optional)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={e => {
                    const files = Array.from(e.target.files);
                    setImages(files);
                    setPreviews(files.map(file => URL.createObjectURL(file)));
                  }}
                />
                {previews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                    {previews.map((src, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={src}
                          className="w-full h-20 object-cover rounded-lg border border-deep-700"
                          alt=""
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newPrev = previews.filter((_, i) => i !== index);
                            const newFiles = Array.from(images).filter(
                              (_, i) => i !== index
                            );
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
                <button
                  type="submit"
                  className="btn btn-primary text-sm"
                  disabled={loading}
                >
                  {loading
                    ? editingId
                      ? 'Saving...'
                      : 'Uploading...'
                    : editingId
                    ? 'Save changes'
                    : 'Upload property'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost text-sm"
                  onClick={resetForm}
                >
                  Reset
                </button>
              </div>
            </form>
          </section>

          <section className="card bg-deep-800">
            <h3 className="text-lg font-semibold mb-4 text-white">Tips</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>Use high quality photos.</li>
              <li>Make sure category is correct.</li>
              <li>Keep titles short.</li>
              <li>Double check price and contact.</li>
            </ul>
          </section>
        </div>

        {/* listings table */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white">Your listings</h3>
            <button
              onClick={fetchListings}
              className="text-xs text-gray-400 hover:text-gray-200"
            >
              Refresh
            </button>
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
                    <th className="px-3 py-2 text-left hidden md:table-cell">
                      Location
                    </th>
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
                            <img
                              src={p.images[0].url}
                              className="w-10 h-10 rounded-md object-cover hidden sm:block"
                              alt=""
                            />
                          )}
                          <span className="font-medium">{p.title}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">{p.category}</td>
                      <td className="px-3 py-2 hidden md:table-cell">
                        {p.location}
                      </td>
                      <td className="px-3 py-2">
                        ₹{p.price?.toLocaleString?.() ?? p.price}
                      </td>
                      <td className="px-3 py-2 text-right space-x-2">
                        <button
                          onClick={() => startEdit(p)}
                          className="text-xs text-indigo-300 hover:text-indigo-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteListing(p._id)}
                          className="text-xs text-red-300 hover:text-red-100"
                        >
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

        {/* contact submissions */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Contact submissions
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Messages sent from the website contact form.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs text-gray-300">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-deep-700 bg-deep-900"
                  checked={showOnlyUnread}
                  onChange={async e => {
                    const next = e.target.checked;
                    setShowOnlyUnread(next);
                    await fetchContacts(next);
                  }}
                />
                <span>Show only unread</span>
              </label>
              <button
                onClick={() => fetchContacts()}
                className="text-xs text-gray-400 hover:text-gray-200"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="card bg-deep-800 border border-deep-700">
            {loadingContacts ? (
              <p className="text-sm text-gray-400">Loading messages...</p>
            ) : contacts.length === 0 ? (
              <p className="text-sm text-gray-400">
                No contact messages yet.
              </p>
            ) : (
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <table className="min-w-full text-xs sm:text-sm text-gray-200">
                  <thead className="bg-deep-900/80 text-[11px] uppercase text-gray-400">
                    <tr>
                      <th className="px-2 sm:px-3 py-2 text-left">Name</th>
                      <th className="px-2 sm:px-3 py-2 text-left hidden md:table-cell">
                        Email
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-left">
                        Message
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-left hidden sm:table-cell">
                        Date
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-deep-700">
                    {contacts.map(c => {
                      const created = c.createdAt
                        ? new Date(c.createdAt)
                        : null;
                      const dateLabel = created
                        ? created.toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Unknown';

                      const snippet =
                        c.message && c.message.length > 80
                          ? c.message.slice(0, 80) + '...'
                          : c.message;

                      return (
                        <tr
                          key={c.id}
                          className={
                            c.read ? 'bg-deep-900/40' : 'bg-deep-900/80'
                          }
                        >
                          <td className="px-2 sm:px-3 py-2 align-top">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {c.name}
                              </span>
                              <span className="md:hidden text-[11px] text-indigo-300">
                                {c.email}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 sm:px-3 py-2 align-top hidden md:table-cell">
                            <span className="text-indigo-300">
                              {c.email}
                            </span>
                          </td>
                          <td className="px-2 sm:px-3 py-2 align-top">
                            <span className="text-gray-200">
                              {snippet}
                            </span>
                          </td>
                          <td className="px-2 sm:px-3 py-2 align-top hidden sm:table-cell">
                            <span className="text-[11px] text-gray-400">
                              {dateLabel}
                            </span>
                          </td>
                          <td className="px-2 sm:px-3 py-2 align-top text-right">
                            <div className="flex flex-col items-end gap-1">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] ${
                                  c.read
                                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40'
                                    : 'bg-amber-500/10 text-amber-300 border border-amber-500/40'
                                }`}
                              >
                                {c.read ? 'Read' : 'Unread'}
                              </span>

                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleContactRead(c, !c.read)
                                  }
                                  className="px-2 py-0.5 rounded-full border border-slate-600 bg-deep-900/80 text-[11px] text-slate-100 hover:bg-slate-800"
                                >
                                  Mark as {c.read ? 'unread' : 'read'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteContact(c)}
                                  className="px-2 py-0.5 rounded-full border border-red-500/70 bg-red-500/10 text-[11px] text-red-200 hover:bg-red-500/20"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

// client/src/pages/ListingsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Listings from '../components/Listings';
import Footer from '../components/Footer';

const API_BASE =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : '';

function api(path) {
  return `${API_BASE}/api${path.startsWith('/') ? path : '/' + path}`;
}

export default function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const res = await axios.get(api('/properties'));
        if (!cancelled) {
          setProperties(res.data || []);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError('Could not load listings.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Navbar />

      <main className="page-spacing">
        <section className="container-lg py-10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-white">
                All Listings
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                Browse every property currently available on HomeCo.
              </p>
            </div>
          </div>

          {error && !loading && (
            <div className="rounded-xl bg-red-500/10 border border-red-600/40 text-red-100 px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          <Listings properties={properties} loading={loading} />
        </section>
      </main>

      <Footer />
    </>
  );
}

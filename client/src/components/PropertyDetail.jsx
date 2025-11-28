// client/src/pages/PropertyDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : '';

function api(path) {
  return `${API_BASE}/api${path.startsWith('/') ? path : '/' + path}`;
}

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProperty() {
      try {
        setLoading(true);
        const res = await axios.get(api(`/properties/${id}`));
        if (!cancelled) {
          setProperty(res.data);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError('Could not load property');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (id) loadProperty();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <>
      <Navbar />

      <main className="page-spacing">
        <section className="container-lg py-10">
          {loading && (
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-10 animate-pulse">
              <div className="h-8 w-1/3 bg-slate-700 rounded mb-6" />
              <div className="h-72 bg-slate-800 rounded-xl mb-6" />
              <div className="h-4 w-2/3 bg-slate-700 rounded mb-2" />
              <div className="h-4 w-1/2 bg-slate-700 rounded mb-2" />
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 text-slate-100">
              <div className="font-semibold mb-2">{error}</div>
              <Link
                to="/"
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                ← Back to home
              </Link>
            </div>
          )}

          {!loading && !error && property && (
            <div className="grid lg:grid-cols-12 gap-10">
              {/* main media */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/70">
                  <img
                    src={
                      property.images?.[0]?.url ||
                      '/sample/prop-1.jpg'
                    }
                    alt={property.title}
                    className="w-full h-80 object-cover"
                  />
                </div>

                {property.images && property.images.length > 1 && (
                  <div className="mt-4 grid grid-cols-4 gap-3">
                    {property.images.slice(1, 5).map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url}
                        alt={`${property.title} ${idx + 2}`}
                        className="h-20 w-full object-cover rounded-lg border border-slate-800"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* info column */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-indigo-300 mb-2">
                    For sale
                  </div>
                  <h1 className="text-3xl font-semibold text-white">
                    {property.title}
                  </h1>
                  <p className="mt-2 text-sm text-slate-300">
                    {property.location}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase text-slate-400">
                      Price
                    </div>
                    <div className="text-2xl font-semibold text-indigo-300 mt-1">
                      ₹{property.price ? Number(property.price).toLocaleString() : '—'}
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/${(property.contactPhone || '919876543210').replace(
                      /\D/g,
                      ''
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary text-sm px-5"
                  >
                    Contact on WhatsApp
                  </a>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 text-sm text-slate-200">
                    <div className="text-xs uppercase text-slate-400">
                      Bedrooms
                    </div>
                    <div className="mt-1 text-lg font-semibold">
                      {property.bedrooms || '—'}
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 text-sm text-slate-200">
                    <div className="text-xs uppercase text-slate-400">
                      Bathrooms
                    </div>
                    <div className="mt-1 text-lg font-semibold">
                      {property.bathrooms || '—'}
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 text-sm text-slate-200">
                    <div className="text-xs uppercase text-slate-400">
                      Area
                    </div>
                    <div className="mt-1 text-lg font-semibold">
                      {property.area ? `${property.area} sqft` : '—'}
                    </div>
                  </div>
                </div>

                {property.description && (
                  <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 text-sm text-slate-200 leading-relaxed">
                    {property.description}
                  </div>
                )}

                <Link
                  to="/listings"
                  className="text-sm text-slate-300 hover:text-white"
                >
                  ← Back to all listings
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

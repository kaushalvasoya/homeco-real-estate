// client/src/pages/PropertyDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../utils/api';

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
        if (!cancelled) setError('Could not load property');
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
          {/* LOADING SKELETON */}
          {loading && (
            <div className="grid lg:grid-cols-12 gap-8 animate-pulse">
              <div className="lg:col-span-7">
                <div className="h-80 rounded-2xl bg-slate-800" />
              </div>
              <div className="lg:col-span-5 space-y-4">
                <div className="h-10 w-2/3 bg-slate-800 rounded" />
                <div className="h-32 bg-slate-800 rounded-2xl" />
                <div className="h-24 bg-slate-800 rounded-2xl" />
              </div>
            </div>
          )}

          {/* ERROR STATE */}
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

          {/* MAIN CONTENT */}
          {!loading && !error && property && (
            <>
              {/* TOP SECTION: IMAGE + OVERVIEW CARD */}
              <div className="grid lg:grid-cols-12 gap-8 mb-8">
                {/* IMAGE */}
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
                </div>

                {/* OVERVIEW CARD */}
                <div className="lg:col-span-5">
                  <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col gap-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-400 mb-1">
                      Property overview
                    </div>

                    <div>
                      <h1 className="text-2xl font-semibold text-white">
                        {property.title}
                      </h1>
                      <p className="mt-1 text-sm text-slate-300">
                        {property.location || 'Location not provided'}
                      </p>
                    </div>

                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase text-slate-400">
                          Price
                        </div>
                        <div className="text-2xl font-semibold text-indigo-300 mt-1">
                          ₹
                          {property.price
                            ? Number(property.price).toLocaleString()
                            : '—'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs uppercase text-slate-400">
                          Area
                        </div>
                        <div className="mt-1 text-lg font-semibold text-slate-100">
                          {property.area ? `${property.area} sqft` : 'Not specified'}
                        </div>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/${(property.contactPhone || '919876543210').replace(
                        /\D/g,
                        ''
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary w-full justify-center text-sm mt-1"
                    >
                      WhatsApp seller
                    </a>
                  </div>
                </div>
              </div>

              {/* BOTTOM SECTION: DESCRIPTION + KEY INFO + BACK CARD */}
              <div className="grid lg:grid-cols-12 gap-8">
                {/* DESCRIPTION CARD */}
                <div className="lg:col-span-7">
                  <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6">
                    <div className="text-sm font-semibold text-white mb-2">
                      Description
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {property.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                {/* SIDE COLUMN: KEY INFO + BACK TO LISTINGS */}
                <div className="lg:col-span-5 space-y-4">
                  {/* KEY INFO */}
                  <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6">
                    <div className="text-sm font-semibold text-white mb-3">
                      Key info
                    </div>
                    <dl className="space-y-2 text-sm text-slate-200">
                      <div className="flex justify-between">
                        <dt className="text-slate-400">Bedrooms</dt>
                        <dd>{property.bedrooms || 'Not specified'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-400">Bathrooms</dt>
                        <dd>{property.bathrooms || 'Not specified'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-400">Category</dt>
                        <dd>{property.category || 'Not set'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-400">Contact</dt>
                        <dd>{property.contactPhone || 'Not provided'}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* BACK TO LISTINGS */}
                  <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6">
                    <div className="text-sm font-semibold text-white mb-2">
                      Back to listings
                    </div>
                    <p className="text-xs text-slate-300 mb-4">
                      Want to keep exploring more properties in your area?
                    </p>
                    <Link
                      to="/listings"
                      className="btn btn-primary w-full justify-center text-sm"
                    >
                      View all listings
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

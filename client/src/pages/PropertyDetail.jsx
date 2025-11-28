// client/src/pages/PropertyDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PropertyDetail(){
  const { id } = useParams();
  const [prop, setProp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    async function fetchOne() {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/properties/${id}`);
        setProp(res.data);
        setErr(null);
      } catch (e) {
        console.error(e);
        setErr('Could not load property');
      } finally {
        setLoading(false);
      }
    }
    fetchOne();
  }, [id]);

  const phone = (prop?.contactPhone || '919876543210').replace(/\D/g, '');
  const waText = encodeURIComponent(
    `Hi, I am interested in your property: ${prop?.title || ''}`
  );

  return (
    <>
      <Navbar />
      <main className="page-spacing">
        {loading && (
          <section className="container-lg py-12">
            <div className="animate-pulse grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 h-72 rounded-2xl bg-slate-800" />
              <div className="h-72 rounded-2xl bg-slate-800" />
            </div>
          </section>
        )}

        {!loading && err && (
          <section className="container-lg py-12">
            <div className="card bg-red-800/40 border border-red-500/30">
              <p className="text-red-100">{err}</p>
              <Link to="/" className="mt-4 inline-block text-indigo-300">
                ← Back to home
              </Link>
            </div>
          </section>
        )}

        {!loading && prop && (
          <>
            {/* top hero image and info */}
            <section className="container-lg py-10">
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="overflow-hidden rounded-3xl shadow-xl border border-[rgba(255,255,255,0.06)]">
                    <img
                      src={prop.images?.[0]?.url || '/sample/prop-1.jpg'}
                      alt={prop.title}
                      className="w-full h-[360px] object-cover"
                    />
                  </div>
                </div>

                <aside className="glass-card">
                  <div className="text-xs uppercase tracking-[0.15em] text-indigo-300">
                    Property overview
                  </div>
                  <h1 className="text-2xl font-semibold mt-2">{prop.title}</h1>
                  <p className="small-muted mt-1">{prop.location}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm small-muted">Price</div>
                      <div className="text-2xl font-semibold text-indigo-300">
                        ₹{prop.price ? Number(prop.price).toLocaleString() : 'NA'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm small-muted">Area</div>
                      <div className="font-semibold">
                        {prop.area ? `${prop.area} sqft` : 'NA'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    {prop.bedrooms && (
                      <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-600">
                        🛏 {prop.bedrooms} bedrooms
                      </span>
                    )}
                    {prop.bathrooms && (
                      <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-600">
                        🛁 {prop.bathrooms} bathrooms
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-600">
                      ID: {prop._id?.slice(-6)}
                    </span>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <a
                      href={`https://wa.me/${phone}?text=${waText}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary flex-1 justify-center"
                    >
                      WhatsApp seller
                    </a>
                    {prop.contactPhone && (
                      <a
                        href={`tel:${phone}`}
                        className="btn flex-1 justify-center border border-slate-600 bg-slate-900/60"
                      >
                        Call now
                      </a>
                    )}
                  </div>
                </aside>
              </div>
            </section>

            {/* details section */}
            <section className="container-lg pb-12">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="card">
                    <h2 className="text-xl font-semibold mb-3">Description</h2>
                    <p className="small-muted whitespace-pre-line">
                      {prop.description || 'Description not provided.'}
                    </p>
                  </div>

                  {prop.images && prop.images.length > 1 && (
                    <div className="card mt-6">
                      <h3 className="text-lg font-semibold mb-3">Gallery</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {prop.images.slice(1).map((img, idx) => (
                          <img
                            key={idx}
                            src={img.url}
                            alt={`Property ${idx + 2}`}
                            className="w-full h-32 md:h-40 object-cover rounded-xl"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="card">
                    <h3 className="text-lg font-semibold mb-2">Key info</h3>
                    <ul className="space-y-2 text-sm small-muted">
                      <li>Listed: {new Date(prop.createdAt || Date.now()).toLocaleDateString()}</li>
                      <li>Contact: {prop.contactPhone || 'Not provided'}</li>
                    </ul>
                  </div>

                  <div className="card">
                    <h3 className="text-lg font-semibold mb-2">Back to listings</h3>
                    <p className="small-muted mb-3">
                      Want to keep exploring more properties in your area
                    </p>
                    <Link to="/" className="btn btn-primary w-full justify-center">
                      View all listings
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

// client/src/components/Listings.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Listings({ properties = [], loading }) {
  const skeletonItems = [1, 2, 3];

  return (
    <section className="container-lg listings">
      <h3 className="text-2xl font-semibold mb-6 text-white">
        Find Home Listing in Your Area
      </h3>

      {/* Skeletons while loading */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skeletonItems.map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-img" />
              <div className="skeleton-line w-3/4" />
              <div className="skeleton-line w-1/2" />
              <div className="skeleton-line w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <div
              className="card hover:-translate-y-1 transition-transform duration-300"
              key={p._id}
            >
              <img
                src={p.images?.[0]?.url || '/sample/prop-1.jpg'}
                alt={p.title}
                className="listing-img"
              />
              <div className="mt-3">
                <div className="font-semibold text-white">
                  {p.title || 'Untitled'}
                </div>
                <div className="text-sm text-gray-400">{p.location}</div>
                <div className="mt-2 text-indigo-300 font-semibold">
                  ₹{p.price ? Number(p.price).toLocaleString() : '—'}
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <Link
                    className="text-sm text-indigo-300 hover:text-indigo-200"
                    to={`/property/${p._id}`}
                  >
                    Details
                  </Link>
                  <a
                    className="btn btn-primary text-sm"
                    href={`https://wa.me/${(p.contactPhone || '919876543210').replace(
                      /\D/g,
                      ''
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}

          {/* no data state */}
          {!properties.length && (
            <p className="text-gray-400 col-span-full mt-2">
              No listings yet. Add one from the admin panel.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

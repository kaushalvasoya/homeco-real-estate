// client/src/components/PropertyCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function formatPrice(price){
  if (price == null) return '—';
  return '₹' + Number(price).toLocaleString();
}

export default function PropertyCard({ p, compact }) {
  const img = p?.images?.[0]?.url || '/sample/prop-1.jpg';
  const phone = (p?.contactPhone || '').replace(/\D/g, '') || '919876543210';
  const text = encodeURIComponent(`Hi, I'm interested in ${p?.title || 'this property'}`);

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-20 h-16 overflow-hidden rounded">
          <img src={img} alt="preview" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="text-xs text-gray-500">{p?.location}</div>
          <div className="font-semibold">{p?.title}</div>
          <div className="chips">
            <span className="text-xs px-2 py-1 bg-gray-100 rounded">{p?.bedrooms ?? '—'} bd</span>
            <span className="text-xs px-2 py-1 bg-gray-100 rounded">{p?.bathrooms ?? '—'} ba</span>
            <span className="text-xs px-2 py-1 bg-gray-100 rounded">{p?.area ?? '—'} sqft</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <img src={img} alt={p?.title} className="w-full h-48 object-cover rounded-md mb-3" />
      <div className="text-sm text-gray-500">{p?.location}</div>
      <h3 className="text-lg font-semibold">{p?.title}</h3>
      <div className="mt-2 text-gray-700">{formatPrice(p?.price)}</div>
      <div className="flex justify-between items-center mt-3">
        <Link to={`/property/${p?._id}`} className="text-primary-600">Details</Link>
        <a href={`https://wa.me/${phone}?text=${text}`} className="btn btn-primary" target="_blank" rel="noreferrer">WhatsApp</a>
      </div>
    </div>
  );
}

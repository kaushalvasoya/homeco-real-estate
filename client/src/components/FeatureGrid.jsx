// client/src/components/FeatureGrid.jsx
import React from 'react';

const items = [
  { title: 'Commercial', sub: 'Offices & retail' },
  { title: 'House', sub: 'Family homes' },
  { title: 'Apartment', sub: 'High-rise & condos' },
  { title: 'Land', sub: 'Plots' },
];

export default function FeatureGrid() {
  return (
    <section className="container-lg features">
      <div className="feature-grid">
        {items.map((it, i) => (
          <div key={i} className="feature">
            <div className="text-lg font-semibold text-white">{it.title}</div>
            <div className="text-sm text-gray-400 mt-2">{it.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

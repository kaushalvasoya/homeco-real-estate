// client/src/components/ListingsSkeleton.jsx
import React from 'react';

const cards = new Array(6).fill(0);

export default function ListingsSkeleton() {
  return (
    <section className="container-lg py-12">
      <h3 className="text-2xl font-semibold mb-6">Loading listings...</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.04)] shadow-lg p-4 animate-pulse"
          >
            <div className="w-full h-40 rounded-xl bg-slate-800 mb-4" />
            <div className="h-4 bg-slate-800 rounded w-3/4 mb-2" />
            <div className="h-3 bg-slate-800 rounded w-1/2 mb-2" />
            <div className="h-4 bg-slate-800 rounded w-1/3 mt-2" />
            <div className="flex justify-between items-center mt-4">
              <div className="h-3 w-16 bg-slate-800 rounded" />
              <div className="h-8 w-20 bg-slate-800 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

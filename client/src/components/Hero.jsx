// client/src/components/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero({ backgroundImageUrl = '/sample/hero.jpg', featured }) {
  return (
    <section className="container-lg relative">
      <div className="hero">
        {/* background image layer */}
        <div className="hero-bg" style={{ backgroundImage: `url(${backgroundImageUrl})` }} />
        <div className="hero-overlay" />

        <div className="hero-inner">
          <div className="hero-left">
            <div className="kicker">Welcome to HomeCo</div>
            <h1 className="hero-title">Let’s Find Your Dream House.</h1>
            <p className="hero-sub">Explore curated listings. search by location, type, price and contact directly with sellers.</p>

            <div className="mt-6 flex items-center gap-4">
              {/* <button className="inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/40 hover:shadow-fuchsia-500/40 hover:-translate-y-0.5 transition transform">Search Properties</button> */}
              <Link to="/listings" className="inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/40 hover:shadow-fuchsia-500/40 hover:-translate-y-0.5 transition transform"> Browse listings →</Link>
            </div>

            {/* NOTE: featured card has been removed from inline flow and is now positioned absolutely below */}
          </div>

          {/* right side floating panels (large screens) */}
          <aside className="lg:col-span-5 hidden lg:block">
            <div className="grid gap-6">
              <div className="feature floating">
                <div className="font-semibold">Explore Apartment Types</div>
                <div className="small-muted mt-2">Commercial, Apartment, House</div>
              </div>
              <div className="feature floating">
                <div className="font-semibold">Top Locations</div>
                <div className="small-muted mt-2">City center, Riverside, Uptown</div>
              </div>
            </div>
          </aside>
        </div>

        {/* FEATURED FLOATING CARD – anchored bottom-left of the hero */}
        <div className="absolute left-8 bottom-6 z-20">
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl w-[300px] flex gap-3 items-start">
            <img
              src={featured?.images?.[0]?.url || '/sample/prop-1.jpg'}
              alt="preview"
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
            />

            <div className="text-white flex-1">
              <div className="text-xs text-gray-200/80">Featured</div>
              <div className="font-semibold">{featured?.title || 'Modern villa with pool'}</div>
              <div className="text-sm text-gray-200/70">{featured?.location || 'Downtown, City'}</div>
            </div>

            <div className="ml-3 text-indigo-300 font-semibold text-right">
              ₹{featured?.price ? Number(featured.price).toLocaleString() : '1,20,00,000'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// client/src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeatureGrid from '../components/FeatureGrid';
import Listings from '../components/Listings';
import TeamTestimonials from '../components/TeamTestimonials';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

// same pattern you used before for API base
// shared helper in each file for now
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : '');


export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch properties
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await axios.get(`${API_BASE}/api/properties`);
        if (!cancelled) {
          setProperties(res.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch properties', err);
        if (!cancelled) setProperties([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  // scroll-reveal animations
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [properties.length]); // re-run once data arrives

  const featured = properties[0];

  return (
    <>
      <Navbar />
      <main className="page-shell pb-16">
        {/* HERO */}
        <div className="reveal reveal-delay-1">
          <Hero
            featured={featured}
            backgroundImageUrl={
              featured?.images?.[0]?.url || '/sample/hero.jpg'
            }
          />
        </div>

        {/* CATEGORY CARDS */}
        <div className="reveal reveal-delay-2">
          <FeatureGrid />
        </div>

        {/* LISTINGS + skeletons when loading */}
        <div className="reveal reveal-delay-3">
          <Listings properties={properties} loading={loading} />
        </div>

        {/* TEAM */}
        <div className="reveal reveal-delay-4">
          <TeamTestimonials />
        </div>

        {/* CONTACT */}
        <ContactSection className="reveal reveal-delay-3" />


        {/* FOOTER (can also fade in if you want) */}
        <Footer />
      </main>
    </>
  );
}

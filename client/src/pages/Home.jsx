// client/src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeatureGrid from '../components/FeatureGrid';
import Listings from '../components/Listings';
import TeamTestimonials from '../components/TeamTestimonials';
import Footer from '../components/Footer';
import axios from 'axios';
import { api } from '../utils/api';

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await axios.get(api('/properties'));
        setProperties(res.data || []);
      } catch (err) {
        console.error('Home fetch error', err);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const featured = properties[0];

  return (
    <>
      <Navbar />
      <main className="page-spacing">
        <Hero
          featured={featured}
          backgroundImageUrl={
            featured?.images?.[0]?.url || '/sample/hero.jpg'
          }
        />
        <FeatureGrid />
        <Listings properties={properties} loading={loading} />
        <TeamTestimonials />
        <div className="container-lg">
          <div className="cta mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">
                  Discover Your Perfect Property Match
                </h3>
                <p className="small-muted mt-2">
                  We help you find the right home quickly and easily.
                </p>
              </div>
              <div>
                <button className="btn btn-primary">Get Started</button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}

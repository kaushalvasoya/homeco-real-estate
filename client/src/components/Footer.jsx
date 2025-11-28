// client/src/components/Footer.jsx
import React from 'react';

export default function Footer(){
  return (
    <footer className="site-footer">
      <div className="container-lg grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="brand text-white">HomeCo</div>
          <p className="small-muted mt-3 text-sm">
            Curated listings and direct contact with property owners and agents.
          </p>
        </div>

        <div>
          <div className="font-semibold text-white text-sm">Explore</div>
          <ul className="mt-3 text-sm small-muted space-y-2">
            <li>Residential properties</li>
            <li>Commercial spaces</li>
            <li>New projects</li>
          </ul>
        </div>

        <div>
          <div className="font-semibold text-white text-sm">Contact</div>
          <p className="small-muted mt-3 text-sm">
            Email: hello@homeco.example  
            <br />
            Phone: +91 98765 43210
          </p>
        </div>
      </div>

      <div className="container-lg mt-8 text-xs small-muted flex flex-wrap items-center justify-between gap-3">
        <span>© {new Date().getFullYear()} HomeCo. All rights reserved.</span>
        <span>Made with care for property seekers.</span>
      </div>
    </footer>
  );
}

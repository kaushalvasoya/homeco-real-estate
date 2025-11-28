// client/src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? 'text-white' : '';

  return (
    <header className="container-lg pt-5">
      <div className="navbar">
        {/* Left brand + nav */}
        <div className="flex items-center gap-8">
          <Link to="/" className="brand">
            HomeCo
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`nav-link ${isActive('/')}`}
            >
              Home
            </Link>

            <Link
              to="/listings"
              className={`nav-link ${isActive('/listings')}`}
            >
              Listings
            </Link>

            <Link
              to="/about"
              className={`nav-link ${isActive('/about')}`}
            >
              About
            </Link>

            {/* smooth scroll to contact section */}
            <a
              href="#contact"
              className="nav-link"
            >
              Contact
            </a>
          </nav>
        </div>

        {/* Right side admin pill */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/40 hover:shadow-fuchsia-500/40 hover:-translate-y-0.5 transition transform"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}

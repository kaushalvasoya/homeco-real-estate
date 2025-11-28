// client/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import ListingsPage from './pages/ListingsPage';
import PropertyDetail from './pages/PropertyDetail';
import Admin from './pages/Admin';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/listings" element={<ListingsPage />} />
      <Route path="/property/:id" element={<PropertyDetail />} />
      <Route path="/admin" element={<Admin />} />
      {/* optional catch all */}
      {/* <Route path="*" element={<Home />} /> */}
    </Routes>
  );
}

// client/src/components/ContactSection.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: '', text: '' });

      await axios.post('http://localhost:5000/api/contact', form);

      setStatus({ type: 'success', text: 'Message sent. We will reply soon.' });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus({
        type: 'error',
        text: 'Something went wrong. Please try again in a moment.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="container-lg py-20 reveal reveal-delay-3">
      <div className="contact-card grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* LEFT – form */}
        <div>
          <p className="text-sm font-semibold text-indigo-300 uppercase tracking-wide mb-2">
            Get in touch
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Send Message Anytime
          </h2>
          <p className="text-gray-300 mb-8 max-w-md leading-relaxed">
            Have a question about a listing or want help finding the right
            property? Drop us a line and we will get back to you.
          </p>

          {status.text && (
            <div
              className={
                'mb-4 rounded-xl px-4 py-2 text-sm ' +
                (status.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                  : 'bg-red-500/10 text-red-300 border border-red-500/30')
              }
            >
              {status.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                className="input input-solid"
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="email"
                className="input input-solid"
                placeholder="Your email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <textarea
              className="input input-solid h-32 resize-none"
              placeholder="Message"
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
            />

            <button
              type="submit"
              className="btn btn-primary mt-2"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* RIGHT – contact info */}
        <div className="space-y-8 text-gray-300">
          <div>
            <h3 className="text-base font-semibold text-white mb-1">Office</h3>
            <p className="text-sm text-gray-400">
              123 HomeCo Street, City, Country
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white mb-1">Phone</h3>
            <p className="text-sm text-gray-400">+91 98765 43210</p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white mb-1">Email</h3>
            <p className="text-sm text-gray-400">hello@homeco.example</p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white mb-1">
              Office Hours
            </h3>
            <p className="text-sm text-gray-400">
              Mon – Sat, 10:00 AM – 7:00 PM
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

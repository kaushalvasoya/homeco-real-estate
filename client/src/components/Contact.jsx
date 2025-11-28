// client/src/components/Contact.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function Contact(){
  const [form, setForm] = useState({ name:'', email:'', message:'' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  async function handleSubmit(e){
    e.preventDefault();
    if(!form.name || !form.email || !form.message){
      setStatus({ type:'error', text:'Please fill all fields.'});
      return;
    }
    setLoading(true);
    try {
      // example: send to your backend. Replace url if needed.
      await axios.post('/api/contact', form).catch(()=>{}); // safe - backend optional
      setStatus({ type:'success', text:'Message sent. We will reply soon.'});
      setForm({ name:'', email:'', message:'' });
    } catch(err){
      setStatus({ type:'error', text: (err?.response?.data?.msg || 'Submit failed')});
    } finally { setLoading(false); }
  }

  return (
    <section className="container-lg py-12" id="contact">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="glass-card animate-fade-up">
          <h3 className="text-2xl font-semibold">Stay informed about the market</h3>
          <p className="small-muted mt-2">
            Join our newsletter for curated listings, market updates and tips.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <input
              className="w-full p-3 rounded-xl glass-input"
              placeholder="Your name"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
            <input
              className="w-full p-3 rounded-xl glass-input"
              placeholder="Email address"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
            />
            <textarea
              className="w-full p-3 rounded-xl glass-input"
              rows="4"
              placeholder="Message"
              value={form.message}
              onChange={e => setForm({...form, message: e.target.value})}
            />
            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Sending...' : 'Send message'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={()=> setForm({ name:'', email:'', message:'' })}>Reset</button>
            </div>

            {status && (
              <div className={`p-3 rounded ${status.type === 'error' ? 'bg-red-600/10 text-red-300' : 'bg-green-600/10 text-green-300'}`}>
                {status.text}
              </div>
            )}
          </form>
        </div>

        <div className="animate-fade-up delay-100">
          <div className="card">
            <h4 className="text-lg font-semibold">Contact</h4>
            <p className="small-muted mt-2">Call or WhatsApp us for a faster reply.</p>

            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="icon-circle">📞</div>
                <div>
                  <div className="font-semibold">Phone</div>
                  <div className="small-muted">+91 98765 43210</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="icon-circle">📍</div>
                <div>
                  <div className="font-semibold">Office</div>
                  <div className="small-muted">Mumbai, India</div>
                </div>
              </div>

              <div className="mt-6">
                <h5 className="font-semibold">Visit us</h5>
                <p className="small-muted mt-2">Open Mon–Sat, 9:30am–6pm</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm small-muted">
            <div>We respect your privacy. Information is used only to contact you regarding property listings.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

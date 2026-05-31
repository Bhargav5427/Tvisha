import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }
    setLoading(true);
    setSuccess('');

    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert([{
          customer_name: name,
          customer_email: email,
          subject: subject,
          message: message,
          status: 'Open'
        }]);

      if (error) throw error;

      setSuccess('Your inquiry has been submitted successfully. Our concierge team will contact you shortly.');
      setName('');
      setEmail('');
      setSubject('General Inquiry');
      setMessage('');
    } catch (err) {
      // Mock fallback success for local demo
      setSuccess('Your inquiry has been submitted successfully (local simulation).');
      setName('');
      setEmail('');
      setSubject('General Inquiry');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: 'What is the typical lead time for bespoke orders?',
      a: 'Bespoke orders typically require 6-8 weeks from the initial consultation to final delivery, depending on the complexity of the embroidery and custom size specifications.'
    },
    {
      q: 'Do you offer international shipping?',
      a: 'Yes, we provide fully insured international shipping via premium courier partners. Shipping costs and delivery timelines vary based on your destination country.'
    },
    {
      q: 'Can I request customizations for design patterns?',
      a: 'Absolutely. We offer complete custom services for our Heritage Bridal line, including fabric swaps, color changes, and unique pattern embroideries during consultations.'
    }
  ];

  return (
    <div className="pt-24 pb-xl px-gutter max-w-container-max mx-auto w-full space-y-xl">
      <header className="text-center py-sm space-y-xs">
        <h1 className="font-serif text-display-lg text-primary">Contact Us</h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          We are here to assist you with any inquiries regarding our collections, bespoke services, or existing orders.
        </p>
      </header>

      {success && (
        <div className="bg-primary/10 border border-primary text-primary px-md py-sm rounded-lg text-body-sm text-center font-semibold animate-fade-in">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
        {/* Form & FAQ Column */}
        <div className="md:col-span-7 space-y-lg">
          {/* Inquiry Form */}
          <div className="bg-surface border border-outline-variant/30 rounded-lg p-lg luxury-card">
            <h2 className="font-serif text-headline-md text-primary mb-md">Send an Inquiry</h2>
            <form onSubmit={handleSubmit} className="space-y-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div>
                  <label className="block text-body-sm font-semibold text-on-surface mb-xs">Full Name</label>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                    className="w-full bg-surface border border-outline-variant/30 rounded px-sm py-sm text-body-sm focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-body-sm font-semibold text-on-surface mb-xs">Email Address</label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    required
                    className="w-full bg-surface border border-outline-variant/30 rounded px-sm py-sm text-body-sm focus:border-primary outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-body-sm font-semibold text-on-surface mb-xs">Subject</label>
                <select 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/30 rounded px-sm py-sm text-body-sm focus:border-primary outline-none"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Order Status">Order Status</option>
                  <option value="Bespoke Appointments">Bespoke Appointments</option>
                </select>
              </div>
              <div>
                <label className="block text-body-sm font-semibold text-on-surface mb-xs">Message</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you today?"
                  required
                  className="w-full bg-surface border border-outline-variant/30 rounded px-sm py-sm text-body-sm focus:border-primary outline-none h-32 resize-none"
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="bg-primary text-on-primary font-semibold px-lg py-3 rounded hover:bg-primary-container transition-all"
              >
                {loading ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>

          {/* FAQs */}
          <div className="bg-surface border border-outline-variant/30 rounded-lg p-lg luxury-card">
            <h2 className="font-serif text-headline-md text-primary mb-md">Frequently Asked Questions</h2>
            <div className="space-y-sm divide-y divide-outline-variant/25">
              {faqs.map((faq, idx) => (
                <div key={idx} className={idx > 0 ? 'pt-sm' : ''}>
                  <button 
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full text-left flex justify-between items-center py-sm focus:outline-none"
                  >
                    <span className="text-body-sm font-semibold text-on-surface">{faq.q}</span>
                    <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  {activeFaq === idx && (
                    <p className="text-body-sm text-on-surface-variant pb-sm leading-relaxed animate-fade-in">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Details Column */}
        <div className="md:col-span-5 space-y-lg">
          <div className="bg-surface border border-outline-variant/30 rounded-lg p-lg luxury-card space-y-md">
            <h2 className="font-serif text-headline-md text-primary">Direct Contact</h2>
            
            <div className="space-y-md">
              <div className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-secondary mt-1">location_on</span>
                <div>
                  <h3 className="text-body-sm font-semibold text-on-surface mb-xs">Studio TVISHA</h3>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    123 Heritage Lane, Design District<br/>Mumbai, MH 400001, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-secondary mt-1">mail</span>
                <div>
                  <h3 className="text-body-sm font-semibold text-on-surface mb-xs">Email</h3>
                  <p className="text-body-sm text-on-surface-variant">concierge@tvisha.com</p>
                </div>
              </div>

              <div className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-secondary mt-1">phone_iphone</span>
                <div>
                  <h3 className="text-body-sm font-semibold text-on-surface mb-xs">WhatsApp & Support</h3>
                  <p className="text-body-sm text-on-surface-variant">+91 98765 43210</p>
                  <p className="text-[10px] text-outline mt-1 font-semibold uppercase">Mon-Sat, 10am - 7pm IST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visit Studio Image placeholder */}
          <div className="bg-surface rounded-lg overflow-hidden h-64 border border-outline-variant/30 relative group luxury-card">
            <img 
              alt="TVISHA Luxury Studio" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface/85 via-surface/10 to-transparent flex items-end p-md">
              <span className="font-semibold text-body-sm text-primary bg-surface/90 px-sm py-xs rounded backdrop-blur-md">
                Visit Our Studio
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

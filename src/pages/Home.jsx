import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';


const CRAFT_PILLARS = [
  { icon: 'diamond', label: 'Heritage Craft', desc: 'Each piece preserves centuries-old embroidery traditions from master artisans across India.' },
  { icon: 'straighten', label: 'Bespoke Fit', desc: 'Every garment tailored to your exact measurements for a flawless, majestic silhouette.' },
  { icon: 'eco', label: 'Ethical Luxury', desc: 'Sustainably sourced fabrics and fairly compensated artisan partners — beauty with conscience.' },
  { icon: 'local_shipping', label: 'White Glove Delivery', desc: 'Insured, premium packaging with personal concierge support from order to delivery.' },
];

const TESTIMONIALS = [
  { name: 'Priya S.', city: 'Mumbai', text: 'Wore the Rajkumari lehenga at my reception — every single guest asked where it was from. Absolute perfection.', stars: 5 },
  { name: 'Ananya K.', city: 'Delhi', text: 'The bespoke fitting experience was beyond what I expected. They truly understood my vision.', stars: 5 },
  { name: 'Meera R.', city: 'Bengaluru', text: 'The Zardozi work on my Chaniya Choli was breathtaking. Worth every rupee and more.', stars: 5 },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleSection, setVisibleSection] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*').limit(3);
        setFeaturedProducts((!error && data) ? data : []);
      } catch {
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
        setTimeout(() => setVisibleSection(true), 100);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="pb-xl overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="pt-20 bg-[#0f1e1e] min-h-screen flex flex-col relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#3d9392]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#cba55c]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex-1 max-w-[1400px] mx-auto px-gutter w-full py-12 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Hero Text */}
          <div className="md:col-span-5 space-y-6 z-10">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-[#cba55c]"></span>
              <span className="text-[#cba55c] text-[11px] font-bold uppercase tracking-widest">The Royal Edit — 2026</span>
            </div>
            <h1 className="font-serif text-[52px] md:text-[64px] font-bold text-white leading-[1.05] tracking-tight">
              Timeless<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3d9392] to-[#cba55c]">Elegance</span>
            </h1>
            <p className="text-white/60 text-[15px] leading-relaxed max-w-md">
              Handcrafted Chaniya Cholis & Lehengas by India's master artisans — where every thread carries centuries of heritage.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => navigate('/collections?category=heritage-bridal')}
                className="flex items-center gap-2 bg-[#3d9392] hover:bg-[#2d7574] text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-[#3d9392]/25 text-[13px]"
              >
                <span className="material-symbols-outlined text-[18px]">diamond</span>
                Shop Bridal
              </button>
              <button
                onClick={() => navigate('/collections')}
                className="flex items-center gap-2 border border-white/20 hover:border-white/50 text-white/80 hover:text-white font-semibold px-7 py-3.5 rounded-xl transition-all text-[13px] backdrop-blur-sm"
              >
                View Collections
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {/* Social Proof Counters */}
            <div className="flex gap-6 pt-4 border-t border-white/10">
              {[{ val: '500+', label: 'Brides Served' }, { val: '25+', label: 'Master Artisans' }, { val: '4.9★', label: 'Avg Rating' }].map(s => (
                <div key={s.label}>
                  <p className="text-white font-bold text-[20px] leading-none">{s.val}</p>
                  <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Bento Grid */}
          <div className="md:col-span-7 grid grid-cols-2 gap-3 h-[520px]">
            {/* Main tall card */}
            <div
              className="row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer"
              onClick={() => navigate('/collections?category=heritage-bridal')}
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVN4DMOR2KStc5MOXWSqAyh4MX73-jh1xV1-Py-Gld1-3aK8vlF5uKqlYZolNNd5WVJdsgYW0tSg6HQLy6FraoGlQvk7b8ZqVDpSa8m0cFFYKG5iiF_Wnj_SWlcSveHr9YLXdTf3HiA4gulKg8O024UWbW63uXJvVdPpX5kJk-L4ZIWibFBlNWXL6rvuMyNUqZngQfiq4f48kSQLamLrUYqGyZTJXhlElEJUCUtFfGp3ShzWY3eoeXglq10zB91TPK1V4q2YYJv1A"
                alt="Bridal Lehenga" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-5 text-white">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#cba55c] mb-1">Heritage Bridal</p>
                <h2 className="font-serif text-[22px] font-bold leading-tight">Bridal<br />Collection</h2>
                <span className="flex items-center gap-1 text-[11px] font-semibold mt-2 text-white/70 group-hover:text-white transition-colors">
                  Explore <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </div>
            </div>

            {/* Navratri card */}
            <div
              className="relative rounded-2xl overflow-hidden group cursor-pointer"
              onClick={() => navigate('/collections?category=festive-glamour')}
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIz6AFJAwSYB_Z-H-ZaVWfgZa7QELcoIyD_6pI4PueCDw-a4zoEGMREzlxr72Jlgt7MyyL1Wxd0n2qcUq9hoPQeDaoFCgbAwRAug-2BT0fDMOzMpeY0c4Q_xT76tV3xiMb15nhDtTptplL1h1yB76c1xJ7WROoYG6G44uxENx50KXljhBee5vKG7Xq50nOFTSvnRoIiF-26ijXWX-_jLqDZtR53j_psBExPElRQ7W4zD1A1LtoV6eWDYqgX1q3Oj1dmE5C76qW5bo"
                alt="Navratri" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#d17b60] mb-0.5">Festive Season</p>
                <h2 className="font-serif text-[16px] font-bold">Navratri Specials</h2>
              </div>
            </div>

            {/* Bespoke CTA card */}
            <div className="relative rounded-2xl bg-gradient-to-br from-[#3d9392]/20 to-[#cba55c]/10 border border-[#cba55c]/20 flex flex-col items-center justify-center p-5 text-center">
              <span className="material-symbols-outlined text-[#cba55c] text-[36px] mb-2">diamond</span>
              <h3 className="font-serif text-[16px] font-bold text-white mb-1">Bespoke Fitting</h3>
              <p className="text-white/50 text-[11px] leading-relaxed mb-3">Custom tailored to your exact measurements.</p>
              <Link
                to="/contact"
                className="text-[11px] font-bold text-[#cba55c] border border-[#cba55c]/40 px-3 py-1.5 rounded-lg hover:bg-[#cba55c]/10 transition-all"
              >
                Book Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BRAND ETHOS ─────────────────────────────────────── */}
      <section className="bg-[#faf7f4] py-16 px-gutter">
        <div className="max-w-[1400px] mx-auto text-center mb-12">
          <span className="text-[#d17b60] text-[11px] font-bold uppercase tracking-widest">Our Craftsmanship</span>
          <h2 className="font-serif text-[36px] font-bold text-[#1a2e2e] mt-2 mb-3">Artisanal Grace, Contemporary Legacy</h2>
          <div className="w-12 h-0.5 bg-[#cba55c] mx-auto mb-4"></div>
          <p className="text-[15px] text-[#6b5c52] leading-relaxed max-w-2xl mx-auto">
            At TVISHA, every thread tells a story of heritage. We collaborate with master artisans to preserve traditional Zardozi, Gota Patti, and Aari embroideries.
          </p>
        </div>
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CRAFT_PILLARS.map((p, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#ece5df] p-6 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#3d9392]/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#3d9392]/20 transition-colors">
                <span className="material-symbols-outlined text-[#3d9392] text-[24px]">{p.icon}</span>
              </div>
              <h3 className="font-serif text-[16px] font-bold text-[#1a2e2e] mb-2">{p.label}</h3>
              <p className="text-[13px] text-[#a08070] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED COUTURE ─────────────────────────────────── */}
      <section className="py-16 px-gutter bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-[#d17b60] text-[11px] font-bold uppercase tracking-widest">Handpicked</span>
              <h2 className="font-serif text-[34px] font-bold text-[#1a2e2e] mt-1">Featured Couture</h2>
              <p className="text-[#a08070] text-[13px] mt-1">Masterworks from our latest capsule collection</p>
            </div>
            <Link
              to="/collections"
              className="hidden md:flex items-center gap-1.5 text-[13px] font-bold text-[#3d9392] border border-[#3d9392]/30 px-4 py-2 rounded-xl hover:bg-[#3d9392]/5 transition-all"
            >
              View All
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(n => (
                <div key={n} className="animate-pulse space-y-3">
                  <div className="bg-[#f0e8e2] rounded-2xl aspect-[3/4]"></div>
                  <div className="h-4 bg-[#f0e8e2] rounded w-2/3 mx-auto"></div>
                  <div className="h-4 bg-[#f0e8e2] rounded w-1/3 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProducts.map((product, idx) => (
                <Link
                  to={`/product/${product.slug}`}
                  key={product.id}
                  className="group bg-[#faf7f4] rounded-2xl border border-[#ece5df] overflow-hidden flex flex-col hover:shadow-xl hover:border-[#cba55c]/40 transition-all duration-500"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <img
                      src={product.image_url} alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-[#3d9392] text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#3d9392]/20">
                        Heritage Craft
                      </span>
                    </div>
                    <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 text-[#3d9392] font-bold text-[12px]">
                        <span className="material-symbols-outlined text-[16px]">local_mall</span>
                        View Details
                      </div>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#a08070] mb-1">{product.fabric}</p>
                      <h3 className="font-serif text-[16px] font-bold text-[#1a2e2e] line-clamp-2 leading-snug mb-1">{product.title}</h3>
                      <p className="text-[12px] text-[#a08070]">{product.embroidery_type}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#f0e8e2]">
                      <p className="text-[18px] font-bold text-[#3d9392]">₹{parseFloat(product.price).toLocaleString()}</p>
                      <span className="text-[11px] font-semibold text-[#a08070] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">straighten</span>
                        Custom Sizes
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link to="/collections" className="inline-flex items-center gap-2 border border-[#3d9392] text-[#3d9392] px-6 py-3 rounded-xl font-semibold text-[13px] hover:bg-[#3d9392]/5 transition-all">
              View All Collections
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── PROCESS BANNER ──────────────────────────────────── */}
      <section className="py-16 px-gutter bg-gradient-to-r from-[#1a2e2e] to-[#2a4a4a]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-[28px] font-bold text-white">The TVISHA Experience</h2>
            <p className="text-white/50 text-[13px] mt-2">From discovery to your doorstep — pure white-glove luxury</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { step: '01', icon: 'search', label: 'Discover', desc: 'Browse our curated couture collections' },
              { step: '02', icon: 'straighten', label: 'Customise', desc: 'Select fabric, size & embroidery details' },
              { step: '03', icon: 'support_agent', label: 'Consult', desc: 'Concierge confirms your bespoke order' },
              { step: '04', icon: 'local_shipping', label: 'Receive', desc: 'Premium delivery with white-glove packaging' },
            ].map(s => (
              <div key={s.step} className="flex flex-col items-center text-center p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/8 transition-colors">
                <span className="text-[#cba55c] text-[10px] font-bold uppercase tracking-widest mb-2">{s.step}</span>
                <div className="w-10 h-10 bg-[#3d9392]/20 rounded-xl flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[#3d9392] text-[20px]">{s.icon}</span>
                </div>
                <h3 className="text-white font-bold text-[14px] mb-1">{s.label}</h3>
                <p className="text-white/40 text-[11px] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────── */}
      <section className="py-16 px-gutter bg-[#faf7f4]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#d17b60] text-[11px] font-bold uppercase tracking-widest">Client Stories</span>
            <h2 className="font-serif text-[32px] font-bold text-[#1a2e2e] mt-2">Worn with Love</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#ece5df] p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.stars)].map((_, j) => (
                    <span key={j} className="material-symbols-outlined text-[#cba55c] text-[16px]">star</span>
                  ))}
                </div>
                <p className="text-[13px] text-[#3d3028] leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#f0e8e2]">
                  <div className="w-9 h-9 rounded-full bg-[#3d9392]/15 text-[#3d9392] flex items-center justify-center font-bold text-[12px]">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#1a2e2e]">{t.name}</p>
                    <p className="text-[11px] text-[#a08070]">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER BANNER ───────────────────────────────── */}
      <section className="py-16 px-gutter bg-white">
        <div className="max-w-[1400px] mx-auto bg-gradient-to-r from-[#3d9392]/10 to-[#cba55c]/10 border border-[#cba55c]/25 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #cba55c 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          <span className="material-symbols-outlined text-[#cba55c] text-[40px] mb-4 block">diamond</span>
          <h2 className="font-serif text-[32px] md:text-[40px] font-bold text-[#1a2e2e] mb-3">Begin Your Bridal Journey</h2>
          <p className="text-[#6b5c52] text-[15px] max-w-xl mx-auto mb-8 leading-relaxed">
            Book a complimentary consultation with our heritage experts to create your dream bridal ensemble — unique, measured, and made to last a lifetime.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/contact" className="flex items-center gap-2 bg-[#3d9392] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#2d7574] transition-all shadow-md shadow-[#3d9392]/25 text-[14px]">
              <span className="material-symbols-outlined text-[18px]">event</span>
              Book Consultation
            </Link>
            <Link to="/collections" className="flex items-center gap-2 border-2 border-[#3d9392] text-[#3d9392] font-bold px-8 py-3.5 rounded-xl hover:bg-[#3d9392]/5 transition-all text-[14px]">
              Explore Collections
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

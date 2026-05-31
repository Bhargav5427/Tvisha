import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';


const ACCORDION_ITEMS = [
  { key: 'fabric',     icon: 'dry_cleaning',     label: 'Fabric & Care',          field: 'fabric_care' },
  { key: 'embroidery', icon: 'auto_fix_high',     label: 'Embroidery & Craft',     field: 'embroidery_details' },
  { key: 'shipping',   icon: 'local_shipping',    label: 'Shipping & Returns',     field: 'shipping_returns' },
];

const TRUST_BADGES = [
  { icon: 'verified', label: 'Authenticity Guaranteed' },
  { icon: 'lock', label: 'Secure Checkout' },
  { icon: 'support_agent', label: 'Concierge Support' },
  { icon: 'replay', label: '7-Day Returns' },
];

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const [qty, setQty] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState('fabric');
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
        if (error || !data) {
          setProduct(null);
        } else {
          setProduct({ ...data, sizes: data.sizes || ['S', 'M', 'L'], fabric_care: data.fabric_care || 'Dry clean only.', embroidery_details: data.embroidery_details || 'Hand-embroidered heritage motifs.', shipping_returns: data.shipping_returns || 'Ships within 3-4 weeks.' });
        }
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, selectedSize, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  if (loading) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#3d9392] border-t-transparent"></div>
        <p className="text-[#a08070] pt-4 text-[13px]">Loading couture details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 text-center space-y-4 min-h-[50vh] flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-[48px] text-[#c0b0a5]">error</span>
        <h2 className="font-serif text-[22px] text-[#1a2e2e]">Product Not Found</h2>
        <Link to="/collections" className="text-[#3d9392] font-semibold hover:underline">Return to Collections</Link>
      </div>
    );
  }

  return (
    <main className="bg-[#faf7f4] min-h-screen">
      {/* Add to cart toast */}
      {added && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#1a2e2e] text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 font-semibold text-[13px] animate-fade-in">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
          {product.title} (Size {selectedSize}) added to bag
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-gutter pt-28 pb-xl">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-[12px] text-[#a08070]">
            {[{ label: 'Home', to: '/' }, { label: 'Collections', to: '/collections' }, { label: product.title }].map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="material-symbols-outlined text-[14px] text-[#d5ccc6]">chevron_right</span>}
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-[#3d9392] transition-colors font-medium">{crumb.label}</Link>
                ) : (
                  <span className="text-[#1a2e2e] font-semibold line-clamp-1 max-w-xs">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </ol>
        </nav>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── Image Panel ── */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-3">
            {/* Thumbnails */}
            <div className="hidden md:flex flex-col gap-2 w-20 flex-shrink-0">
              {[0, 1].map(i => (
                <div key={i} className={`aspect-[3/4] rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${i === 0 ? 'border-[#3d9392]' : 'border-[#ece5df] opacity-50 hover:opacity-80'}`}>
                  <img src={product.image_url} alt={`View ${i + 1}`} className={`w-full h-full object-cover ${i === 1 ? 'brightness-90 saturate-50' : ''}`} />
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative rounded-2xl overflow-hidden group bg-[#f0e8e2] border border-[#ece5df] shadow-sm" style={{ aspectRatio: '3/4' }}>
              <img src={product.image_url} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              {/* Hover hint */}
              <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-[12px]">zoom_in</span>
                Hover to zoom
              </div>
              {/* Craft badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm text-[#3d9392] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-[#3d9392]/20 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">diamond</span>
                  Heritage Craft
                </span>
              </div>
            </div>
          </div>

          {/* ── Product Info Panel ── */}
          <div className="lg:col-span-5 space-y-5">
            {/* Title & Price */}
            <div className="bg-white rounded-2xl border border-[#ece5df] p-6 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#a08070] mb-1">{product.fabric} · {product.embroidery_type}</p>
              <h1 className="font-serif text-[30px] font-bold text-[#1a2e2e] leading-tight mb-3">{product.title}</h1>
              <div className="flex items-baseline gap-3">
                <span className="text-[28px] font-bold text-[#3d9392]">₹{product.price.toLocaleString()}</span>
                <span className="text-[12px] text-[#a08070] bg-[#f7f3f0] px-2 py-0.5 rounded">Incl. all taxes</span>
              </div>
              <div className="flex gap-1 mt-2">
                {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined text-[#cba55c] text-[14px]">star</span>)}
                <span className="text-[11px] text-[#a08070] ml-1">(4.9 · 38 reviews)</span>
              </div>
              <div className="w-10 h-0.5 bg-[#cba55c] mt-3"></div>
              <p className="text-[13px] text-[#6b5c52] leading-relaxed mt-3">{product.description}</p>
            </div>

            {/* Size Selector */}
            <div className="bg-white rounded-2xl border border-[#ece5df] p-5 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#a08070]">Select Size</span>
                <button className="text-[11px] font-bold text-[#3d9392] hover:underline flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">straighten</span>
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {[...product.sizes, 'Custom'].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[52px] py-2.5 px-3 rounded-xl text-[12px] font-bold transition-all border-2 ${
                      selectedSize === size
                        ? 'border-[#3d9392] bg-[#3d9392] text-white shadow-md shadow-[#3d9392]/20'
                        : 'border-[#ece5df] text-[#6b5c52] bg-white hover:border-[#3d9392]/40'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {selectedSize === 'Custom' && (
                <p className="text-[11px] text-[#a08070] mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#cba55c]">info</span>
                  Our concierge will collect your measurements after ordering.
                </p>
              )}
            </div>

            {/* Quantity + CTA */}
            <div className="bg-white rounded-2xl border border-[#ece5df] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#a08070]">Quantity</span>
                <div className="flex items-center border-2 border-[#ece5df] rounded-xl overflow-hidden">
                  <button onClick={() => setQty(prev => Math.max(1, prev - 1))} className="w-9 h-9 flex items-center justify-center text-[#a08070] hover:text-[#3d9392] hover:bg-[#f7f3f0] transition-all">
                    <span className="material-symbols-outlined text-[18px]">remove</span>
                  </button>
                  <span className="w-10 text-center text-[13px] font-bold text-[#1a2e2e]">{qty}</span>
                  <button onClick={() => setQty(prev => prev + 1)} className="w-9 h-9 flex items-center justify-center text-[#a08070] hover:text-[#3d9392] hover:bg-[#f7f3f0] transition-all">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-[14px] transition-all duration-300 shadow-md ${
                  added
                    ? 'bg-emerald-500 text-white shadow-emerald-200'
                    : 'bg-[#3d9392] hover:bg-[#2d7574] text-white shadow-[#3d9392]/25 hover:shadow-lg'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{added ? 'check_circle' : 'local_mall'}</span>
                {added ? 'Added to Cart!' : `Add to Cart — ₹${(product.price * qty).toLocaleString()}`}
              </button>

              <Link
                to="/checkout"
                onClick={() => addToCart(product, selectedSize, qty)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[13px] border-2 border-[#1a2e2e] text-[#1a2e2e] hover:bg-[#1a2e2e] hover:text-white transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">flash_on</span>
                Buy Now
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-2">
              {TRUST_BADGES.map(b => (
                <div key={b.label} className="flex items-center gap-2 bg-white border border-[#ece5df] rounded-xl px-3 py-2.5 shadow-sm">
                  <span className="material-symbols-outlined text-[#3d9392] text-[16px]">{b.icon}</span>
                  <span className="text-[11px] font-semibold text-[#6b5c52]">{b.label}</span>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div className="bg-white rounded-2xl border border-[#ece5df] shadow-sm overflow-hidden">
              {ACCORDION_ITEMS.map((item, idx) => (
                <div key={item.key} className={idx > 0 ? 'border-t border-[#f7f3f0]' : ''}>
                  <button
                    onClick={() => setActiveAccordion(activeAccordion === item.key ? '' : item.key)}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[#f9f5f2] transition-colors group"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${activeAccordion === item.key ? 'bg-[#3d9392]/10' : 'bg-[#f7f3f0] group-hover:bg-[#3d9392]/5'}`}>
                      <span className={`material-symbols-outlined text-[16px] ${activeAccordion === item.key ? 'text-[#3d9392]' : 'text-[#a08070]'}`}>{item.icon}</span>
                    </div>
                    <span className={`flex-1 text-[12px] font-bold uppercase tracking-widest ${activeAccordion === item.key ? 'text-[#3d9392]' : 'text-[#1a2e2e]'}`}>{item.label}</span>
                    <span className={`material-symbols-outlined text-[18px] text-[#a08070] transition-transform ${activeAccordion === item.key ? 'rotate-45' : ''}`}>add</span>
                  </button>
                  {activeAccordion === item.key && (
                    <div className="px-5 pb-4 animate-fade-in">
                      <p className="text-[13px] text-[#6b5c52] leading-relaxed pl-11">{product[item.field]}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="bg-gradient-to-r from-[#3d9392]/8 to-[#cba55c]/8 border border-[#3d9392]/15 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#3d9392]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#3d9392] text-[20px]">support_agent</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-[#1a2e2e]">Need help choosing?</p>
                <p className="text-[11px] text-[#a08070]">Speak to our heritage consultants for bespoke advice.</p>
              </div>
              <Link to="/contact" className="text-[11px] font-bold text-[#3d9392] border border-[#3d9392]/30 px-3 py-1.5 rounded-lg hover:bg-[#3d9392]/5 transition-all flex-shrink-0">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

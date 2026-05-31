import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';


const CATEGORIES = [
  { name: 'Heritage Bridal', slug: 'heritage-bridal', icon: 'diamond', color: 'text-[#cba55c] bg-[#cba55c]/10' },
  { name: 'Festive Glamour', slug: 'festive-glamour', icon: 'celebration', color: 'text-[#d17b60] bg-[#d17b60]/10' },
  { name: 'Modern Minimalist', slug: 'modern-minimalist', icon: 'auto_awesome', color: 'text-[#3d9392] bg-[#3d9392]/10' },
];
const FABRICS = ['Silk', 'Georgette', 'Velvet', 'Cotton'];

export default function Collections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [addedId, setAddedId] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategories([cat]);
  }, [searchParams]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*, category:categories(slug)');
        setProducts((!error && data) ? data : []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];
    if (selectedCategories.length > 0) result = result.filter(p => p.category && selectedCategories.includes(p.category.slug));
    if (selectedFabrics.length > 0) result = result.filter(p => selectedFabrics.some(f => p.fabric.toLowerCase().includes(f.toLowerCase())));
    if (priceMin !== '') result = result.filter(p => p.price >= parseFloat(priceMin));
    if (priceMax !== '') result = result.filter(p => p.price <= parseFloat(priceMax));
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    setFilteredProducts(result);
  }, [products, selectedCategories, selectedFabrics, priceMin, priceMax, sortBy]);

  const toggleCategory = (slug) => setSelectedCategories(prev => prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]);
  const toggleFabric = (f) => setSelectedFabrics(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  const clearFilters = () => { setSelectedCategories([]); setSelectedFabrics([]); setPriceMin(''); setPriceMax(''); setSortBy('recommended'); };

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 'M', 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const activeFilterCount = selectedCategories.length + selectedFabrics.length + (priceMin ? 1 : 0) + (priceMax ? 1 : 0);

  return (
    <div className="pt-20 min-h-screen bg-[#faf7f4]">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-[#1a2e2e] to-[#0f1e1e] px-gutter py-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #cba55c 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <span className="text-[#cba55c] text-[11px] font-bold uppercase tracking-widest block mb-2">TVISHA Boutique</span>
        <h1 className="font-serif text-[40px] md:text-[52px] font-bold text-white leading-tight">The Collection</h1>
        <p className="text-white/50 text-[14px] mt-3 max-w-lg mx-auto">
          Intricately detailed Chaniya Cholis & Lehengas — handcrafted to carry forward India's heritage embroidery traditions.
        </p>
        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat.slug}
              onClick={() => toggleCategory(cat.slug)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-bold border transition-all ${
                selectedCategories.includes(cat.slug)
                  ? 'bg-[#3d9392] text-white border-[#3d9392] shadow-md'
                  : 'border-white/20 text-white/70 hover:border-white/50 hover:text-white backdrop-blur-sm'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-gutter pb-xl pt-6 flex flex-col md:flex-row gap-6 items-start">

        {/* ── Sidebar Filters ── */}
        <aside className="w-full md:w-60 flex-shrink-0 space-y-4 md:sticky md:top-24">
          <div className="bg-white rounded-2xl border border-[#ece5df] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[13px] font-bold text-[#1a2e2e] uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3d9392] text-[18px]">tune</span>
                Filters
              </h2>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-[11px] font-bold text-[#d17b60] hover:underline">
                  Clear all ({activeFilterCount})
                </button>
              )}
            </div>

            {/* Occasion */}
            <div className="mb-5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#a08070] mb-2.5">Occasion</h3>
              <div className="space-y-1.5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.slug}
                    onClick={() => toggleCategory(cat.slug)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] font-semibold transition-all ${
                      selectedCategories.includes(cat.slug)
                        ? 'bg-[#3d9392]/10 text-[#3d9392] border border-[#3d9392]/20'
                        : 'text-[#6b5c52] hover:bg-[#f7f3f0]'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[16px] ${selectedCategories.includes(cat.slug) ? 'text-[#3d9392]' : 'text-[#c0b0a5]'}`}>{cat.icon}</span>
                    {cat.name}
                    {selectedCategories.includes(cat.slug) && <span className="ml-auto material-symbols-outlined text-[14px] text-[#3d9392]">check</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric */}
            <div className="mb-5 pt-4 border-t border-[#f0e8e2]">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#a08070] mb-2.5">Fabric</h3>
              <div className="flex flex-wrap gap-1.5">
                {FABRICS.map(fabric => (
                  <button
                    key={fabric}
                    onClick={() => toggleFabric(fabric)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                      selectedFabrics.includes(fabric)
                        ? 'bg-[#cba55c] text-white border-[#cba55c]'
                        : 'bg-white border-[#ece5df] text-[#6b5c52] hover:border-[#cba55c]/50'
                    }`}
                  >
                    {fabric}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="pt-4 border-t border-[#f0e8e2]">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#a08070] mb-2.5">Price Range (₹)</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="Min"
                  className="w-full bg-[#f7f3f0] border border-[#ece5df] rounded-lg p-2 text-[12px] focus:border-[#3d9392] outline-none"
                />
                <span className="text-[#c0b0a5] font-bold">—</span>
                <input
                  type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="Max"
                  className="w-full bg-[#f7f3f0] border border-[#ece5df] rounded-lg p-2 text-[12px] focus:border-[#3d9392] outline-none"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* ── Product Grid ── */}
        <div className="flex-1 space-y-5">
          {/* Toolbar */}
          <div className="bg-white rounded-xl border border-[#ece5df] px-4 py-3 flex flex-wrap gap-3 items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#3d9392] text-[18px]">grid_view</span>
              <span className="text-[13px] font-semibold text-[#1a2e2e]">{filteredProducts.length} items</span>
              {activeFilterCount > 0 && (
                <span className="bg-[#3d9392] text-white rounded-full px-2 py-0.5 text-[10px] font-bold">{activeFilterCount} filters</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[#a08070]">Sort:</span>
              <select
                value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#f7f3f0] border border-[#ece5df] rounded-lg px-3 py-1.5 text-[12px] font-semibold text-[#1a2e2e] cursor-pointer outline-none focus:border-[#3d9392]"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map(slug => {
                const cat = CATEGORIES.find(c => c.slug === slug);
                return (
                  <span key={slug} className="flex items-center gap-1.5 bg-[#3d9392]/10 text-[#3d9392] border border-[#3d9392]/20 rounded-full px-3 py-1 text-[11px] font-bold">
                    {cat?.name || slug}
                    <button onClick={() => toggleCategory(slug)} className="hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined text-[12px]">close</span>
                    </button>
                  </span>
                );
              })}
              {selectedFabrics.map(f => (
                <span key={f} className="flex items-center gap-1.5 bg-[#cba55c]/10 text-[#cba55c] border border-[#cba55c]/20 rounded-full px-3 py-1 text-[11px] font-bold">
                  {f}
                  <button onClick={() => toggleFabric(f)} className="hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-[12px]">close</span>
                  </button>
                </span>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map(n => (
                <div key={n} className="animate-pulse space-y-3">
                  <div className="bg-[#f0e8e2] rounded-2xl aspect-[3/4]"></div>
                  <div className="h-4 bg-[#f0e8e2] rounded w-2/3 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-[#ece5df] space-y-4">
              <div className="w-14 h-14 bg-[#f7f3f0] rounded-full flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[#c0b0a5] text-[28px]">search_off</span>
              </div>
              <p className="text-[#6b5c52] font-semibold">No items match your filters.</p>
              <button onClick={clearFilters} className="text-[#3d9392] font-bold text-[13px] hover:underline">Clear all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-[#ece5df] overflow-hidden flex flex-col group relative hover:shadow-xl hover:border-[#cba55c]/30 transition-all duration-500"
                >
                  <Link to={`/product/${product.slug}`} className="aspect-[3/4] overflow-hidden block relative">
                    <img src={product.image_url} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {/* Quick add overlay */}
                    <div className="absolute bottom-3 inset-x-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-[12px] transition-all ${
                          addedId === product.id
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white/95 backdrop-blur-sm text-[#3d9392] hover:bg-[#3d9392] hover:text-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {addedId === product.id ? 'check' : 'shopping_bag'}
                        </span>
                        {addedId === product.id ? 'Added!' : 'Quick Add (M)'}
                      </button>
                    </div>
                  </Link>

                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#a08070] mb-1">{product.fabric}</p>
                    <Link to={`/product/${product.slug}`}>
                      <h3 className="font-serif text-[15px] font-bold text-[#1a2e2e] line-clamp-2 leading-snug hover:text-[#3d9392] transition-colors">{product.title}</h3>
                    </Link>
                    <p className="text-[11px] text-[#a08070] mt-1 line-clamp-1">{product.embroidery_type}</p>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#f7f3f0] mt-3">
                      <p className="text-[17px] font-bold text-[#3d9392]">₹{product.price.toLocaleString()}</p>
                      <Link
                        to={`/product/${product.slug}`}
                        className="text-[11px] font-bold text-[#a08070] hover:text-[#3d9392] transition-colors flex items-center gap-0.5"
                      >
                        View
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

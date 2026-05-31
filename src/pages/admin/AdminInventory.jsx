import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [fabric, setFabric] = useState('');
  const [embroidery, setEmbroidery] = useState('');
  const [image, setImage] = useState('');
  const [desc, setDesc] = useState('');
  const [catId, setCatId] = useState('');
  const [sizes, setSizes] = useState(['S', 'M', 'L']);

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*, category:categories(name, slug)').order('created_at', { ascending: false });
      if (!error && data) setProducts(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function fetchCategories() {
    try {
      const { data } = await supabase.from('categories').select('*');
      if (data) setCategories(data);
    } catch (err) { console.error(err); }
  }

  const handleOpenModal = (prod = null) => {
    if (prod) {
      setEditProduct(prod); setTitle(prod.title); setSlug(prod.slug); setPrice(prod.price);
      setStock(prod.stock); setFabric(prod.fabric); setEmbroidery(prod.embroidery_type);
      setImage(prod.image_url); setDesc(prod.description || ''); setCatId(prod.category_id || '');
      setSizes(prod.sizes || ['S', 'M', 'L']);
    } else {
      setEditProduct(null); setTitle(''); setSlug(''); setPrice(''); setStock(''); setFabric('');
      setEmbroidery(''); setImage(''); setDesc(''); setCatId(categories[0]?.id || ''); setSizes(['S', 'M', 'L']);
    }
    setIsOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = { title, slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), price: parseFloat(price), stock: parseInt(stock), fabric, embroidery_type: embroidery, image_url: image, description: desc, category_id: catId || null, sizes };
    try {
      if (editProduct) {
        const { error } = await supabase.from('products').update(payload).eq('id', editProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
      }
      setIsOpen(false); fetchProducts();
    } catch (err) { alert(`Error saving product: ${err.message}`); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      fetchProducts();
    } catch (err) { alert(`Error deleting product: ${err.message}`); }
  };

  const toggleSize = (size) => setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.category?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = products.reduce((s, p) => s + (p.price * p.stock), 0);
  const lowStockCount = products.filter(p => p.stock <= 5).length;

  return (
    <div className="p-6 pb-12 space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-6 bg-gradient-to-b from-[#cba55c] to-[#d17b60] rounded-full"></div>
            <h1 className="font-serif text-[28px] font-bold text-[#1a2e2e] leading-none">Couture Inventory</h1>
          </div>
          <p className="text-[13px] text-[#a08070] ml-3">Configure products, manage stock levels, and curate your catalog.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#3d9392] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#2d7574] shadow-sm hover:shadow-md transition-all text-[13px]"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add New Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Products', value: products.length, icon: 'inventory_2', color: 'text-[#3d9392]', bg: 'bg-[#3d9392]/10' },
          { label: 'Catalog Value', value: `₹${(totalValue / 100000).toFixed(1)}L`, icon: 'paid', color: 'text-[#cba55c]', bg: 'bg-[#cba55c]/10' },
          { label: 'Categories', value: categories.length || 4, icon: 'category', color: 'text-[#d17b60]', bg: 'bg-[#d17b60]/10' },
          { label: 'Low Stock', value: lowStockCount, icon: 'warning', color: lowStockCount > 0 ? 'text-red-500' : 'text-emerald-500', bg: lowStockCount > 0 ? 'bg-red-50' : 'bg-emerald-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-[#ece5df] p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-all">
            <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center`}>
              <span className={`material-symbols-outlined text-[20px] ${s.color}`}>{s.icon}</span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#a08070]">{s.label}</p>
              <p className="text-[18px] font-bold text-[#1a2e2e]">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#c0b0a5] text-[18px]">search</span>
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products or categories..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#ece5df] rounded-xl text-[13px] outline-none focus:border-[#3d9392] focus:ring-1 focus:ring-[#3d9392]/20 shadow-sm"
        />
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#ece5df]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d9392] mx-auto"></div>
          <p className="text-[#a08070] pt-3 text-[13px]">Loading catalog...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#ece5df]">
          <div className="w-14 h-14 bg-[#f7f3f0] rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-[#c0b0a5] text-[28px]">inventory_2</span>
          </div>
          <p className="text-[#6b5c52] font-semibold text-[13px]">
            {search ? 'No products match your search.' : 'Your inventory is empty. Add a product to get started.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#ece5df] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f7f3f0] border-b border-[#ece5df]">
                {['Couture Item', 'Category', 'Price', 'Stock', 'Fabric / Craft', 'Sizes', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#a08070]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-[#f7f3f0] hover:bg-[#f7f3f0] transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={p.image_url} alt={p.title} className="w-10 h-12 object-cover rounded-lg border border-[#ece5df]" />
                        {p.stock === 0 && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold text-[#1a2e2e]">{p.title}</p>
                        <p className="text-[10px] text-[#a08070]">/{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-[#f7f3f0] text-[#6b5c52] px-2 py-0.5 rounded-lg text-[11px] font-semibold">
                      {p.category?.name || 'Unassigned'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-bold text-[#3d9392]">₹{p.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1 text-[12px] font-bold ${p.stock === 0 ? 'text-red-500' : p.stock <= 5 ? 'text-amber-500' : 'text-emerald-600'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.stock === 0 ? 'bg-red-400' : p.stock <= 5 ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[11px] text-[#6b5c52]">{p.fabric}</p>
                    <p className="text-[10px] text-[#a08070]">{p.embroidery_type}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {(p.sizes || []).map(s => (
                        <span key={s} className="bg-[#3d9392]/10 text-[#3d9392] rounded px-1.5 py-0.5 text-[9px] font-bold">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(p)} className="w-8 h-8 rounded-lg bg-[#3d9392]/10 text-[#3d9392] hover:bg-[#3d9392]/20 flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="bg-white rounded-2xl border border-[#ece5df] w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden animate-fade-in">
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#f0e8e2] bg-[#f7f3f0]">
              <div>
                <h2 className="font-serif text-[18px] font-bold text-[#1a2e2e]">
                  {editProduct ? 'Edit Couture Item' : 'Add New Couture Item'}
                </h2>
                <p className="text-[11px] text-[#a08070]">{editProduct ? 'Modify product details and save changes.' : 'Fill in the details to add a new product to your catalog.'}</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg bg-[#ece5df] text-[#6b5c52] hover:bg-[#e0d5cc] flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 max-h-[70vh] overflow-y-auto">
              {[
                { label: 'Product Title', val: title, set: setTitle, ph: 'e.g. Rajkumari Crimson Lehenga', req: true },
                { label: 'URL Slug', val: slug, set: setSlug, ph: 'e.g. rajkumari-crimson-lehenga' },
                { label: 'Price (₹)', val: price, set: setPrice, ph: 'e.g. 85000', type: 'number', req: true },
                { label: 'Stock Quantity', val: stock, set: setStock, ph: 'e.g. 10', type: 'number', req: true },
                { label: 'Fabric Type', val: fabric, set: setFabric, ph: 'e.g. Mulberry Raw Silk', req: true },
              ].map(({ label, val, set, ph, type, req }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-[#a08070]">{label}</label>
                  <input type={type || 'text'} value={val} onChange={(e) => set(e.target.value)} required={req} placeholder={ph}
                    className="border border-[#ece5df] rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-[#3d9392] focus:ring-1 focus:ring-[#3d9392]/20 bg-[#f7f3f0]"
                  />
                </div>
              ))}

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[#a08070]">Category</label>
                <select value={catId} onChange={(e) => setCatId(e.target.value)}
                  className="border border-[#ece5df] rounded-xl px-3 py-2.5 text-[13px] outline-none cursor-pointer bg-[#f7f3f0] focus:border-[#3d9392]"
                >
                  <option value="">Unassigned</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[#a08070]">Embroidery Work</label>
                <input type="text" value={embroidery} onChange={(e) => setEmbroidery(e.target.value)} required placeholder="e.g. Handcrafted Zardozi & Mirror Work"
                  className="border border-[#ece5df] rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-[#3d9392] focus:ring-1 focus:ring-[#3d9392]/20 bg-[#f7f3f0]"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[#a08070]">Image URL</label>
                <input type="url" value={image} onChange={(e) => setImage(e.target.value)} required placeholder="https://example.com/image.jpg"
                  className="border border-[#ece5df] rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-[#3d9392] focus:ring-1 focus:ring-[#3d9392]/20 bg-[#f7f3f0]"
                />
                {image && <img src={image} alt="preview" className="w-16 h-20 object-cover rounded-lg border border-[#ece5df] mt-1" onError={(e) => e.target.style.display='none'} />}
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[#a08070]">Product Description</label>
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Write the story and details of this couture item..."
                  className="border border-[#ece5df] rounded-xl px-3 py-2.5 text-[13px] outline-none focus:border-[#3d9392] bg-[#f7f3f0] h-20 resize-none"
                ></textarea>
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[#a08070]">Available Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                    <button key={size} type="button" onClick={() => toggleSize(size)}
                      className={`w-10 h-10 rounded-xl border-2 font-bold text-[12px] transition-all ${
                        sizes.includes(size) ? 'bg-[#3d9392] border-[#3d9392] text-white shadow-sm' : 'bg-white border-[#ece5df] text-[#6b5c52] hover:border-[#3d9392]/50'
                      }`}
                    >{size}</button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 pt-2 border-t border-[#f0e8e2] flex justify-end gap-3">
                <button type="button" onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 border border-[#ece5df] text-[#6b5c52] rounded-xl text-[13px] font-semibold hover:border-[#3d9392] hover:text-[#3d9392] transition-colors"
                >
                  Cancel
                </button>
                <button type="submit"
                  className="px-6 py-2.5 bg-[#3d9392] text-white rounded-xl text-[13px] font-semibold hover:bg-[#2d7574] shadow-sm transition-all"
                >
                  {editProduct ? 'Save Changes' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

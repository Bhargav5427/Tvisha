import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

const STATUS_CONFIG = {
  Pending:    { bg: 'bg-amber-50',  text: 'text-amber-600',  border: 'border-amber-200',  icon: 'hourglass_empty', dot: 'bg-amber-400' },
  Processing: { bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-200',   icon: 'autorenew',       dot: 'bg-blue-400' },
  Shipped:    { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200', icon: 'local_shipping',  dot: 'bg-violet-400' },
  Delivered:  { bg: 'bg-emerald-50',text: 'text-emerald-600',border: 'border-emerald-200',icon: 'check_circle',    dot: 'bg-emerald-400' },
  Cancelled:  { bg: 'bg-gray-100',  text: 'text-gray-500',   border: 'border-gray-200',   icon: 'cancel',          dot: 'bg-gray-400' },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`*, order_items(id, quantity, size, price, product:products(title, image_url))`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const filteredOrders = orders.filter(order => {
    const q = search.toLowerCase();
    return (
      order.customer_name.toLowerCase().includes(q) ||
      order.customer_email.toLowerCase().includes(q) ||
      order.id.toLowerCase().includes(q)
    ) && (statusFilter === 'All' || order.status === statusFilter);
  });

  const orderCounts = Object.keys(STATUS_CONFIG).reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {});

  return (
    <div className="p-6 pb-12 space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-6 bg-gradient-to-b from-[#d17b60] to-[#cba55c] rounded-full"></div>
            <h1 className="font-serif text-[28px] font-bold text-[#1a2e2e] leading-none">Order Queue</h1>
          </div>
          <p className="text-[13px] text-[#a08070] ml-3">Review boutique transactions and manage dispatch states.</p>
        </div>
        <div className="bg-white rounded-xl border border-[#ece5df] px-4 py-2 text-[12px] font-semibold text-[#6b5c52] shadow-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[#3d9392] text-[16px]">shopping_bag</span>
          {orders.length} total orders
        </div>
      </div>

      {/* Status summary chips */}
      <div className="flex flex-wrap gap-2">
        {['All', ...Object.keys(STATUS_CONFIG)].map(s => {
          const cfg = STATUS_CONFIG[s];
          const count = s === 'All' ? orders.length : orderCounts[s];
          const active = statusFilter === s;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                active
                  ? 'bg-[#1a2e2e] text-white border-[#1a2e2e] shadow-sm'
                  : `bg-white ${cfg?.text || 'text-[#6b5c52]'} border-[#ece5df] hover:border-[#3d9392]/30`
              }`}
            >
              {cfg && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>}
              {s}
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${active ? 'bg-white/20' : 'bg-[#f0e8e2]'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#c0b0a5] text-[18px]">search</span>
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, client name, or email..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#ece5df] rounded-xl text-[13px] outline-none focus:border-[#3d9392] focus:ring-1 focus:ring-[#3d9392]/20 shadow-sm"
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Orders Table */}
        <div className={`bg-white rounded-2xl border border-[#ece5df] shadow-sm overflow-hidden ${selectedOrder ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d9392] mx-auto"></div>
              <p className="text-[#a08070] pt-3 text-[13px]">Fetching orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 bg-[#f7f3f0] rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-[#c0b0a5] text-[28px]">shopping_bag</span>
              </div>
              <p className="text-[#6b5c52] font-semibold text-[13px]">No orders match your filter.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f7f3f0] border-b border-[#ece5df]">
                  {['Order ID', 'Client', 'Date', 'Total', 'Status', 'Update'].map(h => (
                    <th key={h} className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#a08070] ${h === 'Update' ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, idx) => {
                  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Cancelled;
                  const isSelected = selectedOrder?.id === order.id;
                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(isSelected ? null : order)}
                      className={`border-b border-[#f7f3f0] cursor-pointer transition-all ${isSelected ? 'bg-[#3d9392]/5' : 'hover:bg-[#f7f3f0]'}`}
                    >
                      <td className="px-4 py-3">
                        <span className="text-[12px] font-bold text-[#3d9392]">
                          {order.id.length > 8 ? `#TV-${order.id.slice(0, 8).toUpperCase()}` : `#TV-${order.id}`}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#3d9392]/10 text-[#3d9392] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                            {order.customer_name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[12px] font-semibold text-[#1a2e2e]">{order.customer_name}</p>
                            <p className="text-[10px] text-[#a08070]">{order.customer_email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#a08070]">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 text-[13px] font-bold text-[#1a2e2e]">
                        ₹{parseFloat(order.total_amount).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border w-fit ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className="bg-white border border-[#ece5df] rounded-lg py-1 px-2 text-[11px] outline-none cursor-pointer hover:border-[#3d9392] transition-colors"
                        >
                          {Object.keys(STATUS_CONFIG).map(s => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Order Detail Panel */}
        {selectedOrder && (() => {
          const cfg = STATUS_CONFIG[selectedOrder.status] || STATUS_CONFIG.Cancelled;
          return (
            <div className="bg-white rounded-2xl border border-[#ece5df] shadow-sm overflow-hidden animate-fade-in lg:col-span-1">
              <div className={`px-5 py-4 border-b border-[#f0e8e2] flex items-start justify-between ${cfg.bg}`}>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#a08070] mb-0.5">Order Details</p>
                  <h3 className="font-serif text-[16px] font-bold text-[#1a2e2e]">
                    {selectedOrder.id.length > 8 ? `#TV-${selectedOrder.id.slice(0, 8).toUpperCase()}` : `#TV-${selectedOrder.id}`}
                  </h3>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-[#a08070] hover:text-[#1a2e2e] transition-colors p-1">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-[#f7f3f0] rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-[#3d9392]/10 text-[#3d9392] flex items-center justify-center font-bold text-[11px]">
                    {selectedOrder.customer_name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1a2e2e]">{selectedOrder.customer_name}</p>
                    <p className="text-[11px] text-[#a08070]">{selectedOrder.customer_email}</p>
                    <p className="text-[11px] text-[#a08070]">{selectedOrder.customer_phone || 'No phone'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#a08070] mb-1.5">Shipping Address</p>
                  <p className="text-[12px] text-[#6b5c52] leading-relaxed">
                    {selectedOrder.shipping_address}<br />
                    {selectedOrder.city} — {selectedOrder.postal_code}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#a08070] mb-2 pb-1 border-b border-[#f0e8e2]">Ordered Garments</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedOrder.order_items?.map((item) => (
                      <div key={item.id} className="flex gap-2.5 items-center">
                        <img src={item.product?.image_url} alt={item.product?.title} className="w-10 h-12 object-cover rounded-lg border border-[#ece5df] flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-[#1a2e2e] truncate">{item.product?.title}</p>
                          <p className="text-[10px] text-[#a08070]">Size <span className="text-[#3d9392] font-bold">{item.size}</span> × {item.quantity}</p>
                        </div>
                        <p className="text-[12px] font-bold text-[#1a2e2e]">₹{parseFloat(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-b border-[#f0e8e2]">
                  <span className="text-[13px] font-semibold text-[#1a2e2e]">Total Amount</span>
                  <span className="text-[18px] font-bold text-[#3d9392]">₹{parseFloat(selectedOrder.total_amount).toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/${selectedOrder.customer_phone?.replace(/[^0-9]/g, '')}`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 border border-[#ece5df] rounded-xl text-[12px] font-semibold text-[#6b5c52] hover:border-[#3d9392] hover:text-[#3d9392] transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    WhatsApp
                  </a>
                  <a
                    href={`mailto:${selectedOrder.customer_email}?subject=TVISHA Order Update`}
                    className="flex items-center justify-center gap-1.5 py-2.5 border border-[#ece5df] rounded-xl text-[12px] font-semibold text-[#6b5c52] hover:border-[#3d9392] hover:text-[#3d9392] transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">mail</span>
                    Email
                  </a>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#a08070] mb-2">Update Status</p>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                    className="w-full bg-[#f7f3f0] border border-[#ece5df] rounded-xl py-2.5 px-3 text-[13px] font-semibold outline-none cursor-pointer hover:border-[#3d9392] transition-colors"
                  >
                    {Object.keys(STATUS_CONFIG).map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';


const STATUS_CONFIG = {
  Pending:    { color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200',  icon: 'hourglass_empty', step: 1 },
  Processing: { color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   icon: 'autorenew',       step: 2 },
  Shipped:    { color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200', icon: 'local_shipping',  step: 3 },
  Delivered:  { color: 'text-emerald-600',bg: 'bg-emerald-50',border: 'border-emerald-200',icon: 'check_circle',    step: 4 },
  Cancelled:  { color: 'text-gray-500',   bg: 'bg-gray-100',  border: 'border-gray-200',   icon: 'cancel',          step: 0 },
};

const ORDER_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

export default function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    async function fetchUserOrders() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_email', user.email)
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          const formatted = data.map(o => ({
            id: o.id.length > 8 ? `TV-${o.id.slice(0, 8).toUpperCase()}` : `TV-${o.id}`,
            rawId: o.id,
            date: new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            item: 'Couture Commission',
            status: o.status || 'Pending',
            total: parseFloat(o.total_amount),
            image: '',
          }));
          setOrders(formatted);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.warn('Error fetching orders:', err.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUserOrders();
  }, [user]);

  const filteredOrders = orders.filter(o => {
    const q = searchQuery.toLowerCase();
    const matchQ = o.id.toLowerCase().includes(q) || o.item.toLowerCase().includes(q) || o.status.toLowerCase().includes(q);
    const matchS = statusFilter === 'All' || o.status === statusFilter;
    return matchQ && matchS;
  });

  const activeCount = orders.filter(o => ['Pending', 'Processing', 'Shipped'].includes(o.status)).length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const totalSpend = orders.reduce((s, o) => s + o.total, 0);

  const getInitials = () => user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'TV';

  return (
    <div className="pt-28 pb-xl bg-[#faf7f5] min-h-screen">
      {/* Hero Profile Banner */}
      <div className="bg-gradient-to-r from-[#1a2e2e] via-[#2a4a4a] to-[#1a2e2e] px-gutter py-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-1/4 w-64 h-64 rounded-full bg-[#cba55c] blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-[#3d9392] blur-3xl"></div>
        </div>
        <div className="max-w-container-max mx-auto w-full relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-lg">
            <div className="flex items-center gap-md">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3d9392] to-[#2a6e6d] flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                {getInitials()}
              </div>
              <div>
                <p className="text-[#cba55c] text-[11px] font-bold uppercase tracking-widest mb-1">Client Atelier</p>
                <h1 className="font-serif text-[28px] font-bold text-white leading-tight">
                  Welcome back, {user?.name?.split(' ')[0] || 'Valued Client'}
                </h1>
                <p className="text-white/60 text-[13px] mt-0.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">mail</span>
                  {user?.email || 'Your TVISHA account'}
                </p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link
                to="/collections"
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-[12px] font-semibold transition-all backdrop-blur-sm"
              >
                <span className="material-symbols-outlined text-[16px]">storefront</span>
                Browse Boutique
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-2 px-4 py-2.5 bg-[#cba55c] hover:bg-[#b8924a] text-white rounded-xl text-[12px] font-semibold transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">support_agent</span>
                Concierge
              </Link>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-lg">
            {[
              { label: 'Active Orders', value: activeCount, icon: 'local_shipping', color: 'text-[#cba55c]' },
              { label: 'Pieces Acquired', value: deliveredCount || 5, icon: 'checkroom', color: 'text-[#3d9392]' },
              { label: 'Total Invested', value: `₹${(totalSpend / 100000).toFixed(1)}L`, icon: 'payments', color: 'text-white' },
            ].map(s => (
              <div key={s.label} className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
                <span className={`material-symbols-outlined text-[22px] ${s.color} mb-1`}>{s.icon}</span>
                <p className="text-white font-bold text-[22px] leading-none">{s.value}</p>
                <p className="text-white/50 text-[10px] font-semibold uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-gutter w-full mt-lg space-y-md">

        {/* VIP Membership Card */}
        <div className="bg-gradient-to-r from-[#cba55c]/15 via-[#f7f0e5] to-[#cba55c]/10 border border-[#cba55c]/30 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#cba55c] to-[#b8924a] flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="material-symbols-outlined text-white text-[22px]">workspace_premium</span>
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-[#8a6a20]">
              {totalSpend >= 100000 ? 'VIP Gold Member' : totalSpend >= 50000 ? 'VIP Silver Member' : 'TVISHA Member'}
            </p>
            <p className="text-[11px] text-[#a08030] mt-0.5">
              {totalSpend >= 100000
                ? 'Exclusive priority service, bespoke consultations & heritage previews.'
                : `Spend ₹${Math.max(0, 50000 - totalSpend).toLocaleString()} more to unlock VIP Silver benefits.`}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[11px] font-bold text-[#a08030] uppercase tracking-wider">Lifetime Value</p>
            <p className="text-[18px] font-bold text-[#8a6a20]">₹{totalSpend.toLocaleString()}</p>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-2xl border border-[#ece5df] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f0e8e2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f9f5f2]">
            <div>
              <h2 className="font-serif text-[18px] font-bold text-[#1a2e2e]">Order History</h2>
              <p className="text-[11px] text-[#a08070]">{orders.length} total orders placed with TVISHA</p>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#c0b0a5] text-[16px]">search</span>
                <input
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search orders..."
                  className="pl-8 pr-3 py-2 bg-white border border-[#ece5df] rounded-xl text-[12px] outline-none focus:border-[#3d9392] w-44"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-[#ece5df] rounded-xl px-3 py-2 text-[12px] outline-none cursor-pointer focus:border-[#3d9392]"
              >
                <option value="All">All Status</option>
                {Object.keys(STATUS_CONFIG).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d9392] mx-auto"></div>
              <p className="text-[#a08070] text-[13px] mt-3">Loading your orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 bg-[#f7f3f0] rounded-full flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[#d5ccc6] text-[28px]">receipt_long</span>
              </div>
              <p className="text-[#6b5c52] font-semibold">No orders found</p>
              <p className="text-[#a08070] text-[12px]">
                {searchQuery ? 'Try a different search term.' : 'You haven\'t placed any orders yet.'}
              </p>
              {!searchQuery && (
                <Link to="/collections" className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 bg-[#3d9392] text-white rounded-xl text-[13px] font-semibold hover:bg-[#2d7574] transition-all">
                  <span className="material-symbols-outlined text-[16px]">storefront</span>
                  Shop Collections
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-[#f7f3f0]">
              {filteredOrders.map((order, idx) => {
                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
                const isSelected = selectedOrder === order.id;
                return (
                  <div key={`${order.id}-${idx}`}>
                    {/* Order Row */}
                    <div
                      onClick={() => setSelectedOrder(isSelected ? null : order.id)}
                      className={`px-5 py-4 cursor-pointer transition-all hover:bg-[#f9f5f2] ${isSelected ? 'bg-[#f9f5f2]' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Product Thumb */}
                        <div className="flex-shrink-0 w-14 h-16 rounded-xl overflow-hidden border border-[#ece5df] bg-[#f7f3f0]">
                          {order.image ? (
                            <img src={order.image} alt={order.item} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="font-serif text-[14px] font-bold text-[#3d9392]">TV</span>
                            </div>
                          )}
                        </div>

                        {/* Order Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div>
                              <p className="text-[13px] font-bold text-[#3d9392] font-mono">{order.id}</p>
                              <p className="text-[12px] font-semibold text-[#1a2e2e] truncate">{order.item}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-[14px] font-bold text-[#1a2e2e]">₹{order.total.toLocaleString()}</p>
                              <p className="text-[10px] text-[#a08070]">{order.date}</p>
                            </div>
                          </div>

                          {/* Status + Progress */}
                          <div className="flex items-center gap-3 mt-2">
                            <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                              <span className="material-symbols-outlined text-[11px]">{cfg.icon}</span>
                              {order.status}
                            </span>

                            {order.status !== 'Cancelled' && (
                              <div className="flex items-center gap-1 flex-1 max-w-48">
                                {ORDER_STEPS.map((step, i) => {
                                  const stepDone = cfg.step > i;
                                  const stepActive = cfg.step === i + 1;
                                  return (
                                    <React.Fragment key={step}>
                                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                                        stepDone ? 'bg-[#3d9392]' : stepActive ? 'bg-[#3d9392]/30 ring-2 ring-[#3d9392]' : 'bg-[#e8ddd5]'
                                      }`}>
                                        {stepDone && <span className="material-symbols-outlined text-white text-[9px]">check</span>}
                                      </div>
                                      {i < ORDER_STEPS.length - 1 && (
                                        <div className={`flex-1 h-0.5 rounded-full ${stepDone ? 'bg-[#3d9392]' : 'bg-[#e8ddd5]'}`}></div>
                                      )}
                                    </React.Fragment>
                                  );
                                })}
                              </div>
                            )}

                            <span className="ml-auto text-[#a08070]">
                              <span className={`material-symbols-outlined text-[18px] transition-transform ${isSelected ? 'rotate-180' : ''}`}>expand_more</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Detail */}
                    {isSelected && (
                      <div className="px-5 pb-5 bg-[#f9f5f2] border-t border-[#f0e8e2] animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                          {/* Order Steps */}
                          <div className="md:col-span-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#a08070] mb-3">Order Journey</p>
                            <div className="space-y-3">
                              {ORDER_STEPS.map((step, i) => {
                                const done = cfg.step > i;
                                const active = cfg.step === i + 1;
                                const stepCfg = STATUS_CONFIG[step];
                                return (
                                  <div key={step} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                    done ? 'bg-[#3d9392]/5 border-[#3d9392]/20' : active ? 'bg-white border-[#3d9392]/30 shadow-sm' : 'bg-white/50 border-[#ece5df]'
                                  }`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                      done ? 'bg-[#3d9392] text-white' : active ? 'bg-[#3d9392]/10 text-[#3d9392]' : 'bg-[#f0e8e2] text-[#c0b0a5]'
                                    }`}>
                                      <span className="material-symbols-outlined text-[16px]">
                                        {done ? 'check' : stepCfg?.icon || 'circle'}
                                      </span>
                                    </div>
                                    <div>
                                      <p className={`text-[12px] font-bold ${done || active ? 'text-[#1a2e2e]' : 'text-[#c0b0a5]'}`}>{step}</p>
                                      <p className="text-[10px] text-[#a08070]">
                                        {done ? 'Completed' : active ? 'Currently in this stage' : 'Awaiting previous stage'}
                                      </p>
                                    </div>
                                    {active && <span className="ml-auto text-[9px] font-bold text-[#3d9392] bg-[#3d9392]/10 px-2 py-0.5 rounded-full">Current</span>}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="space-y-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#a08070] mb-3">Quick Actions</p>
                            <button
                              onClick={() => navigate('/contact')}
                              className="w-full flex items-center gap-2 px-4 py-3 bg-white border border-[#ece5df] rounded-xl text-[12px] font-semibold text-[#6b5c52] hover:border-[#3d9392] hover:text-[#3d9392] transition-all"
                            >
                              <span className="material-symbols-outlined text-[18px]">support_agent</span>
                              Contact Concierge
                            </button>
                            <button
                              onClick={() => navigate('/contact')}
                              className="w-full flex items-center gap-2 px-4 py-3 bg-white border border-[#ece5df] rounded-xl text-[12px] font-semibold text-[#6b5c52] hover:border-[#3d9392] hover:text-[#3d9392] transition-all"
                            >
                              <span className="material-symbols-outlined text-[18px]">help</span>
                              Order Inquiry
                            </button>
                            <Link
                              to="/collections"
                              className="w-full flex items-center gap-2 px-4 py-3 bg-[#3d9392]/8 border border-[#3d9392]/20 rounded-xl text-[12px] font-semibold text-[#3d9392] hover:bg-[#3d9392]/15 transition-all"
                            >
                              <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                              Shop More
                            </Link>

                            <div className="bg-white border border-[#ece5df] rounded-xl p-3 space-y-1.5">
                              <p className="text-[9px] font-bold uppercase tracking-widest text-[#a08070]">Order Summary</p>
                              <div className="flex justify-between text-[11px]">
                                <span className="text-[#a08070]">Reference</span>
                                <span className="font-bold text-[#3d9392] font-mono text-[10px]">{order.id}</span>
                              </div>
                              <div className="flex justify-between text-[11px]">
                                <span className="text-[#a08070]">Placed</span>
                                <span className="font-semibold text-[#6b5c52]">{order.date}</span>
                              </div>
                              <div className="flex justify-between text-[11px] pt-1.5 border-t border-[#f0e8e2]">
                                <span className="text-[#a08070] font-semibold">Total</span>
                                <span className="font-bold text-[#1a2e2e]">₹{order.total.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Help Banner */}
        <div className="bg-gradient-to-r from-[#3d9392]/10 to-[#cba55c]/10 border border-[#3d9392]/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-12 h-12 bg-[#3d9392]/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[#3d9392] text-[24px]">contact_support</span>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-[14px] font-bold text-[#1a2e2e]">Need help with an order?</p>
            <p className="text-[12px] text-[#a08070] mt-0.5">Our concierge team is available Mon–Sat, 10am–7pm IST.</p>
          </div>
          <Link
            to="/contact"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#3d9392] text-white rounded-xl text-[12px] font-semibold hover:bg-[#2d7574] transition-all shadow-sm flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}

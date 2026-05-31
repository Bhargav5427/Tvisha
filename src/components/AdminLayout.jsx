import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openTickets, setOpenTickets] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    async function fetchBadges() {
      try {
        const [{ data: tickets }, { data: orders }] = await Promise.all([
          supabase.from('support_tickets').select('id').eq('status', 'Open'),
          supabase.from('orders').select('id').eq('status', 'Pending'),
        ]);
        if (tickets) setOpenTickets(tickets.length);
        if (orders) setPendingOrders(orders.length);
      } catch (_) {}
    }
    fetchBadges();
    const tick = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(tick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', end: true, icon: 'dashboard', label: 'Overview', badge: 0 },
    { to: '/admin/inventory', icon: 'inventory_2', label: 'Inventory', badge: 0 },
    { to: '/admin/orders', icon: 'shopping_bag', label: 'Orders', badge: pendingOrders },
    { to: '/admin/users', icon: 'mark_email_unread', label: 'Support Inbox', badge: openTickets },
  ];

  return (
    <div className="min-h-screen flex bg-[#f7f3f0]">
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-[#e8ddd5] flex flex-col z-40 shadow-sm">
        <div className="px-5 pt-6 pb-5 border-b border-[#f0e8e2]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#3d9392] to-[#2a6e6d] flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-white text-[18px]">diamond</span>
            </div>
            <div>
              <h1 className="text-[15px] font-bold text-[#1a2e2e] tracking-tight font-serif">TVISHA</h1>
              <p className="text-[9px] uppercase font-bold tracking-widest text-[#3d9392]">Admin Studio</p>
            </div>
          </div>
          <div className="bg-[#f7f3f0] rounded-lg px-3 py-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#cba55c] text-[14px]">schedule</span>
            <span className="text-[11px] font-semibold text-[#6b5c52]">
              {currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })}
            </span>
            <span className="ml-auto text-[11px] text-[#a08070] font-medium">
              {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1 px-3 pt-4 pb-2 overflow-y-auto">
          <p className="text-[9px] uppercase font-bold tracking-widest text-[#b0a098] px-2 mb-2">Navigation</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-[#3d9392]/12 to-[#3d9392]/5 text-[#3d9392] shadow-sm border border-[#3d9392]/15'
                    : 'text-[#6b5c52] hover:bg-[#f7f3f0] hover:text-[#3d9392]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`material-symbols-outlined text-[20px] transition-all ${isActive ? 'text-[#3d9392]' : 'text-[#b0a098] group-hover:text-[#3d9392]'}`}>
                    {item.icon}
                  </span>
                  <span className="text-[13px] font-semibold flex-1">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="bg-[#d17b60] text-white rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#3d9392] rounded-r-full"></span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mx-3 mb-2 p-3 bg-gradient-to-br from-[#3d9392]/8 to-[#cba55c]/8 rounded-xl border border-[#3d9392]/12">
          <p className="text-[9px] uppercase tracking-widest font-bold text-[#3d9392] mb-1.5">Quick Stats</p>
          <div className="flex justify-between">
            <div className="text-center">
              <p className="text-[16px] font-bold text-[#3d9392]">{pendingOrders}</p>
              <p className="text-[9px] text-[#8a7060] font-medium">Pending</p>
            </div>
            <div className="w-px bg-[#e8ddd5]"></div>
            <div className="text-center">
              <p className="text-[16px] font-bold text-[#d17b60]">{openTickets}</p>
              <p className="text-[9px] text-[#8a7060] font-medium">Open Tickets</p>
            </div>
            <div className="w-px bg-[#e8ddd5]"></div>
            <div className="text-center">
              <p className="text-[16px] font-bold text-[#cba55c]">Live</p>
              <p className="text-[9px] text-[#8a7060] font-medium">Status</p>
            </div>
          </div>
        </div>

        <div className="px-3 pb-4 pt-2 border-t border-[#f0e8e2]">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3d9392]/20 to-[#3d9392]/10 text-[#3d9392] flex items-center justify-center font-bold text-[11px] ring-1 ring-[#3d9392]/20">
              {user ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AD'}
            </div>
            <div className="truncate">
              <p className="text-[12px] font-bold text-[#1a2e2e] leading-none">{user?.name || 'Admin User'}</p>
              <p className="text-[10px] text-[#a08070] leading-none mt-0.5 truncate">{user?.email || 'admin@tvisha.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#c0483a] hover:bg-red-50 transition-all text-[12px] font-semibold group"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="ml-64 flex-1 flex flex-col bg-[#f7f3f0] min-h-screen">
        {children || <Outlet />}
      </main>
    </div>
  );
}

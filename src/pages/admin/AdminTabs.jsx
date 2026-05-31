import React from 'react';
import { NavLink } from 'react-router-dom';

export default function AdminTabs() {
  return (
    <div className="flex flex-wrap gap-2 border-b border-outline-variant/30 pb-sm mb-lg">
      <NavLink 
        to="/admin" 
        end
        className={({ isActive }) => 
          `px-md py-2 text-body-sm font-semibold tracking-wide uppercase border-b-2 transition-all ${
            isActive 
              ? 'border-primary text-primary font-bold' 
              : 'border-transparent text-on-surface-variant hover:text-primary hover:border-primary/50'
          }`
        }
      >
        Overview
      </NavLink>
      <NavLink 
        to="/admin/inventory" 
        className={({ isActive }) => 
          `px-md py-2 text-body-sm font-semibold tracking-wide uppercase border-b-2 transition-all ${
            isActive 
              ? 'border-primary text-primary font-bold' 
              : 'border-transparent text-on-surface-variant hover:text-primary hover:border-primary/50'
          }`
        }
      >
        Inventory
      </NavLink>
      <NavLink 
        to="/admin/orders" 
        className={({ isActive }) => 
          `px-md py-2 text-body-sm font-semibold tracking-wide uppercase border-b-2 transition-all ${
            isActive 
              ? 'border-primary text-primary font-bold' 
              : 'border-transparent text-on-surface-variant hover:text-primary hover:border-primary/50'
          }`
        }
      >
        Orders
      </NavLink>
      <NavLink 
        to="/admin/users" 
        className={({ isActive }) => 
          `px-md py-2 text-body-sm font-semibold tracking-wide uppercase border-b-2 transition-all ${
            isActive 
              ? 'border-primary text-primary font-bold' 
              : 'border-transparent text-on-surface-variant hover:text-primary hover:border-primary/50'
          }`
        }
      >
        Support Tickets
      </NavLink>
    </div>
  );
}

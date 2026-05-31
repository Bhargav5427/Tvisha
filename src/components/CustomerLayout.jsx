import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function CustomerLayout() {
  return (
    <div className="flex flex-col min-h-screen gold-gradient-bg text-on-background font-body-md selection:bg-primary/10 selection:text-primary">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

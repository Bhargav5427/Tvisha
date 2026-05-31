import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container-highest dark:bg-surface-container-low w-full py-xl border-t border-outline-variant/30 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center px-lg md:px-xl w-full max-w-container-max mx-auto gap-lg md:gap-0">
        {/* Footer Logo & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-sm">
          <Link to="/" className="font-serif text-headline-md text-primary font-bold tracking-tight">TVISHA</Link>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            © 2026 TVISHA Luxury Ethnic Wear. All Rights Reserved.
          </span>
        </div>
        {/* Footer Links */}
        <nav className="flex flex-wrap justify-center md:justify-end gap-x-md gap-y-sm">
          <Link to="/collections" className="text-body-sm font-semibold text-on-surface-variant hover:text-secondary transition-colors uppercase tracking-wider">
            Collections
          </Link>
          <Link to="/about" className="text-body-sm font-semibold text-on-surface-variant hover:text-secondary transition-colors uppercase tracking-wider">
            Our Story
          </Link>
          <Link to="/contact" className="text-body-sm font-semibold text-on-surface-variant hover:text-secondary transition-colors uppercase tracking-wider">
            Support
          </Link>
          <Link to="/admin" className="text-body-sm font-semibold text-on-surface-variant hover:text-secondary transition-colors uppercase tracking-wider">
            Admin
          </Link>
        </nav>
      </div>
    </footer>
  );
}

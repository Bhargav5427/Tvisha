import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';


export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartItemCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  return (
    <>
      <header className="fixed top-0 w-full z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 shadow-sm transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center px-gutter max-w-container-max mx-auto h-20">
          {/* Menu Icon (Mobile) */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-primary p-2 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex items-center">
            <img alt="TVISHA Brand Logo" className="h-10 w-auto object-contain" src="/logo.svg" />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-lg">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `nav-link text-label-md font-semibold tracking-wide uppercase transition-colors duration-300 pb-1 ${
                  isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/collections" 
              className={({ isActive }) => 
                `nav-link text-label-md font-semibold tracking-wide uppercase transition-colors duration-300 pb-1 ${
                  isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                }`
              }
            >
              Collections
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                `nav-link text-label-md font-semibold tracking-wide uppercase transition-colors duration-300 pb-1 ${
                  isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                }`
              }
            >
              Our Story
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => 
                `nav-link text-label-md font-semibold tracking-wide uppercase transition-colors duration-300 pb-1 ${
                  isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-sm">
            {/* Admin Dashboard link (Only visible to ADMIN) */}
            {user?.role === 'ADMIN' && (
              <Link 
                to="/admin" 
                className="text-on-surface-variant hover:text-primary p-2 rounded-full hover:bg-surface-variant/50 transition-colors"
                title="Admin Portal"
              >
                <span className="material-symbols-outlined">admin_panel_settings</span>
              </Link>
            )}

            {/* Shopping bag */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative text-on-surface-variant hover:text-primary p-2 rounded-full hover:bg-surface-variant/50 transition-colors"
              aria-label="Shopping Cart"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {getCartItemCount()}
                </span>
              )}
            </button>

            {/* User Session Toggle */}
            {user ? (
              <div className="flex items-center gap-xs">
                <Link 
                  to="/my-orders" 
                  className="flex items-center gap-1 text-on-surface-variant hover:text-primary p-1 rounded-full hover:bg-surface-variant/50 transition-colors"
                  title="Client Dashboard"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-outline-variant/30 object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                  )}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="text-on-surface-variant hover:text-error p-2 rounded-full hover:bg-surface-variant/50 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-label-md text-primary font-bold hover:text-primary-container px-sm py-1.5 border border-primary/20 hover:border-primary rounded transition-all"
              >
                Login
              </Link>
            )}
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden bg-surface border-b border-outline-variant/30 py-4 px-gutter space-y-4">
            <Link 
              to="/" 
              onClick={() => setIsMenuOpen(false)} 
              className="block font-semibold text-on-surface hover:text-primary py-2 border-b border-outline-variant/10"
            >
              Home
            </Link>
            <Link 
              to="/collections" 
              onClick={() => setIsMenuOpen(false)} 
              className="block font-semibold text-on-surface hover:text-primary py-2 border-b border-outline-variant/10"
            >
              Collections
            </Link>
            <Link 
              to="/about" 
              onClick={() => setIsMenuOpen(false)} 
              className="block font-semibold text-on-surface hover:text-primary py-2 border-b border-outline-variant/10"
            >
              Our Story
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setIsMenuOpen(false)} 
              className="block font-semibold text-on-surface hover:text-primary py-2 border-b border-outline-variant/10"
            >
              Contact
            </Link>
          </div>
        )}
      </header>

      {/* Cart Drawer Slide-over */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          ></div>

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
            <div className="pointer-events-auto w-screen sm:max-w-md transform transition-all ease-in-out duration-500">
              <div className="flex h-full flex-col bg-surface shadow-xl border-l border-outline-variant/20">
                {/* Header */}
                <div className="flex items-center justify-between px-md py-md border-b border-outline-variant/20">
                  <h2 className="text-headline-md font-serif text-primary">Your Shopping Bag</h2>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-on-surface-variant hover:text-primary p-1 focus:outline-none"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto px-md py-md space-y-md">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-md">
                      <span className="material-symbols-outlined text-[48px] text-outline">shopping_bag</span>
                      <p className="text-on-surface-variant">Your bag is empty.</p>
                      <button 
                        onClick={() => {
                          setIsCartOpen(false);
                          navigate('/collections');
                        }}
                        className="bg-primary text-white px-lg py-2 rounded text-body-sm font-semibold hover:bg-primary-container transition-all"
                      >
                        Explore Collections
                      </button>
                    </div>
                  ) : (
                    cart.map((item, idx) => (
                      <div key={`${item.product.id}-${item.size}-${idx}`} className="flex space-x-sm border-b border-outline-variant/10 pb-md">
                        <img 
                          src={item.product.image_url} 
                          alt={item.product.title} 
                          className="h-20 w-16 object-cover rounded bg-surface-container"
                        />
                        <div className="flex-grow space-y-1">
                          <h3 className="font-serif text-body-md text-on-background line-clamp-1">{item.product.title}</h3>
                          <p className="text-body-sm text-on-surface-variant">Size: <span className="font-semibold text-on-surface">{item.size}</span></p>
                          <div className="flex items-center space-x-sm pt-2">
                            <div className="flex items-center border border-outline-variant rounded bg-surface-container-lowest">
                              <button 
                                onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                                className="px-2 py-0.5 text-on-surface-variant hover:text-primary"
                              >
                                <span className="material-symbols-outlined text-sm font-bold" style={{ fontSize: '14px' }}>remove</span>
                              </button>
                              <span className="px-2 text-body-sm font-semibold">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                                className="px-2 py-0.5 text-on-surface-variant hover:text-primary"
                              >
                                <span className="material-symbols-outlined text-sm font-bold" style={{ fontSize: '14px' }}>add</span>
                              </button>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.product.id, item.size)}
                              className="text-error hover:text-red-700 text-body-sm underline ml-auto"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="text-right pl-2">
                          <span className="text-body-md font-semibold text-primary">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Subtotal & Checkout */}
                {cart.length > 0 && (
                  <div className="border-t border-outline-variant/20 px-md py-md bg-surface-container-lowest space-y-md">
                    <div className="flex justify-between text-body-lg font-semibold text-on-surface">
                      <span>Subtotal</span>
                      <span className="text-primary font-bold">₹{getCartTotal().toLocaleString()}</span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant">Shipping and taxes calculated at checkout.</p>
                    <button 
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate('/checkout');
                      }}
                      className="w-full bg-primary text-on-primary py-3 rounded font-semibold text-body-md hover:bg-primary-container transition-all shadow-sm hover:shadow-md text-center block"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

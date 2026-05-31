import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    // Simulate user creation and log them in
    await loginWithGoogle('CUSTOMER');
  };

  return (
    <main className="w-full min-h-screen flex bg-background">
      {/* Left Side: Form Area (SaaS Density + Luxe Typography) */}
      <section className="w-full md:w-1/2 flex flex-col justify-center px-md py-xl md:px-xl lg:px-[120px] bg-background z-10 relative min-h-screen">
        {/* Brand Mark */}
        <div className="absolute top-xl left-md md:left-xl lg:left-[120px]">
          <Link className="font-headline-md text-headline-md tracking-widest text-primary hover:opacity-70 transition-opacity uppercase font-bold" to="/">
            TVISHA
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto mt-xl md:mt-16">
          <header className="mb-lg">
            <h1 className="font-display-lg text-display-lg text-on-background mb-base">Begin Your Journey</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Create a heritage account to curate your collections.</p>
          </header>

          <form onSubmit={handleRegisterSubmit} className="space-y-md">
            {/* Full Name */}
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="fullName">Full Name</label>
              <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant rounded transition-all duration-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-tertiary/20 h-[48px] px-sm">
                <span className="material-symbols-outlined text-outline mr-sm">person</span>
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 p-0 font-body-sm text-body-sm text-on-surface placeholder-on-surface-variant outline-none" 
                  id="fullName" 
                  placeholder="E.g. Aanya Sharma" 
                  required 
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="email">Email Address</label>
              <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant rounded transition-all duration-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-tertiary/20 h-[48px] px-sm">
                <span className="material-symbols-outlined text-outline mr-sm">mail</span>
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 p-0 font-body-sm text-body-sm text-on-surface placeholder-on-surface-variant outline-none" 
                  id="email" 
                  placeholder="your@email.com" 
                  required 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* WhatsApp Number */}
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="whatsapp">
                WhatsApp Number 
                <span className="text-on-surface-variant font-normal normal-case tracking-normal text-[10px] ml-1">(for order updates)</span>
              </label>
              <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant rounded transition-all duration-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-tertiary/20 h-[48px] px-sm">
                <span className="material-symbols-outlined text-outline mr-sm">call</span>
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 p-0 font-body-sm text-body-sm text-on-surface placeholder-on-surface-variant outline-none" 
                  id="whatsapp" 
                  placeholder="+91 00000 00000" 
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="password">Password</label>
              <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant rounded transition-all duration-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-tertiary/20 h-[48px] px-sm">
                <span className="material-symbols-outlined text-outline mr-sm">lock</span>
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 p-0 font-body-sm text-body-sm text-on-surface placeholder-on-surface-variant outline-none" 
                  id="password" 
                  placeholder="••••••••" 
                  required 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-outline hover:text-primary transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {/* Primary CTA */}
            <button className="w-full h-[48px] bg-primary text-on-primary font-label-md text-label-md rounded flex items-center justify-center hover:bg-primary-container transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-bold cursor-pointer" type="submit">
              Create Heritage Account
            </button>

            {/* Divider */}
            <div className="flex items-center justify-center space-x-sm py-sm">
              <div className="h-px bg-outline-variant/30 flex-1"></div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">or</span>
              <div className="h-px bg-outline-variant/30 flex-1"></div>
            </div>

            {/* Social Login */}
            <button 
              onClick={() => loginWithGoogle('CUSTOMER')}
              className="w-full h-[48px] bg-surface-container-lowest border border-outline-variant text-on-surface font-label-md text-label-md rounded flex items-center justify-center hover:bg-surface-container-low transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-outline-variant focus:ring-offset-2 cursor-pointer" 
              type="button"
            >
              <svg className="w-5 h-5 mr-sm" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              Sign up with Google
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-lg text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Already have an account? 
              <Link className="text-primary font-semibold hover:text-secondary transition-colors focus:outline-none focus:underline font-bold ml-xs" to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Right Side: Imagery (Luxe Aesthetic - Desktop only) */}
      <section className="hidden md:block md:w-1/2 relative bg-surface-container overflow-hidden border-l border-tertiary-fixed-dim/30 min-h-screen">
        {/* Subtle Gold Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#fcf9f8] to-[#F3E5AB] opacity-30 z-10 pointer-events-none"></div>
        <img 
          alt="Premium ethnic wear fabric detail" 
          className="w-full h-full object-cover z-0 filter contrast-105 saturate-90" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_BrTYCqbf7n7xT7EZaLeXHruhp4jO14MgKvuHc_rRZtnd3kxOf9tZJEC_OWUuWGIic-ghJzFgKZ47ADEl1Mh_NTP-kS4LicQJ9OU1DqKaJrVIQlLnachMoX-IyaOtN4oHIg6h5WWkw8HvJCpr7MuPr-sWAowUooVBKAAJ8ZCVfsZrxKLznfEJfYqVPlzJBqe6tLFt6x7n6fd_MDsH9qJroTXnGx9SItnYUeGiFhM4t9yS68yfsUd9IVJyiK6HVEb98Nq9rO4P1Cg"
        />
        {/* Decorative Element */}
        <div className="absolute bottom-xl right-xl z-20 text-on-surface text-right max-w-sm backdrop-blur-md bg-surface/10 p-md rounded border border-white/20 shadow-[0_12px_24px_-8px_rgba(61,147,146,0.12)]">
          <p className="font-headline-md text-headline-md mb-xs font-serif text-primary">Crafted for Eternity</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant font-medium">Experience the convergence of traditional artistry and modern elegance.</p>
        </div>
      </section>
    </main>
  );
}

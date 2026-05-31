import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  React.useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleGoogleLogin = async (role = null) => {
    await loginWithGoogle(role);
  };

  const handleTraditionalLogin = async (e) => {
    e.preventDefault();
    // Simulate customer login using the input email/password
    const isMockAdmin = email.toLowerCase().includes('admin');
    await loginWithGoogle(isMockAdmin ? 'ADMIN' : 'CUSTOMER');
  };

  return (
    <main className="w-full min-h-screen flex bg-background">
      {/* Left Side: Image Canvas (Desktop only) */}
      <section className="hidden lg:flex lg:w-1/2 relative bg-surface-container overflow-hidden items-center justify-center min-h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBiocDuJuAYizC1liPMAj1cHcILoLJ2G6x6tVJB3tGvRBu8kA3DtpP1k-n6ekiFoZQ_PKPX9_PWaUiTSZoGzesAqWYg9t00nMAKz8OBvl21UduYnPaP5BFcwcHOd68ziOVLnBDF2wkcoH-zzNmDNsEMcStfFC25IpKNiONpDNVXsrniGpVuEHn9vMeRWX3OBIh29USPHTMTbLX7DsdypKAzJm_f47OgFkWLbaJvU-hhM11cTIbhTX3LkPkmeQ9evLkD4lAF-qRuhMU')" 
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-tertiary/20 to-tertiary/10 mix-blend-overlay"></div>
        <div className="relative z-10 p-xl max-w-lg text-center bg-surface/30 backdrop-blur-md rounded-xl border border-tertiary-fixed-dim/30 shadow-sm">
          <h2 className="font-display-lg text-display-lg text-white mb-md drop-shadow-md">Crafted Elegance</h2>
          <p className="font-body-lg text-body-lg text-white/90">Experience the timeless beauty of heritage couture.</p>
        </div>
      </section>

      {/* Right Side: Login Form Canvas */}
      <section className="w-full lg:w-1/2 flex flex-col justify-center px-md lg:px-xl py-xl bg-surface relative min-h-screen">
        <div className="w-full max-w-md mx-auto relative z-10 flex flex-col justify-center">
          <header className="mb-lg text-center lg:text-left">
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-widest mb-md uppercase">TVISHA</h1>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">Welcome Back</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Sign in to access your curated collections and premium orders.</p>
          </header>

          <div className="space-y-lg">
            {/* Google Auth Button */}
            <button 
              onClick={() => handleGoogleLogin()}
              className="w-full flex items-center justify-center gap-sm py-3 px-md border border-outline-variant rounded hover:bg-surface-container transition-colors duration-300 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span className="font-label-md text-label-md text-on-surface font-semibold">Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-outline-variant/30"></div>
              <span className="flex-shrink-0 mx-md font-body-sm text-body-sm text-outline">or log in with email</span>
              <div className="flex-grow border-t border-outline-variant/30"></div>
            </div>

            {/* Traditional Login Form */}
            <form onSubmit={handleTraditionalLogin} className="space-y-md">
              <div className="relative border border-outline-variant rounded bg-surface transition-all duration-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-tertiary/20">
                <input 
                  className="block px-md pb-sm pt-lg w-full text-body-md text-on-surface bg-transparent border-0 appearance-none focus:outline-none focus:ring-0 peer h-[52px]" 
                  id="email" 
                  placeholder=" " 
                  required 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label className="absolute font-body-sm text-body-sm text-on-surface-variant duration-300 transform -translate-y-4 scale-75 top-md z-10 origin-[0] left-md peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-primary pointer-events-none" htmlFor="email">Email Address</label>
              </div>

              <div className="relative border border-outline-variant rounded bg-surface transition-all duration-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-tertiary/20">
                <input 
                  className="block px-md pb-sm pt-lg w-full text-body-md text-on-surface bg-transparent border-0 appearance-none focus:outline-none focus:ring-0 peer h-[52px]" 
                  id="password" 
                  placeholder=" " 
                  required 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label className="absolute font-body-sm text-body-sm text-on-surface-variant duration-300 transform -translate-y-4 scale-75 top-md z-10 origin-[0] left-md peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-primary pointer-events-none" htmlFor="password">Password</label>
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between mt-sm">
                <div className="flex items-center">
                  <input 
                    className="h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded bg-surface cursor-pointer" 
                    id="remember-me" 
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label className="ml-2 block font-body-sm text-body-sm text-on-surface-variant cursor-pointer" htmlFor="remember-me">
                    Remember me
                  </label>
                </div>
                <a className="font-label-md text-label-md text-primary hover:text-secondary transition-colors" href="#">Forgot password?</a>
              </div>

              <button className="w-full py-3 px-md bg-primary text-on-primary font-label-md text-label-md rounded hover:bg-primary-container transition-colors duration-300 shadow-sm mt-lg cursor-pointer font-bold" type="submit">
                Sign In
              </button>
            </form>

            {/* Quick Login Boutique Demo Panel */}
            <div className="border-t border-outline-variant/30 pt-md space-y-sm">
              <p className="text-[11px] text-center text-on-surface-variant font-bold uppercase tracking-wider">
                Boutique Demo Profiles
              </p>
              <div className="grid grid-cols-2 gap-sm">
                <button
                  onClick={() => handleGoogleLogin('CUSTOMER')}
                  className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/40 py-2.5 rounded-lg text-body-sm font-semibold transition-all flex flex-col items-center justify-center gap-xs shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                  Customer View
                </button>
                <button
                  onClick={() => handleGoogleLogin('ADMIN')}
                  className="bg-secondary/15 hover:bg-secondary/25 text-secondary border border-secondary/20 hover:border-secondary/40 py-2.5 rounded-lg text-body-sm font-semibold transition-all flex flex-col items-center justify-center gap-xs shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                  Admin Portal
                </button>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center pt-md border-t border-outline-variant/30">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                New to TVISHA? 
                <Link className="font-label-md text-label-md text-primary hover:text-secondary ml-xs transition-colors underline underline-offset-4 font-bold" to="/register">Create an Account</Link>
              </p>
            </div>

          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-0 right-0 p-xl pointer-events-none opacity-5">
          <svg fill="none" height="200" viewBox="0 0 200 200" width="200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="99.5" stroke="#CBA55C"></circle>
            <circle cx="100" cy="100" r="79.5" stroke="#CBA55C"></circle>
            <path d="M100 0V200M0 100H200" stroke="#CBA55C"></path>
          </svg>
        </div>
      </section>
    </main>
  );
}

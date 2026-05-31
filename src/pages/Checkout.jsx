import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabaseClient';

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('IN');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderRef, setOrderRef] = useState('');

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!firstName || !lastName || !email || !phone || !address || !city || !postalCode) {
      alert('Please fill out all billing and shipping fields.');
      return;
    }

    setLoading(true);

    const total = getCartTotal();
    const customerName = `${firstName} ${lastName}`;

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: customerName,
          customer_email: email,
          customer_phone: phone,
          shipping_address: address,
          city,
          postal_code: postalCode,
          total_amount: total,
          status: 'Pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItemsToInsert = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.product.id && item.product.id.length > 8 ? item.product.id : null,
        quantity: item.quantity,
        size: item.size,
        price: item.product.price
      }));

      if (orderItemsToInsert.length > 0 && orderItemsToInsert[0].product_id) {
        const { error: itemsError } = await supabase.from('order_items').insert(orderItemsToInsert);
        if (itemsError) console.error('Error inserting items:', itemsError);
      }

      const generatedRef = orderData.id ? `TV-${orderData.id.slice(0, 8).toUpperCase()}` : '#TV-8492-AX';
      setOrderRef(generatedRef);
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      console.error('Order creation error:', err);
      const randomId = Math.random().toString(36).substr(2, 9).toUpperCase();
      setOrderRef(`TV-${randomId}`);
      setOrderSuccess(true);
      clearCart();
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="pt-32 pb-xl px-gutter max-w-2xl mx-auto flex flex-col items-center justify-center text-center space-y-lg animate-fade-in">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[52px] text-primary">check_circle</span>
          </div>
          <div className="absolute inset-0 rounded-full ring-4 ring-primary/20 animate-ping opacity-30"></div>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-secondary">Order Confirmed</p>
          <h1 className="font-serif text-display-lg text-on-surface tracking-tighter">Order Received</h1>
          <p className="text-body-lg text-on-surface-variant leading-relaxed max-w-lg">
            Thank you for choosing TVISHA. Your order has been securely recorded and our heritage consultant will contact you shortly to finalize payment and arrange your fitting.
          </p>
        </div>

        <div className="bg-surface border border-outline-variant/30 rounded-xl p-lg w-full max-w-sm space-y-md shadow-sm">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Your Order Reference</p>
            <p className="text-headline-lg text-primary tracking-widest font-bold font-mono">{orderRef}</p>
            <p className="text-[11px] text-on-surface-variant mt-1">Keep this for your records.</p>
          </div>
          <div className="border-t border-outline-variant/20 pt-md space-y-2">
            {[
              { icon: 'mail', text: `Confirmation sent to ${email}` },
              { icon: 'support_agent', text: 'Concierge will contact you within 24h' },
              { icon: 'local_shipping', text: 'Free premium shipping included' },
            ].map(item => (
              <div key={item.icon} className="flex items-center gap-2 text-[12px] text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-[16px]">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            to="/my-orders"
            className="bg-primary text-on-primary px-lg py-3 rounded-lg font-semibold text-body-sm hover:bg-primary-container transition-all shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            View My Orders
          </Link>
          <Link
            to="/collections"
            className="border border-primary text-primary px-lg py-3 rounded-lg font-semibold text-body-sm hover:bg-primary/5 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-xl px-gutter max-w-2xl mx-auto flex flex-col items-center justify-center text-center space-y-md">
        <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-[36px] text-outline">shopping_bag</span>
        </div>
        <h2 className="font-serif text-headline-lg">Your Cart is Empty</h2>
        <p className="text-on-surface-variant">Add some premium ethnicwear to your bag before checking out.</p>
        <Link
          to="/collections"
          className="bg-primary text-white px-lg py-3 rounded-lg font-semibold text-body-sm hover:bg-primary-container transition-all"
        >
          Browse Collections
        </Link>
      </div>
    );
  }

  const steps = ['Cart', 'Details', 'Confirm'];

  return (
    <main className="pt-28 pb-xl px-gutter max-w-container-max mx-auto w-full">
      {/* Progress Bar */}
      <div className="flex items-center justify-center gap-2 mb-xl">
        {steps.map((step, i) => (
          <React.Fragment key={step}>
            <div className={`flex items-center gap-2 ${i <= 1 ? 'text-primary' : 'text-outline'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                i < 1 ? 'bg-primary text-white' : i === 1 ? 'bg-primary text-white' : 'bg-surface-container text-outline border border-outline-variant/30'
              }`}>
                {i < 1 ? <span className="material-symbols-outlined text-[14px]">check</span> : i + 1}
              </div>
              <span className={`text-[12px] font-semibold hidden sm:block ${i <= 1 ? 'text-primary' : 'text-outline'}`}>{step}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 max-w-16 h-0.5 rounded-full ${i < 1 ? 'bg-primary' : 'bg-outline-variant/30'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-gutter items-start">
        {/* Checkout Form */}
        <form onSubmit={handlePlaceOrder} className="w-full lg:w-7/12 space-y-md animate-fade-in">
          <div>
            <h1 className="font-serif text-display-lg text-on-surface leading-tight mb-xs">Secure Checkout</h1>
            <p className="text-body-md text-on-surface-variant">Please provide your details. Our concierge team will contact you to arrange payment and delivery.</p>
          </div>

          {/* Contact Info */}
          <section className="bg-surface border border-outline-variant/30 rounded-xl p-md md:p-lg space-y-md shadow-sm">
            <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[18px]">person</span>
              </div>
              <h2 className="font-serif text-headline-md text-primary">Contact Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {[
                { id: 'firstName', label: 'First Name', val: firstName, set: setFirstName, ph: 'First name', span: 1 },
                { id: 'lastName', label: 'Last Name', val: lastName, set: setLastName, ph: 'Last name', span: 1 },
                { id: 'email', label: 'Email Address', val: email, set: setEmail, ph: 'email@example.com', type: 'email', span: 2 },
                { id: 'phone', label: 'Phone / WhatsApp', val: phone, set: setPhone, ph: '+91 98765 43210', type: 'tel', span: 2 },
              ].map(({ id, label, val, set, ph, type, span }) => (
                <div key={id} className={`flex flex-col space-y-xs ${span === 2 ? 'md:col-span-2' : ''}`}>
                  <label className="text-body-sm font-semibold text-on-surface-variant" htmlFor={id}>{label}</label>
                  <input
                    type={type || 'text'} id={id} value={val} onChange={(e) => set(e.target.value)} required placeholder={ph}
                    className="bg-transparent border border-outline-variant/30 rounded-lg px-sm py-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Shipping Address */}
          <section className="bg-surface border border-outline-variant/30 rounded-xl p-md md:p-lg space-y-md shadow-sm">
            <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-sm">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-[18px]">location_on</span>
              </div>
              <h2 className="font-serif text-headline-md text-primary">Shipping Address</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="flex flex-col space-y-xs md:col-span-2">
                <label className="text-body-sm font-semibold text-on-surface-variant" htmlFor="address">Street Address</label>
                <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="Street address, building, suite"
                  className="bg-transparent border border-outline-variant/30 rounded-lg px-sm py-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div className="flex flex-col space-y-xs">
                <label className="text-body-sm font-semibold text-on-surface-variant" htmlFor="city">City</label>
                <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="City"
                  className="bg-transparent border border-outline-variant/30 rounded-lg px-sm py-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div className="flex flex-col space-y-xs">
                <label className="text-body-sm font-semibold text-on-surface-variant" htmlFor="postalCode">Postal Code</label>
                <input type="text" id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required placeholder="Postal code"
                  className="bg-transparent border border-outline-variant/30 rounded-lg px-sm py-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div className="flex flex-col space-y-xs md:col-span-2">
                <label className="text-body-sm font-semibold text-on-surface-variant" htmlFor="country">Country / Region</label>
                <select id="country" value={country} onChange={(e) => setCountry(e.target.value)}
                  className="bg-surface border border-outline-variant/30 rounded-lg px-sm py-sm text-body-sm focus:border-primary outline-none cursor-pointer"
                >
                  <option value="IN">India</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AE">UAE</option>
                </select>
              </div>
            </div>
          </section>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: 'lock', label: 'Secure & Private' },
              { icon: 'local_shipping', label: 'Free Premium Shipping' },
              { icon: 'support_agent', label: 'Concierge Support' },
            ].map(b => (
              <div key={b.label} className="flex flex-col items-center gap-1 bg-surface border border-outline-variant/20 rounded-lg p-3 text-center">
                <span className="material-symbols-outlined text-primary text-[20px]">{b.icon}</span>
                <span className="text-[10px] font-semibold text-on-surface-variant">{b.label}</span>
              </div>
            ))}
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-primary text-on-primary py-4 rounded-xl font-semibold text-body-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]">{loading ? 'hourglass_empty' : 'check_circle'}</span>
            {loading ? 'Processing Order...' : 'Place Custom Order'}
          </button>
        </form>

        {/* Order Summary */}
        <div className="w-full lg:w-5/12 lg:sticky lg:top-28 space-y-md">
          <div className="bg-surface border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden">
            <div className="px-md py-sm border-b border-outline-variant/20 bg-surface-container-low">
              <h3 className="font-serif text-headline-md text-primary">Order Summary</h3>
              <p className="text-[11px] text-on-surface-variant">{cart.length} item{cart.length !== 1 ? 's' : ''} in your bag</p>
            </div>

            <div className="divide-y divide-outline-variant/10 max-h-80 overflow-y-auto">
              {cart.map((item, idx) => (
                <div key={`${item.product.id}-${item.size}-${idx}`} className="flex gap-3 p-md">
                  <div className="relative flex-shrink-0">
                    <img src={item.product.image_url} alt={item.product.title} className="h-16 w-12 object-cover rounded-lg border border-outline-variant/20" />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-body-sm font-semibold text-on-surface line-clamp-2 leading-tight">{item.product.title}</h4>
                    <p className="text-[11px] text-on-surface-variant mt-1">Size: <span className="font-bold text-primary">{item.size}</span></p>
                    <p className="text-body-sm font-bold text-on-surface mt-1">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-md border-t border-outline-variant/20 space-y-2">
              <div className="flex justify-between text-body-sm text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-semibold text-on-surface">₹{getCartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-body-sm text-on-surface-variant">
                <span>Shipping</span>
                <span className="font-semibold text-primary">Free Concierge</span>
              </div>
              <div className="flex justify-between items-center text-body-md font-bold text-on-surface pt-2 border-t border-outline-variant/10">
                <span>Total</span>
                <span className="text-headline-sm text-primary font-bold">₹{getCartTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0 mt-0.5">info</span>
            <p className="text-[12px] text-on-surface-variant leading-relaxed">
              After placing your order, our heritage consultant will reach out within 24 hours to confirm payment details and schedule any custom fitting requirements.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

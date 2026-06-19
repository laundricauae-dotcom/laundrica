'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/cart-context';
import { useSession } from '@/context/session-context';
import { orderAPI } from '@/lib/api';
import { ArrowLeft, Check, AlertCircle, Shield, Truck, User, Home, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const WHATSAPP_NUMBER = "971508203555";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems = [], getTotalPrice, clearCart } = useCart();
  const { sessionId } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [carpetToggle, setCarpetToggle] = useState(false);
  const [shoesToggle, setShoesToggle] = useState(false);

  useEffect(() => {
    const savedCarpet = localStorage.getItem('carpetContactToggle');
    const savedShoes = localStorage.getItem('shoesContactToggle');
    if (savedCarpet) setCarpetToggle(savedCarpet === 'true');
    if (savedShoes) setShoesToggle(savedShoes === 'true');
  }, []);

  const handleCarpetToggle = (value: boolean) => {
    setCarpetToggle(value);
    localStorage.setItem('carpetContactToggle', String(value));
    toast.success(value ? 'Agent will contact you for Carpet' : 'Carpet: Items can be added directly');
  };

  const handleShoesToggle = (value: boolean) => {
    setShoesToggle(value);
    localStorage.setItem('shoesContactToggle', String(value));
    toast.success(value ? 'Agent will contact you for Shoes' : 'Shoes: Items can be added directly');
  };

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    specialInstructions: '',
  });

  const [addressFields, setAddressFields] = useState({
    streetAddress: '',
    city: 'Dubai'
  });

  const totalPrice = getTotalPrice();
  const finalTotal = totalPrice;

  useEffect(() => {
    if ((!cartItems || cartItems.length === 0) && !orderPlaced) {
      router.push('/cart');
    }
  }, [cartItems, orderPlaced, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'streetAddress' || name === 'city') {
      setAddressFields((prev) => ({ ...prev, [name]: value }));
      const combinedAddress = name === 'streetAddress'
        ? `${value}, ${addressFields.city}`
        : `${addressFields.streetAddress}, ${value}`;
      setFormData((prev) => ({ ...prev, address: combinedAddress }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const formatPhoneNumber = (phone: string): string => {
    let cleaned = phone.replace(/\D/g, '');
    cleaned = cleaned.replace(/^0+/, '');

    if (cleaned.startsWith('971')) {
      if (cleaned.length >= 4 && cleaned[3] === '5') {
        return `+${cleaned}`;
      }
      return `+9715${cleaned.substring(3)}`;
    }

    if (cleaned.length === 9 && cleaned.startsWith('5')) {
      return `+971${cleaned}`;
    }

    if (cleaned.length === 10 && cleaned.startsWith('05')) {
      return `+971${cleaned.substring(1)}`;
    }

    if (cleaned.length === 10 && cleaned.startsWith('5')) {
      return `+971${cleaned}`;
    }

    if (cleaned.length > 0) {
      const mobilePart = cleaned.replace(/^5?/, '5');
      return `+971${mobilePart}`;
    }

    return phone;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const digits = phone.replace(/\D/g, '');
    return /^5[0-9]{8}$/.test(digits) ||
      /^05[0-9]{8}$/.test(digits) ||
      /^9715[0-9]{8}$/.test(digits);
  };

  const groupCartItems = () => {
    const grouped = new Map();
    cartItems.forEach(item => {
      const key = item.id;
      if (grouped.has(key)) {
        const existing = grouped.get(key);
        existing.quantity += item.quantity;
      } else {
        grouped.set(key, {
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || '',
          serviceItems: item.serviceItems || [],
          selectedColor: item.selectedColor || null,
          selectedSize: item.selectedSize || null,
          designImage: item.designImage || null,
          serviceName: item.metadata?.serviceName || '',
          category: item.category || '',
        });
      }
    });
    return Array.from(grouped.values());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || isProcessing) {
      return;
    }

    setIsProcessing(true);
    setIsSubmitting(true);
    setError('');
    setValidationErrors([]);

    try {
      // Validate session
      if (!sessionId) {
        throw new Error('Session ID is missing. Please refresh the page and try again.');
      }

      // Validate form
      if (!formData.fullName.trim()) {
        throw new Error('Please enter your full name');
      }
      if (!formData.phone.trim()) {
        throw new Error('Please enter your phone number');
      }

      const formattedPhone = formatPhoneNumber(formData.phone);
      if (!validatePhoneNumber(formattedPhone)) {
        throw new Error('Please enter a valid UAE mobile number starting with 5');
      }

      if (!addressFields.streetAddress.trim()) {
        throw new Error('Please enter your delivery address');
      }

      if (!cartItems || cartItems.length === 0) {
        throw new Error('Your cart is empty');
      }

      const fullAddress = `${addressFields.streetAddress.trim()}, ${addressFields.city.trim()}`;
      const transformedItems = groupCartItems();

      // Build order data - CLEAN AND VALIDATED
      const orderData = {
        sessionId: sessionId.trim(),
        items: transformedItems,
        subtotal: totalPrice,
        deliveryFee: 0,
        tax: 0,
        discount: 0,
        total: finalTotal,
        customerInfo: {
          full_name: formData.fullName.trim(),
          mobile: formattedPhone,
          email: formData.email?.trim() || '',
          address: fullAddress,
          city: addressFields.city.trim(),
          special_instructions: formData.specialInstructions?.trim() || '',
        },
        carpetContactEnabled: carpetToggle,
        shoesContactEnabled: shoesToggle,
      };

      console.log('========================================');
      console.log('📦 Creating order with payload:');
      console.log('📋 Session ID:', orderData.sessionId);
      console.log('📋 Customer Info:', JSON.stringify(orderData.customerInfo, null, 2));
      console.log('📋 Items:', orderData.items.length);
      console.log('💰 Total:', orderData.total);
      console.log('========================================');

      const response = await orderAPI.createOrder(orderData);
      console.log('✅ Order response:', response);

      if (response.success && response.order) {
        const orderNumber = response.order.orderNumber;

        console.log("=========================================");
        console.log("✅ ORDER CREATED SUCCESSFULLY");
        console.log("📋 Order Number:", orderNumber);
        console.log("💰 Total: AED", response.order.total.toFixed(2));
        console.log("=========================================");

        setOrderResult(response);
        setOrderPlaced(true);
        toast.success("Order placed successfully!");
        await clearCart();
      } else {
        throw new Error(response.message || 'Failed to create order');
      }

    } catch (err: any) {
      console.error('❌ Order creation error:', err);
      console.error('❌ Error details:', err.data || err);

      // Handle validation errors from backend
      if (err.data?.errors) {
        const errors = Array.isArray(err.data.errors) ? err.data.errors : [err.data.errors];
        setValidationErrors(errors);
        setError(`Validation failed: ${errors.join(', ')}`);
        toast.error(`Validation failed: ${errors.join(', ')}`);
      } else if (err.message) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError('Something went wrong. Please try again.');
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setIsProcessing(false);
      setIsSubmitting(false);
    }
  };

  const cartItemsCount = cartItems?.reduce((sum, item) => sum + (item?.quantity || 0), 0) || 0;

  // Order Confirmation Page
  if (orderPlaced && orderResult) {
    const order = orderResult.order;
    const orderNumber = order.orderNumber;
    const whatsappMessage = `Hello! I've placed an order with Laundrica.%0A%0A📋 Order #: ${orderNumber}%0A💰 Total: AED ${order.total.toFixed(2)}%0A👤 Name: ${formData.fullName}%0A📞 Phone: ${formData.phone}%0A📍 Address: ${formData.address}%0A%0APlease confirm my order. Thank you!`;
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

    return (
      <main className="flex flex-col min-h-screen bg-[#f9faf7]">
        <Header />
        <div className="flex-1 py-20 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#bcedd7] rounded-full mb-6">
                <Check size={40} className="text-[#00261b]" />
              </div>
              <h1 className="text-3xl font-bold mb-2 text-[#00261b]">Order Confirmed!</h1>
              <p className="text-lg text-[#5c5f5e] mb-6">Thank you for your order</p>

              <div className="bg-[#f9faf7] rounded-xl p-6 mb-8 text-left">
                {/* <div className="mb-4">
                  <p className="text-sm text-[#5c5f5e] mb-1">Order Number</p>
                  <p className="text-xl font-bold text-[#00261b] font-mono">{orderNumber}</p>
                </div> */}
                <div>
                  <p className="text-sm text-[#5c5f5e] mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-[#00261b]">AED {order.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="w-full rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Chat on WhatsApp
                  </Button>
                </a>
                <Link href="/services" className="block">
                  <Button variant="outline" size="lg" className="w-full rounded-xl">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // Checkout Form
  return (
    <main className="flex flex-col min-h-screen bg-[#f9faf7]">
      <Header />

      <section className="bg-[#00261b] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/cart">
            <button className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Checkout</h1>
          <p className="text-white/80">Complete your order to proceed</p>
        </div>
      </section>

      <div className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                  {validationErrors.length > 0 && (
                    <ul className="text-sm mt-1 list-disc list-inside">
                      {validationErrors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 text-[#00261b] flex items-center gap-2">
                <User className="w-5 h-5 text-[#00261b]" />
                Contact Information
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#00261b] mb-2">Full Name *</label>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="rounded-xl border-gray-200 focus:border-[#00261b] focus:ring-[#00261b]"
                  placeholder="Ahmed Al Mansoori"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#00261b] mb-2">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="rounded-xl border-gray-200 focus:border-[#00261b] focus:ring-[#00261b]"
                    placeholder="ahmed@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#00261b] mb-2">Mobile Number * (UAE)</label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="rounded-xl border-gray-200 focus:border-[#00261b] focus:ring-[#00261b]"
                    placeholder="501234567"
                  />
                  <p className="text-xs text-[#5c5f5e] mt-1">
                    ✓ Enter your UAE mobile number (e.g., 501234567 or +971501234567)
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-[#00261b] mb-2 flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Street Address *
                </label>
                <Input
                  name="streetAddress"
                  value={addressFields.streetAddress}
                  onChange={handleInputChange}
                  required
                  className="rounded-xl border-gray-200 focus:border-[#00261b] focus:ring-[#00261b]"
                  placeholder="Building name, apartment number, street name"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-[#00261b] mb-2">City / Area *</label>
                <Input
                  name="city"
                  value={addressFields.city}
                  onChange={handleInputChange}
                  required
                  className="rounded-xl border-gray-200 focus:border-[#00261b] focus:ring-[#00261b]"
                  placeholder="Dubai"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-[#00261b] mb-2">Special Instructions (Optional)</label>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any special requests? (e.g., delicate items, allergies, etc.)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00261b] focus:border-[#00261b] resize-none"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-[#00261b] mb-4">Special Items</h3>
              <p className="text-sm text-gray-500 mb-4">Toggle on if you want our agent to contact you for these items</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🧹</span>
                    <div>
                      <p className="text-sm font-medium text-[#00261b]">Carpet Items</p>
                      <p className="text-xs text-gray-500">Require contact for pricing</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCarpetToggle(!carpetToggle)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${carpetToggle ? 'bg-[#00261b]' : 'bg-gray-300'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${carpetToggle ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👟</span>
                    <div>
                      <p className="text-sm font-medium text-[#00261b]">Shoe Items</p>
                      <p className="text-xs text-gray-500">Require contact for pricing</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleShoesToggle(!shoesToggle)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${shoesToggle ? 'bg-[#00261b]' : 'bg-gray-300'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${shoesToggle ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Link href="/cart" className="flex-1">
                <Button variant="outline" size="lg" className="w-full rounded-xl border-[#00261b] text-[#00261b] hover:bg-[#bcedd7]">
                  <ArrowLeft className="mr-2" size={18} />
                  Back to Cart
                </Button>
              </Link>
              <Button
                type="submit"
                size="lg"
                className="flex-1 bg-[#00261b] hover:bg-emerald-800 text-white rounded-xl"
                disabled={isProcessing || isSubmitting}
              >
                {(isProcessing || isSubmitting) ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  `Place Order • AED ${finalTotal.toFixed(2)}`
                )}
              </Button>
            </div>
          </form>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-[#00261b] to-emerald-800 p-6 text-white">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Order Summary
                  </h2>
                  <p className="text-sm text-white/80 mt-1">{cartItemsCount} item(s)</p>
                </div>

                <div className="p-6">
                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 max-h-80 overflow-y-auto">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <span className="text-[#00261b]">{item.name || 'Unknown Item'}</span>
                          <span className="text-gray-400 ml-2">x{item.quantity || 0}</span>
                          {item.metadata?.serviceName && (
                            <p className="text-xs text-gray-400 mt-0.5">{item.metadata.serviceName}</p>
                          )}
                        </div>
                        <span className="font-medium text-[#00261b]">AED {((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex justify-between text-[#5c5f5e]">
                      <span>Subtotal</span>
                      <span>AED {totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#5c5f5e]">
                      <span>Delivery</span>
                      <span className="text-green-600">Free</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xl font-bold mb-6">
                    <span className="text-[#00261b]">Total</span>
                    <span className="text-[#00261b]">AED {finalTotal.toFixed(2)}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[#5c5f5e]">
                      <Shield className="w-3 h-3" />
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5c5f5e]">
                      <Truck className="w-3 h-3" />
                      <span>Free delivery</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-[#bcedd7]/20 rounded-xl">
                    <p className="text-xs text-[#00261b]">
                      💡 <strong>Note:</strong> After placing your order, our team will contact you for confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
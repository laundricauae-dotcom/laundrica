// lib/api.ts - Complete working version with Render support and fallback

// Use environment variable or fallback to Render URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function for API calls (with session ID header)
async function apiCall(endpoint: string, options: RequestInit = {}, sessionId?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (sessionId) {
    headers['x-session-id'] = sessionId;
  }

  const isCartOperation = endpoint.includes('/cart/');
  if (!isCartOperation) {
    console.log(`📤 Making ${options.method || 'GET'} request to: ${API_BASE_URL}${endpoint}`);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      // Add credentials for CORS
      credentials: 'include',
    });

    let data;
    const contentType = response.headers.get('content-type');

    if (response.status !== 204 && contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (jsonError) {
        data = null;
      }
    } else {
      data = null;
    }

    // Log response for debugging
    if (!isCartOperation) {
      console.log(`📥 Response status: ${response.status}`);
      if (data) {
        console.log(`📥 Response data:`, JSON.stringify(data, null, 2));
      }
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `API request failed with status ${response.status}`;
      const error: any = new Error(errorMessage);
      error.status = response.status;
      error.data = data;

      // If there are validation errors, add them
      if (data?.errors) {
        error.validationErrors = data.errors;
      }

      throw error;
    }

    return data;
  } catch (error: any) {
    if (!isCartOperation) {
      console.error('❌ API Call Failed:', {
        endpoint,
        error: error.message,
        status: error.status,
        data: error.data,
      });
    }
    throw error;
  }
}

// ============ SESSION API ============
export const sessionAPI = {
  createSession: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/session/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },
};

// ============ CART API - With localStorage Workaround ============

interface LocalCartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  description?: string;
  image?: string;
  serviceItems?: any[];
  selectedColor?: string | null;
  selectedSize?: string | null;
  designImage?: string | null;
  metadata?: any;
}

const getLocalCartKey = (sessionId: string) => `laundrica_cart_${sessionId}`;

const getLocalCart = (sessionId: string): LocalCartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(getLocalCartKey(sessionId));
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveLocalCart = (sessionId: string, items: LocalCartItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getLocalCartKey(sessionId), JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

const clearLocalCart = (sessionId: string) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(getLocalCartKey(sessionId));
  } catch (error) {
    console.error('Failed to clear localStorage cart:', error);
  }
};

const isDuplicateKeyError = (error: any): boolean => {
  return error?.message?.includes('E11000') ||
    error?.message?.includes('duplicate') ||
    error?.status === 400 ||
    error?.status === 409 ||
    error?.data?.code === 11000 ||
    error?.message?.includes('validation');
};

export const cartAPI = {
  getCart: async (sessionId: string) => {
    if (!sessionId) {
      return { success: false, cart: { items: [] }, error: 'Session ID required' };
    }

    try {
      const response = await apiCall(`/cart/${sessionId}`, { method: 'GET' }, sessionId);

      if (response?.success && response?.cart?.items) {
        saveLocalCart(sessionId, response.cart.items);
      }

      return response;
    } catch (error: any) {
      console.log(`Backend cart fetch failed, using localStorage for session ${sessionId}`);
      const items = getLocalCart(sessionId);
      return {
        success: true,
        cart: {
          items: items.map((item: LocalCartItem) => ({
            ...item,
            _id: item.id,
            id: item.id
          }))
        },
        fromLocalStorage: true
      };
    }
  },

  addToCart: async (sessionId: string, item: any) => {
    if (!sessionId) {
      return { success: false, error: 'Session ID required' };
    }

    try {
      const response = await apiCall(`/cart/${sessionId}/add`, {
        method: 'POST',
        body: JSON.stringify(item),
      }, sessionId);

      if (response?.success && response?.cart?.items) {
        saveLocalCart(sessionId, response.cart.items);
      }

      return response;
    } catch (error: any) {
      if (isDuplicateKeyError(error)) {
        console.log('Duplicate key error - cart may already exist, fetching existing cart');
        try {
          const existingCart = await cartAPI.getCart(sessionId);
          if (existingCart?.success && existingCart?.cart?.items) {
            const items = existingCart.cart.items;
            const existingIndex = items.findIndex((i: any) => i.productId === item.productId);

            if (existingIndex >= 0) {
              items[existingIndex].quantity += (item.quantity || 1);
            } else {
              items.push({
                ...item,
                id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              });
            }
            saveLocalCart(sessionId, items);

            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('cart-updated', { detail: { items } }));
            }

            return { success: true, cart: { items }, fromLocalStorage: true };
          }
        } catch (e) {
          console.log('Failed to fetch existing cart');
        }
      }

      console.log(`Backend add to cart failed, using localStorage for session ${sessionId}`);
      const items = getLocalCart(sessionId);
      const existingIndex = items.findIndex((i: LocalCartItem) => i.productId === item.productId);

      if (existingIndex >= 0) {
        items[existingIndex].quantity += (item.quantity || 1);
      } else {
        items.push({
          id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          category: item.category || 'general',
          description: item.description || '',
          image: item.image,
          serviceItems: item.serviceItems || [],
          selectedColor: item.selectedColor || null,
          selectedSize: item.selectedSize || null,
          designImage: item.designImage || null,
          metadata: item.metadata || {},
        });
      }

      saveLocalCart(sessionId, items);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { items } }));
      }

      return { success: true, cart: { items }, fromLocalStorage: true };
    }
  },

  updateCartItem: async (sessionId: string, itemId: string, quantity: number) => {
    if (!sessionId || !itemId) {
      return { success: false, error: 'Session ID and Item ID required' };
    }

    try {
      const response = await apiCall(`/cart/${sessionId}/item/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      }, sessionId);

      if (response?.success && response?.cart?.items) {
        saveLocalCart(sessionId, response.cart.items);
      }

      return response;
    } catch (error: any) {
      console.log(`Backend update failed, using localStorage for session ${sessionId}`);
      const items = getLocalCart(sessionId);
      const itemIndex = items.findIndex(i => i.id === itemId);

      if (itemIndex >= 0) {
        if (quantity <= 0) {
          items.splice(itemIndex, 1);
        } else {
          items[itemIndex].quantity = quantity;
        }
        saveLocalCart(sessionId, items);

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cart-updated', { detail: { items } }));
        }

        return { success: true, cart: { items }, fromLocalStorage: true };
      }

      return { success: false, error: 'Item not found' };
    }
  },

  removeFromCart: async (sessionId: string, itemId: string) => {
    if (!sessionId || !itemId) {
      return { success: false, error: 'Session ID and Item ID required' };
    }

    try {
      const response = await apiCall(`/cart/${sessionId}/item/${itemId}`, {
        method: 'DELETE',
      }, sessionId);

      if (response?.success && response?.cart?.items) {
        saveLocalCart(sessionId, response.cart.items);
      }

      return response;
    } catch (error: any) {
      console.log(`Backend remove failed, using localStorage for session ${sessionId}`);
      const items = getLocalCart(sessionId);
      const filtered = items.filter(i => i.id !== itemId);
      saveLocalCart(sessionId, filtered);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { items: filtered } }));
      }

      return { success: true, cart: { items: filtered }, fromLocalStorage: true };
    }
  },

  clearCart: async (sessionId: string) => {
    if (!sessionId) {
      return { success: false, error: 'Session ID required' };
    }

    try {
      const response = await apiCall(`/cart/${sessionId}/clear`, {
        method: 'DELETE',
      }, sessionId);

      if (response?.success) {
        clearLocalCart(sessionId);
      }

      return response;
    } catch (error: any) {
      console.log(`Backend clear failed, using localStorage for session ${sessionId}`);
      clearLocalCart(sessionId);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { items: [] } }));
      }

      return { success: true, cart: { items: [] }, fromLocalStorage: true };
    }
  },

  applyCoupon: async (sessionId: string, code: string) => {
    if (!sessionId || !code) {
      return { success: false, error: 'Session ID and coupon code required' };
    }

    try {
      const response = await apiCall(`/cart/${sessionId}/coupon`, {
        method: 'POST',
        body: JSON.stringify({ code }),
      }, sessionId);
      return response;
    } catch (error: any) {
      if (code.toLowerCase() === 'fresh10') {
        return { success: true, discount: 10, message: '10% discount applied!', fromLocalStorage: true };
      }
      return { success: false, error: error.message };
    }
  },

  removeCoupon: async (sessionId: string) => {
    if (!sessionId) {
      return { success: false, error: 'Session ID required' };
    }

    try {
      const response = await apiCall(`/cart/${sessionId}/coupon`, {
        method: 'DELETE',
      }, sessionId);
      return response;
    } catch (error) {
      return { success: true, fromLocalStorage: true };
    }
  },
};

// ============ ORDER API - FIXED FOR RENDER ============
export const orderAPI = {
  createOrder: async (orderData: any) => {
    if (!orderData) {
      throw new Error('Order data is required');
    }

    // Make a deep copy to avoid mutating the original
    const cleanData = JSON.parse(JSON.stringify(orderData));

    const sessionId = cleanData.sessionId;

    // ✅ ENSURE CORRECT FIELD NAMES - Build clean order data
    const cleanOrderData = {
      sessionId: sessionId?.trim() || '',
      items: Array.isArray(cleanData.items) ? cleanData.items.map((item: any) => ({
        productId: item.productId || item.id || 'unknown',
        name: item.name || 'Unknown Item',
        price: typeof item.price === 'number' ? item.price : 0,
        quantity: typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1,
        image: item.image || '',
        category: item.category || '',
        serviceItems: Array.isArray(item.serviceItems) ? item.serviceItems : [],
        selectedColor: item.selectedColor || null,
        selectedSize: item.selectedSize || null,
        designImage: item.designImage || null,
        serviceName: item.serviceName || '',
        metadata: item.metadata || {},
      })) : [],
      subtotal: typeof cleanData.subtotal === 'number' ? cleanData.subtotal : 0,
      deliveryFee: typeof cleanData.deliveryFee === 'number' ? cleanData.deliveryFee : 0,
      tax: typeof cleanData.tax === 'number' ? cleanData.tax : 0,
      discount: typeof cleanData.discount === 'number' ? cleanData.discount : 0,
      total: typeof cleanData.total === 'number' ? cleanData.total : 0,
      customerInfo: {
        full_name: cleanData.customerInfo?.full_name?.trim() ||
          cleanData.customerInfo?.name?.trim() || '',
        mobile: cleanData.customerInfo?.mobile?.trim() ||
          cleanData.customerInfo?.phone?.trim() || '',
        email: cleanData.customerInfo?.email?.trim() || '',
        address: cleanData.customerInfo?.address?.trim() || '',
        city: cleanData.customerInfo?.city?.trim() || 'Dubai',
        special_instructions: cleanData.customerInfo?.special_instructions?.trim() ||
          cleanData.customerInfo?.notes?.trim() || '',
      },
      carpetContactEnabled: Boolean(cleanData.carpetContactEnabled),
      shoesContactEnabled: Boolean(cleanData.shoesContactEnabled),
    };

    // Validate required fields before sending
    const errors: string[] = [];

    if (!cleanOrderData.customerInfo.full_name || cleanOrderData.customerInfo.full_name.length < 2) {
      errors.push('Full name is required (minimum 2 characters)');
    }

    if (!cleanOrderData.customerInfo.mobile || cleanOrderData.customerInfo.mobile.length < 5) {
      errors.push('Mobile number is required');
    }

    if (!cleanOrderData.customerInfo.address || cleanOrderData.customerInfo.address.length < 3) {
      errors.push('Address is required');
    }

    if (errors.length > 0) {
      console.error('❌ Validation errors before sending:', errors);
      const error: any = new Error('Validation failed');
      error.validationErrors = errors;
      error.data = { errors };
      throw error;
    }

    console.log('========================================');
    console.log('📦 Creating order with cleaned data:');
    console.log('📋 Session ID:', cleanOrderData.sessionId);
    console.log('📋 Customer Info:', JSON.stringify(cleanOrderData.customerInfo, null, 2));
    console.log('📋 Items count:', cleanOrderData.items.length);
    console.log('💰 Subtotal:', cleanOrderData.subtotal);
    console.log('💰 Total:', cleanOrderData.total);
    console.log('🪙 Carpet Contact:', cleanOrderData.carpetContactEnabled);
    console.log('👟 Shoes Contact:', cleanOrderData.shoesContactEnabled);
    console.log('========================================');

    try {
      const response = await apiCall('/orders', {
        method: 'POST',
        body: JSON.stringify(cleanOrderData),
      }, sessionId);

      console.log('✅ Order created successfully:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Create order error:', error);
      // Re-throw with additional context
      if (error.data?.errors) {
        const errorWithDetails: any = new Error('Validation failed');
        errorWithDetails.validationErrors = error.data.errors;
        errorWithDetails.data = error.data;
        throw errorWithDetails;
      }
      throw error;
    }
  },

  getOrderByNumber: async (orderNumber: string) => {
    if (!orderNumber) {
      throw new Error('Order number is required');
    }

    try {
      const response = await apiCall(`/orders/track/${orderNumber}`);
      return response;
    } catch (error) {
      console.error('Track order error:', error);
      throw error;
    }
  },

  getOrdersBySession: async (sessionId: string) => {
    if (!sessionId) {
      return { success: false, orders: [] };
    }

    try {
      const response = await apiCall(`/orders/session/${sessionId}`, { method: 'GET' }, sessionId);
      return response;
    } catch (error) {
      console.error('Get orders error:', error);
      return { success: false, orders: [] };
    }
  },

  getOrderById: async (orderId: string, sessionId?: string) => {
    if (!orderId) {
      throw new Error('Order ID is required');
    }

    try {
      const response = await apiCall(`/orders/${orderId}`, { method: 'GET' }, sessionId);
      return response;
    } catch (error) {
      console.error('Get order by ID error:', error);
      throw error;
    }
  },

  cancelOrder: async (orderId: string, sessionId: string) => {
    if (!orderId || !sessionId) {
      throw new Error('Order ID and Session ID are required');
    }

    try {
      const response = await apiCall(`/orders/${orderId}/cancel`, {
        method: 'POST',
      }, sessionId);
      return response;
    } catch (error) {
      console.error('Cancel order error:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderNumber: string, status: string, sessionId?: string) => {
    if (!orderNumber || !status) {
      throw new Error('Order number and status are required');
    }

    try {
      const response = await apiCall(`/orders/${orderNumber}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }, sessionId);
      return response;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  },
};

// ============ PRODUCT API ============
export const productAPI = {
  getAllProducts: async (params?: any) => {
    const query = new URLSearchParams(params).toString();

    try {
      const response = await apiCall(`/products${query ? `?${query}` : ''}`);
      return response;
    } catch (error) {
      console.error('Get all products error:', error);
      return { success: false, products: [] };
    }
  },

  getProductById: async (id: string) => {
    if (!id) {
      throw new Error('Product ID is required');
    }

    try {
      const response = await apiCall(`/products/${id}`);
      return response;
    } catch (error) {
      console.error('Get product by ID error:', error);
      throw error;
    }
  },

  getProductBySlug: async (slug: string) => {
    if (!slug) {
      throw new Error('Product slug is required');
    }

    try {
      const response = await apiCall(`/products/slug/${slug}`);
      return response;
    } catch (error) {
      console.error('Get product by slug error:', error);
      throw error;
    }
  },

  getFeaturedProducts: async () => {
    try {
      const response = await apiCall('/products/featured');
      return response;
    } catch (error) {
      console.error('Get featured products error:', error);
      return { success: false, products: [] };
    }
  },

  getCategories: async () => {
    try {
      const response = await apiCall('/products/categories');
      return response;
    } catch (error) {
      console.error('Get categories error:', error);
      return { success: false, categories: [] };
    }
  },

  getServiceCategories: async () => {
    try {
      const response = await apiCall('/products/service-categories');
      return response;
    } catch (error) {
      console.error('Get service categories error:', error);
      return { success: false, categories: [] };
    }
  },

  getServiceItemsForProduct: async (productId: string) => {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    try {
      const response = await apiCall(`/products/${productId}/items`);
      return response;
    } catch (error) {
      console.error('Get service items error:', error);
      return { success: false, items: [] };
    }
  },
};

// ============ SERVICE API ============
export const serviceAPI = {
  getAllServices: async () => {
    try {
      const response = await apiCall('/services');
      return response;
    } catch (error) {
      console.error('Get all services error:', error);
      return { success: false, services: [] };
    }
  },

  getServiceById: async (id: string) => {
    if (!id) {
      throw new Error('Service ID is required');
    }

    try {
      const response = await apiCall(`/services/${id}`);
      return response;
    } catch (error) {
      console.error('Get service by ID error:', error);
      throw error;
    }
  },

  getServicesByCategory: async (category: string) => {
    if (!category) {
      throw new Error('Category is required');
    }

    try {
      const response = await apiCall(`/services/category/${category}`);
      return response;
    } catch (error) {
      console.error('Get services by category error:', error);
      return { success: false, services: [] };
    }
  },

  getServiceItems: async (serviceId: string) => {
    if (!serviceId) {
      throw new Error('Service ID is required');
    }

    try {
      const response = await apiCall(`/services/${serviceId}/items`);
      return response;
    } catch (error) {
      console.error('Get service items error:', error);
      return { success: false, items: [] };
    }
  },
};

// ============ CONTACT API ============
export const contactAPI = {
  submitContactForm: async (formData: any) => {
    if (!formData) {
      throw new Error('Form data is required');
    }

    try {
      const response = await apiCall('/contact/submit', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      return response;
    } catch (error) {
      console.error('Submit contact form error:', error);
      throw error;
    }
  },

  subscribeNewsletter: async (email: string) => {
    if (!email) {
      throw new Error('Email is required');
    }

    try {
      const response = await apiCall('/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      return response;
    } catch (error) {
      console.error('Subscribe to newsletter error:', error);
      throw error;
    }
  },
};

// ============ PROMO API ============
export const promoAPI = {
  validatePromoCode: async (code: string, sessionId?: string) => {
    if (!code) {
      throw new Error('Promo code is required');
    }

    try {
      const response = await apiCall(`/promo/validate/${code}`, {
        method: 'GET',
      }, sessionId);
      return response;
    } catch (error) {
      if (code.toLowerCase() === 'fresh10') {
        return { success: true, valid: true, discount: 10 };
      }
      return { success: false, valid: false };
    }
  },

  getAllPromoCodes: async () => {
    try {
      const response = await apiCall('/promo/all');
      return response;
    } catch (error) {
      console.error('Get all promo codes error:', error);
      return { success: false, promoCodes: [] };
    }
  },
};

// ============ USER API ============
export const userAPI = {
  getUserProfile: async (sessionId: string) => {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    try {
      const response = await apiCall('/user/profile', { method: 'GET' }, sessionId);
      return response;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  },

  updateUserProfile: async (sessionId: string, profileData: any) => {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    try {
      const response = await apiCall('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }, sessionId);
      return response;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  },
};
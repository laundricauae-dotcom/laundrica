'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { useSession } from '@/context/session-context';
import { productAPI, serviceAPI } from '@/lib/api';
import { Minus, Plus, ShoppingCart, ArrowLeft, Check, Clock, Shield, Truck, Leaf, AlertCircle, Phone, MessageCircle, Trash2, MapPin, X, Sparkles, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

// Service images mapping
const SERVICE_IMAGES: Record<string, string> = {
  'laundry': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaHDEQVLbQfnwFR9_VyvfLd-ko007XGQDbe8hwTsWY87HzOxSF5OEi1VIUhphuEPzTyIEYGuar_lQbl5IcLFr6Dnz7X7Z7pctJxklYiZfa-c9MxeiY35ivv9-1g0LOse4jxv133UHtIinIC088t7NfjZ_PC9rleHHBGmlsZ69ybT_UKrJ4utQTtvinL1UeEgulkfcg2nUWiJ2DIJYYhlitbNGfkogR5s0XfbMFFqM3gQtqlpbRweKf5r0np3KX1dvRGk_0eUCe4tVi',
  'dry-cleaning': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDSmGE2TtzW6YVlJMSyDumNuxjDafzBKzMdR4qG3eqVcTjAah0uNIQZPkLuWeHPHol4b4KvmlsPFC_KN3p7tWQBQ6QwwY9XUZtHuIIRZFMG-vCYoyJ0_b_XudUiAoeNPHtFhFaLpyFciaiUZmTUIz8SpnuLdtIr0RiWN6TrQRdNdIb0l8hb8_Ixsen9jOJTPqkeWMIP7psQVAw1npMZJXsAkH52LwBCa_R3N1DEIzyDhvtApslLYMdiQNPrDDyWg663DoZ--vmdfsf',
  'wash-and-fold': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP4Fl1mcL71ms-0aDco1bos4KJFJEZx5OQnJIOBWlWluJMOTU3XhoRrxAQvDa2yackx6UDbMN2aeY0HX3vJrKxXZZvOxDngQlZRCw6IC4qNlNInPtj13VA8r8kN-3-D0Jxrt44nDI5JAqB96hap1m-Sa8t_3oq6LroL8Ag9vqpd38eVyGtjT49EfXZUUUEmpo9H8CJRr1964I_IjjhCECEuvi3KYyJIWnmLx6Um420B0z6GG4nyB3DmF5ORn7DB6p1qP9FsFWioqH3',
  'steam-ironing': 'https://static.vecteezy.com/system/resources/thumbnails/075/548/139/small/closeup-electric-steam-iron-pressing-blue-shirt-with-powerful-vapor-mist-photo.jpeg',
  'shoe-cleaning': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyptsqgZUbgwL6Bq4bEsstny-6nDqBiqN5cBGYnfUgzSDXYcQRlm_pDhIj6-7C68tcWLpUVUoyuqYl-KtPTYiEtKvAJKV-rN_GAYoaYWEJWdkhtUtLShsLIqrzAO6qwGzS6zO7N7uSjdF1P9-5EztAjqUgYK-p6ctAHvjW1HY9dOh0XDdiAVOm2igRfKnzzKg7pled4rUzMo9aRGOi5PSI77IxhAP5ks-Hikp_CL0RfODVncfmgpsv7pnnGfj_ibEbUbaBjB1zew3f',
  'carpet-cleaning': '/images/carpet.png',
  'curtain-cleaning': 'https://lh3.googleusercontent.com/aida-public/AB6AXuA45R7mYBYS5a_-9pcT1PdHvi75OrnW6SgurkHhCX-fJ_ymGD8x0ZZuqiCo5Rh908iElZhzYe3KP3UjAx1wUQ4w_Gkwp_0eqEpz_6SyRfDVW2dl0ja2MyCknffKUydongro0YT2wxCiDPDXKNyOovJkMUoqOJr4ZA-NfMZLhrLsPSzz1PycN1W0-fHxB0FkSehzYFH-4oAoWgJiJMcL_xJ9Sn_AkpjsLYsdhmJFybGq8Ju4kHUF-wp0f_OGW_HJf2FKgFPDwm8vZA6D',
  'commercial': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaHDEQVLbQfnwFR9_VyvfLd-ko007XGQDbe8hwTsWY87HzOxSF5OEi1VIUhphuEPzTyIEYGuar_lQ5blIcLFr6Dnz7X7Z7pctJxklYiZfa-c9MxeiY35ivv9-1g0LOse4jxv133UHtIinIC088t7NfjZ_PC9rleHHBGmlsZ69ybT_UKrJ4utQTtvinL1UeEgulkfcg2nUWiJ2DIJYYhlitbNGfkogR5s0XfbMFFqM3gQtqlpbRweKf5r0np3KX1dvRGk_0eUCe4tVi',
};

type CategoryType = 'men' | 'women' | 'children' | 'household' | 'carpet' | 'shoes';

interface Category {
  id: CategoryType;
  label: string;
  icon: string;
  description: string;
  contactForPricing?: boolean;
}

interface ServiceItem {
  _id: string;
  id?: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  category: string;
  image?: string;
  contactForPricing?: boolean;
  minQuantity?: number;
}

interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  tagline?: string;
  category: string;
  turnaround?: string;
  features?: string[];
  image?: string;
  icon?: string;
  isActive: boolean;
}

const SERVICE_CATEGORY_MAP: Record<string, CategoryType[]> = {
  'laundry': ['men', 'women', 'children', 'household'],
  'dry-cleaning': ['men', 'women', 'children', 'household'],
  'carpet-cleaning': ['carpet'],
  'shoe-cleaning': ['shoes'],
  'curtain-cleaning': ['household'],
  'commercial': ['men', 'women', 'household'],
  'wash-and-fold': ['household'],// ✅ ADD THIS LINE
};

const ALL_CATEGORIES: Record<CategoryType, Category> = {
  men: { id: 'men', label: 'Men', icon: '👔', description: 'Shirts, pants, suits, and more' },
  women: { id: 'women', label: 'Women', icon: '👗', description: 'Dresses, blouses, skirts, and more' },
  children: { id: 'children', label: 'Children', icon: '🧸', description: 'Kids clothing, uniforms, and more' },
  household: { id: 'household', label: 'Household', icon: '🏠', description: 'Curtains, bedding, towels, and more' },
  carpet: { id: 'carpet', label: 'Carpet Cleaning', icon: '🧹', description: 'Professional carpet and rug cleaning', contactForPricing: true },
  shoes: { id: 'shoes', label: 'Shoe Cleaning', icon: '👟', description: 'Premium shoe cleaning and restoration', contactForPricing: true },
};

const DEFAULT_ITEMS: Record<CategoryType, ServiceItem[]> = {
  men: [
    { _id: 'men-shirts', name: 'T-shirts / Polo Shirts', price: 8, unit: 'piece', description: 'Professional pressing and folding', category: 'men' },
    { _id: 'men-formal-shirts', name: 'Formal Shirts', price: 10, unit: 'piece', description: 'Crisp ironing and stain removal', category: 'men' },
    { _id: 'men-pants', name: 'Trousers / Pants', price: 12, unit: 'piece', description: 'Crease-free pressing', category: 'men' },
    { _id: 'men-jeans', name: 'Jeans', price: 15, unit: 'piece', description: 'Color-safe washing', category: 'men' },
    { _id: 'men-kandora', name: 'Kandora / Dishdasha', price: 18, unit: 'piece', description: 'Expert care for traditional wear', category: 'men' },
    { _id: 'men-suits', name: 'Suit (2 piece)', price: 45, unit: 'set', description: 'Expert dry cleaning', category: 'men' },
    { _id: 'men-blazer', name: 'Blazer / Sport Coat', price: 25, unit: 'piece', description: 'Professional care', category: 'men' },
    { _id: 'men-sweater', name: 'Sweater / Jumper', price: 18, unit: 'piece', description: 'Gentle wool care', category: 'men' },
    { _id: 'men-shorts', name: 'Shorts', price: 8, unit: 'piece', description: 'Fresh and clean', category: 'men' },
  ],
  women: [
    { _id: 'women-shirts', name: 'T-shirts / Blouses', price: 8, unit: 'piece', description: 'Gentle fabric care', category: 'women' },
    { _id: 'women-pants', name: 'Trousers / Pants', price: 12, unit: 'piece', description: 'Perfect pressing', category: 'women' },
    { _id: 'women-jeans', name: 'Jeans', price: 15, unit: 'piece', description: 'Color protection', category: 'women' },
    { _id: 'women-abaya', name: 'Abaya', price: 25, unit: 'piece', description: 'Special care for abayas', category: 'women' },
    { _id: 'women-dress-casual', name: 'Casual Dress', price: 20, unit: 'piece', description: 'Gentle washing', category: 'women' },
    { _id: 'women-dress-formal', name: 'Formal Dress / Gown', price: 35, unit: 'piece', description: 'Premium dry cleaning', category: 'women' },
    { _id: 'women-skirt', name: 'Skirt', price: 10, unit: 'piece', description: 'Expert pressing', category: 'women' },
    { _id: 'women-saree', name: 'Saree', price: 40, unit: 'piece', description: 'Traditional saree care', category: 'women' },
    { _id: 'women-lehenga', name: 'Lehenga / Choli', price: 50, unit: 'set', description: 'Special care for wedding wear', category: 'women' },
  ],
  children: [
    { _id: 'kids-shirts', name: 'Kids Shirts', price: 6, unit: 'piece', description: 'Safe for sensitive skin', category: 'children' },
    { _id: 'kids-pants', name: 'Kids Pants', price: 8, unit: 'piece', description: 'Stain removal treatment', category: 'children' },
    { _id: 'kids-uniforms', name: 'School Uniforms', price: 10, unit: 'piece', description: 'Quick turnaround', category: 'children' },
    { _id: 'kids-dress', name: 'Kids Dress', price: 10, unit: 'piece', description: 'Gentle care', category: 'children' },
    { _id: 'kids-jeans', name: 'Kids Jeans', price: 8, unit: 'piece', description: 'Durable cleaning', category: 'children' },
    { _id: 'kids-shorts', name: 'Kids Shorts', price: 5, unit: 'piece', description: 'Fresh and clean', category: 'children' },
  ],
  household: [
    { _id: 'house-bedsheet-single', name: 'Bed Sheet (Single)', price: 15, unit: 'piece', description: 'Crisp and fresh', category: 'household' },
    { _id: 'house-bedsheet-double', name: 'Bed Sheet (Double)', price: 20, unit: 'piece', description: 'Professional pressing', category: 'household' },
    { _id: 'house-bedsheet-king', name: 'Bed Sheet (King)', price: 25, unit: 'piece', description: 'Expert care', category: 'household' },
    { _id: 'house-pillow', name: 'Pillow Cover', price: 6, unit: 'pair', description: 'Clean and fresh', category: 'household' },
    { _id: 'house-duvet', name: 'Duvet / Comforter', price: 45, unit: 'piece', description: 'Deep cleaning', category: 'household' },
    { _id: 'house-towel-bath', name: 'Bath Towel', price: 8, unit: 'piece', description: 'Fluffy and absorbent', category: 'household' },
    { _id: 'house-curtains', name: 'Curtains', price: 30, unit: 'panel', description: 'Dust-free cleaning', category: 'household' },
  ],
  carpet: [
    { _id: 'carpet-area', name: 'Area Rugs', price: 0, unit: 'sq ft', description: 'Professional deep cleaning for area rugs', category: 'carpet', contactForPricing: true },
    { _id: 'carpet-wall-to-wall', name: 'Wall-to-Wall Carpet', price: 0, unit: 'room', description: 'Complete carpet cleaning service', category: 'carpet', contactForPricing: true },
    { _id: 'carpet-stain', name: 'Stain Removal', price: 0, unit: 'stain', description: 'Specialized stain treatment', category: 'carpet', contactForPricing: true },
    { _id: 'carpet-protection', name: 'Carpet Protection', price: 0, unit: 'treatment', description: 'Protective coating application', category: 'carpet', contactForPricing: true },
  ],
  shoes: [
    { _id: 'shoes-sneakers', name: 'Sneakers', price: 0, unit: 'pair', description: 'Deep cleaning and deodorizing for sneakers', category: 'shoes', contactForPricing: true },
    { _id: 'shoes-leather', name: 'Leather Shoes', price: 0, unit: 'pair', description: 'Premium leather cleaning and conditioning', category: 'shoes', contactForPricing: true },
    { _id: 'shoes-suede', name: 'Suede Shoes', price: 0, unit: 'pair', description: 'Specialized suede cleaning and restoration', category: 'shoes', contactForPricing: true },
    { _id: 'shoes-luxury', name: 'Luxury Footwear', price: 0, unit: 'pair', description: 'Premium care for designer shoes', category: 'shoes', contactForPricing: true },
  ],
};

export default function ServiceOrderPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { addToCart, cartItems = [], updateQuantity, removeFromCart, clearCart } = useCart();
  const { sessionId } = useSession();

  const [service, setService] = useState<Service | null>(null);
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('men');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactItem, setContactItem] = useState<ServiceItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isClearingCart, setIsClearingCart] = useState(false);

  // Toggle switches for carpet and shoes - store in localStorage
  const [carpetToggle, setCarpetToggle] = useState(false);
  const [shoesToggle, setShoesToggle] = useState(false);

  // Load toggle states from localStorage on mount
  useEffect(() => {
    const savedCarpet = localStorage.getItem('carpetContactToggle');
    const savedShoes = localStorage.getItem('shoesContactToggle');
    if (savedCarpet) setCarpetToggle(savedCarpet === 'true');
    if (savedShoes) setShoesToggle(savedShoes === 'true');
  }, []);

  // Save toggle states to localStorage
  const handleCarpetToggle = (value: boolean) => {
    setCarpetToggle(value);
    localStorage.setItem('carpetContactToggle', String(value));
    if (value) {
      toast.success('Our agent will get in touch with you soon for Carpet');
    } else {
      toast.success('Carpet: Items can be added directly');
    }
  };

  const handleShoesToggle = (value: boolean) => {
    setShoesToggle(value);
    localStorage.setItem('shoesContactToggle', String(value));
    if (value) {
      toast.success('Our agent will get in touch with you soon for Shoes');
    } else {
      toast.success('Shoes: Items can be added directly');
    }
  };

  const getAvailableCategories = useCallback((): Category[] => {
    if (!service) return [];
    const serviceType = service.category;
    const categoryIds = SERVICE_CATEGORY_MAP[serviceType] || SERVICE_CATEGORY_MAP['laundry'];
    return categoryIds.map(id => ALL_CATEGORIES[id]);
  }, [service]);

  const availableCategories = useMemo(() => getAvailableCategories(), [getAvailableCategories]);

  useEffect(() => {
    if (availableCategories.length > 0 && !availableCategories.find(c => c.id === activeCategory)) {
      setActiveCategory(availableCategories[0].id);
    }
  }, [availableCategories, activeCategory]);

  useEffect(() => {
    fetchServiceAndItems();
  }, [slug]);


  const fetchServiceAndItems = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Use productAPI instead of serviceAPI
      const response = await productAPI.getProductBySlug(slug);

      if (response.success && response.product) {
        const foundService = response.product;
        setService(foundService);

        // Fetch service items using the product API
        try {
          const itemsResponse = await productAPI.getServiceItemsForProduct(foundService._id);
          if (itemsResponse.success && itemsResponse.items && itemsResponse.items.length > 0) {
            setServiceItems(itemsResponse.items);
            console.log(`Loaded ${itemsResponse.items.length} items for ${foundService.name}`);
          } else {
            console.log('No service items found in database');
            setServiceItems([]);
          }
        } catch (itemsError) {
          console.log('Error fetching service items:', itemsError);
          setServiceItems([]);
        }
      } else {
        // Try serviceAPI as fallback
        const servicesData = await serviceAPI.getAllServices();
        let foundService = null;

        if (servicesData.success && servicesData.services) {
          foundService = servicesData.services.find((s: any) => s.slug === slug);
        }

        if (foundService) {
          setService(foundService);
          // Fetch items similarly
          const itemsResponse = await serviceAPI.getServiceItems(foundService._id);
          if (itemsResponse.success && itemsResponse.items) {
            setServiceItems(itemsResponse.items);
          }
        } else {
          const localService = getLocalServiceBySlug(slug);
          if (localService) {
            setService(localService);
          } else {
            setError('Service not found');
          }
        }
      }
    } catch (err: any) {
      console.error('Error fetching service:', err);
      const localService = getLocalServiceBySlug(slug);
      if (localService) {
        setService(localService);
      } else {
        setError(err.message || 'Failed to load service');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getLocalServiceBySlug = (slug: string): Service | null => {
    const localServices: Record<string, Service> = {
      'professional-laundry-services-in-dubai': {
        _id: 'laundry-1',
        name: 'Laundry Services (Wash & Press)',
        slug: 'professional-laundry-services-in-dubai',
        description: 'Professional wash and press for all your clothing needs.',
        tagline: 'Fresh, clean, and perfectly pressed',
        category: 'laundry',
        turnaround: '24-48 hours',
        isActive: true,
      },
      'dry-cleaning-services-in-dubai': {
        _id: 'dry-clean-1',
        name: 'Dry Cleaning Services',
        slug: 'dry-cleaning-services-in-dubai',
        description: 'Expert dry cleaning for delicate and formal garments.',
        tagline: 'Gentle care for delicate fabrics',
        category: 'dry-cleaning',
        turnaround: '24-48 hours',
        isActive: true,
      },
      'carpet-cleaning-services-in-dubai': {
        _id: 'carpet-1',
        name: 'Carpet Cleaning Services',
        slug: 'carpet-cleaning-services-in-dubai',
        description: 'Professional deep cleaning for carpets and rugs.',
        tagline: 'Deep clean, fresh carpets',
        category: 'carpet-cleaning',
        turnaround: '24-48 hours',
        isActive: true,
      },
      'shoe-cleaning-services-in-dubai': {
        _id: 'shoe-1',
        name: 'Shoe Cleaning Services',
        slug: 'shoe-cleaning-services-in-dubai',
        description: 'Premium shoe cleaning and restoration.',
        tagline: 'Like new, every time',
        category: 'shoe-cleaning',
        turnaround: '24-48 hours',
        isActive: true,
      },
    };
    return localServices[slug] || null;
  };

  const getServiceImage = () => {
    if (service?.image) return service.image;
    return SERVICE_IMAGES[service?.category || 'laundry'] || '/images/laundry-service.jpg';
  };

  const getCartItemByOriginalId = (originalItemId: string) => {
    if (!Array.isArray(cartItems)) return null;
    return cartItems.find((item: any) => {
      if (item.metadata?.originalItemId === originalItemId) return true;
      if (item.productId === `${service?._id}-${originalItemId}`) return true;
      return false;
    });
  };

  const getCartQuantity = (itemId: string) => {
    const cartItem = getCartItemByOriginalId(itemId);
    return cartItem?.quantity || 0;
  };

  const shouldShowContactForItem = (item: ServiceItem): boolean => {
    if (item.contactForPricing) return true;
    // Check if the item's category matches the toggle state
    if (item.category === 'carpet' && carpetToggle) return true;
    if (item.category === 'shoes' && shoesToggle) return true;
    return false;
  };

  const handleIncrement = async (item: ServiceItem) => {
    if (!sessionId) {
      toast.error('Session not initialized');
      return;
    }

    // Check if item requires contact based on toggle
    if (shouldShowContactForItem(item)) {
      setContactItem(item);
      setShowContactModal(true);
      return;
    }

    // ✅ CHECK MINIMUM QUANTITY FOR WASH & FOLD
    const currentQty = getCartQuantity(item._id);
    const minQty = item.minQuantity || 1;

    // If it's a Wash & Fold item (unit is 'kg') and current quantity is 0
    if (item.unit === 'kg' && currentQty === 0 && minQty > 1) {
      // Show toast that minimum quantity is required
      toast.info(`${item.name}: Minimum ${minQty} kg required`);

      const cartItem = {
        productId: `${service?._id}-${item._id}`,
        name: item.name,
        price: item.price,
        quantity: minQty,  // ✅ ADD MINIMUM QUANTITY
        category: activeCategory,
        description: item.description,
        image: getServiceImage(),
        serviceItems: [],
        slug,
        metadata: {
          originalItemId: item._id,
          serviceName: service?.name,
          unit: item.unit,
          serviceId: service?._id,
          itemCategory: item.category,
          minQuantity: minQty  // ✅ ADD THIS - PASS MIN QUANTITY TO CART
        }
      };

      setSuccessMessage(`${minQty} kg ${item.name} added to cart (minimum order)`);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 1500);

      try {
        await addToCart(cartItem);
      } catch (err) {
        console.error('Error adding to cart:', err);
        toast.error('Failed to add to cart');
      }
      return;
    }

    // Normal increment for other items
    const cartItem = {
      productId: `${service?._id}-${item._id}`,
      name: item.name,
      price: item.price,
      quantity: 1,
      category: activeCategory,
      description: item.description,
      image: getServiceImage(),
      serviceItems: [],
      slug,
      metadata: {
        originalItemId: item._id,
        serviceName: service?.name,
        unit: item.unit,
        serviceId: service?._id,
        itemCategory: item.category,
        minQuantity: minQty  // ✅ ADD THIS - PASS MIN QUANTITY TO CART
      }
    };

    setSuccessMessage(`${item.name} added to cart`);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 1500);

    try {
      await addToCart(cartItem);
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Failed to add to cart');
    }
  };

  const handleDecrement = async (item: ServiceItem) => {
    if (!sessionId) {
      toast.error('Session not initialized');
      return;
    }

    const currentCartItem = getCartItemByOriginalId(item._id);
    if (!currentCartItem || !currentCartItem.id) return;

    const currentQty = currentCartItem.quantity;
    const newQty = currentQty - 1;

    // ✅ Show immediate feedback
    if (newQty === 0) {
      setSuccessMessage(`${item.name} removed from cart`);
    } else {
      setSuccessMessage(`${item.name} quantity updated`);
    }
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 1500);

    try {
      if (newQty === 0) {
        await removeFromCart(currentCartItem.id);
      } else {
        await updateQuantity(currentCartItem.id, newQty);
      }
    } catch (err) {
      console.error('Error updating cart:', err);
      toast.error('Failed to update cart');
    }
  };

  const handleRemoveItem = async (item: ServiceItem) => {
    if (!sessionId) {
      toast.error('Session not initialized');
      return;
    }

    const currentCartItem = getCartItemByOriginalId(item._id);
    if (!currentCartItem || !currentCartItem.id) return;

    // ✅ Show immediate feedback
    setSuccessMessage(`${item.name} removed from cart`);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 1500);

    try {
      await removeFromCart(currentCartItem.id);
    } catch (err) {
      console.error('Error removing from cart:', err);
      toast.error('Failed to remove from cart');
    }
  };

  const handleWhatsAppContact = (item: ServiceItem) => {
    const phoneNumber = "971508203555";
    const message = encodeURIComponent(
      `Hello, I'm interested in pricing for ${service?.name} - ${item.name}. Please share the pricing details.`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    setShowContactModal(false);
  };

  const handleCallContact = () => {
    window.location.href = "tel:+971508203555";
    setShowContactModal(false);
  };

  const handleBackToShopping = () => {
    router.push('/services');
  };

  const getCurrentItems = (): ServiceItem[] => {
    if (serviceItems.length > 0) {
      // ✅ FILTER BY BOTH CATEGORY AND SERVICE NAME
      // Only show items that belong to the current service's name
      return serviceItems.filter(item => {
        // First filter by active category
        if (item.category !== activeCategory) return false;

        // For Wash & Fold, only show items that are actually Wash & Fold items
        // (they don't have 'men', 'women', 'children' as category)
        if (service?.name === 'Wash & Fold') {
          // Only show household items that are specifically for Wash & Fold
          // These items have unit 'kg' and are from this service
          return item.unit === 'kg' || item.name.includes('Laundry Bag');
        }

        return true;
      });
    }
    // Default items - keep original order
    return DEFAULT_ITEMS[activeCategory] || [];
  };

  const subtotal = useMemo(() => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cartItems]);

  // NO DELIVERY FEE - removed completely
  const total = subtotal;

  const handleProceedToCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      router.push('/checkout');
    }, 1000);
  };

  const handleClearCart = async () => {
    if (!sessionId) {
      toast.error('Session not initialized');
      return;
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) return;

    setIsClearingCart(true);
    try {
      await clearCart();
      toast.success('Cart cleared');
    } catch (err) {
      console.error('Error clearing cart:', err);
      toast.error('Failed to clear cart');
    } finally {
      setIsClearingCart(false);
    }
  };

  const currentCategory = availableCategories.find(c => c.id === activeCategory);
  const isContactCategory = currentCategory?.contactForPricing || false;
  const currentItems = getCurrentItems();
  const cartItemsCount = Array.isArray(cartItems) ? cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;

  if (isLoading) {
    return (
      <main className="flex flex-col min-h-screen bg-[#f9faf7]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-2 border-[#bcedd7] rounded-full"></div>
              <div className="absolute inset-0 border-2 border-t-[#00261b] rounded-full animate-spin"></div>
            </div>
            <p className="text-[#5c5f5e]">Loading service details...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !service) {
    return (
      <main className="flex flex-col min-h-screen bg-[#f9faf7]">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-red-50 flex items-center justify-center mx-auto mb-4 rounded-full">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-[#00261b] mb-2">Service Not Found</h1>
            <p className="text-[#5c5f5e] mb-6">{error || 'The service you are looking for does not exist.'}</p>
            <Link href="/services">
              <Button className="bg-[#00261b] hover:bg-emerald-800 text-white px-6 py-2 rounded-xl">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Services
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#f9faf7]">
      <Header />

      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-[#00261b] text-white px-4 py-2 shadow-lg rounded-xl flex items-center gap-2 text-sm"
          >
            <Check className="w-4 h-4" />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContactModal && contactItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-md w-full p-6 shadow-xl rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#00261b]">Contact for Pricing</h3>
                <button onClick={() => setShowContactModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[#5c5f5e] mb-6">
                For {contactItem.name}, pricing varies based on size, material, and specific requirements.
                Please contact us directly for a personalized quote.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => handleWhatsAppContact(contactItem)}
                  className="w-full bg-[#25D366] hover:bg-[#20b859] text-white py-2 flex items-center justify-center gap-2 rounded-xl"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact via WhatsApp
                </Button>
                <Button
                  onClick={handleCallContact}
                  variant="outline"
                  className="w-full border border-[#00261b] text-[#00261b] hover:bg-[#bcedd7] py-2 flex items-center justify-center gap-2 rounded-xl"
                >
                  <Phone className="w-4 h-4" />
                  Call for Quote
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="relative bg-[#00261b] min-h-[400px] flex items-center">
        <div className="absolute inset-0 opacity-20">
          <img
            src={getServiceImage()}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <Link href="/services">
            <button className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </button>
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {service.name}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-4">
            {service.tagline || service.description}
          </p>
          {service.turnaround && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90">
              <Clock className="w-4 h-4" />
              <span>Turnaround: {service.turnaround}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items Section */}
          <div className="lg:col-span-2">
            <div className="mb-8 border-b border-gray-200">
              <div className="flex flex-wrap gap-1">
                {availableCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-5 py-2 font-medium transition-all rounded-t-lg ${activeCategory === category.id
                      ? 'text-[#00261b] border-b-2 border-[#00261b] bg-[#bcedd7]/20'
                      : 'text-[#5c5f5e] hover:text-[#00261b]'
                      }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.label}
                    {category.contactForPricing && (
                      <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                        Contact
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {currentItems.map((item) => {
                const cartQty = getCartQuantity(item._id);
                const requiresContact = shouldShowContactForItem(item);
                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl border border-gray-100 hover:border-[#bcedd7] hover:shadow-md transition-all duration-300"
                  >
                    <div className="p-5">
                      <div className="mb-3">
                        <h3 className="text-lg font-semibold text-[#00261b] mb-1">{item.name}</h3>
                        <p className="text-sm text-[#5c5f5e]">{item.description}</p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div>
                          {requiresContact ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[#00261b] font-medium">Contact for Price</span>
                            </div>
                          ) : (
                            <div>
                              <span className="text-xl font-bold text-[#00261b]">AED {item.price}</span>
                              <span className="text-sm text-[#5c5f5e] ml-1">/{item.unit}</span>
                              {/* ✅ SHOW MINIMUM QUANTITY FOR KG ITEMS */}
                              {item.unit === 'kg' && item.minQuantity && item.minQuantity > 1 && (
                                <div className="text-xs text-amber-600 mt-1">
                                  Min {item.minQuantity} {item.unit}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {requiresContact ? (
                          <Button
                            onClick={() => {
                              setContactItem(item);
                              setShowContactModal(true);
                            }}
                            className="bg-[#00261b] hover:bg-emerald-800 text-white px-4 py-1.5 text-sm rounded-lg"
                          >
                            Contact
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#00261b] transition-colors disabled:opacity-50"
                                onClick={() => handleDecrement(item)}
                                disabled={cartQty === 0}
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-10 text-center text-[#00261b] font-medium">
                                {cartQty}
                              </span>
                              <button
                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#00261b] transition-colors"
                                onClick={() => handleIncrement(item)}
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            {cartQty > 0 && (
                              <button
                                onClick={() => handleRemoveItem(item)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {currentItems.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-[#00261b] mb-1">No Items Available</h3>
                <p className="text-[#5c5f5e]">Please check another category.</p>
              </div>
            )}
          </div>

          {/* Order Summary - WITH TOGGLE BUTTONS INSIDE */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                <div className="bg-[#00261b] p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-white" />
                      <h3 className="font-semibold text-white">Your Cart</h3>
                      <span className="text-sm text-[#bcedd7]">({cartItemsCount})</span>
                    </div>
                    {cartItemsCount > 0 && (
                      <button
                        onClick={handleClearCart}
                        disabled={isClearingCart}
                        className="text-xs text-[#bcedd7] hover:text-white transition-colors disabled:opacity-50"
                      >
                        {isClearingCart ? 'Clearing...' : 'Clear all'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  {/* TOGGLE BUTTONS FOR CARPET AND SHOES */}
                  <div className="mb-4 space-y-3 pb-4 border-b border-gray-200">
                    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🧹</span>
                        <div>
                          <p className="text-sm font-medium text-[#00261b]">Carpet Items</p>
                          <p className="text-xs text-gray-500">Please select if there is requirement our team will contact you shortly</p>
                        </div>
                      </div>
                      <button
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
                          <p className="text-xs text-gray-500">Please select if there is requirement our team will contact you shortly</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleShoesToggle(!shoesToggle)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${shoesToggle ? 'bg-[#00261b]' : 'bg-gray-300'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${shoesToggle ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-60 overflow-y-auto mb-4">
                    {cartItemsCount === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingCart className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-[#5c5f5e] text-sm">Your cart is empty</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {cartItems.map((item: any) => {
                          const originalItem = currentItems.find(i => i._id === item.metadata?.originalItemId);
                          return (
                            <div key={item.id} className="flex items-start justify-between border-b border-gray-100 pb-3">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-[#00261b]">{item.name}</p>
                                {item.metadata?.serviceName && (
                                  <p className="text-xs text-gray-400">Service: {item.metadata.serviceName}</p>
                                )}
                                <p className="text-xs text-gray-400">
                                  AED {item.price} per {item.metadata?.unit || 'piece'}
                                </p>
                                {/* ✅ SHOW TOTAL WEIGHT FOR KG ITEMS */}
                                {item.metadata?.unit === 'kg' && (
                                  <p className="text-xs text-emerald-600 font-medium">
                                    Total: {item.quantity} kg = AED {(item.price * item.quantity).toFixed(2)}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                  <button
                                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#00261b] transition-colors disabled:opacity-50"
                                    onClick={() => {
                                      if (originalItem) {
                                        handleDecrement(originalItem);
                                      }
                                    }}
                                    disabled={!originalItem}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-8 text-center text-sm text-[#00261b]">
                                    {item.quantity}
                                  </span>
                                  <button
                                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#00261b] transition-colors"
                                    onClick={() => {
                                      if (originalItem) {
                                        handleIncrement(originalItem);
                                      }
                                    }}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                                <button
                                  onClick={() => {
                                    if (originalItem) {
                                      handleRemoveItem(originalItem);
                                    } else if (item.id) {
                                      removeFromCart(item.id);
                                    }
                                  }}
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {cartItemsCount > 0 && (
                    <>
                      <div className="space-y-2 mb-4 pt-2 border-t border-gray-100">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#5c5f5e]">Subtotal</span>
                          <span className="font-medium text-[#00261b]">AED {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                          <div className="flex justify-between">
                            <span className="font-semibold text-[#00261b]">Total</span>
                            <span className="text-xl font-bold text-[#00261b]">AED {total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-[#00261b] hover:bg-emerald-800 text-white py-3 font-medium rounded-xl transition-all duration-300 hover:shadow-lg"
                          onClick={handleProceedToCheckout}
                          disabled={isCheckingOut}
                        >
                          {isCheckingOut ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Processing...
                            </div>
                          ) : (
                            'Checkout'
                          )}
                        </Button>
                        <Button
                          onClick={handleBackToShopping}
                          variant="outline"
                          className="border-[#00261b] text-[#00261b] hover:bg-[#bcedd7] py-3 font-medium rounded-xl"
                        >
                          <ShoppingBag className="w-4 h-4 mr-1" />
                          Shop More
                        </Button>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mt-4">
                        {[
                          { icon: Shield, label: 'Secure' },
                          { icon: Truck, label: 'Free' },
                          { icon: Clock, label: '24-48h' },
                          { icon: Leaf, label: 'Eco' },
                        ].map((badge, idx) => (
                          <div key={idx} className="text-center py-2 bg-[#bcedd7]/20 rounded-lg">
                            <badge.icon className="w-4 h-4 mx-auto mb-0.5 text-[#00261b]" />
                            <p className="text-[10px] text-[#5c5f5e]">{badge.label}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 p-2 bg-[#bcedd7]/20 rounded-lg flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#00261b] mt-0.5" />
                        <p className="text-[11px] text-[#5c5f5e]">
                          Free delivery. Estimated 24-48 hours.
                        </p>
                      </div>
                    </>
                  )}

                  <div className={`mt-4 p-3 bg-[#bcedd7]/20 rounded-lg flex items-center justify-between ${cartItemsCount === 0 ? 'mt-0' : ''}`}>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-[#00261b]" />
                      <span className="text-xs text-[#00261b]">Need help?</span>
                    </div>
                    <button
                      onClick={() => window.open('https://wa.me/971509259667', '_blank')}
                      className="text-xs text-[#00261b] font-medium hover:underline"
                    >
                      Chat with us
                    </button>
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
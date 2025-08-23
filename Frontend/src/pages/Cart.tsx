import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { Chatbot } from "@/components/Chatbot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CartHeader from "@/components/cart/CartHeader";
import OrderSummary from "@/components/cart/OrderSummary";
import CartItem from "@/components/cart/CartItem";
import SavedItems from "@/components/cart/SavedItems";
import { RelatedProducts } from "@/components/RelatedProducts";
import { ShoppingCart, Loader2 } from 'lucide-react';
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from "react-router-dom";
import { getCategoryIcon, getLicenseColor } from '@/components/cart/utils';
import { CartItem as CartItemType, SavedItem, FeaturedProject } from '@/components/cart/types';
import { useToast } from '@/hooks/use-toast';
import { useAuthState } from '@/hooks/useAuthState';
import userService from '@/services/userService';
import { toast } from 'sonner';
import Header from "@/components/Header";
import { API_ENDPOINTS } from '../config/api';
import NoImageAvailable from '@/assets/images/no image available.png';

interface BackendCartItem {
  productId: string;
  addedAt: string;
  quantity: number;
}

const Cart = () => {
  const { toast: showToast } = useToast();
  const { user, isLoading: authLoading } = useAuthState();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  const featuredProjects: FeaturedProject[] = [
    {
      id: '5',
      name: 'Smart City IoT Management',
      description: 'Comprehensive IoT platform for managing smart city infrastructure with real-time monitoring',
      price: 1999.99,
      category: 'software',
      studentName: 'David Kim',
      university: 'Carnegie Mellon',
      rating: 4.6,
      tags: ['IoT', 'Smart City', 'Infrastructure']
    },
    {
      id: '6',
      name: 'Quantum Computing Algorithm',
      description: 'Advanced quantum computing algorithm for cryptographic applications',
      price: 4299.99,
      category: 'algorithm',
      studentName: 'Lisa Zhang',
      university: 'Harvard University',
      rating: 4.9,
      tags: ['Quantum', 'Cryptography', 'Security']
    },
    {
      id: '7',
      name: 'Sustainable Architecture Design',
      description: 'Eco-friendly building design framework using AI-optimized materials',
      price: 2799.99,
      category: 'design',
      studentName: 'Carlos Martinez',
      university: 'MIT',
      rating: 4.7,
      tags: ['Architecture', 'Sustainability', 'AI']
    },
    {
      id: '8',
      name: 'Neural Network Framework',
      description: 'Lightweight neural network framework optimized for edge computing',
      price: 1799.99,
      category: 'software',
      studentName: 'Priya Patel',
      university: 'Stanford University',
      rating: 4.8,
      tags: ['Neural Networks', 'Edge Computing', 'ML']
    },
    {
      id: '9',
      name: 'Renewable Energy Optimizer',
      description: 'AI-powered system for optimizing renewable energy production and distribution',
      price: 3499.99,
      category: 'idea',
      studentName: 'Ahmed Hassan',
      university: 'UC Berkeley',
      rating: 4.5,
      tags: ['Renewable Energy', 'Optimization', 'AI']
    },
    {
      id: '10',
      name: 'Autonomous Vehicle Control',
      description: 'Advanced control system for autonomous vehicle navigation and safety',
      price: 3999.99,
      category: 'software',
      studentName: 'Sophie Chen',
      university: 'Georgia Tech',
      rating: 4.9,
      tags: ['Autonomous Vehicles', 'Safety', 'Control Systems']
    }
  ];

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/signin');
        return;
      }
      loadCartData();
    }
  }, [user, authLoading, navigate]);

  const loadCartData = async () => {
    try {
      setLoading(true);
      
      const userData = await userService.getUserProfile();
      if (!userData || !userData.customUserId) {
        console.error('User data or customUserId not found');
        toast.error('User data not found');
        return;
      }

      console.log('Firebase UID:', user.uid);
      
      // Fetch cart data from backend
      const response = await userService.getUserCartByCustomId(userData.customUserId);
      console.log('Cart data received:', response);
      
      // Handle different response structures
      let cartData: any[] = [];
      if (Array.isArray(response)) {
        cartData = response;
      } else if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as any).data)) {
        cartData = (response as any).data;
      } else if (response && typeof response === 'object' && 'cart' in response && Array.isArray((response as any).cart)) {
        cartData = (response as any).cart;
      } else {
        console.log('No cart data found or invalid structure:', response);
        setCartItems([]);
        return;
      }
      
      // Fetch project details from marketplace for each cart item
      const transformedCartItems: CartItemType[] = (await Promise.all(
        cartData.map(async (item: BackendCartItem) => {
          try {
            // Fetch project details from marketplace
            const response = await fetch(API_ENDPOINTS.MARKETPLACE_PROJECT(item.productId));
            console.log(`Fetching project ${item.productId}, status: ${response.status}`);
            
            if (!response.ok) {
              if (response.status === 404) {
                console.warn(`Project ${item.productId} not found in marketplace - will be removed from cart`);
                // Automatically remove invalid item from cart
                try {
                  await userService.removeFromCart(item.productId);
                  console.log(`Removed invalid project ${item.productId} from cart`);
                } catch (removeError) {
                  console.error(`Failed to remove invalid project ${item.productId} from cart:`, removeError);
                }
                return null; // Skip this item
              }
              throw new Error(`Failed to fetch project ${item.productId} - Status: ${response.status}`);
            }
            const projectData = await response.json();
            console.log(`Project data for ${item.productId}:`, projectData);
            const project = projectData.project;
            
            if (!project) {
              throw new Error(`No project data returned for ${item.productId}`);
            }
            
            console.log(`Project details for ${item.productId}:`, {
              title: project.title,
              price: project.price,
              description: project.description,
              category: project.category
            });
            
            return {
              id: item.productId,
              name: project.title || `Project ${item.productId}`,
              description: project.description || 'No description available',
              price: project.price || 0,
              category: (project.category || 'software').toLowerCase() as 'software' | 'idea' | 'design' | 'algorithm',
              studentName: typeof project.author === 'string' ? 'Unknown' : (project.author?.name || 'Unknown'),
              university: 'University', // You can add university field to marketplace if needed
              rating: project.rating || 0,
              downloadable: true,
              licenseType: 'commercial' as const,
              tags: project.tags || ['Unknown'],
              quantity: item.quantity,
              image: project.image || NoImageAvailable
            };
          } catch (error) {
            console.error(`Error fetching project ${item.productId}:`, error);
            // For non-404 errors, still show the item but with fallback data
            return {
              id: item.productId,
              name: `Project ${item.productId}`,
              description: 'Project details not available - this project may have been removed from the marketplace',
              price: 0,
              category: 'software' as const,
              studentName: 'Unknown',
              university: 'Unknown University',
              rating: 0,
              downloadable: true,
              licenseType: 'commercial' as const,
              tags: ['Unknown'],
              quantity: item.quantity,
              image: NoImageAvailable
            };
          }
        }))
      ).filter((item) => item !== null) as CartItemType[];

      setCartItems(transformedCartItems);
      
      // Notify user if any invalid items were removed
      const removedCount = cartData.length - transformedCartItems.length;
      if (removedCount > 0) {
        toast.info(`${removedCount} invalid item${removedCount > 1 ? 's' : ''} removed from cart automatically`);
      }
    } catch (error) {
      console.error('Error loading cart data:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      
      // Additional debugging for user not found error
      if (error.message === 'User not found') {
        console.error('=== USER NOT FOUND DEBUGGING ===');
        console.error('Firebase UID:', user?.uid);
        const userData = await userService.getUserProfile();
        console.error('Custom User ID from backend:', userData?.customUserId);
        console.error('=== END DEBUGGING ===');
      }
      
      toast.error('Failed to load cart data');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id: string) => {
    try {
      const userData = await userService.getUserProfile();
      if (!userData) {
        toast.error('User data not found');
        return;
      }

      // Remove item from cart in backend
      await userService.removeFromCart(id);
      
      // Update local state
      setCartItems(items => items.filter(item => item.id !== id));
      toast.success('Project removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const moveToSaved = (item: CartItemType) => {
    setSavedItems(prev => [...prev, {
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      studentName: item.studentName
    }]);
    removeItem(item.id);
    toast.success('Project saved for later');
  };

  const moveToCart = (savedItem: SavedItem) => {
    const newCartItem: CartItemType = {
      ...savedItem,
      description: 'Engineering solution moved from saved items',
      university: 'Engineering University',
      rating: 4.5,
      downloadable: true,
      licenseType: 'commercial',
      tags: ['Engineering', 'Innovation'],
      quantity: 1
    };
    setCartItems(prev => [...prev, newCartItem]);
    setSavedItems(prev => prev.filter(item => item.id !== savedItem.id));
    toast.success('Project moved to cart');
  };

  const clearCart = async () => {
    try {
      const userData = await userService.getUserProfile();
      if (!userData) {
        toast.error('User data not found');
        return;
      }

      // Clear cart in backend
      await userService.clearCart();
      
      // Update local state
      setCartItems([]);
      toast.success('Cart cleared successfully');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const buyNow = (item: CartItemType) => {
    toast.success(`Proceeding to checkout for ${item.name}`);
  };

  const addToWishlist = (project: FeaturedProject) => {
    const wishlistItem: SavedItem = {
      id: project.id,
      name: project.name,
      price: project.price,
      category: project.category,
      studentName: project.studentName
    };
    
    const isAlreadyInWishlist = savedItems.some(item => item.id === project.id);
    if (isAlreadyInWishlist) {
      toast.error(`${project.name} is already in your wishlist`);
      return;
    }
    
    setSavedItems(prev => [...prev, wishlistItem]);
    toast.success(`${project.name} has been added to your wishlist`);
  };

  const addToCart = (project: FeaturedProject) => {
    const newCartItem: CartItemType = {
      ...project,
      university: project.university,
      downloadable: true,
      licenseType: 'commercial',
      quantity: 1
    };
    setCartItems(prev => [...prev, newCartItem]);
    toast.success(`${project.name} has been added to your cart`);
  };
  

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const platformFee = subtotal * 0.05;
  const total = subtotal + platformFee;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-lg font-medium text-blue-900">Loading cart...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <Header />
      <div className="container mx-auto px-2 xs:px-4 py-4 xs:py-8 flex-1 w-full relative">
        {/* Cart Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-2">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-7 w-7 text-blue-600" />
            <h2 className="heading-section font-bold text-gray-900 mobile-text-4xl">
              Your Cart
            </h2>
            <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
              {cartItems.length}
            </span>
          </div>
          {/* Desktop Clear Cart button */}
          {cartItems.length > 0 && (
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hidden sm:inline-flex"
              onClick={clearCart}
              size="sm"
            >
              Clear Cart
            </Button>
          )}
        </div>

        {/* Main Cart Content */}
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <ShoppingCart className="h-14 w-14 text-gray-300 mb-4" />
            <h3 className="text-lg xs:text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-4 text-center max-w-xs">
              Looks like you haven't added any projects yet. Browse the marketplace to find innovative student projects.
            </p>
            <Link to="/marketplace">
              <Button className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-base rounded-full shadow">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-x-8 gap-y-10">
            {/* Cart Items Section */}
            <div className="xl:col-span-2 space-y-6">
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="rounded-xl bg-white shadow-md hover:shadow-lg transition-all border border-gray-100 p-3 xs:p-4 flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-full sm:w-32">
                      <img
                        src={item.image || NoImageAvailable}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200 bg-gray-50"
                        onError={e => { e.currentTarget.src = NoImageAvailable; }}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold">
                            {item.category}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 font-semibold">
                            {item.licenseType}
                          </span>
                        </div>
                        <h4 className="text-base xs:text-lg font-bold text-gray-900 mb-1">{item.name}</h4>
                        <p className="text-xs xs:text-sm text-gray-600 mb-1 line-clamp-2">{item.description}</p>
                        <div className="flex flex-wrap gap-1 mb-1">
                          {item.tags?.map((tag, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-500">{tag}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>By <span className="font-semibold text-gray-700">{item.studentName}</span></span>
                          <span className="hidden xs:inline">|</span>
                          <span>{item.university}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-green-600">₹{item.price}</span>
                            <span className="text-xs text-gray-500">per item</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mt-2 gap-2">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" onClick={() => moveToSaved(item)}>
                            Save for later
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => removeItem(item.id)}>
                            Remove
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => buyNow(item)}>
                            Buy Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="xl:col-span-1">
              <div className="sticky top-6">
                <OrderSummary
                  subtotal={subtotal}
                  platformFee={platformFee}
                  total={total}
                  itemCount={cartItems.length}
                />
              </div>
            </div>
          </div>
        )}

        {/* Saved Items Section */}
        {savedItems.length > 0 && (
          <div className="mt-12">
            <Card className="bg-white/90 shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg xs:text-xl font-bold text-gray-900">Saved for Later</CardTitle>
              </CardHeader>
              <CardContent>
                <SavedItems
                  items={savedItems}
                  onMoveToCart={moveToCart}
                  onRemove={(id) => setSavedItems(items => items.filter(item => item.id !== id))}
                />
              </CardContent>
            </Card>
          </div>
        )}

        <RelatedProducts/>

        {/* Mobile Clear Cart Button */}
        {cartItems.length > 0 && (
          <div className="fixed bottom-0 left-0 w-full z-30 sm:hidden bg-white/90 border-t border-gray-200 px-4 py-3 flex justify-center">
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 w-full max-w-xs"
              onClick={clearCart}
              size="sm"
            >
              Clear Cart
            </Button>
          </div>
        )}
      </div>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Cart;

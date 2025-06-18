import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { Chatbot } from "@/components/Chatbot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CartHeader from "@/components/cart/CartHeader";
import OrderSummary from "@/components/cart/OrderSummary";
import CartItem from "@/components/cart/CartItem";
import SavedItems from "@/components/cart/SavedItems";
import FeaturedProjects from "@/components/cart/FeaturedProjects";
import { ShoppingCart, Loader2 } from 'lucide-react';
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from "react-router-dom";
import { getCategoryIcon, getLicenseColor } from '@/components/cart/utils';
import { CartItem as CartItemType, SavedItem, FeaturedProject } from '@/components/cart/types';
import { useToast } from '@/hooks/use-toast';
import { useAuthState } from '@/hooks/useAuthState';
import { firestoreService } from '@/services/firestoreService';
import { userService } from '@/services/userService';
import { toast } from 'sonner';

interface BackendCartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
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
      
      // Get user data from Firestore to get customUserId
      const firestoreData = await firestoreService.getCurrentUserData();
      if (!firestoreData) {
        toast.error('User data not found');
        return;
      }

      // Fetch cart data from backend
      const cartData = await userService.getUserCartByCustomId(firestoreData.customUserId);
      
      // Transform backend cart items to frontend format
      const transformedCartItems: CartItemType[] = cartData.map((item: BackendCartItem) => ({
        id: item.productId,
        name: item.name,
        description: 'Engineering solution from marketplace',
        price: item.price,
        category: 'software', // Default category
        studentName: 'Engineering Student',
        university: 'Engineering University',
        rating: 4.5,
        downloadable: true,
        licenseType: 'commercial',
        tags: ['Engineering', 'Innovation'],
        quantity: item.quantity
      }));

      setCartItems(transformedCartItems);
    } catch (error) {
      console.error('Error loading cart data:', error);
      toast.error('Failed to load cart data');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id: string) => {
    try {
      const firestoreData = await firestoreService.getCurrentUserData();
      if (!firestoreData) {
        toast.error('User data not found');
        return;
      }

      // Remove item from cart in backend
      await userService.removeFromCart(firestoreData.customUserId, id);
      
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
      tags: ['Engineering', 'Innovation']
    };
    setCartItems(prev => [...prev, newCartItem]);
    setSavedItems(prev => prev.filter(item => item.id !== savedItem.id));
    toast.success('Project moved to cart');
  };

  const clearCart = async () => {
    try {
      const firestoreData = await firestoreService.getCurrentUserData();
      if (!firestoreData) {
        toast.error('User data not found');
        return;
      }

      // Clear cart in backend
      await userService.clearCart(firestoreData.customUserId);
      
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
      toast({
        title: "Already in wishlist",
        description: `${project.name} is already in your wishlist`
      });
      return;
    }
    
    setSavedItems(prev => [...prev, wishlistItem]);
    toast({
      title: "Added to wishlist",
      description: `${project.name} has been added to your wishlist`
    });
  };

  const addToCart = (project: FeaturedProject) => {
    const newCartItem: CartItemType = {
      ...project,
      university: project.university,
      downloadable: true,
      licenseType: 'commercial'
    };
    setCartItems(prev => [...prev, newCartItem]);
    toast({
      title: "Added to cart",
      description: `${project.name} has been added to your cart`
    });
  };
  

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const platformFee = subtotal * 0.05;
  const total = subtotal + platformFee;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading cart...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Cart Section */}
          <div className="lg:col-span-2">
            <CartHeader itemCount={cartItems.length} />
            
            {cartItems.length === 0 ? (
              <Card className="p-8 text-center">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add some amazing engineering solutions to get started!</p>
                <Link to="/marketplace">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Browse Marketplace
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={removeItem}
                    onSave={moveToSaved}
                    onBuyNow={buyNow}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <OrderSummary items={cartItems} />
            <SavedItems 
              items={savedItems} 
              onMoveToCart={moveToCart}
            />
            <FeaturedProjects 
              projects={featuredProjects}
              onAddToWishlist={addToWishlist}
            />
          </div>
        </div>
      </div>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Cart;

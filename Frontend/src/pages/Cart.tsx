
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { Chatbot } from "@/components/Chatbot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CartHeader from "@/components/cart/CartHeader";
import OrderSummary from "@/components/cart/OrderSummary";
import CartItem from "@/components/cart/CartItem";
import SavedItems from "@/components/cart/SavedItems";
import FeaturedProjects from "@/components/cart/FeaturedProjects";
import { ShoppingCart} from 'lucide-react';
import { ArrowLeft } from 'lucide-react'
import { Link } from "react-router-dom";
import { getCategoryIcon, getLicenseColor } from '@/components/cart/utils';
import { CartItem as CartItemType, SavedItem, FeaturedProject } from '@/components/cart/types';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItemType[]>([{
    id: '1',
    name: 'AI-Powered Traffic Management System',
    description: 'Machine learning algorithm for optimizing city traffic flow with real-time data processing and predictive analytics',
    price: 2499.99,
    category: 'software',
    studentName: 'Alex Chen',
    university: 'MIT',
    rating: 4.8,
    downloadable: true,
    licenseType: 'enterprise',
    tags: ['AI', 'Machine Learning', 'Traffic', 'Urban Planning']
  }, {
    id: '2',
    name: 'Blockchain Supply Chain Tracker',
    description: 'Complete solution for transparent supply chain management using blockchain technology with smart contracts',
    price: 1899.99,
    category: 'software',
    studentName: 'Sarah Johnson',
    university: 'Stanford University',
    rating: 4.9,
    downloadable: true,
    licenseType: 'commercial',
    tags: ['Blockchain', 'Supply Chain', 'Transparency', 'Enterprise']
  }, {
    id: '3',
    name: 'Sustainable Energy Grid Design',
    description: 'Innovative smart grid architecture for renewable energy distribution and optimization with IoT integration',
    price: 3299.99,
    category: 'design',
    studentName: 'Miguel Rodriguez',
    university: 'Caltech',
    rating: 4.7,
    downloadable: false,
    licenseType: 'enterprise',
    tags: ['Energy', 'Sustainability', 'Smart Grid', 'Renewable']
  }]);

  const [savedItems, setSavedItems] = useState<SavedItem[]>([{
    id: '4',
    name: 'IoT Security Framework',
    price: 1599.99,
    category: 'software',
    studentName: 'Emma Wilson'
  }]);

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

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast({
      title: "Project removed",
      description: "Engineering solution has been removed from your cart"
    });
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
    toast({
      title: "Saved for later",
      description: "Project has been saved to your watchlist"
    });
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
    toast({
      title: "Added to cart",
      description: "Project has been moved to your cart"
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart cleared",
      description: "All engineering solutions have been removed from your cart"
    });
  };

  const buyNow = (item: CartItemType) => {
    toast({
      title: "Proceeding to checkout",
      description: `Processing purchase for ${item.name}`
    });
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


   return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100">
      
      <CartHeader itemCount={cartItems.length} />
    

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
          <div className="xl:col-span-4 space-y-6">
            <Card className="border-gray-200 shadow-sm bg-white">
              <CardHeader className="flex flex-row items-center justify-between bg-gray-50 rounded-t-lg px-4 sm:px-6">
                <CardTitle className="flex items-center gap-3 text-gray-900 text-lg sm:text-xl">
                  <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  Selected Engineering Solutions
                </CardTitle>
                {cartItems.length > 0 && (
                  <Button variant="outline" size="sm" onClick={clearCart} className="border-gray-300 text-gray-700 hover:bg-gray-100 text-xs sm:text-sm">
                    Clear All
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12 sm:py-16">
                    <ShoppingCart className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-gray-400 mb-6" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900">Your cart is empty</h3>
                    <p className="text-gray-600 mb-6 text-sm sm:text-base lg:text-lg">Discover innovative engineering solutions from top universities</p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base">
                      Browse Engineering Projects
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    {cartItems.map(item => (
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
              </CardContent>
            </Card>

            <SavedItems items={savedItems} onMoveToCart={moveToCart} />
          </div>
        </div>
        
          <OrderSummary
        subtotal={subtotal}
        platformFee={platformFee}
        total={total}
        itemCount={cartItems.length}
      />

        <div className="mt-6 text-center">
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3">
            Continue Browsing Engineering Solutions
          </Button>
        </div>

        <div className="mt-12">
          <FeaturedProjects
            projects={featuredProjects}
            onAddToCart={addToCart}
            onAddToWishlist={addToWishlist}
          />
        </div>
      </div>
        <Footer />
        <Chatbot />
    </div>
  );
};

export default Cart;

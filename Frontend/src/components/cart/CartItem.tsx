import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Shield, ShoppingCart, Bookmark, Download, Star, GraduationCap } from 'lucide-react';
import { CartItem as CartItemType } from './types';
import { getCategoryIcon,  getLicenseColor } from '@/components/cart/utils';

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onSave: (item: CartItemType) => void;
  onBuyNow: (item: CartItemType) => void;
}

 // Use different Unsplash images based on item category and ID
  const getImageUrl = (itemId: string, category: string) => {
    const imageMap: { [key: string]: string } = {
      '1': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&crop=center',
      '2': 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop&crop=center',
      '3': 'https://images.unsplash.com/photo-1497436072909-f5e4be06ca1f?w=800&h=600&fit=crop&crop=center'
    };
    
    return imageMap[itemId] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop&crop=center';
  };


const CartItem = ({ item, onRemove, onSave, onBuyNow }: CartItemProps) => {
   // Convert dollars to rupees (approximate conversion rate: 1 USD = 83 INR)
  const conversionRate = 83;
  const priceINR = item.price * conversionRate;
 return (
     <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-6 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
      {/* Left side - Image */}
      <div className="w-full lg:w-48 xl:w-56 flex-shrink-0">
        <div className="aspect-video lg:aspect-square w-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg border border-gray-200 overflow-hidden">
          <img 
            src={getImageUrl(item.id, item.category)}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Right side - Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-2 mb-2">
              <h3 className="font-semibold text-lg lg:text-xl text-gray-900 leading-tight">{item.name}</h3>
              <Badge variant="outline" className="text-xs border-blue-300 text-blue-700 bg-blue-50">
                {item.category}
              </Badge>
            </div>
            
            <p className="text-gray-600 text-sm lg:text-base mb-3 line-clamp-2">{item.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1">
                <span className="font-medium">by {item.studentName}</span>
              </span>
              <span>• {item.university}</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{item.rating}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {item.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                  {tag}
                </Badge>
              ))}
              {item.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                  +{item.tags.length - 3} more
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {item.downloadable && (
                <div className="flex items-center gap-1 text-green-600">
                  <Download className="h-4 w-4" />
                  <span>Downloadable</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-blue-600">
                <Shield className="h-4 w-4" />
                <span className="capitalize">{item.licenseType} License</span>
              </div>
            </div>
          </div>
          
          {/* Price and actions */}
          <div className="flex flex-col items-start lg:items-end gap-3 lg:min-w-[200px]">
            <div className="text-right">
              <div className="text-2xl lg:text-3xl font-bold text-gray-900">₹{priceINR.toFixed(2)}</div>
              <div className="text-sm text-gray-500">${item.price.toFixed(2)}</div>
            </div>
            
            <div className="flex flex-col lg:flex-col xl:flex-row gap-2 w-full lg:w-auto">
              <Button
                onClick={() => onBuyNow(item)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm lg:text-base w-full lg:w-auto"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buy Now
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSave(item)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 flex-1 lg:flex-none"
                >
                  <Bookmark className="h-4 w-4 mr-1" />
                  Save
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemove(item.id)}
                  className="border-red-300 text-red-600 hover:bg-red-50 flex-1 lg:flex-none"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
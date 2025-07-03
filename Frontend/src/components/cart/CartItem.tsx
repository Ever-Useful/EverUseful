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

const CartItem = ({ item, onRemove, onSave, onBuyNow }: CartItemProps) => {
 return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-6 border border-gray-200 rounded-2xl bg-white shadow hover:shadow-lg transition-shadow duration-200">
      {/* Left side - Image */}
      <div className="w-full lg:w-48 xl:w-56 flex-shrink-0">
        <div className="w-full h-32 lg:h-[180px] bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg border border-gray-200 overflow-hidden">
          <img 
            src={item.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop&crop=center'}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* Right side - Content */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 w-full">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start gap-2 mb-2">
            <h3 className="font-semibold text-lg lg:text-xl text-gray-900 leading-tight line-clamp-1">{item.name}</h3>
            <Badge variant="outline" className="text-xs border-blue-300 text-blue-700 bg-blue-50 flex-shrink-0">
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
          <div className="flex flex-wrap items-center gap-4 mb-2">
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
        <div className="flex flex-col items-start lg:items-end gap-3 lg:min-w-[200px] flex-shrink-0">
          <div className="text-right">
            <div className="text-2xl lg:text-3xl font-bold text-gray-900">${item.price.toFixed(2)}</div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Button
              size="sm"
              variant="default"
              className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 text-xs"
              onClick={() => onSave(item)}
            >
              <Bookmark className="h-4 w-4 mr-1" /> Save for Later
            </Button>
            <Button
              size="sm"
              variant="default"
              className="w-full text-xs"
              onClick={() => onRemove(item.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Remove
            </Button>
            <Button
              size="sm"
              variant="default"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs"
              onClick={() => onBuyNow(item)}
            >
              <ShoppingCart className="h-4 w-4 mr-1" /> Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
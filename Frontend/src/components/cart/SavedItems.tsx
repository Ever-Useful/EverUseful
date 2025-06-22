import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import { SavedItem } from '@/components/cart/types';
import { getCategoryIcon } from '@/components/cart/utils';

interface SavedItemsProps {
  items: SavedItem[];
  onMoveToCart: (item: SavedItem) => void;
  onRemove: (id: string) => void;
}

const SavedItems = ({ items, onMoveToCart, onRemove }: SavedItemsProps) => {
  if (items.length === 0) return null;

  return (
    <Card className="border-gray-200 shadow-sm bg-white">
      <CardHeader className="bg-gray-50 rounded-t-lg px-4 sm:px-6">
        <CardTitle className="flex items-center gap-3 text-gray-900 text-lg sm:text-xl">
          <Bookmark className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          Wishlist ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-md border border-gray-200 flex items-center justify-center text-xl flex-shrink-0">
                {getCategoryIcon(item.category)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base truncate">{item.name}</h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">by {item.studentName}</p>
                <p className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">${item.price.toFixed(2)}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs flex-1" onClick={() => onMoveToCart(item)}>
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50 text-xs" onClick={() => onRemove(item.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedItems;
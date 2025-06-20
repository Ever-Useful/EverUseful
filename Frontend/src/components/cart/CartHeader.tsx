import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '../ui/button';

interface CartHeaderProps {
  itemCount: number;
}

const handleGoBack = () => {
  window.history.back();
};

const CartHeader = ({ itemCount }: CartHeaderProps) => {
  return (
    <div className="border-b border-gray-200 shadow-sm bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Engineering Solutions Cart</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              {itemCount} innovative {itemCount === 1 ? 'solution' : 'solutions'} from talented engineering students
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="hidden sm:inline">Enterprise-Grade Security</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartHeader;
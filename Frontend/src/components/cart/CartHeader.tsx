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
    <div className=" border-b border-gray-200 shadow-sm">
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {/* Back Button */}
      
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="flex items-center gap-2 text-gray-700 hover:text-black-900 hover:bg-gray-300 p-2">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back</span>
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
     
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Engineering Solutions Cart</h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-1">
              {itemCount} innovative {itemCount === 1 ? 'solution' : 'solutions'} from talented engineering students
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="h-5 w-5 text-green-600" />
            <span>Enterprise-Grade Security</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartHeader;
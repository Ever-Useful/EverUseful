import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

interface OrderSummaryProps {
  subtotal: number;
  platformFee: number;
  total: number;
  itemCount: number;
}

const OrderSummary = ({ subtotal, platformFee, total, itemCount }: OrderSummaryProps) => {
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const trustedFeatures = [
    {
      title: "Secure Payments",
      description: "256-bit SSL encryption",
    },
    {
      title: "Quality Assured",
      description: "University verified",
    },
    {
      title: "Instant Access",
      description: "Download immediately",
    },
    {
      title: "24/7 Support",
      description: "Expert assistance",
    }
  ];

  return (
    <div className="flex flex-col gap-6 h-fit">
      
      {/* Trusted Platform Card - hidden on mobile, visible on md+ */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-[0_8px_30px_rgb(34_197_94_0.15)] h-fit">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold text-green-600">Trusted Platform</h2>
          </div>

          <div className="space-y-4">
            {trustedFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 rounded-full bg-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-2 rounded-lg bg-green-50 border border-green-200">
            <p className="text-center text-sm text-green-700 font-medium">
              Verified Engineering Solutions
            </p>
          </div>
        </div>
      </div>

      {/* Order Summary Card */}
      <div className="bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-[0_8px_30px_rgb(59_130_246_0.15)] h-fit w-full max-w-md mx-auto md:max-w-full">
        <div className="p-4 xs:p-5 md:p-6">
          <h2 className="text-lg xs:text-xl font-semibold mb-4 xs:mb-6 text-blue-600">Order Summary</h2>
          
          <div className="space-y-3 xs:space-y-4">
            <div className="flex justify-between items-center text-sm xs:text-base">
              <span className="text-gray-600">Items ({itemCount})</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm xs:text-base">
              <span className="text-gray-600">Platform Fee (5%)</span>
              <span className="font-medium">{formatPrice(platformFee)}</span>
            </div>
            
            <div className="border-t border-gray-200 pt-3 xs:pt-4 mt-3 xs:mt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-base xs:text-lg">Total</span>
                <span className="font-semibold text-base xs:text-lg text-blue-600">{formatPrice(total)}</span>
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-3 xs:mt-4 text-sm xs:text-base">
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default OrderSummary;
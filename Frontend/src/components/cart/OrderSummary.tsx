import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IndianRupee, DollarSign, Shield, Award, Clock, Users } from 'lucide-react';
import { useState } from 'react';

interface OrderSummaryProps {
  subtotal: number;
  platformFee: number;
  total: number;
  itemCount: number;
}

const OrderSummary = ({ subtotal, platformFee, total, itemCount }: OrderSummaryProps) => {
  const [isINR, setIsINR] = useState(true);
  const conversionRate = 83;

  const convertPrice = (price: number) => {
    return isINR ? price * conversionRate : price;
  };

  const formatPrice = (price: number) => {
    const convertedPrice = convertPrice(price);
    return isINR 
      ? `₹${convertedPrice.toFixed(2)}`
      : `$${convertedPrice.toFixed(2)}`;
  };

  const trustedIndicators = [
    {
      icon: Shield,
      title: "Secure Payments",
      description: "256-bit SSL encryption",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=40&h=30&fit=crop"
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "University verified",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=40&h=30&fit=crop"
    },
    {
      icon: Clock,
      title: "Instant Access",
      description: "Download immediately",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=40&h=30&fit=crop"
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Expert assistance",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=40&h=30&fit=crop"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Order Summary with Blue Gradient */}
      <Card className="border-gray-200 shadow-lg bg-gradient-to-br from-blue-50 via-white to-blue-100 backdrop-blur-sm">
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Order Summary</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsINR(!isINR)}
              className="flex items-center gap-1 text-xs bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {isINR ? <IndianRupee className="h-3 w-3" /> : <DollarSign className="h-3 w-3" />}
              {isINR ? 'INR' : 'USD'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Items ({itemCount})</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Platform Fee (5%)</span>
            <span className="font-medium">{formatPrice(platformFee)}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-blue-600">{formatPrice(total)}</span>
            </div>
          </div>
          <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white mt-4">
            Proceed to Checkout
          </Button>
          <p className="text-xs text-gray-500 text-center mt-2">
            {isINR ? 'Prices in Indian Rupees' : 'Prices in US Dollars'}
          </p>
        </CardContent>
      </Card>

      {/* Trusted Indicators with Green Gradient */}
      <Card className="border-gray-200 shadow-lg bg-gradient-to-br from-green-50 via-white to-emerald-100 backdrop-blur-sm">
        <CardHeader className="pb-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Trusted Platform
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trustedIndicators.map((indicator, index) => {
            const IconComponent = indicator.icon;
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={indicator.image} 
                    alt={indicator.title}
                    className="w-8 h-6 object-cover rounded border"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-0.5">
                    <IconComponent className="h-2 w-2 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-900">{indicator.title}</h4>
                  <p className="text-xs text-gray-600">{indicator.description}</p>
                </div>
              </div>
            );
          })}
          <Badge variant="outline" className="w-full justify-center mt-4 text-xs border-green-500 text-green-700 bg-gradient-to-r from-green-50 to-emerald-50">
            <Award className="h-3 w-3 mr-1" />
            Verified Engineering Solutions
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSummary;
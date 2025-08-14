
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Shield, Lock, Check, ShoppingCart } from "lucide-react";

const Checkout = () => {
  const cartItems = [
    {
      id: 1,
      title: "AI-Powered Climate Change Prediction Model",
      price: 2500,
      category: "AI & Sustainability",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop"
    },
    {
      id: 2,
      title: "Blockchain-Based Supply Chain Tracker",
      price: 3200,
      category: "Blockchain",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=100&fit=crop"
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
                  <h1 className="text-4xl font-bold text-white mb-2 mobile-text-4xl">Checkout</h1>
        <p className="text-gray-400 text-sm sm:text-base mobile-text-base">Complete your purchase securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Contact Information */}
            <Card className="bg-gray-800/60 border-gray-700">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-white text-base sm:text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Input placeholder="First Name" className="bg-gray-700 border-gray-600 text-white text-sm sm:text-base" />
                  <Input placeholder="Last Name" className="bg-gray-700 border-gray-600 text-white text-sm sm:text-base" />
                </div>
                <Input placeholder="Email Address" className="bg-gray-700 border-gray-600 text-white text-sm sm:text-base" />
                <Input placeholder="Phone Number" className="bg-gray-700 border-gray-600 text-white text-sm sm:text-base" />
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="bg-gray-800/60 border-gray-700">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-white flex items-center text-base sm:text-lg">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                  <Button variant="outline" className="border-blue-500 text-blue-400 text-xs sm:text-sm py-2 sm:py-3">
                    Credit Card
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-400 text-xs sm:text-sm py-2 sm:py-3">
                    PayPal
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-400 text-xs sm:text-sm py-2 sm:py-3">
                    Bank Transfer
                  </Button>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <Input placeholder="Card Number" className="bg-gray-700 border-gray-600 text-white text-sm sm:text-base" />
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <Input placeholder="MM/YY" className="bg-gray-700 border-gray-600 text-white text-sm sm:text-base" />
                    <Input placeholder="CVV" className="bg-gray-700 border-gray-600 text-white text-sm sm:text-base" />
                  </div>
                  <Input placeholder="Cardholder Name" className="bg-gray-700 border-gray-600 text-white text-sm sm:text-base" />
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card className="bg-gray-800/60 border-gray-700">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-white text-base sm:text-lg">Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <Input placeholder="Street Address" className="bg-gray-700 border-gray-600 text-white text-sm sm:text-base" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <Input placeholder="City" className="bg-gray-700 border-gray-600 text-white text-sm sm:text-base" />
                  <Input placeholder="State" className="bg-gray-700 border-gray-600 text-white text-sm sm:text-base" />
                  <Input placeholder="ZIP Code" className="bg-gray-700 border-gray-600 text-white text-sm sm:text-base" />
                </div>
                <Input placeholder="Country" className="bg-gray-700 border-gray-600 text-white text-sm sm:text-base" />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="bg-gray-800/60 border-gray-700">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-white flex items-center text-base sm:text-lg">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex space-x-3">
                    <img src={item.image} alt={item.title} className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-xs sm:text-sm truncate">{item.title}</h4>
                      <Badge variant="outline" className="text-xs mt-1 border-gray-600 text-gray-400">
                        {item.category}
                      </Badge>
                      <p className="text-blue-400 font-bold mt-1 text-sm sm:text-base">${item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                
                <Separator className="bg-gray-700" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300 text-sm sm:text-base">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-300 text-sm sm:text-base">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="flex justify-between text-white font-bold text-base sm:text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="bg-gray-800/60 border-gray-700">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2 text-green-400 mb-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs sm:text-sm font-medium">Secure Payment</span>
                </div>
                <div className="space-y-1 text-xs text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Check className="w-3 h-3 flex-shrink-0" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3 h-3 flex-shrink-0" />
                    <span>PCI DSS compliant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3 h-3 flex-shrink-0" />
                    <span>Money-back guarantee</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm sm:text-lg py-3 sm:py-4">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Complete Purchase
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;

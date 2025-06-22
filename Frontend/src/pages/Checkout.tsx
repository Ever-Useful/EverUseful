
import { Header } from "@/components/Header";
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
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Checkout</h1>
          <p className="text-gray-400">Complete your purchase securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card className="bg-gray-800/60 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="First Name" className="bg-gray-700 border-gray-600 text-white" />
                  <Input placeholder="Last Name" className="bg-gray-700 border-gray-600 text-white" />
                </div>
                <Input placeholder="Email Address" className="bg-gray-700 border-gray-600 text-white" />
                <Input placeholder="Phone Number" className="bg-gray-700 border-gray-600 text-white" />
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="bg-gray-800/60 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4">
                  <Button variant="outline" className="flex-1 border-blue-500 text-blue-400">
                    Credit Card
                  </Button>
                  <Button variant="outline" className="flex-1 border-gray-600 text-gray-400">
                    PayPal
                  </Button>
                  <Button variant="outline" className="flex-1 border-gray-600 text-gray-400">
                    Bank Transfer
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <Input placeholder="Card Number" className="bg-gray-700 border-gray-600 text-white" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="MM/YY" className="bg-gray-700 border-gray-600 text-white" />
                    <Input placeholder="CVV" className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  <Input placeholder="Cardholder Name" className="bg-gray-700 border-gray-600 text-white" />
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card className="bg-gray-800/60 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Street Address" className="bg-gray-700 border-gray-600 text-white" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder="City" className="bg-gray-700 border-gray-600 text-white" />
                  <Input placeholder="State" className="bg-gray-700 border-gray-600 text-white" />
                  <Input placeholder="ZIP Code" className="bg-gray-700 border-gray-600 text-white" />
                </div>
                <Input placeholder="Country" className="bg-gray-700 border-gray-600 text-white" />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="bg-gray-800/60 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex space-x-3">
                    <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{item.title}</h4>
                      <Badge variant="outline" className="text-xs mt-1 border-gray-600 text-gray-400">
                        {item.category}
                      </Badge>
                      <p className="text-blue-400 font-bold mt-1">${item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                
                <Separator className="bg-gray-700" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="bg-gray-800/60 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-green-400 mb-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Secure Payment</span>
                </div>
                <div className="space-y-1 text-xs text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Check className="w-3 h-3" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3 h-3" />
                    <span>PCI DSS compliant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3 h-3" />
                    <span>Money-back guarantee</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-4">
              <Lock className="w-5 h-5 mr-2" />
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

import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Download, 
  Mail, 
  Calendar, 
  CreditCard,
  Package,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { generateReceipt } from "@/utils/receiptGenerator";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id') || 'cs_test_12345abcdef';
  
  // Mock user data - in a real app, this would come from authentication
  const userEmail = "user@example.com";
  
  // Mock order data - in a real app, this would be fetched based on session_id
  const orderDetails = {
    orderId: "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    transactionId: sessionId,
            amount: "₹2,500.00",
    currency: "USD",
    paymentMethod: "**** **** **** 4242",
    purchaseDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    product: {
      title: "AI-Powered Climate Change Prediction Model",
      category: "AI & Sustainability",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
      deliverables: [
        "Complete source code",
        "Documentation",
        "Training dataset", 
        "API endpoints",
        "Deployment guide",
        "30-day support"
      ]
    }
  };

  const handleDownloadReceipt = () => {
    generateReceipt(orderDetails, userEmail);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Order Details */}
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Order Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-semibold text-gray-900">{orderDetails.orderId}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-sm text-gray-900 break-all">{orderDetails.transactionId}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-bold text-green-600 text-lg">{orderDetails.amount}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Method:</span>
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">{orderDetails.paymentMethod}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Purchase Date:</span>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">{orderDetails.purchaseDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900">Product Purchased</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-4">
                <img 
                  src={orderDetails.product.image} 
                  alt={orderDetails.product.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{orderDetails.product.title}</h3>
                  <Badge className="bg-blue-100 text-blue-800">
                    {orderDetails.product.category}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">What you'll receive:</h4>
                <div className="space-y-2">
                  {orderDetails.product.deliverables.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delivery Information */}
        <Card className="border-gray-200 bg-white max-w-6xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Delivery Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800">
                <strong>You'll receive your product by email.</strong> All deliverables will be sent to{" "}
                <span className="font-semibold">{userEmail}</span> within the next 24 hours.
              </p>
            </div>
            
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Check your inbox and spam folder for delivery confirmation</p>
              <p>• Download links will be valid for 30 days</p>
              <p>• Support is available for 30 days from purchase date</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild variant="outline" className="flex items-center space-x-2">
            <Link to="/">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Homepage</span>
            </Link>
          </Button>
          
          <Button 
            onClick={handleDownloadReceipt}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            <span>Download Receipt</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Truck, Mail, Phone, MapPin, Calendar } from "lucide-react";

const DeliveryPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal-50 to-cyan-100 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-teal-100 p-4 rounded-full">
                <Truck className="w-8 h-8 text-teal-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Delivery Policy
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
              Learn about our delivery processes, timelines, and policies for digital products, 
              services, and physical items available on our platform.
            </p>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              Last Updated: February 4, 2025
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          
          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Overview</h2>
            <div className="bg-teal-50 border-l-4 border-teal-400 p-6 rounded-r-lg mb-8">
              <p className="text-gray-700 leading-relaxed">
                This Delivery Policy outlines how we deliver our products and services to you. 
                Our delivery methods vary depending on the type of product or service you purchase, 
                and we strive to ensure timely and secure delivery of all items.
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              We offer various delivery options for different types of products and services, 
              including instant digital access, scheduled deliveries, and physical shipping. 
              This policy explains what you can expect from our delivery process.
            </p>
          </section>

          {/* Digital Products */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Digital Products & Services</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">Instant Access</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Most digital products and services are delivered instantly upon successful payment:
              </p>
              <ul className="text-gray-700 space-y-2">
                <li>• Online courses and educational content</li>
                <li>• Digital downloads and resources</li>
                <li>• Software licenses and access codes</li>
                <li>• Membership access and subscriptions</li>
                <li>• Virtual consultations and services</li>
              </ul>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-semibold text-green-800 mb-2">Access Methods</h4>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• Email confirmation with access details</li>
                  <li>• Direct login to your account</li>
                  <li>• Download links sent to your email</li>
                  <li>• Dashboard access for course materials</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h4 className="font-semibold text-purple-800 mb-2">Support</h4>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• 24/7 technical support available</li>
                  <li>• Help documentation and guides</li>
                  <li>• Live chat support during business hours</li>
                  <li>• Email support for complex issues</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Physical Products */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Physical Products</h2>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-orange-800 mb-3">Shipping Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                For physical products, we offer various shipping options:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600 font-bold">1-3</span>
                  </div>
                  <h4 className="font-semibold text-green-800 text-sm">Express</h4>
                  <p className="text-gray-600 text-xs">1-3 business days</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold">3-7</span>
                  </div>
                  <h4 className="font-semibold text-blue-800 text-sm">Standard</h4>
                  <p className="text-gray-600 text-xs">3-7 business days</p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-gray-600 font-bold">7-14</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm">Economy</h4>
                  <p className="text-gray-600 text-xs">7-14 business days</p>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h4 className="font-semibold text-yellow-800 mb-2">Shipping Partners</h4>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• FedEx Express and Ground</li>
                  <li>• UPS Standard and Express</li>
                  <li>• USPS Priority and First Class</li>
                  <li>• DHL International</li>
                  <li>• Local courier services</li>
                </ul>
              </div>
              
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h4 className="font-semibold text-indigo-800 mb-2">Tracking</h4>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• Real-time tracking updates</li>
                  <li>• Email notifications at each stage</li>
                  <li>• SMS alerts for delivery status</li>
                  <li>• Online tracking portal access</li>
                  <li>• Customer service support</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Delivery Areas */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Delivery Areas</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                We currently deliver to the following areas:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Domestic Delivery</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• All 50 US states</li>
                    <li>• Washington D.C.</li>
                    <li>• US territories (Puerto Rico, Guam, etc.)</li>
                    <li>• Alaska and Hawaii</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">International Delivery</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Canada and Mexico</li>
                    <li>• European Union countries</li>
                    <li>• United Kingdom</li>
                    <li>• Australia and New Zealand</li>
                    <li>• Select Asian countries</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Delivery Fees */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Delivery Fees</h2>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                Our delivery fees vary based on the type of product and delivery method:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Digital Products</h4>
                  <p className="text-2xl font-bold text-purple-600">Free</p>
                  <p className="text-gray-600 text-sm">Instant delivery</p>
                </div>
                <div className="bg-white border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Standard Shipping</h4>
                  <p className="text-2xl font-bold text-purple-600">$5.99</p>
                  <p className="text-gray-600 text-sm">3-7 business days</p>
                </div>
                <div className="bg-white border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Express Shipping</h4>
                  <p className="text-2xl font-bold text-purple-600">$12.99</p>
                  <p className="text-gray-600 text-sm">1-3 business days</p>
                </div>
              </div>
            </div>
          </section>

          {/* Delivery Process */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Delivery Process</h2>
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Step 1: Order Confirmation</h3>
                <p className="text-gray-700 leading-relaxed">
                  Upon successful payment, you will receive an order confirmation email with your order details, 
                  estimated delivery date, and tracking information (for physical products).
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-3">Step 2: Processing</h3>
                <p className="text-gray-700 leading-relaxed">
                  For physical products, we process your order within 1-2 business days. Digital products 
                  are typically available immediately or within a few hours.
                </p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-yellow-800 mb-3">Step 3: Shipping</h3>
                <p className="text-gray-700 leading-relaxed">
                  Physical products are shipped using your selected shipping method. You'll receive 
                  tracking updates via email and SMS.
                </p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-purple-800 mb-3">Step 4: Delivery</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your order will be delivered to the address provided during checkout. 
                  For digital products, access will be granted to your account.
                </p>
              </div>
            </div>
          </section>

          {/* Delivery Issues */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Delivery Issues</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                If you experience any issues with delivery, please contact us immediately:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Common Issues</h4>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>• Package not received within expected timeframe</li>
                    <li>• Damaged or missing items</li>
                    <li>• Incorrect delivery address</li>
                    <li>• Digital access not working</li>
                    <li>• Missing order confirmation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Resolution Steps</h4>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>• Contact customer support within 48 hours</li>
                    <li>• Provide order number and details</li>
                    <li>• We'll investigate and resolve promptly</li>
                    <li>• Refund or replacement if necessary</li>
                    <li>• Follow-up to ensure satisfaction</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Contact Us</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-6">
                For questions about delivery or to report issues, please contact us:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-700">delivery@amoghedu.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <p className="text-gray-700">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Address</h4>
                    <p className="text-gray-700">123 Business Street, City, State 12345</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DeliveryPolicy;
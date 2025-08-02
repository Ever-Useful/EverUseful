import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft, RefreshCw, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle, Clock, Package } from "lucide-react";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-50 to-pink-100 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full">
                <RefreshCw className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Refund Policy
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
              We want you to be completely satisfied with your purchase. Learn about our refund process, 
              eligibility criteria, and how to request a refund.
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
            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg mb-8">
              <p className="text-gray-700 leading-relaxed">
                At AMOGH, we are committed to providing high-quality products and services. 
                If you are not completely satisfied with your purchase, we offer a comprehensive 
                refund policy to ensure your satisfaction.
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              This refund policy outlines the terms and conditions for requesting refunds, 
              the refund process, and what you can expect when seeking a refund for our 
              products and services.
            </p>
          </section>

          {/* Refund Eligibility */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Refund Eligibility</h2>
            <p className="text-gray-700 mb-6">
              Refund eligibility depends on the type of product or service purchased:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-3">Digital Products</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Online courses: 30-day money-back guarantee</li>
                  <li>• Digital downloads: 7-day refund window</li>
                  <li>• Software licenses: 14-day refund period</li>
                  <li>• Subscriptions: Pro-rated refunds available</li>
                  <li>• Virtual services: Case-by-case basis</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Physical Products</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Books and materials: 30-day return window</li>
                  <li>• Electronics: 14-day return period</li>
                  <li>• Merchandise: 30-day return window</li>
                  <li>• Damaged items: Immediate replacement</li>
                  <li>• Defective products: Full refund available</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Refund Process */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Refund Process</h2>
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-yellow-800 mb-3">Step 1: Request Refund</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Submit a refund request through our customer support portal or contact us directly. 
                  Include your order number and reason for the refund request.
                </p>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Use our online refund form</li>
                  <li>• Email us at refunds@amoghedu.com</li>
                  <li>• Call our customer service line</li>
                  <li>• Provide order details and reason</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-3">Step 2: Review Process</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our team will review your request within 2-3 business days. We may contact you 
                  for additional information if needed.
                </p>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Eligibility verification</li>
                  <li>• Product condition assessment</li>
                  <li>• Usage analysis for digital products</li>
                  <li>• Customer service interaction review</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Step 3: Refund Processing</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Once approved, refunds are processed within 5-10 business days. The refund method 
                  depends on your original payment method.
                </p>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Credit card refunds: 5-7 business days</li>
                  <li>• PayPal refunds: 3-5 business days</li>
                  <li>• Bank transfers: 7-10 business days</li>
                  <li>• Store credit: Immediate</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Refund Methods */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Refund Methods</h2>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                Refunds are issued using the same payment method used for the original purchase:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-purple-800 mb-2">Original Payment Method</h4>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>• Credit/Debit cards</li>
                    <li>• PayPal accounts</li>
                    <li>• Bank transfers</li>
                    <li>• Digital wallets</li>
                    <li>• Cryptocurrency payments</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800 mb-2">Alternative Options</h4>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>• Store credit for future purchases</li>
                    <li>• Exchange for different products</li>
                    <li>• Partial refunds when applicable</li>
                    <li>• Extended access to services</li>
                    <li>• Complimentary upgrades</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Non-Refundable Items */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Non-Refundable Items</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                The following items are generally not eligible for refunds:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Digital Products</h4>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>• Completed online courses</li>
                    <li>• Downloaded software after 14 days</li>
                    <li>• Used gift cards or vouchers</li>
                    <li>• Completed consulting sessions</li>
                    <li>• Custom development work</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Physical Products</h4>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>• Personalized or custom items</li>
                    <li>• Perishable goods</li>
                    <li>• Damaged by customer misuse</li>
                    <li>• Missing original packaging</li>
                    <li>• Items marked as final sale</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Partial Refunds */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Partial Refunds</h2>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                In certain circumstances, we may offer partial refunds:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">Subscription Services</h4>
                  <p className="text-gray-700 text-sm">
                    Pro-rated refunds for unused subscription periods
                  </p>
                </div>
                <div className="bg-white border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">Course Completion</h4>
                  <p className="text-gray-700 text-sm">
                    Partial refunds based on course completion percentage
                  </p>
                </div>
                <div className="bg-white border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">Service Packages</h4>
                  <p className="text-gray-700 text-sm">
                    Refunds for unused services within packages
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Return Shipping */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Return Shipping</h2>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                For physical products, return shipping costs are handled as follows:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-indigo-800 mb-2">Free Returns</h4>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>• Defective or damaged items</li>
                    <li>• Incorrect items shipped</li>
                    <li>• Quality issues</li>
                    <li>• Manufacturing defects</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-indigo-800 mb-2">Customer Pays</h4>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>• Change of mind returns</li>
                    <li>• Size or style preferences</li>
                    <li>• No longer needed items</li>
                    <li>• International returns</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Dispute Resolution</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                If you disagree with a refund decision, we offer a dispute resolution process:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">Internal Review</h4>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>• Escalation to senior management</li>
                    <li>• Additional documentation review</li>
                    <li>• Customer service mediation</li>
                    <li>• Alternative resolution options</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">External Options</h4>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>• Credit card chargeback process</li>
                    <li>• PayPal dispute resolution</li>
                    <li>• Consumer protection agencies</li>
                    <li>• Legal consultation if necessary</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">9. Contact Us</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-6">
                For questions about refunds or to request a refund, please contact us:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-700">refunds@amoghedu.com</p>
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

export default RefundPolicy;
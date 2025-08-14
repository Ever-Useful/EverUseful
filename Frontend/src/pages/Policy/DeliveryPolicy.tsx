import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Truck, Mail, Phone, MapPin, Calendar } from "lucide-react";

const AccessibilityPolicy = () => {
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
              Accessibility Policy
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
              Learn about our commitment to accessibility for all users, including accessible digital content, physical products, and support services.
            </p>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              Last Updated: June, 2025
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">

          {/* Accessibility Commitment */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Our Accessibility Commitment</h2>
            <div className="bg-teal-50 border-l-4 border-teal-400 p-6 rounded-r-lg mb-8">
              <p className="text-gray-700 leading-relaxed">
                We are dedicated to providing an inclusive experience for all users, regardless of ability. Our website, digital products, and customer support are designed to meet recognized accessibility standards such as WCAG and ADA.
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              We continually review and improve our accessibility features. If you encounter any barriers or need accommodations, please contact us and we will work with you to ensure equal access.
            </p>
          </section>

          {/* Accessible Digital Products */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Accessible Digital Products & Services</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">Accessibility Features</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                All digital products and services are delivered in accessible formats, compatible with screen readers, keyboard navigation, and alternative text for images. We provide:
              </p>
              <ul className="text-gray-700 space-y-2">
                <li>• Online courses and content with captions, transcripts, and alt text</li>
                <li>• Digital downloads in accessible formats (PDF, audio, large print)</li>
                <li>• Software and platforms supporting assistive technologies</li>
                <li>• Accessible membership and subscription portals</li>
                <li>• Virtual consultations with live captioning available</li>
              </ul>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-semibold text-green-800 mb-2">Access Methods</h4>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• Accessible email confirmations and instructions</li>
                  <li>• Account login with screen reader support</li>
                  <li>• Download links with accessible file formats</li>
                  <li>• WCAG-compliant dashboards and course materials</li>
                </ul>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h4 className="font-semibold text-purple-800 mb-2">Accessibility Support</h4>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• 24/7 technical support for accessibility issues</li>
                  <li>• Help guides in accessible formats</li>
                  <li>• Live chat and email support for accommodations</li>
                  <li>• Dedicated accessibility assistance</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Accessible Physical Products */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Accessible Physical Products</h2>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-orange-800 mb-3">Accessible Packaging & Instructions</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We offer accessible packaging, delivery instructions in large print or braille, and can accommodate special needs upon request.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600 font-bold">Vision</span>
                  </div>
                  <h4 className="font-semibold text-green-800 text-sm">Large Print/Braille</h4>
                  <p className="text-gray-600 text-xs">Accessible labels & instructions</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold">Mobility</span>
                  </div>
                  <h4 className="font-semibold text-blue-800 text-sm">Easy-Open Packaging</h4>
                  <p className="text-gray-600 text-xs">Accessible for limited mobility</p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-gray-600 font-bold">Hearing</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm">Visual Instructions</h4>
                  <p className="text-gray-600 text-xs">Pictorial guides included</p>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h4 className="font-semibold text-yellow-800 mb-2">Accessibility Partners</h4>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• Collaboration with accessible shipping providers</li>
                  <li>• Delivery instructions in accessible formats upon request</li>
                  <li>• Accommodations for mobility, vision, or hearing needs</li>
                </ul>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h4 className="font-semibold text-indigo-800 mb-2">Accessible Tracking</h4>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• Real-time tracking on accessible websites</li>
                  <li>• Email and SMS notifications in accessible formats</li>
                  <li>• Customer service for accessibility support</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Accessibility Areas */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Accessibility Areas</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                We provide accessible services and products domestically and internationally. Please specify any accessibility needs during checkout or contact support for assistance.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Domestic Accessibility</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Accessible service available in all US states and territories</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">International Accessibility</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Accessible service available in supported international regions</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Accessibility Fees */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Accessibility Fees</h2>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                Accessibility features and accommodations are provided at no extra cost. Contact us for fee waivers or accommodations if needed.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Digital Products</h4>
                  <p className="text-2xl font-bold text-purple-600">Free</p>
                  <p className="text-gray-600 text-sm">Accessible formats available</p>
                </div>
                <div className="bg-white border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Physical Products</h4>
                  <p className="text-2xl font-bold text-purple-600">No Extra Fee</p>
                  <p className="text-gray-600 text-sm">Accessible packaging available</p>
                </div>
                <div className="bg-white border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Support Services</h4>
                  <p className="text-2xl font-bold text-purple-600">Free</p>
                  <p className="text-gray-600 text-sm">Accessibility assistance included</p>
                </div>
              </div>
            </div>
          </section>

          {/* Accessibility Process */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Accessibility Process</h2>
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Step 1: Accessible Confirmation</h3>
                <p className="text-gray-700 leading-relaxed">
                  Confirmation emails and instructions are provided in accessible formats. Contact us for braille, large print, or audio versions.
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-3">Step 2: Processing & Accommodation</h3>
                <p className="text-gray-700 leading-relaxed">
                  Orders and requests are processed with accessibility in mind. Notify us of any special requirements and we will accommodate your needs.
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-yellow-800 mb-3">Step 3: Accessible Support</h3>
                <p className="text-gray-700 leading-relaxed">
                  Support and updates are sent in accessible formats. Our team is available to assist with any accessibility needs.
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-purple-800 mb-3">Step 4: Accessible Completion</h3>
                <p className="text-gray-700 leading-relaxed">
                  Completion of your order or service includes accessibility accommodations as requested.
                </p>
              </div>
            </div>
          </section>

          {/* Accessibility Issues & Support */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Accessibility Issues & Support</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                If you experience any accessibility barriers or issues, please contact us immediately. We will resolve accessibility concerns promptly and provide alternative formats or accommodations as needed.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Common Accessibility Issues</h4>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>• Inaccessible digital content or files</li>
                    <li>• Packaging not suitable for your needs</li>
                    <li>• Instructions not provided in accessible format</li>
                    <li>• Difficulty using support tools</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Resolution Steps</h4>
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li>• Contact accessibility support within 48 hours</li>
                    <li>• Provide details of your accessibility needs</li>
                    <li>• We will investigate and resolve promptly</li>
                    <li>• Alternative formats or accommodations provided</li>
                    <li>• Follow-up to ensure satisfaction</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Accessibility Contact Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Accessibility Contact</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-6">
                For accessibility questions, requests, or to report barriers, please contact our accessibility team:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-700">amogheveruseful@gmail.com</p>
                  </div>
                </div>
                {/* <div className="flex items-start">
                  <Phone className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <p className="text-gray-700">+1 (555) 123-4567</p>
                  </div>
                </div> */}
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Address</h4>
                    <p className="text-gray-700">Connaught place , New Delhi-110001, India</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-gray-700 text-sm">
                <strong>Accessibility Requests:</strong> If you need products, services, or communications in an accessible format or have specific accessibility requirements, please mention them when contacting us. We are committed to providing equal access for all customers.
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AccessibilityPolicy;
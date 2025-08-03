import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft, FileText, Mail, Phone, MapPin, Calendar } from "lucide-react";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms & Conditions
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
              Please read these terms and conditions carefully before using our services. 
              By accessing our platform, you agree to be bound by these terms.
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
          
          {/* Acceptance of Terms */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Acceptance of Terms</h2>
            <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg mb-8">
              <p className="text-gray-700 leading-relaxed">
                By accessing and using this website, you accept and agree to be bound by the terms and provision 
                of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              These Terms and Conditions ("Terms") govern your use of the AMOGH platform and services. 
              By using our services, you acknowledge that you have read, understood, and agree to be bound 
              by these Terms. If you do not agree with any part of these Terms, you must not use our services.
            </p>
          </section>

          {/* Description of Service */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Description of Service</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                AMOGH provides a comprehensive educational technology platform that includes:
              </p>
              <ul className="text-gray-700 space-y-2">
                <li>• Online learning courses and educational content</li>
                <li>• Marketplace for educational products and services</li>
                <li>• Freelancing opportunities and project collaboration</li>
                <li>• Community features and networking tools</li>
                <li>• Career development and mentorship programs</li>
                <li>• Sustainable education initiatives</li>
              </ul>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify, suspend, or discontinue any part of our service at any time 
              without notice. We will not be liable to you or any third party for any modification, 
              suspension, or discontinuance of the service.
            </p>
          </section>

          {/* User Accounts */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">3. User Accounts</h2>
            <p className="text-gray-700 mb-6">
              When you create an account with us, you must provide information that is accurate, complete, 
              and current at all times. You are responsible for:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-yellow-800 mb-3">Account Security</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Safeguarding your password and login credentials</li>
                  <li>• All activities that occur under your account</li>
                  <li>• Maintaining the security of your account</li>
                  <li>• Immediately notifying us of unauthorized use</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-purple-800 mb-3">Account Information</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Keeping your profile information accurate</li>
                  <li>• Updating contact details when they change</li>
                  <li>• Providing truthful and complete information</li>
                  <li>• Maintaining professional conduct</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Prohibited Uses */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Prohibited Uses</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4 font-semibold">You may not use our service for:</p>
              <ul className="text-gray-700 space-y-2">
                <li>• Any unlawful purpose or to solicit others to act unlawfully</li>
                <li>• Violating international, federal, provincial, or state regulations</li>
                <li>• Infringing upon intellectual property rights</li>
                <li>• Harassing, abusing, or discriminating against others</li>
                <li>• Submitting false or misleading information</li>
                <li>• Uploading or transmitting malicious code or viruses</li>
                <li>• Attempting to gain unauthorized access to our systems</li>
                <li>• Interfering with the proper functioning of our platform</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property Rights */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Intellectual Property Rights</h2>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                The service and its original content, features, and functionality are and will remain the exclusive 
                property of AMOGH Technologies and its licensors. The service is protected by copyright, trademark, 
                and other laws.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-indigo-800 mb-2">Our Rights</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Platform design and functionality</li>
                    <li>• Educational content and materials</li>
                    <li>• Trademarks and brand assets</li>
                    <li>• Software and technology</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-indigo-800 mb-2">Your Rights</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Content you create and upload</li>
                    <li>• Your personal data and information</li>
                    <li>• Your intellectual property</li>
                    <li>• Your user-generated content</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* User Content */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. User Content</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                Our service may allow you to post, link, store, share and otherwise make available certain 
                information, text, graphics, videos, or other material. You are responsible for the content 
                that you post to the service.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Your Responsibilities</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Ensure content is legal and appropriate</li>
                    <li>• Respect intellectual property rights</li>
                    <li>• Maintain professional standards</li>
                    <li>• Avoid harmful or offensive content</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Our Rights</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Review and moderate content</li>
                    <li>• Remove inappropriate content</li>
                    <li>• Use content for platform improvement</li>
                    <li>• Share content with other users</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy Policy */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Privacy Policy</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your 
                use of the service, to understand our practices regarding the collection, use, and protection 
                of your personal information.
              </p>
              <Link 
                to="/privacy-policy" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                Read our Privacy Policy
              </Link>
            </div>
          </section>

          {/* Termination */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Termination</h2>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                We may terminate or suspend your account and bar access to the service immediately, without 
                prior notice or liability, under our sole discretion, for any reason whatsoever, including 
                without limitation if you breach the Terms.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-orange-800 mb-2">Grounds for Termination</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Violation of these Terms</li>
                    <li>• Inappropriate behavior</li>
                    <li>• Fraudulent activities</li>
                    <li>• Extended inactivity</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-800 mb-2">After Termination</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Account access will be revoked</li>
                    <li>• Data may be retained as required</li>
                    <li>• Outstanding obligations remain</li>
                    <li>• Appeals process available</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">9. Limitation of Liability</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed">
                In no event shall AMOGH Technologies, nor its directors, employees, partners, agents, suppliers, 
                or affiliates, be liable for any indirect, incidental, special, consequential, or punitive 
                damages, including without limitation, loss of profits, data, use, goodwill, or other 
                intangible losses, resulting from your access to or use of or inability to access or use the service.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">10. Governing Law</h2>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be interpreted and governed by the laws of India, without regard to its 
                conflict of law provisions. Our failure to enforce any right or provision of these Terms 
                will not be considered a waiver of those rights.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">11. Changes to Terms</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will try to provide at least 30 days notice prior to any new 
                terms taking effect.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">12. Contact Us</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-6">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-700">legal@amoghedu.com</p>
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

export default TermsConditions;
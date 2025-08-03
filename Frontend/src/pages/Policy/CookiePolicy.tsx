import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Cookie, Mail, Phone, MapPin, Calendar } from "lucide-react";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-100 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-orange-100 p-4 rounded-full">
                <Cookie className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Cookie Policy
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
              Learn how we use cookies and similar technologies to enhance your browsing experience 
              and provide personalized services on our platform.
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
          
          {/* What Are Cookies */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">1. What Are Cookies</h2>
            <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-lg mb-8">
              <p className="text-gray-700 leading-relaxed">
                Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
                They are widely used to make websites work more efficiently and to provide information to website owners. 
                Cookies allow us to recognize your device and store some information about your preferences or past actions.
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              When you visit our website, we may place cookies on your device to enhance your experience, 
              analyze site usage, and provide personalized content. These cookies help us understand how 
              you interact with our platform and improve our services accordingly.
            </p>
          </section>

          {/* How We Use Cookies */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">2. How We Use Cookies</h2>
            <p className="text-gray-700 mb-6">We use cookies for several purposes:</p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Essential Cookies</h3>
                <p className="text-gray-700 text-sm">
                  These cookies are necessary for the website to function properly. They enable basic functions 
                  like page navigation and access to secure areas.
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-3">Performance Cookies</h3>
                <p className="text-gray-700 text-sm">
                  These cookies collect information about how visitors use our website, such as which pages 
                  are visited most often and if users get error messages.
                </p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-purple-800 mb-3">Functionality Cookies</h3>
                <p className="text-gray-700 text-sm">
                  These cookies allow the website to remember choices you make and provide enhanced, 
                  more personal features.
                </p>
              </div>
              
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-indigo-800 mb-3">Analytics Cookies</h3>
                <p className="text-gray-700 text-sm">
                  We use these cookies to understand how our website is being used and to improve our services.
                </p>
              </div>
            </div>
          </section>

          {/* Types of Cookies */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Types of Cookies We Use</h2>
            
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-yellow-800 mb-3">3.1 Session Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  These are temporary cookies that remain in your browser until you leave the website. 
                  They help us maintain your session and ensure the website functions properly during your visit.
                </p>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Store your login session information</li>
                  <li>• Remember your shopping cart items</li>
                  <li>• Maintain form data during your visit</li>
                  <li>• Provide security features</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-3">3.2 Persistent Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  These cookies remain on your device for a set period or until you delete them. 
                  They help us remember your preferences and provide a more personalized experience on return visits.
                </p>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Remember your language preferences</li>
                  <li>• Store your theme settings</li>
                  <li>• Keep you logged in between visits</li>
                  <li>• Track your usage patterns</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Third-Party Cookies</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                We may also use third-party services that place cookies on your device. These include analytics services 
                like Google Analytics, social media plugins, and advertising networks. These third parties have their own 
                privacy policies, and we encourage you to read them.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Analytics Services</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Google Analytics</li>
                    <li>• Hotjar</li>
                    <li>• Mixpanel</li>
                    <li>• Amplitude</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Social Media</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Facebook Pixel</li>
                    <li>• LinkedIn Insight</li>
                    <li>• Twitter Analytics</li>
                    <li>• YouTube Embed</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Managing Cookies */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Managing Cookies</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <p className="text-gray-700 mb-4 font-semibold">
                You can control and manage cookies in various ways:
              </p>
              <ul className="text-gray-700 space-y-2">
                <li>• Most browsers allow you to refuse cookies or alert you when cookies are being sent</li>
                <li>• You can delete cookies that have already been set through your browser settings</li>
                <li>• You can use browser plugins or tools to manage cookies automatically</li>
                <li>• Please note that disabling cookies may affect the functionality of our website</li>
              </ul>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-3">Browser Settings</h4>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• Chrome: Settings → Privacy and security → Cookies</li>
                  <li>• Firefox: Options → Privacy & Security → Cookies</li>
                  <li>• Safari: Preferences → Privacy → Cookies</li>
                  <li>• Edge: Settings → Cookies and site permissions</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-3">Cookie Management Tools</h4>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• Browser extensions for cookie control</li>
                  <li>• Privacy-focused browsers</li>
                  <li>• Cookie consent management tools</li>
                  <li>• Third-party privacy tools</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookie Consent */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Cookie Consent</h2>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                When you first visit our website, you will see a cookie consent banner that allows you to 
                choose which types of cookies you want to accept. You can change your preferences at any time 
                by visiting our cookie settings page.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <h4 className="font-semibold text-green-800 text-sm">Accept All</h4>
                  <p className="text-gray-600 text-xs">Allow all cookies for full functionality</p>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-yellow-600 font-bold">⚙</span>
                  </div>
                  <h4 className="font-semibold text-yellow-800 text-sm">Customize</h4>
                  <p className="text-gray-600 text-xs">Choose specific cookie categories</p>
                </div>
                <div className="text-center">
                  <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-red-600 font-bold">✗</span>
                  </div>
                  <h4 className="font-semibold text-red-800 text-sm">Reject All</h4>
                  <p className="text-gray-600 text-xs">Only essential cookies allowed</p>
                </div>
              </div>
            </div>
          </section>

          {/* Updates to Policy */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Updates to This Policy</h2>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other 
                operational, legal, or regulatory reasons. Please check this page periodically for updates. 
                We will notify you of any significant changes through our website or email communications.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Contact Us</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-6">
                If you have any questions about our Cookie Policy, please contact us:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-700">cookies@amoghedu.com</p>
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

export default CookiePolicy;
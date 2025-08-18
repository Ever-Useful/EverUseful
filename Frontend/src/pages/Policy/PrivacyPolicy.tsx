import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Shield, Mail, Phone, MapPin, Calendar } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="text-center">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="bg-blue-100 p-3 sm:p-4 rounded-full">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Privacy Policy
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 max-w-3xl mx-auto px-2">
              We are committed to protecting your privacy and ensuring the security of your personal information. 
              This policy outlines how we collect, use, and safeguard your data.
            </p>
            <div className="flex items-center justify-center text-xs sm:text-sm text-gray-500">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Last Updated: June, 2025
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
          
          {/* Introduction */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Introduction</h2>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 rounded-r-lg mb-6 sm:mb-8">
              <p className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed">
                This privacy policy (the "Policy") sets out AMOGH Technologies' data processing practices and approach 
                to data privacy in furtherance of its obligations under the applicable data privacy laws. Reference to 
                "we", "us", "our", "ours" and "AMOGH" refers to AMOGH Technologies (including its affiliates). Further, 
                the terms "you", "your", "yours" refer to you as a user of the platform.
              </p>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed mb-4 sm:mb-6">
              This Policy is aimed at providing individuals notice of the basic practices and principles by which we 
              process the personal data of individuals ("Personal Data") who visit, use, interact with and/or transact 
              through our website and services. If you are a California, Virginia, or Colorado resident you may have 
              certain rights and are entitled to certain disclosures regarding the processing of your Personal Data 
              that are reflected in the sections below.
            </p>
          </section>

          {/* Types of Personal Data Collected */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Types of Personal Data Collected</h2>
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 mb-4 sm:mb-6">
              We may collect the following types of Personal Data:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-2 sm:mb-3">Personal Information</h3>
                <ul className="text-xs sm:text-sm lg:text-base text-gray-700 space-y-1 sm:space-y-2">
                  <li>• Name, title, gender, date of birth</li>
                  <li>• Email address and phone number</li>
                  <li>• Postal address and location data</li>
                  <li>• Profile pictures and display names</li>
                  <li>• Educational and employment history</li>
                  <li>• Resume/CV and professional credentials</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-2 sm:mb-3">Technical Data</h3>
                <ul className="text-xs sm:text-sm lg:text-base text-gray-700 space-y-1 sm:space-y-2">
                  <li>• IP addresses and device information</li>
                  <li>• Browser type and operating system</li>
                  <li>• Website usage patterns and analytics</li>
                  <li>• Social media profile information</li>
                  <li>• Payment and financial information</li>
                  <li>• Communication preferences</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Sources of Personal Data */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Sources of Obtaining Personal Data</h2>
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 mb-4 sm:mb-6">
              The Personal Data that is processed by us can broadly be categorised as follows:
            </p>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-purple-800 mb-2 sm:mb-3">Data Shared by You</h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-700 mb-3 sm:mb-4">
                  The Personal Data provided by you in most cases is direct when you:
                </p>
                <ul className="text-xs sm:text-sm lg:text-base text-gray-700 space-y-1 sm:space-y-2">
                  <li>• Register to use our products and/or services including free trials</li>
                  <li>• Apply for roles as instructors, teaching assistants, mentors, or career coaches</li>
                  <li>• Participate in surveys, feedback forms, or community discussions</li>
                  <li>• Update your profile or account information</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-orange-800 mb-2 sm:mb-3">Data from Third Parties</h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-700 mb-3 sm:mb-4">
                  The Personal Data collected from third parties includes:
                </p>
                <ul className="text-xs sm:text-sm lg:text-base text-gray-700 space-y-1 sm:space-y-2">
                  <li>• Social media platforms (Facebook, Google, GitHub, LinkedIn)</li>
                  <li>• Service providers and advertising partners</li>
                  <li>• Educational partners and scholarship providers</li>
                  <li>• Analytics providers and recruiters</li>
                  <li>• Other networks connected to our service</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Purpose of Data Collection */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Purpose of Obtaining Personal Data</h2>
            <p className="text-xs sm:text-sm lg:text-base text-gray-700 mb-4 sm:mb-6">
              In addition to verifying your identity, we collect and process your Personal Data for various reasons including:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold text-indigo-800 mb-2 text-sm sm:text-base">Service Delivery</h4>
                  <p className="text-xs sm:text-sm text-gray-700">Deliver our products and services, manage your account, and process transactions.</p>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold text-indigo-800 mb-2 text-sm sm:text-base">Communication</h4>
                  <p className="text-xs sm:text-sm text-gray-700">Respond to inquiries, provide updates, and send promotional materials.</p>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold text-indigo-800 mb-2 text-sm sm:text-base">Personalization</h4>
                  <p className="text-xs sm:text-sm text-gray-700">Tailor our services to your preferences and enhance user experience.</p>
                </div>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold text-indigo-800 mb-2 text-sm sm:text-base">Improvement</h4>
                  <p className="text-xs sm:text-sm text-gray-700">Analyze and improve our services, develop new features.</p>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold text-indigo-800 mb-2 text-sm sm:text-base">Security</h4>
                  <p className="text-xs sm:text-sm text-gray-700">Prevent, detect and mitigate fraudulent activities.</p>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold text-indigo-800 mb-2 text-sm sm:text-base">Compliance</h4>
                  <p className="text-xs sm:text-sm text-gray-700">Comply with legal obligations and enforce our agreements.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Legal Basis */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Legal Basis of Processing Your Personal Data</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
              <p className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                Our basis for collecting your Personal Data is based on the fact that you have consented to us 
                processing your Personal Data for a specific reason. This includes:
              </p>
              <ul className="text-xs sm:text-sm lg:text-base text-gray-700 space-y-1 sm:space-y-2">
                <li>• Information you have made public through your social media accounts</li>
                <li>• Information shared during sign-up and sign-in processes</li>
                <li>• Processing necessary for the performance of our contract with you</li>
                <li>• Compliance with legal obligations under applicable law</li>
              </ul>
            </div>
          </section>

          {/* Withdrawing Consent */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Withdrawing Consent</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
              <p className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                At all times you have the right to withdraw your consent to our collection and processing of your 
                Personal Data. Please note that such withdrawal may lead to us not being able to continue offering 
                our products and services to you.
              </p>
              <p className="text-xs sm:text-sm lg:text-base text-gray-700">
                Please email us at <span className="text-blue-600 font-medium">privacy@amoghedu.com</span> to withdraw your consent.
              </p>
            </div>
          </section>

                    {/* Contact Information */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Contact Us</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
              <p className="text-xs sm:text-sm lg:text-base text-gray-700 mb-4 sm:mb-6">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="flex items-start">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Email</h4>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-700">amogheveruseful@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Address</h4>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-700">Connaught Place Delhi-110001 , India</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Additional Rights for Specific States */}
          {/* <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Additional Rights for Specific States</h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">California Residents</h3>
                <p className="text-gray-700 mb-4">
                  California residents have the right to know, correct, and delete their Personal Data. 
                  You may also appoint an authorized agent to submit requests on your behalf.
                </p>
                <p className="text-gray-700">
                  Submit requests to: <span className="text-blue-600 font-medium">us-support@amoghedu.com</span>
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-3">Virginia & Colorado Residents</h3>
                <p className="text-gray-700 mb-4">
                  Virginia and Colorado residents have similar rights to access, correct, and delete their Personal Data.
                </p>
                <p className="text-gray-700">
                  Submit requests to: <span className="text-green-600 font-medium">us-support@amoghedu.com</span>
                </p>
              </div>
            </div>
          </section> */}

          {/* Notification of Changes */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Notification of Changes</h2>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 sm:p-6">
              <p className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed">
                We regularly review and update our Policy to ensure it is up-to-date and accurate. Any changes we may 
                make to this Policy will be in effect immediately after being posted on this page. We reserve the right 
                to update or change our Policy at any time and you should check this Policy periodically. Your continued 
                use of the service after we post any modifications to the Policy on this page will constitute your 
                acknowledgment of the modifications and your consent to abide and be bound by the modified Policy.
              </p>
            </div>
          </section>

          {/* Grievance */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Grievance</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
              <p className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                If you have any issue or grievance with respect to our policy or with the manner in which we collect 
                or store your information, or in any respect related to your Personal Data provided to us, please 
                contact <span className="text-red-600 font-medium">tech@amoghedu.com</span>.
              </p>
              <p className="text-xs sm:text-sm lg:text-base text-gray-700">
                We will take reasonable actions to ensure that your grievance is attended to and addressed within 
                a period of 30 days from the date of receipt of your grievance.
              </p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
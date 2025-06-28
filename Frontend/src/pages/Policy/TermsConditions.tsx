
import { Link } from "react-router-dom";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link 
            to="/" 
            className="text-blue-400 hover:text-blue-300 mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">Terms & Conditions</h1>
          <p className="text-gray-400">Latest update: 26 June 2024</p>
        </div>

        <div className="prose prose-lg max-w-none text-white">
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-6">
              By accessing and using this website, you accept and agree to be bound by the terms and provision 
              of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Service</h2>
            <p className="mb-6">
              Our website provides [description of your service/product]. We reserve the right to modify, 
              suspend, or discontinue the service at any time without notice. We will not be liable to you 
              or any third party for any modification, suspension, or discontinuance of the service.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
            <p className="mb-4">
              When you create an account with us, you must provide information that is accurate, complete, 
              and current at all times. You are responsible for:
            </p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>Safeguarding the password and all activities that occur under your account</li>
              <li>Maintaining the security of your account credentials</li>
              <li>Immediately notifying us of any unauthorized use of your account</li>
              <li>Ensuring your account information remains accurate and up-to-date</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Prohibited Uses</h2>
            <p className="mb-4">You may not use our service:</p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>For any unlawful purpose or to solicit others to act unlawfully</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Intellectual Property Rights</h2>
            <p className="mb-6">
              The service and its original content, features, and functionality are and will remain the exclusive 
              property of [Your Company] and its licensors. The service is protected by copyright, trademark, 
              and other laws. Our trademarks and trade dress may not be used in connection with any product 
              or service without our prior written consent.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. User Content</h2>
            <p className="mb-6">
              Our service may allow you to post, link, store, share and otherwise make available certain 
              information, text, graphics, videos, or other material. You are responsible for the content 
              that you post to the service, including its legality, reliability, and appropriateness.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Privacy Policy</h2>
            <p className="mb-6">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your 
              use of the service, to understand our practices.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Termination</h2>
            <p className="mb-6">
              We may terminate or suspend your account and bar access to the service immediately, without 
              prior notice or liability, under our sole discretion, for any reason whatsoever, including 
              without limitation if you breach the Terms.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Limitation of Liability</h2>
            <p className="mb-6">
              In no event shall [Your Company], nor its directors, employees, partners, agents, suppliers, 
              or affiliates, be liable for any indirect, incidental, special, consequential, or punitive 
              damages, including without limitation, loss of profits, data, use, goodwill, or other 
              intangible losses, resulting from your access to or use of or inability to access or use the service.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Governing Law</h2>
            <p className="mb-6">
              These Terms shall be interpreted and governed by the laws of [Your State/Country], without 
              regard to its conflict of law provisions. Our failure to enforce any right or provision of 
              these Terms will not be considered a waiver of those rights.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Changes to Terms</h2>
            <p className="mb-6">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material, we will try to provide at least 30 days notice prior to any new 
              terms taking effect.
            </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contact Us</h2>
          <p className="mb-6">
            If you have any questions about these Terms and Conditions, please contact us:
          </p>
          <div className="border border-gray-700 p-4 rounded-lg">
            <p>
              Email: legal@yourcompany.com<br />
              Phone: +1 (555) 123-4567<br />
              Address: 123 Business Street, City, State 12345
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
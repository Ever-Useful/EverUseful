
import { Link } from "react-router-dom";

const CookiePolicy = () => {
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
          <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
          <p className="text-gray-400">Latest update: 26 June 2024</p>
        </div>

        <div className="prose prose-lg max-w-none text-white">
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. What Are Cookies</h2>
            <p className="mb-6">
              Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
              They are widely used to make websites work more efficiently and to provide information to website owners. 
              Cookies allow us to recognize your device and store some information about your preferences or past actions.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Cookies</h2>
            <p className="mb-4">We use cookies for several purposes:</p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas.</li>
              <li><strong>Performance Cookies:</strong> These cookies collect information about how visitors use our website, such as which pages are visited most often and if users get error messages.</li>
              <li><strong>Functionality Cookies:</strong> These cookies allow the website to remember choices you make and provide enhanced, more personal features.</li>
              <li><strong>Analytics Cookies:</strong> We use these cookies to understand how our website is being used and to improve our services.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Session Cookies</h3>
            <p className="mb-6">
              These are temporary cookies that remain in your browser until you leave the website. 
              They help us maintain your session and ensure the website functions properly during your visit.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Persistent Cookies</h3>
            <p className="mb-6">
              These cookies remain on your device for a set period or until you delete them. 
              They help us remember your preferences and provide a more personalized experience on return visits.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Cookies</h2>
            <p className="mb-6">
              We may also use third-party services that place cookies on your device. These include analytics services 
              like Google Analytics, social media plugins, and advertising networks. These third parties have their own 
              privacy policies, and we encourage you to read them.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Managing Cookies</h2>
            <p className="mb-4">
              You can control and manage cookies in various ways:
            </p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>Most browsers allow you to refuse cookies or alert you when cookies are being sent</li>
              <li>You can delete cookies that have already been set through your browser settings</li>
              <li>You can use browser plugins or tools to manage cookies automatically</li>
              <li>Please note that disabling cookies may affect the functionality of our website</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Updates to This Policy</h2>
            <p className="mb-6">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other 
              operational, legal, or regulatory reasons. Please check this page periodically for updates.
            </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Us</h2>
          <p className="mb-6">
            If you have any questions about our Cookie Policy, please contact us at:
          </p>
          <div className="border border-gray-700 p-4 rounded-lg">
            <p>
              Email: cookies@yourcompany.com<br />
              Phone: +1 (555) 123-4567<br />
              Address: 123 Business Street, City, State 12345
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
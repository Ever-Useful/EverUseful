
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
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
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-400">Latest update: 26 June 2024</p>
        </div>

        <div className="prose prose-lg max-w-none text-white">
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p className="mb-6">
            At [Your Company], your privacy is important to us. We value your privacy and are committed to protecting 
            your personal information. This Privacy Policy outlines our practices regarding the 
            collection, use, and protection of information when you visit our website 
            [yourwebsite.com]. By using our services, you agree to the terms of this policy. Please read it 
            carefully to understand how we handle your information.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Personal Data</h3>
          <p className="mb-6">
            We collect personally identifiable information ("Personal Data") that you voluntarily provide 
            to us. This may include your name, email address, phone number, postal address, and 
            billing information. You may provide this information when you sign up for our services, 
            contact us for inquiries, or participate in surveys and promotions. We also collect details 
            about your preferences and interests to tailor our services to your needs.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Non-Personal Data</h3>
          <p className="mb-6">
            In addition to Personal Data, we collect non-personal information ("Non-Personal Data") 
            that cannot be used to identify you individually. This includes data such as your IP address, 
            browser type, operating system, referring website, pages visited, and the date and time of 
            visits. Non-Personal Data helps us understand user behavior and improve our website's 
            performance and user experience. We may also collect aggregated data from multiple 
            users, which is not linked to any specific individual.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Personal Data</h3>
          <p className="mb-4">We use the Personal Data we collect for various purposes, including:</p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Service Provision: To deliver the services you request, manage your account, and process transactions.</li>
            <li>Communication: To communicate with you about your account, respond to inquiries, provide updates, and send promotional materials.</li>
            <li>Personalization: To tailor our services to your preferences and enhance your user experience.</li>
            <li>Improvement: To analyze and improve our services, develop new features, and understand how users interact with our website.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Non-Personal Data</h3>
          <p className="mb-4">Non-Personal Data is used primarily to:</p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Enhance User Experience: By understanding how visitors use our website, we can improve navigation, content, and functionality.</li>
            <li>Analytics: To gather statistics and insights about user preferences and behavior, helping us make informed decisions about our services.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Sharing Your Information</h2>
          <p className="mb-6">
            We do not sell, trade, or otherwise transfer your Personal Data to outside parties without your consent, 
            except as described in this policy. We may share your information with trusted third parties who assist 
            us in operating our website, conducting our business, or servicing you, provided that those parties agree 
            to keep this information confidential.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Changes to This Privacy Policy</h2>
          <p className="mb-6">
            We may update this Privacy Policy from time to time to reflect changes in our practices or for other 
            operational, legal, or regulatory reasons. We will notify you of any significant changes by posting the 
            updated policy on our website and updating the "Last updated" date at the top of this page.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact Us</h2>
          <p className="mb-6">
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <div className="border border-gray-700 p-4 rounded-lg">
            <p>
              Email: privacy@yourcompany.com<br />
              Phone: +1 (555) 123-4567<br />
              Address: 123 Business Street, City, State 12345
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
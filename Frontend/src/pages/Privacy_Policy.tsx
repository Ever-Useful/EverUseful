import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <section className="w-full max-w-4xl bg-white rounded-lg shadow p-6 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-700 mb-6 text-base">
            When you use our services, you're trusting us with your information. We understand this is a big responsibility and work hard to protect your information and put you in control.
          </p>
          <p className="text-gray-700 mb-6 text-base">
            At <span className="font-semibold">AMOGH</span>, we value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when you visit our website and use our services. By using our site, you agree to the practices described in this policy.
          </p>
          <div className="space-y-6 text-gray-700 text-base">
            <section>
              <h2 className="font-semibold mb-2">1. Information We Collect</h2>
              <p>We collect information that helps us provide a better service to you. This can include:</p>
              <ul className="list-disc pl-5 mb-2">
                <li className="font-medium">Personal Information</li>
                <ul className="list-disc pl-8 mb-2">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Payment information</li>
                </ul>
                <li className="font-medium">Non-Personal Information</li>
                <ul className="list-disc pl-8">
                  <li>IP address</li>
                  <li>Browser type</li>
                  <li>Device type</li>
                  <li>Cookies</li>
                </ul>
              </ul>
            </section>
            <section>
              <h2 className="font-semibold mb-2">2. How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Personalizing your experience:</strong> Tailoring content and offers to your preferences.</li>
                <li><strong>Improving our website:</strong> Analyzing user activity to enhance performance and features.</li>
                <li><strong>Processing transactions:</strong> To fulfill orders and provide customer support.</li>
                <li><strong>Sending promotional emails:</strong> If you've opted-in, we may send you updates, offers, and news about our products and services.</li>
                <li><strong>Security:</strong> Protecting our website and your information from unauthorized access.</li>
              </ul>
            </section>
            <section>
              <h2 className="font-semibold mb-2">3. Cookies and Tracking Technologies</h2>
              <p>We use cookies and other tracking technologies to improve your experience on our website. Cookies are small files that store information about your preferences and behavior.</p>
              <ul className="list-disc pl-5 mb-2">
                <li><strong>How we use cookies:</strong> We use cookies to remember your preferences, analyze site traffic, and help us understand how users interact with our content.</li>
                <li><strong>Managing cookies:</strong> You can manage or disable cookies in your browser settings. However, some features of our website may not function properly without cookies.</li>
              </ul>
            </section>
            <section>
              <h2 className="font-semibold mb-2">4. Data Security</h2>
              <p>We take the security of your data seriously. We use industry-standard encryption (SSL) to protect your information during transmission. However, please note that no method of data transmission over the internet is 100% secure.</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">5. Sharing Your Information</h2>
              <p>We respect your privacy and will not share, sell, or rent your personal information to third parties, except as outlined below:</p>
              <ul className="list-disc pl-5 mb-2">
                <li><strong>Service Providers:</strong> We may share your information with trusted third-party providers who assist us in operating our website, processing payments, and delivering services. These partners are obligated to keep your information confidential.</li>
                <li><strong>Legal Compliance:</strong> We may disclose your information if required by law or in response to a legal request (e.g., court order or government investigation).</li>
              </ul>
            </section>
            <section>
              <h2 className="font-semibold mb-2">6. Your Rights</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Access:</strong> Request a copy of the information we hold about you.</li>
                <li><strong>Correction:</strong> Correct any inaccurate or incomplete information.</li>
                <li><strong>Deletion:</strong> Request that we delete your personal data, subject to legal restrictions.</li>
                <li><strong>Opt-out of Marketing:</strong> You can opt-out of receiving marketing communications at any time by clicking the unsubscribe link in our emails or adjusting your preferences.</li>
              </ul>
            </section>
            <section>
              <h2 className="font-semibold mb-2">7. Third-Party Links</h2>
              <p>Our website may contain links to external sites that are not controlled by us. We are not responsible for the privacy practices of these third-party websites. We encourage you to read their privacy policies before providing any personal information.</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">8. Changes to This Privacy Policy</h2>
              <p>We reserve the right to update or modify this Privacy Policy at any time. When we do, we will revise the Last Updated date at the top of this page. Any changes will be effective immediately upon posting. Please review this policy periodically for any updates.</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">9. Contact Us</h2>
              <p>If you have any questions or concerns about this Privacy Policy, please reach out to us at:</p>
              <p className="mt-2"><strong>Email:</strong> support@amogh.com</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">10. Acceptance of This Privacy Policy</h2>
              <p>By using our website, you agree to the terms outlined in this Privacy Policy. If you do not agree with this policy, please do not use our website.</p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
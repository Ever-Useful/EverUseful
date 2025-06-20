import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <section className="w-full max-w-4xl bg-white rounded-lg shadow p-6 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
          <p className="text-gray-700 mb-6 text-base">
            Welcome to <span className="font-semibold">AMOGH</span>! These terms are here to help us build a fair and transparent relationship with you. By continuing to explore our website, you agree to abide by these terms and conditions. Let's keep things simple and clear.
          </p>
          <div className="space-y-6 text-gray-700 text-base">
            <section>
              <h2 className="font-semibold mb-2">1. Acceptance of Terms</h2>
              <p>By using our website, you agree to follow these terms and conditions. They're here to protect both you and us. If anything seems unclear, feel free to reach out—we're happy to help!</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">2. User Accounts</h2>
              <p>If you create an account, you are responsible for maintaining its confidentiality. You agree to provide accurate information when registering. We reserve the right to suspend or terminate accounts that violate these terms.</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">3. Responsible Use of Our Platform</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Use Responsibly:</strong> Please don't misuse or harm the website in any way.</li>
                <li><strong>Respect the Rules:</strong> Avoid unauthorized access, spamming, or any actions that could disrupt the experience for others.</li>
                <li><strong>Personal Use Only:</strong> All content is for your personal or informational use unless we grant specific permission.</li>
              </ul>
            </section>
            <section>
              <h2 className="font-semibold mb-2">4. Intellectual Property</h2>
              <p>All designs, text, images, and ideas on this site are our hard work.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Feel free to browse and be inspired.</li>
                <li>If you'd like to use something, just ask us for permission.</li>
                <li>We're always happy to collaborate or share when it's appropriate!</li>
              </ul>
            </section>
            <section>
              <h2 className="font-semibold mb-2">5. Third-Party Links</h2>
              <p>Our website may contain links to third-party websites. We do not endorse or control these websites and are not responsible for their content.</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">6. Keeping Things Running Smoothly</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Links might break, services could temporarily pause, or information may occasionally need updating.</li>
                <li>While we strive for perfection, we can't guarantee it all the time.</li>
                <li>If something isn't working as expected, let us know, and we'll do our best to fix it.</li>
              </ul>
            </section>
            <section>
              <h2 className="font-semibold mb-2">7. Privacy First</h2>
              <p>Your trust means the world to us. Our Privacy Policy outlines how we collect, use, and protect your data. We recommend reviewing it to stay informed.</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">8. Refund Policy</h2>
              <p>We offer a one-day free trial to allow users to explore our services before committing to a subscription. Once a subscription is purchased, the payment is non-refundable, regardless of usage or cancellation requests.</p>
            </section>
            <section>
              <h2 className="font-semibold mb-2">9. Changes to These Terms</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Check back here occasionally for updates.</li>
                <li>Continued use of our site means you accept any changes we've made.</li>
              </ul>
            </section>
            <section>
              <h2 className="font-semibold mb-2">10. Have Questions? Let's Chat!</h2>
              <p>We want to make your experience here as seamless as possible. If you have any concerns, questions, or just want to say hello, you can always reach us at:</p>
              <p className="mt-2"><strong>Email:</strong> support@amogh.com</p>
              <p className="mt-4">Thank you for being here and trusting us. Let's make this journey a wonderful one together!</p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
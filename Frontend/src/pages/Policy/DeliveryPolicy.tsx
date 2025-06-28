
import { Link } from "react-router-dom";

const DeliveryPolicy = () => {
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
          <h1 className="text-4xl font-bold mb-2">Delivery Policy</h1>
          <p className="text-gray-400">Latest update: 26 June 2024</p>
        </div>

        <div className="prose prose-lg max-w-none text-white">
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Delivery Information</h2>
            <p className="mb-6">
              We are committed to delivering your orders in a timely and efficient manner. This Delivery Policy 
              outlines our shipping methods, delivery times, and important information about receiving your orders.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Shipping Methods</h2>
            <p className="mb-4">We offer several shipping options to meet your needs:</p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li><strong>Standard Shipping:</strong> 5-7 business days - Free for orders over $50</li>
              <li><strong>Express Shipping:</strong> 2-3 business days - $9.99</li>
              <li><strong>Overnight Shipping:</strong> 1 business day - $19.99</li>
              <li><strong>International Shipping:</strong> 7-14 business days - Rates vary by location</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Processing Time</h2>
            <p className="mb-6">
              Orders are typically processed within 1-2 business days. During peak seasons or promotional periods, 
              processing may take up to 3-5 business days. You will receive a confirmation email once your order 
              has been processed and shipped.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Delivery Areas</h2>
            <p className="mb-4">We currently deliver to:</p>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>All 50 United States and Washington D.C.</li>
              <li>Canada (additional fees may apply)</li>
              <li>International destinations (limited availability)</li>
              <li>P.O. Boxes and military addresses (APO/FPO)</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Delivery Instructions</h2>
            <h3 className="text-xl font-semibold mt-6 mb-3">5.1 Address Accuracy</h3>
            <p className="mb-4">
              Please ensure that your shipping address is complete and accurate. We are not responsible for 
              delays or additional charges resulting from incorrect or incomplete addresses.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">5.2 Signature Requirements</h3>
            <p className="mb-4">
              Some orders may require a signature upon delivery for security purposes. If you're not available 
              to sign, the carrier will leave a notice with instructions for redelivery or pickup.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Tracking Your Order</h2>
            <p className="mb-6">
              Once your order ships, you'll receive a tracking number via email. You can use this number to 
              track your package on our website or the carrier's website. Tracking information is usually 
              updated within 24 hours of shipment.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Delivery Issues</h2>
            <h3 className="text-xl font-semibold mt-6 mb-3">7.1 Damaged Packages</h3>
            <p className="mb-4">
              If your package arrives damaged, please contact us within 48 hours of delivery with photos 
              of the damage. We will work with you to resolve the issue promptly.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">7.2 Lost or Stolen Packages</h3>
            <p className="mb-4">
              If your package is marked as delivered but you haven't received it, please check with neighbors 
              and look around your delivery area. Contact us within 48 hours if you still cannot locate your package.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Special Circumstances</h2>
            <p className="mb-6">
              Delivery times may be affected by weather conditions, natural disasters, carrier delays, or other 
              circumstances beyond our control. We will notify you of any significant delays and work to minimize 
              any inconvenience.
            </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
          <p className="mb-6">
            For questions about delivery or to track your order, please contact us:
          </p>
          <div className="border border-gray-700 p-4 rounded-lg">
            <p>
              Email: shipping@yourcompany.com<br />
              Phone: +1 (555) 123-4567<br />
              Hours: Monday-Friday, 9 AM - 6 PM EST
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPolicy;
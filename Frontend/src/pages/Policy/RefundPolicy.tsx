
import { Link } from "react-router-dom";

const RefundPolicy = () => {
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
          <h1 className="text-4xl font-bold mb-2">Refund Policy</h1>
          <p className="text-gray-400">Latest update: 26 June 2024</p>
        </div>

        <div className="prose prose-lg max-w-none text-white">
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Our Commitment</h2>
          <p className="mb-6">
            We stand behind the quality of our products and services. If you're not completely satisfied with 
            your purchase, we offer a comprehensive refund policy to ensure your satisfaction.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Refund Eligibility</h2>
          <p className="mb-4">You may be eligible for a refund if:</p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>You request a refund within 30 days of purchase</li>
            <li>The product is in its original condition and packaging</li>
            <li>You have proof of purchase (order confirmation or receipt)</li>
            <li>The product has not been used, damaged, or altered</li>
            <li>All original accessories and documentation are included</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Non-Refundable Items</h2>
          <p className="mb-4">The following items are not eligible for refund:</p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Digital products or downloads after they have been accessed</li>
            <li>Personalized or customized items</li>
            <li>Perishable goods or items with limited shelf life</li>
            <li>Gift cards or store credit</li>
            <li>Items damaged by misuse or normal wear and tear</li>
            <li>Products purchased with promotional discounts or clearance items</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Refund Process</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">4.1 How to Request a Refund</h3>
          <p className="mb-4">To request a refund:</p>
          <ol className="list-decimal list-inside mb-6 space-y-2">
            <li>Contact our customer service team within 30 days of purchase</li>
            <li>Provide your order number and reason for the refund request</li>
            <li>Follow the return instructions provided by our team</li>
            <li>Ship the item back to us using the provided return label</li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Processing Time</h3>
          <p className="mb-6">
            Once we receive your returned item, we will inspect it and notify you of the approval or rejection 
            of your refund. If approved, your refund will be processed within 5-10 business days to your original 
            payment method.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Partial Refunds</h2>
          <p className="mb-4">Partial refunds may be granted for:</p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Items that are not in their original condition or are damaged</li>
            <li>Items that are missing parts for reasons not due to our error</li>
            <li>Items returned more than 30 days after purchase</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Return Shipping</h2>
          <p className="mb-6">
            We will provide a prepaid return shipping label for defective items or errors on our part. 
            For other returns, you are responsible for return shipping costs unless the item is defective 
            or we made an error in your order.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Exchanges</h2>
          <p className="mb-6">
            We only replace items if they are defective or damaged. If you need to exchange an item for 
            the same item, please contact us and send your item to our returns address.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Late or Missing Refunds</h2>
          <p className="mb-6">
            If you haven't received your refund yet, first check your bank account. Contact your credit card 
            company and bank, as it may take some time before your refund is officially posted. If you've done 
            all of this and still have not received your refund, please contact us.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
          <p className="mb-6">
            For refund requests or questions about our refund policy:
          </p>
          <div className="border border-gray-700 p-4 rounded-lg">
            <p>
              Email: refunds@yourcompany.com<br />
              Phone: +1 (555) 123-4567<br />
              Hours: Monday-Friday, 9 AM - 6 PM EST<br />
              Returns Address: 123 Business Street, City, State 12345
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
export const generateReceipt = (orderData: any, userEmail: string) => {
  const receiptContent = `
PAYMENT RECEIPT
===============

Order Details:
- Order ID: ${orderData.orderId}
- Transaction ID: ${orderData.transactionId}
- Amount: ${orderData.amount} ${orderData.currency}
- Payment Method: ${orderData.paymentMethod}
- Purchase Date: ${orderData.purchaseDate}

Product Details:
- Title: ${orderData.product.title}
- Category: ${orderData.product.category}

Customer Information:
- Email: ${userEmail}

Deliverables:
${orderData.product.deliverables.map((item: string, index: number) => `${index + 1}. ${item}`).join('\n')}

Delivery Information:
All deliverables will be sent to ${userEmail} within 24 hours.

Thank you for your purchase!
  `;

  const blob = new Blob([receiptContent], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `receipt-${orderData.orderId}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
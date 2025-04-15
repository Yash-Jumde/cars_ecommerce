import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get payment details from request body
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Create the signature to verify the payment
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Verify the signature
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is verified
      // Here you would typically update your database, mark the order as paid, etc.
      
      res.status(200).json({ status: 'success', message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ status: 'error', message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ status: 'error', message: 'Something went wrong', error: error.message });
  }
}
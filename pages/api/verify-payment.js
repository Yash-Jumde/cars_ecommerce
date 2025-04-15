// pages/api/verify-payment.js
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Extract payment details from request body
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId, // Get user ID
    } = req.body;

    // Verify that the user ID exists
    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'User authentication required',
      });
    }

    // Create a signature to verify the payment
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    // If signatures match, payment is authorized
    if (digest === razorpay_signature) {

      // Return success response
      return res.status(200).json({
        status: 'success',
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
    } else {
      // Payment signature verification failed
      return res.status(400).json({
        status: 'error',
        message: 'Payment verification failed',
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}
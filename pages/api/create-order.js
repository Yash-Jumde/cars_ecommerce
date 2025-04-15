import Razorpay from 'razorpay';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Get order details from request body
    const { amount, currency = 'INR', receipt, notes } = req.body;

    // Create order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in smallest currency unit (paise)
      currency,
      receipt,
      notes,
    });

    res.status(200).json({ order });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
}
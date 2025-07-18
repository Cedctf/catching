export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Simulate a transaction
    const transaction = {
      transaction_id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      transaction_date: new Date().toISOString(),
      amount: Math.floor(Math.random() * 500) + 10, // Random amount between 10-510
      payment_method: ['FACE', 'QR', 'CARD'][Math.floor(Math.random() * 3)],
      transaction_status: 'completed',
      transaction_type: 'payment',
      business_identity_token: 'your_business_token'
    };

    // Broadcast update to all connected clients
    if (global.connections) {
      const update = {
        type: 'transaction',
        transaction
      };
      global.connections.forEach(sendUpdate => sendUpdate(update));
    }

    res.status(200).json({
      success: true,
      message: 'Transaction simulated successfully',
      transaction
    });
  } catch (error) {
    console.error('Simulation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to simulate transaction'
    });
  }
} 
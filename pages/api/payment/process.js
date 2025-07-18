import { addTransaction, generateTransactionId } from '../../../lib/mockData';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { amount, paymentMethod } = req.body;

    // Validate input
    if (!amount || !paymentMethod) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid amount' 
      });
    }

    // Create transaction record
    const transaction = {
      transaction_id: generateTransactionId(),
      payer_identity_token: 'encrypted_token_here',
      receiver_identity_token: 'encrypted_business_token_here',
      business_identity_token: 'encrypted_business_token_here',
      transaction_type: 'payment',
      amount: parseFloat(amount),
      transaction_date: new Date().toISOString(),
      weekday: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
      payment_method: paymentMethod.toUpperCase(),
      transaction_status: 'completed'
    };

    // Save transaction to JSON file
    const transactionAdded = addTransaction(transaction);
    
    if (!transactionAdded) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate transaction detected'
      });
    }

    // Broadcast update to all connected clients
    if (global.connections) {
      const update = {
        type: 'transaction',
        transaction
      };
      global.connections.forEach(sendUpdate => {
        try {
          sendUpdate(update);
        } catch (error) {
          console.error('Error sending update:', error);
        }
      });
    }

    // Return success response
    res.status(200).json({
      success: true,
      transactionId: transaction.transaction_id,
      message: 'Payment processed successfully'
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment'
    });
  }
}
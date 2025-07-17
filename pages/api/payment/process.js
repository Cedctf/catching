import { addTransaction, addInvoice, generateTransactionId, generateInvoiceNumber } from '../../../lib/mockData';
import { getCurrentDateString, getWeekdayName } from '../../../lib/dateUtils';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('Payment API called with:', req.body);

  try {
    const { amount, paymentMethod, payerToken, receiverToken } = req.body;

    // Validate input
    if (!amount || !paymentMethod || !payerToken || !receiverToken) {
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

    // Generate transaction ID
    const transactionId = generateTransactionId();
    const invoiceNumber = generateInvoiceNumber();
    const timestamp = getCurrentDateString();
    const weekday = getWeekdayName(timestamp);

    // Create transaction object
    const transaction = {
      transaction_id: transactionId,
      payer_identity_token: payerToken,
      receiver_identity_token: receiverToken,
      business_identity_token: receiverToken,
      transaction_type: 'payment',
      amount: parseFloat(amount),
      transaction_date: timestamp,
      weekday: weekday,
      payment_method: paymentMethod.toUpperCase(),
      transaction_status: 'completed'
    };

    // Create invoice object
    const invoice = {
      user_identity_token: payerToken,
      business_identity_token: receiverToken,
      invoice_number: invoiceNumber,
      amount: parseFloat(amount),
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      status: 'paid',
      created_at: timestamp,
      weekday: weekday
    };

    // Save transaction and invoice
    const transactionAdded = addTransaction(transaction);
    const invoiceAdded = addInvoice(invoice);

    if (!transactionAdded || !invoiceAdded) {
      console.log('Duplicate payment detected, returning existing transaction');
      return res.status(409).json({
        success: false,
        message: 'Duplicate payment detected'
      });
    }

    console.log('Payment processed successfully:', { transactionId, invoiceNumber });

    // Return success response
    res.status(200).json({
      success: true,
      transactionId,
      invoiceNumber,
      message: 'Payment processed successfully'
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
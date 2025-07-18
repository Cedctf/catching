import { addInvoice, generateInvoiceNumber } from '../../../lib/mockData';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { amount, description, customerName, customerEmail, dueDate } = req.body;

    // Validate required fields
    if (!amount || !description || !customerName) {
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

    // Create invoice record
    const invoice = {
      user_identity_token: 'encrypted_token_here',
      business_identity_token: 'encrypted_business_token_here',
      invoice_number: generateInvoiceNumber(),
      amount: parseFloat(amount),
      due_date: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      created_at: new Date().toISOString(),
      weekday: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
      description: description,
      customer_name: customerName,
      customer_email: customerEmail
    };

    // Save invoice to JSON file
    const invoiceAdded = addInvoice(invoice);
    
    if (!invoiceAdded) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate invoice detected'
      });
    }

    // Broadcast update to all connected clients
    if (global.connections) {
      const update = {
        type: 'invoice',
        invoice
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
      invoiceId: invoice.invoice_number,
      invoiceNumber: invoice.invoice_number,
      message: 'Invoice created successfully'
    });
  } catch (error) {
    console.error('Invoice creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create invoice'
    });
  }
} 
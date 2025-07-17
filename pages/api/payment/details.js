import { getTransactions, getInvoices } from '../../../lib/mockData';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { txnId } = req.query;

    if (!txnId) {
      return res.status(400).json({ message: 'Transaction ID is required' });
    }

    // Get transaction details
    const transactions = getTransactions();
    const transaction = transactions.transactions.find(t => t.transaction_id === txnId);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Get related invoice
    const invoices = getInvoices();
    const invoice = invoices.invoices.find(i => 
      i.user_identity_token === transaction.payer_identity_token &&
      i.business_identity_token === transaction.business_identity_token &&
      i.amount === transaction.amount
    );

    res.status(200).json({
      transaction,
      invoiceNumber: invoice?.invoice_number || null
    });

  } catch (error) {
    console.error('Error fetching transaction details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
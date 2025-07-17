import { getTransactions } from '../../../lib/mockData';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const transactions = getTransactions();
    
    // Filter transactions for Doe's Bakery (business_identity_token: "encrypted_business_token_here")
    const businessTransactions = transactions.transactions.filter(
      t => t.business_identity_token === 'encrypted_business_token_here'
    );

    // Sort by date (newest first)
    businessTransactions.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));

    res.status(200).json({
      transactions: businessTransactions,
      total: businessTransactions.length
    });

  } catch (error) {
    console.error('Error fetching business transactions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
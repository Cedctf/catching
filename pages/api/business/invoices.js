import { getInvoices } from '../../../lib/mockData';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const invoices = getInvoices();
    
    // Filter invoices for Doe's Bakery (business_identity_token: "encrypted_business_token_here")
    const businessInvoices = invoices.invoices.filter(
      i => i.business_identity_token === 'encrypted_business_token_here'
    );

    // Sort by created date (newest first)
    businessInvoices.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.status(200).json({
      invoices: businessInvoices,
      total: businessInvoices.length
    });

  } catch (error) {
    console.error('Error fetching business invoices:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
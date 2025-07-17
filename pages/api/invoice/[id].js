import { getInvoices } from '../../../lib/mockData';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Invoice ID is required' });
    }

    const invoices = getInvoices();
    const invoice = invoices.invoices.find(i => i.invoice_number === id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json(invoice);

  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
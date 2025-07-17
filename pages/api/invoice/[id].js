import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    // Try to read from public/invoices.json first (detailed format)
    try {
      const publicFilePath = path.join(process.cwd(), 'public', 'invoices.json');
      const publicFileContents = fs.readFileSync(publicFilePath, 'utf8');
      const publicData = JSON.parse(publicFileContents);
      const detailedInvoice = publicData.invoices.find(inv => inv.id === id);
      
      if (detailedInvoice) {
        return res.status(200).json(detailedInvoice);
      }
    } catch (publicError) {
      // File doesn't exist or other error, continue to mock data
    }

    // Fallback to mock/invoices.json (simple format)
    const mockFilePath = path.join(process.cwd(), 'mock', 'invoices.json');
    const mockFileContents = fs.readFileSync(mockFilePath, 'utf8');
    const mockData = JSON.parse(mockFileContents);
    
    // Find the invoice by invoice_number (not id)
    const simpleInvoice = mockData.invoices.find(inv => inv.invoice_number === id);

    if (!simpleInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Transform simple invoice data to EInvoice format
    const transformedInvoice = {
      id: simpleInvoice.invoice_number,
      status: simpleInvoice.status,
      companyInfo: {
        name: 'Catching Payment System',
        address: 'Digital Payment Platform, Malaysia',
        phone: '60312345678',
        email: 'support@catching.com'
      },
      supplier: {
        tin: 'E100000000030',
        name: 'Catching Sdn Bhd',
        regNo: 'NA',
        sstId: 'NA',
        address: 'Digital Payment Platform, Malaysia',
        contact: '60312345678',
        email: 'support@catching.com',
        msic: '62020',
        activity: 'Digital payment services'
      },
      buyer: {
        tin: 'C987654321120',
        regNo: '298021010000023',
        sstId: 'L10-5621-78000000'
      },
      invoiceMeta: {
        type: '01 - Invoice',
        version: '1.0',
        code: simpleInvoice.invoice_number,
        uid: `${simpleInvoice.invoice_number}-2025-001`,
        refNo: 'Payment Transaction',
        dateTime: new Date(simpleInvoice.created_at).toLocaleString('en-GB'),
        validationDate: new Date(simpleInvoice.created_at).toLocaleString('en-GB')
      },
      items: [
        {
          classification: 'O35',
          description: `Payment Transaction - ${simpleInvoice.invoice_number}`,
          quantity: 1,
          unitPrice: simpleInvoice.amount,
          amount: simpleInvoice.amount,
          disc: '-',
          taxRate: '0.00%',
          taxAmount: 0,
          totalInclTax: simpleInvoice.amount
        }
      ],
      summary: {
        totalExclTax: simpleInvoice.amount,
        taxAmount: 0,
        totalInclTax: simpleInvoice.amount
      },
      digitalSignature: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2',
      qrCodeUrl: '',
      notes: `Payment processed on ${new Date(simpleInvoice.created_at).toLocaleDateString()}`
    };

    res.status(200).json(transformedInvoice);
  } catch (error) {
    console.error('Error reading invoice data:', error);
    res.status(500).json({ message: 'Error reading invoice data' });
  }
}
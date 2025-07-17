import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import EInvoice from '../../components/EInvoice';

export default function InvoiceDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/invoice/${id}`);
      if (response.ok) {
        const data = await response.json();
        setInvoice(data);
      } else {
        setError('Invoice not found');
      }
    } catch (err) {
      setError('Error loading invoice');
    } finally {
      setLoading(false);
    }
  };

  // Static fallback data for unavailable fields (same as main invoice page)
  const staticFallbacks = {
    companyInfo: {
      name: 'Food Eatery Sdn Bhd',
      address: '1st Floor, Palm Green, Kesari Street, 543210, Kuala Lumpur',
      phone: '60312346789',
      email: 'gretasolutions.com'
    },
    supplier: {
      tin: 'E100000000030',
      name: 'ABC Advisory Ltd',
      regNo: 'NA',
      sstId: 'NA',
      address: '1, Street Avenue, NOP 123 England',
      contact: '441234567890',
      email: 'ABC advisory@gamil.com',
      msic: '00000',
      activity: 'NA'
    },
    buyer: {
      tin: 'C987654321120',
      regNo: '298021010000023',
      sstId: 'L10-5621-78000000'
    },
    invoiceMeta: {
      type: '01 - Invoice',
      version: '1.0',
      code: 'INV000001',
      uid: '123456789-2024-4017344',
      refNo: 'Not Applicable',
      dateTime: '11/06/2024 11:53:13',
      validationDate: '12/06/2024 12:58:13'
    },
    digitalSignature: '9e83e05bbf9b8dbac0deeec3bce6cba983f6dc50531c7a919f28d5fb369etc3',
    qrCodeUrl: '',
    notes: ''
  };

  // Merge API data with static fallbacks
  const getMergedData = () => {
    if (!invoice) {
      return staticFallbacks;
    }

    return {
      companyInfo: { ...staticFallbacks.companyInfo, ...invoice.companyInfo },
      supplier: { ...staticFallbacks.supplier, ...invoice.supplier },
      buyer: { ...staticFallbacks.buyer, ...invoice.buyer },
      invoiceMeta: { ...staticFallbacks.invoiceMeta, ...invoice.invoiceMeta },
      items: invoice.items || [],
      summary: invoice.summary || {},
      digitalSignature: invoice.digitalSignature || staticFallbacks.digitalSignature,
      qrCodeUrl: invoice.qrCodeUrl || staticFallbacks.qrCodeUrl,
      notes: invoice.notes || staticFallbacks.notes,
      showIllustrationBadge: false
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <Link href="/business/dashboard" className="text-blue-600 hover:text-blue-800">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link href="/business/dashboard" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Invoice Details</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Status Badge */}
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Invoice #{invoice.invoice_number || invoice.id}
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              invoice.status === 'paid' 
                ? 'bg-green-100 text-green-800'
                : invoice.status === 'overdue'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {invoice.status ? invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) : 'Pending'}
            </span>
          </div>
          
          {/* EInvoice Component */}
          <EInvoice {...getMergedData()} />
        </div>
      </div>
    </div>
  );
}
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';

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

  const handleDownloadPDF = () => {
    // Simulate PDF download
    alert('PDF download would start here in a real implementation');
  };

  const formatCurrency = (amount) => {
    return `RM ${amount.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested invoice could not be found.'}</p>
          <Link href="/business/dashboard">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Invoice Details</h1>
          <Link href="/business/dashboard" className="text-blue-600 hover:text-blue-800">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Invoice */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Invoice Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">INVOICE</h2>
                <p className="text-blue-100">Catching Payment System</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{invoice.invoice_number}</div>
                <div className="text-blue-100">Invoice Number</div>
              </div>
            </div>
          </div>

          {/* Invoice Body */}
          <div className="p-6">
            {/* Business and Customer Info */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">From:</h3>
                <div className="text-gray-600">
                  <div className="font-medium text-gray-900">Doe's Bakery</div>
                  <div>456 Bakery St</div>
                  <div>info@doesbakery.com</div>
                  <div>+60123456780</div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">To:</h3>
                <div className="text-gray-600">
                  <div className="font-medium text-gray-900">John Doe</div>
                  <div>123 Main St</div>
                  <div>john.doe@email.com</div>
                  <div>+60123456789</div>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <div className="text-sm text-gray-500 mb-1">Invoice Date</div>
                <div className="font-medium">{formatDate(invoice.created_at)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Due Date</div>
                <div className="font-medium">{formatDate(invoice.due_date)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Status</div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  invoice.status === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      Payment Transaction - {invoice.invoice_number}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                      {formatCurrency(invoice.amount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="flex justify-between items-center py-2 border-t border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-gray-900">{formatCurrency(invoice.amount)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Payment Information</h4>
              <p className="text-sm text-gray-600">
                This invoice has been automatically generated for a Catching payment transaction. 
                Payment was processed securely through our digital payment platform.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleDownloadPDF}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download PDF
              </button>
              <button
                onClick={() => window.print()}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
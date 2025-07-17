import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PaymentSuccess() {
  const router = useRouter();
  const { txnId, amount, method } = router.query;
  const [transactionDetails, setTransactionDetails] = useState(null);

  useEffect(() => {
    if (txnId) {
      // Fetch transaction details
      fetch(`/api/payment/details?txnId=${txnId}`)
        .then(res => res.json())
        .then(data => setTransactionDetails(data))
        .catch(err => console.error('Error fetching transaction details:', err));
    }
  }, [txnId]);

  const formatMethod = (method) => {
    return method === 'face' ? 'Face Recognition' : 'QR Code';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-4xl text-white">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Thank you for using Catching</p>
        </div>

        {/* Transaction Details */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6 text-center">Transaction Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Amount</span>
              <span className="font-semibold text-lg">RM {amount}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium">{formatMethod(method)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-mono text-sm">{txnId}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">To</span>
              <span className="font-medium">Doe's Bakery</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Date</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Status</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Completed
              </span>
            </div>
          </div>
        </div>

        {/* E-Invoice Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">E-Invoice Generated</h3>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="text-sm text-gray-600 mb-2">Invoice Number</div>
            <div className="font-mono font-medium">{transactionDetails?.invoiceNumber || 'Loading...'}</div>
          </div>
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
            📄 Download PDF Invoice
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/payment/start" className="block">
            <button className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors">
              Make Another Payment
            </button>
          </Link>
          
          <Link href="/" className="block">
            <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Back to Home
            </button>
          </Link>
        </div>

        {/* Receipt Note */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>A receipt has been sent to your registered email</p>
        </div>
      </div>
    </div>
  );
}
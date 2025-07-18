import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Download, Mail, Loader2, AlertCircle } from 'lucide-react';
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

  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 15 },
    visible: {
      opacity: 1, y: 0, rotateX: 0,
      transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }
    }
  };

  if (loading) {
    return (
      <div className="relative w-full max-w-7xl mx-auto px-6 py-8 pt-20">
        <div className="flex items-center justify-center min-h-[400px]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-[#002fa7] border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full max-w-7xl mx-auto px-6 py-8 pt-20">
        <div className="flex items-center justify-center min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="p-4 bg-red-100 rounded-full w-fit mx-auto">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Invoice</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Link href="/business/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#002fa7] hover:bg-[#002fa7]/90 text-white font-medium py-2 px-4 rounded-xl transition-colors duration-200"
                >
                  Back to Dashboard
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const mergedData = getMergedData();

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 py-8 pt-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/business/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-[#002fa7]/10 hover:bg-[#002fa7]/20 rounded-xl transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </motion.button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoice Details</h1>
            <p className="text-gray-600">Invoice {id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-xl transition-colors duration-200 border border-gray-200 text-sm"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white font-medium py-2 px-4 rounded-xl transition-colors duration-200 text-sm"
          >
            <Mail className="h-4 w-4" />
            <span>Send Email</span>
          </motion.button>
        </div>
      </header>

      {/* Invoice Content */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6"
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Invoice Preview
          </h2>
        </div>
        <EInvoice {...mergedData} />
      </motion.div>
    </div>
  );
}
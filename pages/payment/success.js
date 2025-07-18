import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Download, 
  Mail, 
  ArrowRight, 
  Receipt, 
  Calendar,
  CreditCard,
  Building,
  Loader2,
  FileText
} from 'lucide-react';
import EInvoice from '../../components/EInvoice';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function PaymentSuccess() {
  const router = useRouter();
  const { transactionId } = router.query;
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const invoiceRef = useRef();

  useEffect(() => {
    if (transactionId) {
      fetchTransactionDetails();
    }
  }, [transactionId]);

  const fetchTransactionDetails = async () => {
    try {
      const response = await fetch(`/api/payment/details?txnId=${transactionId}`);
      if (response.ok) {
        const data = await response.json();
        setTransactionDetails(data.transaction); // Fix: access the transaction object
        
        if (data.invoiceNumber) {
          await fetchInvoiceData(data.invoiceNumber);
        }
      }
    } catch (error) {
      console.error('Error fetching transaction details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoiceData = async (invoiceNumber) => {
    try {
      const response = await fetch(`/api/invoice/${invoiceNumber}`);
      if (response.ok) {
        const data = await response.json();
        setInvoiceData(data);
        
        // Auto-send email after invoice data is loaded and component is ready (3 seconds)
        setTimeout(() => {
          // Check if the invoice ref is available before sending email
          if (invoiceRef.current) {
            autoSendEmail(data, invoiceNumber);
          } else {
            // Retry after a short delay if ref is not ready
            setTimeout(() => {
              if (invoiceRef.current) {
                autoSendEmail(data, invoiceNumber);
              }
            }, 1000);
          }
        }, 3000);
      }
    } catch (error) {
      console.error('Error fetching invoice data:', error);
    }
  };

  const autoSendEmail = async (invoice, invoiceNumber) => {
    if (emailSent || isSendingEmail) return;
    
    setIsSendingEmail(true);
    try {
      console.log('Starting auto-email process...');
      const pdf = await generatePDF();
      const pdfBase64 = pdf.output('datauristring').split(',')[1]; // Get base64 without data:application/pdf;base64,
      
      const emailData = {
        email: 'loyqunjie@gmail.com',
        pdfData: pdfBase64,
        invoiceNumber: invoiceNumber || transactionDetails?.transaction_id || 'INV000001'
      };

      const response = await fetch('/api/send-invoice-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        setEmailSent(true);
        console.log('Invoice email sent automatically to loyqunjie@gmail.com');
      } else {
        const errorData = await response.json();
        console.error('Email sending failed:', errorData);
      }
    } catch (error) {
      console.error('Error auto-sending email:', error);
      // Don't retry automatically to avoid infinite loops
      // User can still manually download if needed
    } finally {
      setIsSendingEmail(false);
    }
  };

  const generatePDF = async () => {
    const element = invoiceRef.current;
    
    // Check if element exists before proceeding
    if (!element) {
      throw new Error('Invoice element not found. Please wait for the page to fully load.');
    }
    
    const clonedElement = element.cloneNode(true);
    
    const applyInlineStyles = (el) => {
      const computedStyle = window.getComputedStyle(el);
      
      const stylesToCopy = [
        'backgroundColor', 'color', 'fontSize', 'fontFamily', 'fontWeight',
        'padding', 'margin', 'border', 'borderColor', 'borderWidth', 'borderStyle',
        'textAlign', 'lineHeight', 'display', 'width', 'height', 'minWidth',
        'maxWidth', 'boxSizing', 'textDecoration', 'textTransform'
      ];
      
      stylesToCopy.forEach(prop => {
        const value = computedStyle.getPropertyValue(prop.replace(/([A-Z])/g, '-$1').toLowerCase());
        if (value && value !== 'initial' && value !== 'inherit') {
          if (value.includes('lab(')) {
            if (prop === 'backgroundColor') {
              el.style[prop] = '#ffffff';
            } else if (prop === 'color') {
              el.style[prop] = '#000000';
            }
          } else {
            el.style[prop] = value;
          }
        }
      });
      
      Array.from(el.children).forEach(applyInlineStyles);
    };
    
    document.body.appendChild(clonedElement);
    applyInlineStyles(clonedElement);
    
    const canvas = await html2canvas(clonedElement, {
      scale: 1.5, // Reduced scale to decrease file size
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false, // Disable logging for better performance
      removeContainer: true
    });
    
    document.body.removeChild(clonedElement);
    
    const imgData = canvas.toDataURL('image/jpeg', 0.8); // Use JPEG with 80% quality to reduce size
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true // Enable PDF compression
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 30;
    
    pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    
    return pdf;
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const pdf = await generatePDF();
      pdf.save(`receipt-${transactionDetails?.transaction_id || 'transaction'}.pdf`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Show user-friendly error message
      alert('Unable to generate PDF. Please wait for the page to fully load and try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const getInvoiceProps = () => {
    if (!invoiceData) {
      return {
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
          code: transactionDetails?.transaction_id || 'INV000001',
          uid: '123456789-2024-4017344',
          refNo: 'Not Applicable',
          dateTime: new Date().toLocaleString('en-GB', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          }),
          validationDate: new Date(Date.now() + 24*60*60*1000).toLocaleString('en-GB', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          })
        },
        items: [
          {
            classification: 'O35',
            description: 'Payment Transaction',
            quantity: 1,
            unitPrice: transactionDetails?.amount || 0,
            amount: transactionDetails?.amount || 0,
            disc: '-',
            taxRate: '0.00%',
            taxAmount: 0,
            totalInclTax: transactionDetails?.amount || 0,
          }
        ],
        summary: {
          totalExclTax: transactionDetails?.amount || 0,
          taxAmount: 0,
          totalInclTax: transactionDetails?.amount || 0,
        },
        digitalSignature: '9e83e05bbf9b8dbac0deeec3bce6cba983f6dc50531c7a919f28d5fb369etc3',
        qrCodeUrl: '',
        notes: '',
        showIllustrationBadge: false
      };
    }
    
    return {
      ...invoiceData,
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

  const successVariants = {
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  if (loading) {
    return (
      <div className="relative w-full max-w-7xl mx-auto px-6 py-8">
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

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Success Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <motion.div
          variants={successVariants}
          initial="hidden"
          animate="visible"
          className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="h-12 w-12 text-green-600" />
        </motion.div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your payment has been processed successfully</p>
        </div>
      </motion.div>

      {/* Transaction Details */}
      {transactionDetails && (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white border border-gray-200 rounded-3xl shadow-lg p-4"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Receipt className="h-5 w-5 text-[#002fa7]" />
              <h2 className="text-lg font-semibold text-gray-900">Transaction Details</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Transaction ID</span>
                <span className="font-mono text-gray-900">{transactionDetails.transaction_id}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="font-medium text-gray-900">
                  {new Intl.NumberFormat('en-MY', {
                    style: 'currency',
                    currency: 'MYR',
                  }).format(transactionDetails.amount)}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Date & Time</span>
                <span className="font-medium text-gray-900">
                  {new Date(transactionDetails.transaction_date).toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Payment Method</span>
                <span className="font-medium text-gray-900 capitalize">
                  {transactionDetails.payment_method}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                Status: <span className="font-medium text-green-600">Completed</span>
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200 disabled:opacity-50"
        >
          {isDownloading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
          <span>Download Receipt</span>
        </motion.button>
        
        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors duration-200 border border-gray-200"
          >
            <ArrowRight className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </motion.button>
        </Link>
      </div>

      {/* Invoice Preview */}
      {transactionDetails && (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-6 w-6 text-[#002fa7]" />
            <h2 className="text-xl font-semibold text-gray-900">Invoice</h2>
          </div>
          <div ref={invoiceRef}>
            <EInvoice {...getInvoiceProps()} />
          </div>
        </motion.div>
      )}

      {/* Hidden Invoice for PDF Generation */}
      <div className="hidden">
        <div>
          <EInvoice {...getInvoiceProps()} />
        </div>
      </div>
    </div>
  );
}
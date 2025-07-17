import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import EInvoice from '../../components/EInvoice';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function PaymentSuccess() {
  const router = useRouter();
  const { txnId, amount, method } = router.query;
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const invoiceRef = useRef();

  useEffect(() => {
    if (txnId) {
      // Fetch transaction details
      fetch(`/api/payment/details?txnId=${txnId}`)
        .then(res => res.json())
        .then(data => {
          setTransactionDetails(data);
          // Fetch invoice data using the invoice number
          if (data.invoiceNumber) {
            fetchInvoiceData(data.invoiceNumber);
          }
        })
        .catch(err => console.error('Error fetching transaction details:', err));
    }
  }, [txnId]);

  const fetchInvoiceData = async (invoiceNumber) => {
    try {
      const response = await fetch(`/api/invoice/${invoiceNumber}`);
      if (response.ok) {
        const data = await response.json();
        setInvoiceData(data);
        // Auto-send email after invoice data is loaded
        autoSendEmail(data, invoiceNumber);
      }
    } catch (error) {
      console.error('Error fetching invoice data:', error);
    }
  };

  const autoSendEmail = async (invoice, invoiceNumber) => {
    if (emailSent) return; // Prevent duplicate emails
    
    try {
      // Generate PDF for email
      const pdfData = await generatePDF();
      
      // Auto-send to a default email (you can modify this logic)
      const defaultEmail = 'loyqunjie@gmail.com'; // Replace with actual customer email
      
      const response = await fetch('/api/send-invoice-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: defaultEmail,
          pdfData,
          invoiceNumber: invoiceNumber,
        }),
      });

      if (response.ok) {
        setEmailSent(true);
        console.log('Invoice email sent automatically');
      }
    } catch (error) {
      console.error('Error auto-sending email:', error);
    }
  };

  const generatePDF = async () => {
    const element = invoiceRef.current;
    
    // Create a clone of the element to avoid modifying the original
    const clonedElement = element.cloneNode(true);
    
    // Apply inline styles to preserve exact styling
    const applyInlineStyles = (el) => {
      const computedStyle = window.getComputedStyle(el);
      
      // Copy all computed styles to inline styles
      const stylesToCopy = [
        'backgroundColor', 'color', 'fontSize', 'fontFamily', 'fontWeight',
        'padding', 'margin', 'border', 'borderColor', 'borderWidth', 'borderStyle',
        'textAlign', 'lineHeight', 'display', 'width', 'height', 'minWidth',
        'maxWidth', 'boxSizing', 'textDecoration', 'textTransform'
      ];
      
      stylesToCopy.forEach(prop => {
        const value = computedStyle.getPropertyValue(prop.replace(/([A-Z])/g, '-$1').toLowerCase());
        if (value && value !== 'initial' && value !== 'inherit') {
          // Convert lab() colors to rgb() equivalents
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
      
      // Recursively apply to children
      Array.from(el.children).forEach(applyInlineStyles);
    };
    
    // Temporarily add the cloned element to the DOM
    document.body.appendChild(clonedElement);
    clonedElement.style.position = 'absolute';
    clonedElement.style.left = '-9999px';
    clonedElement.style.top = '0';
    
    try {
      applyInlineStyles(clonedElement);
      
      const canvas = await html2canvas(clonedElement, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      return pdf.output('datauristring').split(',')[1]; // Return base64 string
    } finally {
      // Clean up: remove the cloned element
      document.body.removeChild(clonedElement);
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoiceData) return;
    
    setIsDownloading(true);
    try {
      const pdfData = await generatePDF();
      
      // Convert base64 back to blob and download
      const byteCharacters = atob(pdfData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${transactionDetails?.invoiceNumber || txnId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

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
          
          {/* Email Status */}
          {emailSent && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg mb-4 text-sm">
              Invoice emailed successfully!
            </div>
          )}
          
          <button 
            onClick={handleDownloadPDF}
            disabled={!invoiceData || isDownloading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {isDownloading ? 'Generating PDF...' : 'Download PDF Invoice'}
          </button>
        </div>

        {/* Hidden EInvoice for PDF Generation */}
        <div style={{ position: 'absolute', left: '-9999px', top: '0' }}>
          <div ref={invoiceRef}>
            {invoiceData && <EInvoice {...invoiceData} />}
          </div>
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
          <p>{emailSent ? 'E-Invoice has been sent to your registered email' : 'Sending e-invoice to your email...'}</p>
        </div>
      </div>
    </div>
  );
}
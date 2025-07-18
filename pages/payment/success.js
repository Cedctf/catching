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
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCcw
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
  const [emailStatus, setEmailStatus] = useState({
    started: false,
    steps: {
      generating: { status: 'pending', error: null },
      preparing: { status: 'pending', error: null },
      sending: { status: 'pending', error: null },
      completed: { status: 'pending', error: null }
    }
  });

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
        
        // Start auto-email timer after invoice data is loaded
        startAutoEmailTimer();
      }
    } catch (error) {
      console.error('Error fetching invoice data:', error);
    }
  };

  const startAutoEmailTimer = () => {
    console.log('=== Auto Email Timer Started ===');
    console.log('Current state:', {
      emailSent,
      isSendingEmail,
      hasInvoiceRef: !!invoiceRef.current,
      emailStatusStarted: emailStatus.started
    });

    setTimeout(async () => {
      console.log('Auto email timer fired after 3 seconds');
      console.log('Checking conditions:', {
        emailSent,
        isSendingEmail,
        hasInvoiceRef: !!invoiceRef.current
      });

      if (!emailSent && !isSendingEmail && invoiceRef.current) {
        console.log('Conditions met, calling sendInvoiceEmail...');
        await sendInvoiceEmail();
      } else if (!invoiceRef.current) {
        console.log('Invoice ref not ready, retrying in 1 second...');
        setTimeout(async () => {
          console.log('Retry attempt - checking conditions:', {
            emailSent,
            isSendingEmail,
            hasInvoiceRef: !!invoiceRef.current
          });
          if (!emailSent && !isSendingEmail && invoiceRef.current) {
            console.log('Retry conditions met, calling sendInvoiceEmail...');
            await sendInvoiceEmail();
          } else {
            console.log('Retry conditions not met, giving up');
          }
        }, 1000);
      } else {
        console.log('Auto email timer conditions not met:', {
          emailSent: emailSent ? 'Already sent' : 'Not sent',
          isSendingEmail: isSendingEmail ? 'Currently sending' : 'Not sending',
          hasInvoiceRef: !!invoiceRef.current ? 'Available' : 'Not available'
        });
      }
    }, 3000);
  };

  const sendInvoiceEmail = async () => {
    if (emailSent || isSendingEmail || !invoiceRef.current) {
      console.log('Email sending prevented:', { emailSent, isSendingEmail, hasInvoiceRef: !!invoiceRef.current });
      return;
    }
    
    console.log('=== Starting Invoice Email Process ===');
    setIsSendingEmail(true);
    setEmailSent(false);
    setEmailStatus({
      started: true,
      steps: {
        generating: { status: 'processing', error: null },
        preparing: { status: 'pending', error: null },
        sending: { status: 'pending', error: null },
        completed: { status: 'pending', error: null }
      }
    });

    try {
      // Generate PDF
      console.log('Step 1: Starting PDF generation...');
      
      if (!invoiceRef.current) {
        throw new Error('Invoice reference not available');
      }

      const pdf = await generatePDF();
      if (!pdf) {
        throw new Error('PDF generation failed');
      }

      const pdfBlob = pdf.output('blob');
      console.log('Step 1 Complete: PDF generated successfully:', {
        size: pdfBlob.size,
        type: pdfBlob.type
      });

      if (pdfBlob.size === 0) {
        throw new Error('Generated PDF is empty');
      }

      setEmailStatus(prev => ({
        ...prev,
        steps: {
          ...prev.steps,
          generating: { status: 'completed', error: null },
          preparing: { status: 'processing', error: null }
        }
      }));

      // Create FormData
      console.log('Step 2: Creating FormData...');
      const formData = new FormData();
      
      // Create file with proper name and type
      const pdfFile = new File([pdfBlob], 'invoice.pdf', { 
        type: 'application/pdf',
        lastModified: Date.now()
      });
      
      formData.append('pdf', pdfFile);
      formData.append('email', 'loyqunjie@gmail.com');

      console.log('Step 2 Complete: FormData prepared:', {
        hasPDF: formData.has('pdf'),
        hasEmail: formData.has('email'),
        email: formData.get('email'),
        pdfSize: pdfFile.size,
        pdfType: pdfFile.type
      });

      setEmailStatus(prev => ({
        ...prev,
        steps: {
          ...prev.steps,
          preparing: { status: 'completed', error: null },
          sending: { status: 'processing', error: null }
        }
      }));

      // Send email
      console.log('Step 3: Sending invoice email to loyqunjie@gmail.com...');
      console.log('Making fetch request to /api/send-invoice-email');

      const response = await fetch('/api/send-invoice-email', {
        method: 'POST',
        body: formData,
      });

      console.log('Step 3: Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      let responseData;
      try {
        responseData = await response.json();
        console.log('Step 3: Response data parsed:', responseData);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        const textResponse = await response.text();
        console.log('Response as text:', textResponse);
        throw new Error(`Server returned non-JSON response: ${textResponse}`);
      }

      if (response.ok && responseData) {
        console.log('Step 3 Complete: Invoice email sent successfully!');
        setEmailSent(true);
        setEmailStatus(prev => ({
          ...prev,
          steps: {
            ...prev.steps,
            sending: { status: 'completed', error: null },
            completed: { status: 'completed', error: null }
          }
        }));
        console.log('=== Email Process Complete ===');
      } else {
        const errorMessage = responseData?.message || responseData?.error || `HTTP ${response.status}: ${response.statusText}`;
        console.error('Step 3 Failed:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('=== Email Process Failed ===');
      console.error('Detailed error in invoice email sending:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        currentStep: getCurrentStep(emailStatus.steps)
      });
      
      setEmailStatus(prev => ({
        ...prev,
        steps: {
          ...prev.steps,
          [getCurrentStep(prev.steps)]: { 
            status: 'error', 
            error: error.message || 'An unexpected error occurred'
          }
        }
      }));
    } finally {
      console.log('=== Email Process Finished ===');
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

  // Helper function to get current step
  const getCurrentStep = (steps) => {
    if (steps.generating.status === 'processing') return 'generating';
    if (steps.preparing.status === 'processing') return 'preparing';
    if (steps.sending.status === 'processing') return 'sending';
    return 'completed';
  };

  // Add manual send button in development
  const ManualSendButton = () => {
    return (
      <div className="mb-4">
        <button
          onClick={() => {
            console.log('Manual email trigger clicked');
            sendInvoiceEmail();
          }}
          className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          <Mail className="h-4 w-4" />
          Manual Send Invoice Email
        </button>
      </div>
    );
  };

  // Status indicator component
  const StatusStep = ({ status, label, isLast }) => {
    const getIcon = () => {
      switch (status) {
        case 'pending':
          return <Clock className="h-5 w-5 text-gray-400" />;
        case 'processing':
          return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
        case 'completed':
          return <CheckCircle2 className="h-5 w-5 text-green-500" />;
        case 'error':
          return <XCircle className="h-5 w-5 text-red-500" />;
      }
    };

    return (
      <div className="flex items-center">
        <div className="flex flex-col items-center">
          <div className={`
            flex items-center justify-center w-8 h-8 rounded-full
            ${status === 'processing' ? 'bg-primary/10' :
              status === 'completed' ? 'bg-green-100' :
              status === 'error' ? 'bg-red-100' :
              'bg-gray-100'}
          `}>
            {getIcon()}
          </div>
          <div className="text-sm mt-1 font-medium text-gray-600">{label}</div>
        </div>
        {!isLast && (
          <div className={`
            h-0.5 w-12 mx-2
            ${status === 'completed' ? 'bg-green-500' :
              status === 'processing' ? 'bg-primary' :
              status === 'error' ? 'bg-red-500' :
              'bg-gray-200'}
          `} />
        )}
      </div>
    );
  };

  const InvoiceEmailStatus = () => {
    const isProcessing = isSendingEmail || (emailStatus.started && !emailSent && !Object.values(emailStatus.steps).some(step => step.status === 'error'));
    const hasError = Object.values(emailStatus.steps).some(step => step.status === 'error');
    const errorMessage = Object.values(emailStatus.steps).find(step => step.error)?.error;

    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white border border-gray-200 rounded-3xl shadow-lg overflow-hidden"
      >
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Invoice Email</h3>
                <p className="text-sm text-gray-500">Sending invoice to your email</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2
              ${emailSent ? 'bg-green-100 text-green-700' : 
                hasError ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'}`}
            >
              {emailSent ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Sent</span>
                </>
              ) : hasError ? (
                <>
                  <XCircle className="h-4 w-4" />
                  <span>Failed</span>
                </>
              ) : (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending</span>
                </>
              )}
            </div>
          </div>

          {/* Status Content */}
          <div className={`p-4 rounded-xl ${
            emailSent ? 'bg-green-50' :
            hasError ? 'bg-red-50' :
            'bg-blue-50'
          }`}>
            {emailSent ? (
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Invoice Sent Successfully!</p>
                  <p className="text-sm text-green-700 mt-1">
                    We've sent the invoice to loyqunjie@gmail.com. Please check your inbox.
                  </p>
                </div>
              </div>
            ) : hasError ? (
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="space-y-2">
                  <div>
                    <p className="font-medium text-red-900">Failed to Send Invoice</p>
                    <p className="text-sm text-red-700 mt-1">
                      {errorMessage || 'An error occurred while sending the invoice.'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEmailStatus(prev => ({
                        ...prev,
                        steps: Object.keys(prev.steps).reduce((acc, key) => ({
                          ...acc,
                          [key]: { status: 'pending', error: null }
                        }), {})
                      }));
                      sendInvoiceEmail();
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white text-red-600 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Sending Invoice...</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Please wait while we prepare and send your invoice.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Progress Steps */}
          {isProcessing && (
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between">
                {Object.entries(emailStatus.steps).map(([key, step], index, arr) => (
                  <div key={key} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        ${step.status === 'completed' ? 'bg-green-100' :
                          step.status === 'processing' ? 'bg-blue-100' :
                          step.status === 'error' ? 'bg-red-100' :
                          'bg-gray-100'}
                      `}>
                        {step.status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : step.status === 'processing' ? (
                          <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                        ) : step.status === 'error' ? (
                          <XCircle className="h-5 w-5 text-red-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                    </div>
                    {index < arr.length - 1 && (
                      <div className={`
                        w-12 h-0.5 mx-2
                        ${step.status === 'completed' ? 'bg-green-500' :
                          step.status === 'processing' ? 'bg-blue-500' :
                          'bg-gray-200'}
                      `} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Update the loading state UI to show email status
  if (loading) {
    return (
      <div className="relative w-full max-w-7xl mx-auto px-6 pt-24 pb-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
          />
          <p className="text-muted-foreground text-sm">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-6 pt-24 pb-8 space-y-6">
        {process.env.NODE_ENV === 'development' && <ManualSendButton />}

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

        {/* Invoice Email Status */}
        <InvoiceEmailStatus />

        {/* Transaction Details */}
        {transactionDetails && (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Receipt className="h-5 w-5 text-primary" />
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

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Invoice Email</span>
                  <span className="font-medium text-gray-900">
                    loyqunjie@gmail.com
                  </span>
                </div>
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
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200 disabled:opacity-50"
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
          <div ref={invoiceRef}>
            <EInvoice {...getInvoiceProps()} />
          </div>
        </div>
      </div>
    </div>
  );
}
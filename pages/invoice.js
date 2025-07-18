import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, FileText, Loader2 } from 'lucide-react';
import EInvoice from '../components/EInvoice';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function InvoicePage() {
  const invoiceRef = useRef();
  const [email, setEmail] = useState('loyqunjie@gmail.com');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const generatePDF = async () => {
    const element = invoiceRef.current;
    
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
      scale: 1.5, // Reduced scale for smaller file size
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      quality: 0.8 // Reduced quality for smaller file size
    });
    
    document.body.removeChild(clonedElement);
    
    const imgData = canvas.toDataURL('image/jpeg', 0.8); // Use JPEG with 80% quality
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
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
    setIsLoading(true);
    setMessage('');
    
    try {
      const pdf = await generatePDF();
      pdf.save('invoice.pdf');
      setMessage('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      setMessage('Error generating PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSend = async () => {
    if (!email) {
      setMessage('Please enter an email address.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const pdf = await generatePDF();
      const pdfBlob = pdf.output('blob');
      
      const formData = new FormData();
      formData.append('email', email);
      formData.append('pdf', pdfBlob, 'invoice.pdf');

      const response = await fetch('/api/send-invoice-email', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('Invoice sent successfully!');
        console.log('Email sent:', result);
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setMessage(`Error sending email: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 15 },
    visible: {
      opacity: 1, y: 0, rotateX: 0,
      transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 py-8 pt-20 space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoice Generator</h1>
          <p className="text-gray-600">Create and send professional invoices</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            disabled={isLoading}
            className="flex items-center gap-2 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white font-medium py-2 px-4 rounded-xl transition-colors duration-200 text-sm disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span>Download PDF</span>
          </motion.button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Preview */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl shadow-lg p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Invoice Preview
            </h2>
          </div>
          <div ref={invoiceRef}>
            <EInvoice />
          </div>
        </motion.div>

        {/* Email Controls */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Send Invoice
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Send this invoice via email
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002fa7]/30 focus:border-[#002fa7]/20 transition-all duration-200"
                  placeholder="Enter email address"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEmailSend}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#002fa7] hover:bg-[#002fa7]/90 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                <span>Send Invoice</span>
              </motion.button>
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-xl text-sm ${
                  message.includes('Error') 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {message}
              </motion.div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  disabled={isLoading}
                  className="w-full flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-3 rounded-xl transition-colors duration-200 border border-gray-200 text-sm disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import React, { useRef, useState } from 'react';
import EInvoice from '../components/EInvoice';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function InvoicePage() {
  const invoiceRef = useRef();
  const [email, setEmail] = useState('cedricctf11a@gmail.com'); // Pre-filled default email
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

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
        scale: 1.5, // Reduce from 2 to 1.5 to make smaller file
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          // Preserve exact styling in cloned document
          const style = clonedDoc.createElement('style');
          style.textContent = `
            /* Preserve exact EInvoice styling */
            .max-w-4xl { max-width: 56rem !important; }
            .mx-auto { margin-left: auto !important; margin-right: auto !important; }
            .bg-white { background-color: rgb(255, 255, 255) !important; }
            .border { border-width: 1px !important; }
            .border-black { border-color: rgb(0, 0, 0) !important; }
            .p-8 { padding: 2rem !important; }
            .text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
            .font-sans { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif !important; }
            .relative { position: relative !important; }
            
            /* Header styling */
            .text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
            .font-bold { font-weight: 700 !important; }
            .text-center { text-align: center !important; }
            .mb-2 { margin-bottom: 0.5rem !important; }
            .mt-2 { margin-top: 0.5rem !important; }
            
            /* Table styling */
            .min-w-full { min-width: 100% !important; }
            .bg-black { background-color: rgb(0, 0, 0) !important; }
            .text-white { color: rgb(255, 255, 255) !important; }
            .border-white { border-color: rgb(255, 255, 255) !important; }
            .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
            .py-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
            .text-right { text-align: right !important; }
            .bg-gray-100 { background-color: rgb(243, 244, 246) !important; }
            .font-semibold { font-weight: 600 !important; }
            
            /* Colors */
            .text-blue-700 { color: rgb(29, 78, 216) !important; }
            .underline { text-decoration: underline !important; }
            .text-red-700 { color: rgb(185, 28, 28) !important; }
            .bg-red-100 { background-color: rgb(254, 226, 226) !important; }
            .border-red-400 { border-color: rgb(248, 113, 113) !important; }
            .text-gray-700 { color: rgb(55, 65, 81) !important; }
            .font-mono { font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace !important; }
            .text-[10px] { font-size: 10px !important; }
            .break-all { word-break: break-all !important; }
            
            /* Layout */
            .flex { display: flex !important; }
            .flex-col { flex-direction: column !important; }
            .items-center { align-items: center !important; }
            .justify-between { justify-content: space-between !important; }
            .items-end { align-items: flex-end !important; }
            .space-y-0\.5 > * + * { margin-top: 0.125rem !important; }
            .min-w-[220px] { min-width: 220px !important; }
            .text-base { font-size: 1rem !important; line-height: 1.5rem !important; }
            .border-t { border-top-width: 1px !important; }
            .border-gray-300 { border-color: rgb(209, 213, 219) !important; }
            .pt-2 { padding-top: 0.5rem !important; }
            .pb-2 { padding-bottom: 0.5rem !important; }
            .overflow-x-auto { overflow-x: auto !important; }
            .mt-4 { margin-top: 1rem !important; }
            .max-w-xl { max-width: 36rem !important; }
            .w-24 { width: 6rem !important; }
            .h-24 { height: 6rem !important; }
            .object-contain { object-fit: contain !important; }
            .absolute { position: absolute !important; }
            .right-8 { right: 2rem !important; }
            .top-4 { top: 1rem !important; }
            .uppercase { text-transform: uppercase !important; }
            
            /* Table specific */
            table { border-collapse: collapse !important; }
            th, td { border: 1px solid !important; }
            thead th { background-color: rgb(0, 0, 0) !important; color: rgb(255, 255, 255) !important; }
            tbody tr:nth-child(odd) td { background-color: rgb(255, 255, 255) !important; }
            tbody tr.bg-gray-100 td { background-color: rgb(243, 244, 246) !important; }
          `;
          clonedDoc.head.appendChild(style);
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.8); // Use JPEG with 80% quality instead of PNG
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

  const handleEmailSend = async () => {
    if (!email) {
      setMessage('Please enter an email address');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const pdfData = await generatePDF();
      
      const response = await fetch('/api/send-invoice-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          pdfData,
          invoiceNumber: 'INV000001',
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Email sent successfully!');
        setEmail('');
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsLoading(true);
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
      link.download = 'invoice-INV000001.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setMessage('PDF downloaded successfully!');
    } catch (error) {
      setMessage(`Error generating PDF: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Email Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Invoice Actions</h2>
          
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">Invoice will be sent to: {email}</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleEmailSend}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                {isLoading ? 'Sending...' : 'Email Invoice'}
              </button>
              
              <button
                onClick={handleDownloadPDF}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                {isLoading ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          </div>
          
          {message && (
            <div className={`mt-4 p-3 rounded-md ${
              message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Invoice */}
        <div ref={invoiceRef}>
          <EInvoice />
        </div>
      </div>
    </div>
  );
}

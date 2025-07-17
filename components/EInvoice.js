import React from 'react';

function formatCurrency(val) {
  if (typeof val === 'number') return 'RM' + val.toLocaleString('en-MY', {minimumFractionDigits: 2});
  if (typeof val === 'string' && val.startsWith('RM')) return val;
  if (!val) return '-';
  return 'RM' + val;
}

function sumAmounts(amount, taxAmount) {
  // Try to parse numbers from strings like 'RM200,000.00'
  const parse = v => typeof v === 'number' ? v : (v ? Number(v.replace(/[^\d.\-]/g, '')) : 0);
  const a = parse(amount);
  const t = parse(taxAmount);
  if (isNaN(a) || isNaN(t)) return '-';
  return formatCurrency(a + t);
}

// Default mock data
const defaultItems = [
  {
    classification: 'O35',
    description: 'Provision of legal advisory services',
    quantity: 1,
    unitPrice: 200000,
    amount: 200000,
    disc: '-',
    taxRate: '8.00%',
    taxAmount: 16000,
    totalInclTax: 216000,
  },
  {
    classification: 'A12',
    description: 'Consulting fee',
    quantity: 2,
    unitPrice: 50000,
    amount: 100000,
    disc: '0',
    taxRate: '8.00%',
    taxAmount: 8000,
    totalInclTax: 108000,
  },
];

const defaultSummary = {
  totalExclTax: 300000,
  taxAmount: 24000,
  totalInclTax: 324000,
};

const EInvoice = ({
  companyInfo = {},
  invoiceInfo = {},
  supplier = {},
  buyer = {},
  items = defaultItems,
  summary = defaultSummary,
  notes = '',
  qrCodeUrl = '',
  digitalSignature = '',
  invoiceMeta = {},
  showIllustrationBadge = false,
}) => {
  return (
    <div className="max-w-4xl mx-auto bg-white border border-black p-8 text-xs font-sans relative">
      {/* Illustration Badge */}
      {showIllustrationBadge && (
        <div className="absolute right-8 top-4 bg-red-100 border border-red-400 text-red-700 px-2 py-1 text-xs font-bold uppercase">FOR ILLUSTRATION PURPOSES ONLY</div>
      )}
      {/* Header */}
      <div className="flex flex-col items-center mb-2">
        <div className="text-lg font-bold">{companyInfo.name || 'Food Eatery Sdn Bhd'}</div>
        <div className="text-center text-xs">{companyInfo.address || '1st Floor, Palm Green, Kesari Street, 543210, Kuala Lumpur'}</div>
        <div className="text-center text-xs">{companyInfo.phone || '60312346789'}</div>
        <div className="text-center text-xs">Contact us@{companyInfo.email || 'gretasolutions.com'}</div>
      </div>
      <div className="flex justify-between mt-2 mb-2">
        {/* Supplier Info */}
        <div className="text-xs space-y-0.5">
          <div>Supplier TIN: <span className="text-blue-700 underline">{supplier.tin || 'E100000000030'}</span></div>
          <div>Supplier Name: {supplier.name || 'ABC Advisory Ltd'}</div>
          <div>Supplier Registration Number: {supplier.regNo || 'NA'}</div>
          <div>Supplier SST ID: {supplier.sstId || 'NA'}</div>
          <div>Supplier Business Address: {supplier.address || '1, Street Avenue, NOP 123 England'}</div>
          <div>Supplier Contact Number(Office): {supplier.contact || '441234567890'}</div>
          <div>Supplier Email: {supplier.email || 'ABC advisory@gamil.com'}</div>
          <div>Supplier MSIC code: {supplier.msic || '00000'}</div>
          <div>Supplier business activity description: {supplier.activity || 'NA'}</div>
        </div>
        {/* Invoice Meta */}
        <div className="text-xs text-right space-y-0.5 min-w-[220px]">
          <div className="font-bold text-base">E-INVOICE</div>
          <div>e-Invoice Type : {invoiceMeta.type || '01 - Invoice'}</div>
          <div>e-Invoice version : {invoiceMeta.version || '1.0'}</div>
          <div>e-Invoice code : {invoiceMeta.code || 'INV000001'}</div>
          <div>Unique Identifier No : {invoiceMeta.uid || '123456789-2024-4017344'}</div>
          <div>Orginal Invoice Ref No : {invoiceMeta.refNo || 'Not Applicable'}</div>
          <div>Invoice Date and Time : {invoiceMeta.dateTime || '11/06/2024 11:53:13'}</div>
        </div>
      </div>
      {/* Buyer Info */}
      <div className="border-t border-gray-300 my-2 pt-2 pb-2">
        <div className="text-xs">
          Buyer TIN : <span>{buyer.tin || 'C987654321120'}</span><br />
          Buyer Business Registration Number : <span>{buyer.regNo || '298021010000023'}</span><br />
          Buyer SST ID : <span>{buyer.sstId || 'L10-5621-78000000'}</span>
        </div>
      </div>
      {/* Main Table */}
      <div className="overflow-x-auto mb-2">
        <table className="min-w-full border border-black">
          <thead className="bg-black text-white">
            <tr>
              <th className="border border-white px-2 py-1">Classification</th>
              <th className="border border-white px-2 py-1">Description</th>
              <th className="border border-white px-2 py-1">Quantity</th>
              <th className="border border-white px-2 py-1">Unit Price</th>
              <th className="border border-white px-2 py-1">Amount</th>
              <th className="border border-white px-2 py-1">Disc</th>
              <th className="border border-white px-2 py-1">Tax Rate</th>
              <th className="border border-white px-2 py-1">Tax Amount</th>
              <th className="border border-white px-2 py-1">Total Product / Service Price (incl. tax)</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? items.map((item, idx) => (
              <tr key={idx}>
                <td className="border border-white px-2 py-1">{item.classification || 'O35'}</td>
                <td className="border border-white px-2 py-1">{item.description || 'Provision of legal advisory services'}</td>
                <td className="border border-white px-2 py-1 text-right">{item.quantity || '1'}</td>
                <td className="border border-white px-2 py-1 text-right">{formatCurrency(item.unitPrice) || 'RM200,000.00'}</td>
                <td className="border border-white px-2 py-1 text-right">{formatCurrency(item.amount) || 'RM200,000.00'}</td>
                <td className="border border-white px-2 py-1 text-right">{item.disc || '-'}</td>
                <td className="border border-white px-2 py-1 text-right">{formatCurrency(item.taxAmount) || 'RM16,000.00'}</td>
                <td className="border border-white px-2 py-1 text-right">{item.taxRate || '8.00%'}</td>
                <td className="border border-white px-2 py-1 text-right">{sumAmounts(item.amount, item.taxAmount) || item.totalInclTax || 'RM216,000.00'}</td>
              </tr>
            )) : null}
            {/* Subtotal row */}
            <tr className="bg-gray-100 font-semibold">
              <td colSpan={4} className="border border-white px-2 py-1 text-right">Subtotal</td>
              <td className="border border-white px-2 py-1 text-right">{formatCurrency(summary.totalExclTax) || 'RM200,000.00'}</td>
              <td className="border border-white px-2 py-1"></td>
              <td className="border border-white px-2 py-1 text-right">{formatCurrency(summary.taxAmount) || 'RM16,000.00'}</td>
              <td className="border border-white px-2 py-1"></td>
              <td className="border border-white px-2 py-1 text-right">{formatCurrency(summary.totalInclTax) || 'RM216,000.00'}</td>
            </tr>
            {/* Tax breakdown */}
            <tr>
              <td colSpan={4} className="border border-white px-2 py-1 text-right">Total excluding tax</td>
              <td className="border border-white px-2 py-1 text-right">{formatCurrency(summary.totalExclTax) || 'RM200,000.00'}</td>
              <td className="border border-white px-2 py-1"></td>
              <td className="border border-white px-2 py-1 text-right">{formatCurrency(summary.taxAmount) || 'RM16,000.00'}</td>
              <td className="border border-white px-2 py-1"></td>
              <td className="border border-white px-2 py-1 text-right">{formatCurrency(summary.totalInclTax) || 'RM216,000.00'}</td>
            </tr>
            <tr>
              <td colSpan={4} className="border border-white px-2 py-1 text-right">Tax amount (SST)</td>
              <td className="border border-white px-2 py-1"></td>
              <td className="border border-white px-2 py-1"></td>
              <td className="border border-white px-2 py-1 text-right">{formatCurrency(summary.taxAmount) || 'RM16,000.00'}</td>
              <td className="border border-white px-2 py-1"></td>
              <td className="border border-white px-2 py-1"></td>
            </tr>
            <tr>
              <td colSpan={4} className="border border-white px-2 py-1 text-right">Total including tax</td>
              <td className="border border-white px-2 py-1"></td>
              <td className="border border-white px-2 py-1"></td>
              <td className="border border-white px-2 py-1"></td>
              <td className="border border-white px-2 py-1"></td>
              <td className="border border-white px-2 py-1 text-right">{formatCurrency(summary.totalInclTax) || 'RM216,000.00'}</td>
            </tr>
            <tr className="font-bold">
              <td colSpan={4} className="border border-white px-2 py-1 text-right">Total payable amount</td>
              <td className="border border-white px-2 py-1"></td>
              <td className="border border-white px-2 py-1"></td>
              <td className="border border-white px-2 py-1"></td>
              <td className="border border-white px-2 py-1"></td>
              <td className="border border-white px-2 py-1 text-right">{formatCurrency(summary.totalInclTax) || 'RM216,000.00'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Digital Signature and Footer */}
      <div className="flex justify-between items-end mt-4">
        <div className="text-gray-700 text-xs max-w-xl">
          <div>Digital Signature :</div>
          <div className="break-all font-mono text-[10px]">{digitalSignature || '9e83e05bbf9b8dbac0deeec3bce6cba983f6dc50531c7a919f28d5fb369etc3'}</div>
          <div>Date and Time of validation : {invoiceMeta.validationDate || '12/06/2024 12:58:13'}</div>
          <div>This document is a visual presentation of the e-Invoice</div>
        </div>
        {qrCodeUrl && (
          <img src={qrCodeUrl} alt="QR Code" className="w-24 h-24 object-contain border border-black" />
        )}
      </div>
    </div>
  );
};

export default EInvoice; 
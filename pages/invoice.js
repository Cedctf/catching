import React, { useState } from 'react';
import EInvoice from '../components/EInvoice';

const emptyItem = { classification: '', description: '', quantity: '', unitPrice: '', amount: '', tax: '', taxAmount: '' };

const staticInvoiceData = {
  companyInfo: {
    name: 'Bintang Telco Sdn Bhd',
    address: 'Tingkat 1, Bangunan Koperasi, Persiaran Sukan, Seksyen 13, 40100 Shah Alam, Selangor, Malaysia',
    email: 'info@bintangtelco.com',
  },
  invoiceInfo: {
    number: 'INV-2024-001',
    date: '2024-06-01',
    dueDate: '2024-06-15',
  },
  billTo: {
    name: 'Koperasi Angkasa',
    address: 'No. 1, Jalan Angkasa, 50400 Kuala Lumpur, Malaysia',
    email: 'billing@angkasa.com',
  },
  shipTo: {
    name: 'Koperasi Angkasa',
    address: 'No. 1, Jalan Angkasa, 50400 Kuala Lumpur, Malaysia',
    email: 'shipping@angkasa.com',
  },
  items: [
    {
      classification: 'S22',
      description: 'Monthly charges for May 2024',
      quantity: '1',
      unitPrice: 'RM 100.00',
      amount: 'RM 100.00',
      tax: '6%',
      taxAmount: 'RM 6.00',
    },
    {
      classification: 'S23',
      description: 'Other charges',
      quantity: '2',
      unitPrice: 'RM 50.00',
      amount: 'RM 100.00',
      tax: '6%',
      taxAmount: 'RM 6.00',
    },
  ],
  summary: {
    totalExclTax: 'RM 200.00',
    taxAmount: 'RM 12.00',
    totalInclTax: 'RM 212.00',
    paymentMethod: 'Credit Card',
  },
  notes: 'Thank you for your business! Please make payment by the due date.',
  qrCodeUrl: '/vercel.svg',
};

export default function InvoicePage() {
  const [companyInfo, setCompanyInfo] = useState({ name: '', address: '', email: '' });
  const [invoiceInfo, setInvoiceInfo] = useState({ number: '', date: '', dueDate: '' });
  const [billTo, setBillTo] = useState({ name: '', address: '', email: '' });
  const [shipTo, setShipTo] = useState({ name: '', address: '', email: '' });
  const [items, setItems] = useState([{ ...emptyItem }]);
  const [summary, setSummary] = useState({ totalExclTax: '', taxAmount: '', totalInclTax: '', paymentMethod: '' });
  const [notes, setNotes] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);
  const [showStatic, setShowStatic] = useState(false);

  const handleItemChange = (idx, field, value) => {
    const newItems = items.map((item, i) => i === idx ? { ...item, [field]: value } : item);
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { ...emptyItem }]);
  const removeItem = idx => setItems(items.filter((_, i) => i !== idx));

  const handleSubmit = e => {
    e.preventDefault();
    setShowInvoice(true);
    setShowStatic(false);
  };

  const handleStatic = e => {
    e.preventDefault();
    setShowStatic(true);
    setShowInvoice(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form className="space-y-6 bg-white border border-gray-200 shadow p-6 mb-8 rounded">
        <h2 className="text-lg font-bold mb-2">Company Info</h2>
        <div className="grid grid-cols-3 gap-4">
          <input className="input" placeholder="Name" value={companyInfo.name} onChange={e => setCompanyInfo({ ...companyInfo, name: e.target.value })} />
          <input className="input" placeholder="Address" value={companyInfo.address} onChange={e => setCompanyInfo({ ...companyInfo, address: e.target.value })} />
          <input className="input" placeholder="Email" value={companyInfo.email} onChange={e => setCompanyInfo({ ...companyInfo, email: e.target.value })} />
        </div>
        <h2 className="text-lg font-bold mb-2">Invoice Info</h2>
        <div className="grid grid-cols-3 gap-4">
          <input className="input" placeholder="Invoice Number" value={invoiceInfo.number} onChange={e => setInvoiceInfo({ ...invoiceInfo, number: e.target.value })} />
          <input className="input" type="date" placeholder="Date" value={invoiceInfo.date} onChange={e => setInvoiceInfo({ ...invoiceInfo, date: e.target.value })} />
          <input className="input" type="date" placeholder="Due Date" value={invoiceInfo.dueDate} onChange={e => setInvoiceInfo({ ...invoiceInfo, dueDate: e.target.value })} />
        </div>
        <h2 className="text-lg font-bold mb-2">Bill To</h2>
        <div className="grid grid-cols-3 gap-4">
          <input className="input" placeholder="Name" value={billTo.name} onChange={e => setBillTo({ ...billTo, name: e.target.value })} />
          <input className="input" placeholder="Address" value={billTo.address} onChange={e => setBillTo({ ...billTo, address: e.target.value })} />
          <input className="input" placeholder="Email" value={billTo.email} onChange={e => setBillTo({ ...billTo, email: e.target.value })} />
        </div>
        <h2 className="text-lg font-bold mb-2">Ship To</h2>
        <div className="grid grid-cols-3 gap-4">
          <input className="input" placeholder="Name" value={shipTo.name} onChange={e => setShipTo({ ...shipTo, name: e.target.value })} />
          <input className="input" placeholder="Address" value={shipTo.address} onChange={e => setShipTo({ ...shipTo, address: e.target.value })} />
          <input className="input" placeholder="Email" value={shipTo.email} onChange={e => setShipTo({ ...shipTo, email: e.target.value })} />
        </div>
        <h2 className="text-lg font-bold mb-2">Items</h2>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-7 gap-2 items-center">
              <input className="input" placeholder="Classification" value={item.classification} onChange={e => handleItemChange(idx, 'classification', e.target.value)} />
              <input className="input" placeholder="Description" value={item.description} onChange={e => handleItemChange(idx, 'description', e.target.value)} />
              <input className="input" placeholder="Quantity" value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', e.target.value)} />
              <input className="input" placeholder="Unit Price" value={item.unitPrice} onChange={e => handleItemChange(idx, 'unitPrice', e.target.value)} />
              <input className="input" placeholder="Amount" value={item.amount} onChange={e => handleItemChange(idx, 'amount', e.target.value)} />
              <input className="input" placeholder="Tax" value={item.tax} onChange={e => handleItemChange(idx, 'tax', e.target.value)} />
              <input className="input" placeholder="Tax Amount" value={item.taxAmount} onChange={e => handleItemChange(idx, 'taxAmount', e.target.value)} />
              {items.length > 1 && (
                <button type="button" className="text-red-500 ml-2" onClick={() => removeItem(idx)}>-</button>
              )}
            </div>
          ))}
          <button type="button" className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded" onClick={addItem}>Add Item</button>
        </div>
        <h2 className="text-lg font-bold mb-2">Summary</h2>
        <div className="grid grid-cols-4 gap-4">
          <input className="input" placeholder="Total Excl. Tax" value={summary.totalExclTax} onChange={e => setSummary({ ...summary, totalExclTax: e.target.value })} />
          <input className="input" placeholder="Tax Amount" value={summary.taxAmount} onChange={e => setSummary({ ...summary, taxAmount: e.target.value })} />
          <input className="input" placeholder="Total Incl. Tax" value={summary.totalInclTax} onChange={e => setSummary({ ...summary, totalInclTax: e.target.value })} />
          <input className="input" placeholder="Payment Method" value={summary.paymentMethod} onChange={e => setSummary({ ...summary, paymentMethod: e.target.value })} />
        </div>
        <div>
          <textarea className="input w-full" rows={2} placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
        <div>
          <input className="input" placeholder="QR Code URL (optional)" value={qrCodeUrl} onChange={e => setQrCodeUrl(e.target.value)} />
        </div>
        <div className="flex gap-4 mt-4">
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded font-semibold">Create Invoice</button>
          <button onClick={handleStatic} className="px-6 py-2 bg-gray-600 text-white rounded font-semibold">Create Static Invoice</button>
        </div>
      </form>
      {showInvoice && (
        <EInvoice
          companyInfo={companyInfo}
          invoiceInfo={invoiceInfo}
          billTo={billTo}
          shipTo={shipTo}
          items={items}
          summary={summary}
          notes={notes}
          qrCodeUrl={qrCodeUrl}
        />
      )}
      {showStatic && (
        <EInvoice {...staticInvoiceData} />
      )}
      <style jsx global>{`
        .input {
          @apply border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-200;
        }
      `}</style>
    </div>
  );
}

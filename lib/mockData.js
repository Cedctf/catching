import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'mock');

export function getMockData(filename) {
  const filePath = path.join(dataDir, filename);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export function saveMockData(filename, data) {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Helper functions for specific data
export function getUsers() {
  return getMockData('users.json');
}

export function getBusinesses() {
  return getMockData('businesses.json');
}

export function getTransactions() {
  return getMockData('transactions.json');
}

export function getInvoices() {
  return getMockData('invoices.json');
}

export function addTransaction(transaction) {
  const transactions = getTransactions();
  
  // Check for duplicate transaction ID to prevent duplicates
  const existingTransaction = transactions.transactions.find(
    t => t.transaction_id === transaction.transaction_id
  );
  
  if (existingTransaction) {
    console.log('Duplicate transaction detected, skipping:', transaction.transaction_id);
    return false;
  }
  
  console.log('Adding new transaction:', transaction.transaction_id);
  transactions.transactions.push(transaction);
  saveMockData('transactions.json', transactions);
  return true;
}

export function addInvoice(invoice) {
  const invoices = getInvoices();
  
  // Check for duplicate invoice number to prevent duplicates
  const existingInvoice = invoices.invoices.find(
    i => i.invoice_number === invoice.invoice_number
  );
  
  if (existingInvoice) {
    console.log('Duplicate invoice detected, skipping:', invoice.invoice_number);
    return false;
  }
  
  console.log('Adding new invoice:', invoice.invoice_number);
  invoices.invoices.push(invoice);
  saveMockData('invoices.json', invoices);
  return true;
}

export function generateTransactionId() {
  return `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateInvoiceNumber() {
  const invoices = getInvoices();
  const count = invoices.invoices.length + 1;
  return `INV${new Date().getFullYear()}${String(count).padStart(4, '0')}`;
}
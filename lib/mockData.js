// Import mock data directly
import users from '../mock/users.json';
import businesses from '../mock/businesses.json';
import transactions from '../mock/transactions.json';
import invoices from '../mock/invoices.json';

// Helper functions for specific data
export function getUsers() {
  return users;
}

export function getBusinesses() {
  return businesses;
}

export function getTransactions() {
  return transactions;
}

export function getInvoices() {
  return invoices;
}

export function generateTransactionId() {
  return `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateInvoiceNumber() {
  const count = invoices.invoices.length + 1;
  return `INV${new Date().getFullYear()}${String(count).padStart(4, '0')}`;
}

// Note: In a real application, these would be API calls instead of local modifications
export function addTransaction(transaction) {
  // Check for duplicate transaction ID
  const existingTransaction = transactions.transactions.find(
    t => t.transaction_id === transaction.transaction_id
  );
  
  if (existingTransaction) {
    console.log('Duplicate transaction detected, skipping:', transaction.transaction_id);
    return false;
  }
  
  console.log('Adding new transaction:', transaction.transaction_id);
  transactions.transactions.push(transaction);
  return true;
}

export function addInvoice(invoice) {
  // Check for duplicate invoice number
  const existingInvoice = invoices.invoices.find(
    i => i.invoice_number === invoice.invoice_number
  );
  
  if (existingInvoice) {
    console.log('Duplicate invoice detected, skipping:', invoice.invoice_number);
    return false;
  }
  
  console.log('Adding new invoice:', invoice.invoice_number);
  invoices.invoices.push(invoice);
  return true;
}
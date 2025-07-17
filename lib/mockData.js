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
  transactions.transactions.push(transaction);
  saveMockData('transactions.json', transactions);
}

export function addInvoice(invoice) {
  const invoices = getInvoices();
  invoices.invoices.push(invoice);
  saveMockData('invoices.json', invoices);
}

export function generateTransactionId() {
  return `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateInvoiceNumber() {
  const invoices = getInvoices();
  const count = invoices.invoices.length + 1;
  return `INV${new Date().getFullYear()}${String(count).padStart(4, '0')}`;
}
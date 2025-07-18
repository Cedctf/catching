import { NextResponse } from 'next/server';

// In-memory storage for transactions (replace with database in production)
let transactions = [];

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const transaction = req.body;

      // Validate required fields
      if (!transaction.transaction_type || !transaction.amount || !transaction.transaction_date || !transaction.payment_method || !transaction.transaction_status) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate amount is a positive number
      if (typeof transaction.amount !== 'number' || transaction.amount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
      }

      // Validate transaction type
      const validTypes = ['payment', 'transfer', 'deposit', 'withdrawal'];
      if (!validTypes.includes(transaction.transaction_type)) {
        return res.status(400).json({ error: 'Invalid transaction type' });
      }

      // Validate transaction status
      const validStatuses = ['pending', 'completed', 'failed', 'cancelled'];
      if (!validStatuses.includes(transaction.transaction_status)) {
        return res.status(400).json({ error: 'Invalid transaction status' });
      }

      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(transaction.transaction_date)) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
      }

      // Add transaction ID and timestamp
      const newTransaction = {
        ...transaction,
        transaction_id: `TX${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Store transaction
      transactions.push(newTransaction);

      return res.status(201).json(newTransaction);
    } catch (error) {
      console.error('Error processing transaction:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    // Return all transactions
    return res.status(200).json({ transactions });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
} 
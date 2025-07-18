import { getTransactions } from '../../lib/mockData';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const transactionsData = getTransactions();
    const transactions = transactionsData.transactions || [];
    const completedTransactions = transactions.filter(t => t.transaction_status === 'completed');

    console.log('Total transactions:', transactions.length);
    console.log('Completed transactions:', completedTransactions.length);

    // Get all unique dates from transactions and sort them
    const transactionDates = [...new Set(completedTransactions.map(t => 
      new Date(t.transaction_date).toISOString().split('T')[0]
    ))].sort((a, b) => new Date(b) - new Date(a)); // Sort descending (newest first)
    
    console.log('Transaction dates:', transactionDates);

    // Calculate revenue for each date
    const revenueByDate = {};
    completedTransactions.forEach(t => {
      const date = new Date(t.transaction_date).toISOString().split('T')[0];
      if (!revenueByDate[date]) {
        revenueByDate[date] = 0;
      }
      revenueByDate[date] += Number(t.amount) || 0;
    });

    console.log('Revenue by date:', revenueByDate);

    // Take the 7 most recent dates that have transactions
    const recentDates = transactionDates.slice(0, 7).reverse(); // Reverse to show oldest to newest
    
    const last7Days = recentDates.map(dateString => {
      const dayRevenue = revenueByDate[dateString] || 0;
      return {
        date: dateString,
        fullDate: new Date(dateString).toLocaleDateString('en-MY', { 
          month: 'short', 
          day: 'numeric' 
        }),
        revenue: dayRevenue
      };
    });

    res.status(200).json({
      totalTransactions: transactions.length,
      completedTransactions: completedTransactions.length,
      transactionDates,
      revenueByDate,
      last7Days
    });

  } catch (error) {
    console.error('Error in test-revenue API:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
} 
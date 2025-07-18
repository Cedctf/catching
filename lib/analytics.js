import { getTransactions, getInvoices } from './mockData';

// Business analytics functions
export function calculateBusinessAnalytics(businessToken = 'encrypted_business_token_here') {
  const transactions = getTransactions();
  const invoices = getInvoices();
  
  // Filter transactions for this business
  const businessTransactions = transactions.transactions.filter(
    t => t.business_identity_token === businessToken || t.receiver_identity_token === businessToken
  );

  // Calculate revenue (money received)
  const revenue = businessTransactions
    .filter(t => t.transaction_status === 'completed' && t.transaction_type === 'payment')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate expenses (money sent out - refunds, fees, etc.)
  const expenses = businessTransactions
    .filter(t => t.transaction_status === 'completed' && 
           (t.transaction_type === 'refund' || t.transaction_type === 'fee'))
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate pending transactions
  const pendingAmount = businessTransactions
    .filter(t => t.transaction_status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate failed transactions (loss indicator)
  const failedAmount = businessTransactions
    .filter(t => t.transaction_status === 'failed')
    .reduce((sum, t) => sum + t.amount, 0);

  // Net balance
  const balance = revenue - expenses;

  // Transaction counts
  const totalTransactions = businessTransactions.length;
  const completedTransactions = businessTransactions.filter(t => t.transaction_status === 'completed').length;
  const pendingTransactions = businessTransactions.filter(t => t.transaction_status === 'pending').length;
  const failedTransactions = businessTransactions.filter(t => t.transaction_status === 'failed').length;

  // Payment method breakdown
  const paymentMethodsRaw = businessTransactions.reduce((acc, t) => {
    if (t.transaction_status === 'completed') {
      if (!acc[t.payment_method]) {
        acc[t.payment_method] = { amount: 0, count: 0 };
      }
      acc[t.payment_method].amount += t.amount;
      acc[t.payment_method].count += 1;
    }
    return acc;
  }, {});

  // Calculate percentages for payment methods
  const paymentMethods = Object.entries(paymentMethodsRaw).reduce((acc, [method, data]) => {
    const percentage = completedTransactions > 0 ? (data.count / completedTransactions) * 100 : 0;
    acc[method] = {
      amount: data.amount,
      count: data.count,
      percentage: percentage
    };
    return acc;
  }, {});

  // Daily revenue (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const dailyRevenue = last7Days.map(date => {
    const dayRevenue = businessTransactions
      .filter(t => {
        const transactionDate = new Date(t.transaction_date).toISOString().split('T')[0];
        return transactionDate === date && 
               t.transaction_status === 'completed' && 
               t.transaction_type === 'payment';
      })
      .reduce((sum, t) => sum + t.amount, 0);
    return { 
      date, 
      revenue: dayRevenue,
      weekday: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      fullDate: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });

  // Monthly summary
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthlyRevenue = businessTransactions
    .filter(t => t.transaction_date.startsWith(currentMonth) && t.transaction_status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  // Average transaction value
  const avgTransactionValue = completedTransactions > 0 ? revenue / completedTransactions : 0;

  // Invoice analytics
  const businessInvoices = invoices.invoices.filter(i => i.business_identity_token === businessToken);
  const paidInvoices = businessInvoices.filter(i => i.status === 'paid').length;
  const pendingInvoices = businessInvoices.filter(i => i.status === 'pending').length;
  const overdueInvoices = businessInvoices.filter(i => {
    const dueDate = new Date(i.due_date);
    const today = new Date();
    return i.status === 'pending' && dueDate < today;
  }).length;

  // Calculate growth rates (mock data for now - in real app, compare with previous period)
  const revenueGrowth = 15.2; // Mock growth rate
  const invoiceGrowth = 8.5; // Mock growth rate
  const transactionGrowth = -2.3; // Mock growth rate

  return {
    // Nested structure for dashboard cards
    revenue: {
      total: revenue,
      growth: revenueGrowth
    },
    invoices: {
      total: businessInvoices.length,
      growth: invoiceGrowth
    },
    transactions: {
      total: totalTransactions,
      growth: transactionGrowth
    },
    
    // Core metrics
    expenses,
    balance,
    pendingAmount,
    failedAmount,
    
    // Transaction counts
    completedTransactions,
    pendingTransactions,
    failedTransactions,
    
    // Payment insights
    paymentMethods,
    avgTransactionValue,
    
    // Time-based analytics
    dailyRevenue,
    monthlyRevenue,
    
    // Invoice metrics
    paidInvoices,
    pendingInvoices,
    overdueInvoices,
    
    // Success rates
    successRate: totalTransactions > 0 ? (completedTransactions / totalTransactions) * 100 : 0,
    failureRate: totalTransactions > 0 ? (failedTransactions / totalTransactions) * 100 : 0
  };
}

// Format currency helper
export function formatCurrency(amount) {
  return `RM ${amount.toFixed(2)}`;
}

// Format percentage helper
export function formatPercentage(value) {
  return `${value.toFixed(1)}%`;
}

// Get growth rate compared to previous period
export function calculateGrowthRate(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}
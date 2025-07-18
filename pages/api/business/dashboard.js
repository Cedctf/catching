import { getTransactions, getInvoices, getBusinesses } from '../../../lib/mockData';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get data from JSON files
    const businessesData = getBusinesses();
    const transactionsData = getTransactions();
    const invoicesData = getInvoices();

    // Get the first business
    const business = businessesData.businesses[0];
    
    // Get transactions and invoices
    const transactions = transactionsData.transactions || [];
    const invoices = invoicesData.invoices || [];

    // Calculate analytics based on actual data
    const completedTransactions = transactions.filter(t => t.transaction_status === 'completed');
    const pendingTransactions = transactions.filter(t => t.transaction_status === 'pending');
    const failedTransactions = transactions.filter(t => t.transaction_status === 'failed');
    
    const totalRevenue = completedTransactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const totalTransactions = transactions.length;
    const successRate = totalTransactions > 0 ? (completedTransactions.length / totalTransactions) * 100 : 0;

    // Calculate paid invoices
    const paidInvoices = invoices.filter(i => i.status === 'paid');
    const pendingInvoices = invoices.filter(i => i.status === 'pending');

    // Calculate daily revenue for the last 7 days with actual data
    // First, get all unique dates from transactions and sort them
    const transactionDates = [...new Set(completedTransactions.map(t => 
      new Date(t.transaction_date).toISOString().split('T')[0]
    ))].sort((a, b) => new Date(b) - new Date(a)); // Sort descending (newest first)
    
    // Take the 7 most recent dates that have transactions
    const recentDates = transactionDates.slice(0, 7).reverse(); // Reverse to show oldest to newest
    
    const last7Days = [];
    
    // If we have fewer than 7 days with data, fill with recent dates
    if (recentDates.length < 7) {
      // Add the most recent date from data as starting point
      const startDate = recentDates.length > 0 ? new Date(recentDates[recentDates.length - 1]) : new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(startDate);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const dayTransactions = completedTransactions.filter(t => {
          const transactionDate = new Date(t.transaction_date).toISOString().split('T')[0];
          return transactionDate === dateString;
        });
        const dayRevenue = dayTransactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        
        last7Days.push({
          date: dateString,
          fullDate: new Date(dateString).toLocaleDateString('en-MY', { 
            month: 'short', 
            day: 'numeric' 
          }),
          revenue: dayRevenue
        });
      }
    } else {
      // Use actual dates with data
      recentDates.forEach(dateString => {
        const dayTransactions = completedTransactions.filter(t => {
          const transactionDate = new Date(t.transaction_date).toISOString().split('T')[0];
          return transactionDate === dateString;
        });
        const dayRevenue = dayTransactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        
        last7Days.push({
          date: dateString,
          fullDate: new Date(dateString).toLocaleDateString('en-MY', { 
            month: 'short', 
            day: 'numeric' 
          }),
          revenue: dayRevenue
        });
      });
    }

    // Calculate growth rates (compare with previous period - simplified)
    const currentWeekRevenue = totalRevenue;
    const previousWeekRevenue = currentWeekRevenue * 0.89; // Mock previous week data
    const revenueGrowth = previousWeekRevenue > 0 ? ((currentWeekRevenue - previousWeekRevenue) / previousWeekRevenue) * 100 : 0;

    const currentWeekTransactions = totalTransactions;
    const previousWeekTransactions = Math.floor(currentWeekTransactions * 0.87); // Mock previous week data
    const transactionGrowth = previousWeekTransactions > 0 ? ((currentWeekTransactions - previousWeekTransactions) / previousWeekTransactions) * 100 : 0;

    const currentWeekInvoices = invoices.length;
    const previousWeekInvoices = Math.floor(currentWeekInvoices * 0.92); // Mock previous week data
    const invoiceGrowth = previousWeekInvoices > 0 ? ((currentWeekInvoices - previousWeekInvoices) / previousWeekInvoices) * 100 : 0;

    // Calculate payment method breakdown
    const paymentMethodStats = completedTransactions.reduce((acc, t) => {
      const method = t.payment_method;
      if (!acc[method]) {
        acc[method] = { count: 0, amount: 0 };
      }
      acc[method].count += 1;
      acc[method].amount += t.amount;
      return acc;
    }, {});

    const dashboardData = {
      // Business info from businesses.json
      businessName: business.business_name,
      businessAddress: business.business_address,
      businessEmail: business.business_email,
      businessPhone: business.business_phone,
      kycStatus: business.kyc_status,
      registrationDate: business.registration_date,
      registrationId: business.identity_token,
      businessToken: business.identity_token,
      
      // Employee info
      authorizedEmployees: business.authorized_employees,
      
      // Analytics calculated from actual data
      analytics: {
        revenue: {
          total: totalRevenue,
          growth: revenueGrowth
        },
        invoices: {
          total: invoices.length,
          growth: invoiceGrowth,
          paid: paidInvoices.length,
          pending: pendingInvoices.length
        },
        transactions: {
          total: totalTransactions,
          growth: transactionGrowth,
          completed: completedTransactions.length,
          pending: pendingTransactions.length,
          failed: failedTransactions.length
        },
        successRate: successRate,
        dailyRevenue: last7Days,
        paymentMethods: paymentMethodStats
      },
      
      // Raw data for components
      transactions: transactions,
      invoices: invoices,
      
      // Additional profile data
      ownerName: business.authorized_employees.find(e => e.role === 'Manager')?.first_name + ' ' + business.authorized_employees.find(e => e.role === 'Manager')?.last_name || 'Business Owner',
      ownerEmail: business.authorized_employees.find(e => e.role === 'Manager')?.email || business.business_email,
      ownerPhone: business.business_phone,
      position: business.authorized_employees.find(e => e.role === 'Manager')?.role || 'Owner',
      faceIdStatus: 'active',
      lastFaceIdUpdate: '2024-01-15T10:30:00Z',
      
      // Business metrics
      employeeCount: business.authorized_employees.length.toString(),
      monthlyRevenue: totalRevenue,
      
      // Notifications based on actual data
      notifications: [
        {
          id: 'notif_001',
          type: 'compliance',
          message: 'KYC status is ' + business.kyc_status,
          priority: business.kyc_status === 'approved' ? 'low' : 'high',
          date: new Date().toISOString()
        },
        ...(pendingTransactions.length > 0 ? [{
          id: 'notif_002',
          type: 'transaction',
          message: `${pendingTransactions.length} pending transactions`,
          priority: 'medium',
          date: new Date().toISOString()
        }] : []),
        ...(pendingInvoices.length > 0 ? [{
          id: 'notif_003',
          type: 'invoice',
          message: `${pendingInvoices.length} pending invoices`,
          priority: 'medium',
          date: new Date().toISOString()
        }] : [])
      ]
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
} 
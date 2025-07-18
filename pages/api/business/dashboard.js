import businessesData from '../../../mock/businesses.json';
import transactionsData from '../../../mock/transactions.json';
import invoicesData from '../../../mock/invoices.json';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Get the first business from the businesses.json
  const business = businessesData.businesses[0];
  
  // Get transactions and invoices
  const transactions = transactionsData.transactions || [];
  const invoices = invoicesData.invoices || [];

  // Calculate analytics
  const completedTransactions = transactions.filter(t => t.transaction_status === 'completed');
  const totalRevenue = completedTransactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const totalTransactions = transactions.length;
  const successRate = totalTransactions > 0 ? (completedTransactions.length / totalTransactions) * 100 : 0;

  // Calculate daily revenue for the last 7 days
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    const dayTransactions = completedTransactions.filter(t => 
      t.transaction_date && t.transaction_date.startsWith(dateString)
    );
    const dayRevenue = dayTransactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    
    last7Days.push({
      date: dateString,
      fullDate: dateString,
      revenue: dayRevenue
    });
  }

  const dashboardData = {
    // Business info from businesses.json
    businessName: business.business_name,
    businessAddress: business.business_address,
    businessEmail: business.business_email,
    businessPhone: business.business_phone,
    kycStatus: business.kyc_status,
    registrationDate: business.registration_date,
    registrationId: business.identity_token,
    
    // Employee info
    authorizedEmployees: business.authorized_employees,
    
    // Analytics
    analytics: {
      revenue: {
        total: totalRevenue,
        growth: 12.5 // Mock growth percentage
      },
      invoices: {
        total: invoices.length,
        growth: 8.2
      },
      transactions: {
        total: totalTransactions,
        growth: 15.3
      },
      successRate: successRate,
      dailyRevenue: last7Days
    },
    
    // Transactions and invoices
    transactions: transactions,
    invoices: invoices,
    
    // Additional profile data for other modules
    ownerName: business.authorized_employees.find(e => e.role === 'Manager')?.first_name + ' ' + business.authorized_employees.find(e => e.role === 'Manager')?.last_name || 'Business Owner',
    ownerEmail: business.authorized_employees.find(e => e.role === 'Manager')?.email || business.business_email,
    ownerPhone: business.business_phone,
    position: business.authorized_employees.find(e => e.role === 'Manager')?.role || 'Owner',
    faceIdStatus: 'active',
    lastFaceIdUpdate: '2024-01-15T10:30:00Z',
    
    // Business metrics
    employeeCount: business.authorized_employees.length.toString(),
    monthlyRevenue: totalRevenue,
    
    // Notifications
    notifications: [
      {
        id: 'notif_001',
        type: 'compliance',
        message: 'KYC status is ' + business.kyc_status,
        priority: business.kyc_status === 'approved' ? 'low' : 'high',
        date: new Date().toISOString()
      }
    ]
  };

  res.status(200).json(dashboardData);
} 
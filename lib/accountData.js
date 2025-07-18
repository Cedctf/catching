// Account Types
export const ACCOUNT_TYPES = {
  BANK: 'bank',
  EWALLET: 'e-wallet',
  PAYMENT: 'payment'
};

// Account Status
export const ACCOUNT_STATUS = {
  VERIFIED: 'verified',
  PENDING: 'pending',
  NEEDS_VERIFICATION: 'needs_verification'
};

// Sync Frequencies
export const SYNC_FREQUENCIES = {
  REALTIME: 'realtime',
  DAILY: 'daily',
  MANUAL: 'manual'
};

// Account Data Structure
export const accountsData = {
  banks: [
    {
      id: 'maybank',
      name: 'Maybank',
      type: ACCOUNT_TYPES.BANK,
      accountNumber: '•••• 4567',
      balance: 15250.75,
      currency: 'MYR',
      status: ACCOUNT_STATUS.VERIFIED,
      syncFrequency: SYNC_FREQUENCIES.DAILY,
      lastSync: '2024-03-20T08:00:00Z',
      icon: '/logos/maybank.png',
      permissions: {
        viewBalance: true,
        viewTransactions: true,
        shareData: false
      }
    },
    {
      id: 'cimb',
      name: 'CIMB Bank',
      type: ACCOUNT_TYPES.BANK,
      accountNumber: '•••• 7890',
      balance: 8540.20,
      currency: 'MYR',
      status: ACCOUNT_STATUS.VERIFIED,
      syncFrequency: SYNC_FREQUENCIES.DAILY,
      lastSync: '2024-03-20T08:00:00Z',
      icon: '/logos/cimb.jpeg',
      permissions: {
        viewBalance: true,
        viewTransactions: true,
        shareData: true
      }
    },
    {
      id: 'hsbc',
      name: 'HSBC Bank',
      type: ACCOUNT_TYPES.BANK,
      accountNumber: '•••• 1234',
      balance: 22300.00,
      currency: 'MYR',
      status: ACCOUNT_STATUS.VERIFIED,
      syncFrequency: SYNC_FREQUENCIES.DAILY,
      lastSync: '2024-03-20T08:00:00Z',
      icon: '/logos/hsbc.png',
      permissions: {
        viewBalance: true,
        viewTransactions: true,
        shareData: false
      }
    }
  ],
  ewallets: [
    {
      id: 'tng',
      name: 'Touch \'n Go',
      type: ACCOUNT_TYPES.EWALLET,
      accountId: '@username',
      balance: 750.50,
      currency: 'MYR',
      status: ACCOUNT_STATUS.VERIFIED,
      syncFrequency: SYNC_FREQUENCIES.REALTIME,
      lastSync: '2024-03-20T08:00:00Z',
      icon: '/logos/tng.png',
      permissions: {
        viewBalance: true,
        viewTransactions: true,
        shareData: true
      }
    },
    {
      id: 'boost',
      name: 'Boost',
      type: ACCOUNT_TYPES.EWALLET,
      accountId: '@username',
      balance: 320.80,
      currency: 'MYR',
      status: ACCOUNT_STATUS.NEEDS_VERIFICATION,
      syncFrequency: SYNC_FREQUENCIES.MANUAL,
      lastSync: '2024-03-20T08:00:00Z',
      icon: '/logos/boost.png',
      permissions: {
        viewBalance: false,
        viewTransactions: false,
        shareData: false
      }
    },
    {
      id: 'grabpay',
      name: 'GrabPay',
      type: ACCOUNT_TYPES.EWALLET,
      accountId: '@username',
      balance: 510.00,
      currency: 'MYR',
      status: ACCOUNT_STATUS.VERIFIED,
      syncFrequency: SYNC_FREQUENCIES.REALTIME,
      lastSync: '2024-03-20T08:00:00Z',
      icon: '/logos/grabpay.png',
      permissions: {
        viewBalance: true,
        viewTransactions: true,
        shareData: true
      }
    }
  ],
  paymentServices: [
    {
      id: 'paypal',
      name: 'PayPal',
      type: ACCOUNT_TYPES.PAYMENT,
      accountId: 'user@email.com',
      balance: 1250.00,
      currency: 'MYR',
      status: ACCOUNT_STATUS.VERIFIED,
      syncFrequency: SYNC_FREQUENCIES.DAILY,
      lastSync: '2024-03-20T08:00:00Z',
      icon: '/logos/paypal.png',
      permissions: {
        viewBalance: true,
        viewTransactions: true,
        shareData: false
      }
    }
  ]
};

// Helper functions
export const getAllAccounts = () => {
  return [
    ...accountsData.banks,
    ...accountsData.ewallets,
    ...accountsData.paymentServices
  ];
};

export const getAccountById = (id) => {
  return getAllAccounts().find(account => account.id === id);
};

export const getAccountsByType = (type) => {
  switch (type) {
    case ACCOUNT_TYPES.BANK:
      return accountsData.banks;
    case ACCOUNT_TYPES.EWALLET:
      return accountsData.ewallets;
    case ACCOUNT_TYPES.PAYMENT:
      return accountsData.paymentServices;
    default:
      return getAllAccounts();
  }
};

export const formatAccountBalance = (balance, currency) => {
  if (!currency) return '0.00'; // Default return if currency is not provided
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: currency
  }).format(balance);
}; 
import { useTranslation } from 'react-i18next';

// Tutorial steps for different pages
export const getDashboardSteps = (t) => [
  {
    target: '.dashboard-header',
    content: (
      <div>
        <h3>{t('tutorial.welcome')}</h3>
        <p>{t('tutorial.welcomeDesc')}</p>
      </div>
    ),
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '.analytics-cards',
    content: (
      <div>
        <h3>{t('tutorial.analytics')}</h3>
        <p>{t('tutorial.analyticsDesc')}</p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '.revenue-chart',
    content: (
      <div>
        <h3>{t('tutorial.revenueChart')}</h3>
        <p>{t('tutorial.revenueChartDesc')}</p>
      </div>
    ),
    placement: 'top',
  },
  {
    target: '.qr-code-section',
    content: (
      <div>
        <h3>{t('tutorial.qrCode')}</h3>
        <p>{t('tutorial.qrCodeDesc')}</p>
      </div>
    ),
    placement: 'left',
  },
  {
    target: '.recent-transactions',
    content: (
      <div>
        <h3>{t('tutorial.transactions')}</h3>
        <p>{t('tutorial.transactionsDesc')}</p>
      </div>
    ),
    placement: 'top',
  },
  {
    target: '.recent-invoices',
    content: (
      <div>
        <h3>{t('tutorial.invoices')}</h3>
        <p>{t('tutorial.invoicesDesc')}</p>
      </div>
    ),
    placement: 'top',
  },
  {
    target: '.create-invoice-btn',
    content: (
      <div>
        <h3>{t('tutorial.createInvoice')}</h3>
        <p>{t('tutorial.createInvoiceDesc')}</p>
      </div>
    ),
    placement: 'bottom',
  },
];

export const getLandingPageSteps = (t) => [
  {
    target: '.features-grid',
    content: (
      <div>
        <h3>{t('tutorial.features')}</h3>
        <p>{t('tutorial.featuresDesc')}</p>
      </div>
    ),
    placement: 'bottom',
    disableBeacon: true,
    offset: 20,
    spotlightPadding: 10,
  },
  {
    target: '.demo-section',
    content: (
      <div>
        <h3>{t('tutorial.demo')}</h3>
        <p>{t('tutorial.demoDesc')}</p>
      </div>
    ),
    placement: 'top',
  },
  {
    target: '.pay-now-btn',
    content: (
      <div>
        <h3>{t('tutorial.startPayment')}</h3>
        <p>{t('tutorial.startPaymentDesc')}</p>
      </div>
    ),
    placement: 'bottom',
  },
];

export const getPaymentSteps = (t) => [
  {
    target: '.payment-method-selection',
    content: (
      <div>
        <h3>{t('tutorial.paymentMethod')}</h3>
        <p>{t('tutorial.paymentMethodDesc')}</p>
      </div>
    ),
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '.amount-input',
    content: (
      <div>
        <h3>{t('tutorial.amount')}</h3>
        <p>{t('tutorial.amountDesc')}</p>
      </div>
    ),
    placement: 'top',
  },
  {
    target: '.process-payment-btn',
    content: (
      <div>
        <h3>{t('tutorial.processPayment')}</h3>
        <p>{t('tutorial.processPaymentDesc')}</p>
      </div>
    ),
    placement: 'top',
  },
];

export const getInvoiceSteps = (t) => [
  {
    target: '.invoice-header',
    content: (
      <div>
        <h3>{t('tutorial.invoiceDetails')}</h3>
        <p>{t('tutorial.invoiceDetailsDesc')}</p>
      </div>
    ),
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '.invoice-actions',
    content: (
      <div>
        <h3>{t('tutorial.invoiceActions')}</h3>
        <p>{t('tutorial.invoiceActionsDesc')}</p>
      </div>
    ),
    placement: 'top',
  },
];

// Helper function to get steps based on current page
export const getStepsForPage = (pathname, t) => {
  if (pathname === '/') return getLandingPageSteps(t);
  if (pathname === '/business/dashboard') return getDashboardSteps(t);
  if (pathname === '/payment/start') return getPaymentSteps(t);
  if (pathname.startsWith('/invoice/')) return getInvoiceSteps(t);
  return [];
};
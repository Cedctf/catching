// Utility functions for date handling in the payment system

export function getCurrentDateString() {
  return new Date().toISOString();
}

export function getDateString(daysAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

export function getWeekdayName(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

export function generateRecentTransactionDates() {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push({
      dateString: date.toISOString(),
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
      shortWeekday: date.toLocaleDateString('en-US', { weekday: 'short' })
    });
  }
  return dates;
}

// Update transaction with current date and weekday
export function addCurrentDateToTransaction(transaction) {
  const now = new Date().toISOString();
  const weekday = getWeekdayName(now);
  
  return {
    ...transaction,
    transaction_date: now,
    weekday: weekday
  };
}
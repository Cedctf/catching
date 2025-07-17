// Test script to verify payment flow
console.log('Testing Catching Payment System...');

// Test data
const testPayment = {
  amount: 25.50,
  paymentMethod: 'face',
  payerToken: 'encrypted_token_here',
  receiverToken: 'encrypted_business_token_here'
};

// Simulate API call
fetch('/api/payment/process', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testPayment)
})
.then(response => response.json())
.then(data => {
  console.log('Payment test result:', data);
  if (data.success) {
    console.log('✅ Payment processing works!');
    console.log('Transaction ID:', data.transactionId);
    console.log('Invoice Number:', data.invoiceNumber);
  } else {
    console.log('❌ Payment failed:', data.message);
  }
})
.catch(error => {
  console.error('❌ Test error:', error);
});

console.log('Test completed. Check browser console for results.');
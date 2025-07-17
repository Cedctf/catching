import { calculateBusinessAnalytics } from '../../../lib/analytics';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { businessToken } = req.query;
    const token = businessToken || 'encrypted_business_token_here'; // Default to Doe's Bakery
    
    const analytics = calculateBusinessAnalytics(token);
    
    res.status(200).json({
      success: true,
      analytics,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error calculating business analytics:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
}
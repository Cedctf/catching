export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { 
      businessName, 
      businessType, 
      phoneNumber, 
      email, 
      ssmDocuments 
    } = req.body;

    // Validate required fields
    if (!businessName || !businessType || !phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Validate business type
    if (!['formal', 'informal'].includes(businessType)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid business type' 
      });
    }

    // Validate SSM documents for formal business
    if (businessType === 'formal' && (!ssmDocuments || ssmDocuments.length === 0)) {
      return res.status(400).json({ 
        success: false, 
        message: 'SSM documents required for formal business' 
      });
    }

    // Validate phone number format
    const phonePattern = /^\+?60\d{9,10}$/;
    if (!phonePattern.test(phoneNumber.replace(/\s/g, ''))) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid phone number format' 
      });
    }

    // Validate email if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    // TODO: Here you would:
    // 1. Process and store SSM documents
    // 2. Verify business registration with SSM
    // 3. Create business account in database
    // 4. Generate business identity token
    // 5. Send verification emails/SMS

    console.log('Business registration:', { 
      businessName, 
      businessType, 
      phoneNumber, 
      email,
      ssmDocuments: ssmDocuments ? ssmDocuments.length : 0
    });

    // For demo purposes, return success
    res.status(200).json({
      success: true,
      message: 'Business registered successfully',
      businessId: 'business_' + Date.now(),
      businessToken: 'business_token_' + Date.now(),
      status: businessType === 'formal' ? 'pending_verification' : 'active'
    });

  } catch (error) {
    console.error('Business registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Business registration failed'
    });
  }
} 
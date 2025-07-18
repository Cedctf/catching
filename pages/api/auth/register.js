export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { icNumber, icPicture, faceData } = req.body;

    // Validate required fields
    if (!icNumber || !icPicture || !faceData) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Validate IC number format (basic validation)
    const icPattern = /^\d{6}-\d{2}-\d{4}$/;
    if (!icPattern.test(icNumber)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid IC number format' 
      });
    }

    // TODO: Here you would:
    // 1. Verify IC number against government database
    // 2. Process and store IC picture
    // 3. Store face biometric data securely
    // 4. Create user account

    console.log('User registration:', { icNumber, faceData: 'stored' });

    // For demo purposes, return success
    res.status(200).json({
      success: true,
      message: 'User registered successfully',
      userId: 'user_' + Date.now()
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
} 
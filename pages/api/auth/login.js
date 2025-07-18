export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { method, email, password, faceData } = req.body;

    if (method === 'face') {
      // Face recognition login
      if (!faceData) {
        return res.status(400).json({ 
          success: false, 
          message: 'Face data required' 
        });
      }

      // TODO: Here you would:
      // 1. Compare face data with stored biometric data
      // 2. Verify identity
      // 3. Generate session token

      console.log('Face login attempt:', { faceData: 'verified' });

      // For demo purposes, return success
      res.status(200).json({
        success: true,
        message: 'Face login successful',
        token: 'jwt_token_' + Date.now(),
        user: {
          id: 'user_123',
          email: 'user@example.com',
          name: 'John Doe'
        }
      });

    } else if (method === 'password') {
      // Password login
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email and password required' 
        });
      }

      // TODO: Here you would:
      // 1. Verify email and password against database
      // 2. Check password hash
      // 3. Generate session token

      console.log('Password login attempt:', { email });

      // For demo purposes, simple validation
      if (email === 'user@example.com' && password === 'password') {
        res.status(200).json({
          success: true,
          message: 'Login successful',
          token: 'jwt_token_' + Date.now(),
          user: {
            id: 'user_123',
            email: email,
            name: 'John Doe'
          }
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid login method' 
      });
    }

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
} 
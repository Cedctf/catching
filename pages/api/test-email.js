import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('=== Testing Email Configuration ===');
  
  try {
    // 1. Check environment variables
    console.log('Checking environment variables...');
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      return res.status(500).json({
        error: 'Missing credentials',
        details: {
          hasEmailUser: !!emailUser,
          hasEmailPass: !!emailPass,
          envKeys: Object.keys(process.env)
        }
      });
    }

    console.log('Credentials found:', {
      user: emailUser,
      passLength: emailPass?.length
    });

    // 2. Create transporter
    console.log('Creating transporter...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass.replace(/\s/g, ''),
      },
      debug: true,
      logger: true
    });

    // 3. Verify connection
    console.log('Verifying connection...');
    await transporter.verify();
    console.log('Connection verified successfully');

    // 4. Send test email to loyqunjie@gmail.com
    const recipientEmail = 'loyqunjie@gmail.com';
    console.log('Sending test email to:', recipientEmail);
    
    const info = await transporter.sendMail({
      from: emailUser,
      to: recipientEmail,
      subject: 'Test Email from Catching Payment System',
      text: 'This is a test email to verify the email configuration.',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #002fa7;">Test Email</h2>
          <p>This is a test email to verify that the email configuration is working correctly.</p>
          <p>If you receive this email, it means the email service is configured properly.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">Sent from Catching Payment System</p>
        </div>
      `
    });

    console.log('Test email sent successfully:', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    });

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      recipient: recipientEmail,
      details: {
        accepted: info.accepted,
        rejected: info.rejected
      }
    });

  } catch (error) {
    console.error('Email test failed:', {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack
    });

    return res.status(500).json({
      error: 'Email test failed',
      details: {
        message: error.message,
        code: error.code,
        command: error.command
      }
    });
  }
} 
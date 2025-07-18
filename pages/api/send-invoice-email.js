const formidable = require('formidable');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const os = require('os');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('Email API called');
  console.log('Environment variables:', {
    EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set',
    EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Not set'
  });

  let pdfFile = null;

  try {
    // Use OS temp directory for better Windows compatibility
    const tempDir = os.tmpdir();
    console.log('Using temp directory:', tempDir);
    
    // Parse the form data
    const form = new formidable.IncomingForm({
      uploadDir: tempDir,
      keepExtensions: true,
      maxFileSize: 20 * 1024 * 1024, // 20MB limit
    });

    const [fields, files] = await form.parse(req);
    console.log('Form parsed successfully');
    
    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    pdfFile = Array.isArray(files.pdf) ? files.pdf[0] : files.pdf;

    console.log('Email recipient:', email);
    console.log('PDF file:', pdfFile ? 'Received' : 'Not received');

    if (!email || !pdfFile) {
      return res.status(400).json({ message: 'Email and PDF file are required' });
    }

    // Check if environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email credentials not found in environment variables');
      return res.status(500).json({ message: 'Email configuration not found' });
    }

    // Create transporter with better error handling
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS.replace(/\s/g, ''), // Remove any spaces from app password
      },
      debug: true, // Enable debug mode
    });

    console.log('Transporter created');

    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log('Email transporter verified successfully');
    } catch (verifyError) {
      console.error('Email transporter verification failed:', verifyError);
      return res.status(500).json({ 
        message: 'Email configuration verification failed',
        error: verifyError.message 
      });
    }

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Invoice from Catching Payment System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #002fa7;">Invoice Attached</h2>
          <p>Dear Customer,</p>
          <p>Please find your invoice attached to this email.</p>
          <p>If you have any questions about this invoice, please don't hesitate to contact us.</p>
          <br>
          <p>Best regards,<br>Catching Payment System</p>
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #666;">
            This is an automated email. Please do not reply to this email address.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: 'invoice.pdf',
          path: pdfFile.filepath,
          contentType: 'application/pdf',
        },
      ],
    };

    console.log('Sending email to:', email);
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    // Clean up the temporary file
    if (fs.existsSync(pdfFile.filepath)) {
      fs.unlinkSync(pdfFile.filepath);
      console.log('Temporary file cleaned up');
    }

    res.status(200).json({ 
      message: 'Email sent successfully',
      messageId: info.messageId 
    });

  } catch (error) {
    console.error('Detailed error sending email:', error);
    
    // Clean up any temporary files in case of error
    if (pdfFile && pdfFile.filepath && fs.existsSync(pdfFile.filepath)) {
      try {
        fs.unlinkSync(pdfFile.filepath);
        console.log('Temporary file cleaned up after error');
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }

    res.status(500).json({ 
      message: 'Failed to send email', 
      error: error.message,
      details: error.stack
    });
  }
}
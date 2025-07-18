import formidable from 'formidable';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('=== Email API Called ===');
  console.log('Request headers:', req.headers);
  
  // Test email configuration if requested
  if (req.headers['x-test-email'] === 'true') {
    try {
      console.log('Testing email configuration...');
      
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Missing email credentials:', {
          hasEmailUser: !!process.env.EMAIL_USER,
          hasEmailPass: !!process.env.EMAIL_PASS
        });
        return res.status(500).json({
          message: 'Email configuration not found',
          details: 'Missing email credentials in environment variables'
        });
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS.replace(/\s/g, ''),
        },
        debug: true,
        logger: true
      });

      console.log('Verifying email configuration...');
      await transporter.verify();
      console.log('Email configuration verified successfully');
      
      return res.status(200).json({
        message: 'Email configuration is valid',
        email: process.env.EMAIL_USER
      });
    } catch (error) {
      console.error('Email configuration test failed:', {
        error: error.message,
        code: error.code,
        command: error.command
      });
      return res.status(500).json({
        message: 'Email configuration test failed',
        error: error.message,
        details: {
          code: error.code,
          command: error.command
        }
      });
    }
  }

  // Check environment variables
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Missing email credentials');
    return res.status(500).json({ 
      message: 'Email configuration not found',
      error: 'Missing EMAIL_USER or EMAIL_PASS environment variables',
      details: 'Please check your .env.local file'
    });
  }

  let pdfFile = null;
  let recipientEmail = null;

  try {
    // Use OS temp directory
    const tempDir = os.tmpdir();
    console.log('Using temp directory:', tempDir);
    
    // Parse form data with formidable v3 syntax
    console.log('Creating formidable form...');
    const form = formidable({
      uploadDir: tempDir,
      keepExtensions: true,
      maxFileSize: 20 * 1024 * 1024,
      allowEmptyFiles: false,
      minFileSize: 1
    });

    console.log('Parsing form data...');
    try {
      const [fields, files] = await form.parse(req);
      
      console.log('Form data parsed successfully:', {
        fieldKeys: Object.keys(fields),
        fileKeys: Object.keys(files)
      });

      // Handle fields and files (they might be arrays in v3)
      recipientEmail = Array.isArray(fields.email) ? fields.email[0] : fields.email;
      pdfFile = Array.isArray(files.pdf) ? files.pdf[0] : files.pdf;

      console.log('Extracted data:', {
        email: recipientEmail,
        hasPDF: !!pdfFile
      });

      if (!recipientEmail) {
        throw new Error('Missing recipient email address');
      }

      if (!pdfFile) {
        throw new Error('Missing PDF file attachment');
      }

      console.log('PDF file validation:', {
        originalFilename: pdfFile.originalFilename,
        newFilename: pdfFile.newFilename,
        size: pdfFile.size,
        mimetype: pdfFile.mimetype,
        filepath: pdfFile.filepath,
        exists: fs.existsSync(pdfFile.filepath)
      });

      if (!fs.existsSync(pdfFile.filepath)) {
        throw new Error('PDF file not found in temp directory');
      }

      if (pdfFile.size === 0) {
        throw new Error('PDF file is empty');
      }

    } catch (parseError) {
      console.error('Form parsing failed:', parseError);
      throw new Error(`Form parsing failed: ${parseError.message}`);
    }

    // Create transporter
    console.log('Creating email transporter...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS.replace(/\s/g, ''),
      },
      debug: true,
      logger: true
    });

    // Verify transporter
    console.log('Verifying email configuration...');
    try {
      await transporter.verify();
      console.log('Email configuration verified successfully');
    } catch (verifyError) {
      console.error('Email verification failed:', verifyError);
      throw new Error(`Email configuration verification failed: ${verifyError.message}`);
    }

    // Prepare email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
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

    console.log('Sending email to:', recipientEmail);
    console.log('Email options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      attachmentCount: mailOptions.attachments.length
    });
    
    // Send email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', {
        messageId: info.messageId,
        response: info.response,
        accepted: info.accepted,
        rejected: info.rejected
      });

      // Clean up
      if (fs.existsSync(pdfFile.filepath)) {
        fs.unlinkSync(pdfFile.filepath);
        console.log('Temporary file cleaned up');
      }

      return res.status(200).json({ 
        message: 'Email sent successfully',
        messageId: info.messageId,
        recipient: recipientEmail,
        details: {
          accepted: info.accepted,
          rejected: info.rejected
        }
      });

    } catch (sendError) {
      console.error('Email sending failed:', sendError);
      throw new Error(`Email sending failed: ${sendError.message}`);
    }

  } catch (error) {
    console.error('=== Email API Error ===');
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      command: error.command,
      name: error.name
    });
    
    // Clean up on error
    if (pdfFile && pdfFile.filepath && fs.existsSync(pdfFile.filepath)) {
      try {
        fs.unlinkSync(pdfFile.filepath);
        console.log('Temporary file cleaned up after error');
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }

    // Return detailed error information
    return res.status(500).json({ 
      message: 'Failed to send email', 
      error: error.message,
      details: {
        code: error.code,
        command: error.command,
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
}
import nodemailer from 'nodemailer';

// Increase the body size limit for this API route
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Increase from default 1mb to 10mb
    },
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, pdfData, invoiceNumber } = req.body;

  if (!email || !pdfData) {
    return res.status(400).json({ message: 'Email and PDF data are required' });
  }

  try {
    // Create transporter (you'll need to configure with your email service)
    // For demo purposes, using Gmail. In production, use proper email service
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your app password
      },
    });

    // Convert base64 PDF data to buffer
    const pdfBuffer = Buffer.from(pdfData, 'base64');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `E-Invoice ${invoiceNumber || 'INV000001'}`,
      text: `Please find attached your e-invoice ${invoiceNumber || 'INV000001'}.`,
      html: `
        <h2>E-Invoice</h2>
        <p>Dear Customer,</p>
        <p>Please find attached your e-invoice <strong>${invoiceNumber || 'INV000001'}</strong>.</p>
        <p>Thank you for your business.</p>
        <br>
        <p>Best regards,<br>Your Company</p>
      `,
      attachments: [
        {
          filename: `invoice-${invoiceNumber || 'INV000001'}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
}
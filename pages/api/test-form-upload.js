import formidable from 'formidable';
import fs from 'fs';
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

  console.log('=== Test Form Upload API ===');
  
  try {
    // Check if formidable can be imported
    console.log('Formidable imported successfully');
    
    // Check temp directory
    const tempDir = os.tmpdir();
    console.log('Temp directory:', tempDir);
    console.log('Temp directory exists:', fs.existsSync(tempDir));
    
    // Create form with minimal config
    const form = formidable({
      uploadDir: tempDir,
      keepExtensions: true,
      maxFileSize: 20 * 1024 * 1024,
      allowEmptyFiles: false,
      minFileSize: 1
    });
    
    console.log('Formidable form created');
    
    // Parse the form (using v3 syntax)
    console.log('Starting form parse...');
    const [fields, files] = await form.parse(req);
    
    console.log('Form parsed successfully');
    console.log('Fields:', Object.keys(fields));
    console.log('Files:', Object.keys(files));
    
    // Check if we received the expected data (handle arrays in v3)
    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    const pdfFile = Array.isArray(files.pdf) ? files.pdf[0] : files.pdf;
    
    console.log('Email field:', email);
    console.log('PDF file:', pdfFile ? {
      size: pdfFile.size,
      mimetype: pdfFile.mimetype,
      filepath: pdfFile.filepath,
      exists: fs.existsSync(pdfFile.filepath)
    } : 'No PDF file');
    
    // Clean up if file exists
    if (pdfFile && pdfFile.filepath && fs.existsSync(pdfFile.filepath)) {
      fs.unlinkSync(pdfFile.filepath);
      console.log('Cleaned up test file');
    }
    
    return res.status(200).json({
      success: true,
      message: 'Form upload test successful',
      data: {
        email: email,
        hasPDF: !!pdfFile,
        pdfSize: pdfFile?.size || 0
      }
    });
    
  } catch (error) {
    console.error('=== Test Form Upload Error ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
} 
import fs from 'fs';
import pdfParse from 'pdf-parse';

/**
 * Extracts text from a PDF file path or buffer.
 * Validates whether the document contains readable text.
 * Handles errors and unreadable/scanned documents gracefully.
 */
export const extractTextFromPDF = async (filePathOrBuffer) => {
  try {
    let dataBuffer;
    if (typeof filePathOrBuffer === 'string') {
      if (!fs.existsSync(filePathOrBuffer)) {
        throw new Error(`PDF file does not exist at path: ${filePathOrBuffer}`);
      }
      dataBuffer = fs.readFileSync(filePathOrBuffer);
    } else if (Buffer.isBuffer(filePathOrBuffer)) {
      dataBuffer = filePathOrBuffer;
    } else {
      throw new Error('Invalid input provided for PDF extraction');
    }

    const data = await pdfParse(dataBuffer);

    const rawText = data.text || '';
    const cleanedText = rawText
      .replace(/\r\n/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/[ ]{2,}/g, ' ')
      .trim();

    // Check if extracted text is empty or too short (scanned PDF without OCR layer)
    if (!cleanedText || cleanedText.length < 20) {
      return {
        success: false,
        text: '',
        pageCount: data.numpages || 1,
        snippet: '',
        warning:
          'The PDF appears to be a scanned image or contains no readable selectable text layer. Please use a text-based PDF CV.',
      };
    }

    const snippet =
      cleanedText.length > 300
        ? cleanedText.substring(0, 300).trim() + '...'
        : cleanedText;

    return {
      success: true,
      text: cleanedText,
      pageCount: data.numpages || 1,
      info: data.info || {},
      snippet,
    };
  } catch (error) {
    console.error('[PDFService] Text extraction error:', error.message);
    return {
      success: false,
      text: '',
      pageCount: 0,
      snippet: '',
      error: `Could not parse PDF document: ${error.message}`,
    };
  }
};

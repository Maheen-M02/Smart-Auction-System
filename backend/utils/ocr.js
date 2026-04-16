import Tesseract from 'tesseract.js';

export const extractTextFromImage = async (imagePath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
      logger: m => console.log(m)
    });
    
    return parseIDData(text);
  } catch (error) {
    console.error('OCR error:', error);
    throw error;
  }
};

const parseIDData = (text) => {
  const lines = text.split('\n').filter(line => line.trim());
  
  // Extract name (usually first non-empty line or after "Name:")
  let extractedName = '';
  const nameMatch = text.match(/Name[:\s]+([A-Za-z\s]+)/i);
  if (nameMatch) {
    extractedName = nameMatch[1].trim();
  } else {
    extractedName = lines[0]?.trim() || 'Unknown';
  }
  
  // Extract ID number (look for patterns like numbers, passport format, etc.)
  let idNumber = '';
  const idPatterns = [
    /\b[A-Z0-9]{6,12}\b/,  // Generic alphanumeric ID
    /\b\d{9,12}\b/,         // Numeric ID
    /[A-Z]\d{7,9}/          // Letter followed by numbers
  ];
  
  for (const pattern of idPatterns) {
    const match = text.match(pattern);
    if (match) {
      idNumber = match[0];
      break;
    }
  }
  
  return {
    extractedName: extractedName.substring(0, 50),
    idNumber: idNumber || 'ID_' + Date.now(),
    rawText: text
  };
};

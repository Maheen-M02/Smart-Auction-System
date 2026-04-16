# Tesseract.js OCR Setup Guide

## Overview
This project uses Tesseract.js for Optical Character Recognition (OCR) to extract text from government ID images.

## How It Works

### Backend OCR (Primary Method)
Located in `backend/utils/ocr.js`:

```javascript
import Tesseract from 'tesseract.js';

const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
  logger: m => console.log(m)
});
```

### Client-Side OCR (Fallback)
Located in `frontend/src/components/OCRStep.jsx`:

```javascript
const result = await Tesseract.recognize(
  imageUrl,
  'eng',
  {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        setProgress(Math.round(m.progress * 100));
      }
    }
  }
);
```

## Text Parsing Logic

### Name Extraction
```javascript
// Look for "Name:" label
const nameMatch = text.match(/Name[:\s]+([A-Za-z\s]+)/i);

// Fallback to first line
if (!nameMatch) {
  extractedName = lines[0]?.trim();
}
```

### ID Number Extraction
Multiple patterns supported:
```javascript
const idPatterns = [
  /\b[A-Z0-9]{6,12}\b/,  // Alphanumeric (PAN: ABCDE1234F)
  /\b\d{9,12}\b/,         // Numeric (Aadhaar: 123456789012)
  /[A-Z]\d{7,9}/          // Letter + numbers
];
```

## Supported ID Formats

### PAN Card
- Format: `ABCDE1234F`
- Pattern: 5 letters + 4 digits + 1 letter
- Example extraction: "ABCDE1234F"

### Aadhaar Card
- Format: `1234 5678 9012`
- Pattern: 12 digits
- Example extraction: "123456789012"

### Passport
- Format: `A1234567`
- Pattern: Letter + 7-9 digits
- Example extraction: "A1234567"

## OCR Accuracy Tips

### Image Quality
1. **Resolution**: Minimum 300 DPI
2. **Lighting**: Even, no shadows
3. **Angle**: Straight, not tilted
4. **Focus**: Sharp, not blurry

### ID Card Requirements
- Text should be clearly visible
- No glare or reflections
- Full card in frame
- High contrast between text and background

## Processing Flow

```
1. User uploads ID image
   ↓
2. Backend receives image → saves to /uploads
   ↓
3. Tesseract.js processes image
   ↓
4. Extract raw text
   ↓
5. Parse with regex patterns
   ↓
6. Return structured data:
   {
     extractedName: "John Doe",
     idNumber: "ABCDE1234F"
   }
```

## Error Handling

### Backend Failure
If backend OCR fails, frontend automatically tries client-side OCR:

```javascript
try {
  // Try backend first
  const response = await axios.post('/api/kyc/ocr', { userId });
} catch (err) {
  // Fallback to client-side
  const result = await Tesseract.recognize(imageUrl, 'eng');
}
```

### No Text Detected
- Generates fallback ID: `ID_${Date.now()}`
- Uses first line as name
- Continues verification process

## Performance

### Backend OCR
- **Speed**: 2-5 seconds
- **Accuracy**: Higher (server resources)
- **Load**: Server-side processing

### Client-Side OCR
- **Speed**: 5-10 seconds
- **Accuracy**: Good (browser resources)
- **Load**: Client-side processing

## Testing OCR

### Test Images
Use clear ID images with:
- Printed text (not handwritten)
- Standard fonts
- Good contrast
- Minimal background noise

### Expected Output
```json
{
  "success": true,
  "extractedName": "JOHN DOE",
  "idNumber": "ABCDE1234F",
  "rawText": "..."
}
```

## Customization

### Add New ID Format
In `backend/utils/ocr.js`:

```javascript
const idPatterns = [
  // ... existing patterns
  /YOUR_NEW_PATTERN/,  // Add your pattern
];
```

### Improve Name Extraction
```javascript
// Add more name patterns
const namePatterns = [
  /Name[:\s]+([A-Za-z\s]+)/i,
  /Full Name[:\s]+([A-Za-z\s]+)/i,
  // Add more...
];
```

## Integration Status

✅ Tesseract.js installed (backend & frontend)
✅ Backend OCR endpoint created
✅ Client-side fallback implemented
✅ Text parsing with regex
✅ Multiple ID format support
✅ Progress tracking
✅ Error handling

import { useState, useEffect } from 'react';
import axios from 'axios';

function OCRStep({ userId, setOcrData, onNext }) {
  const [loading, setLoading] = useState(true);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    performOCR();
  }, []);

  const performOCR = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/kyc/ocr', { userId });
      setExtractedData(response.data);
      setOcrData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'OCR processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Identity Extraction</h2>
        <p className="text-gray-600">Extracting information from your ID</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-lg font-medium text-gray-700 mb-2">🔍 Scanning document...</p>
          <p className="text-sm text-gray-500">Extracting identity information</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-lg font-medium text-red-600 mb-4">{error}</p>
          <button
            onClick={performOCR}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center py-6">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-lg font-medium text-green-600">Extraction Complete!</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Extracted Name</p>
              <p className="text-lg font-semibold text-gray-800">{extractedData.extractedName}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">ID Number</p>
              <p className="text-lg font-semibold text-gray-800">{extractedData.idNumber}</p>
            </div>
          </div>

          <button
            onClick={onNext}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Continue to Face Matching
          </button>
        </div>
      )}
    </div>
  );
}

export default OCRStep;

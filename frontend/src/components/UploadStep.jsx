import { useState } from 'react';
import axios from 'axios';

function UploadStep({ userId, idImage, setIdImage, selfieImage, setSelfieImage, onNext }) {
  const [idPreview, setIdPreview] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleIdUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdImage(file);
      setIdPreview(URL.createObjectURL(file));
    }
  };

  const handleSelfieUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelfieImage(file);
      setSelfiePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!idImage || !selfieImage) {
      setError('Please upload both ID and selfie images');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('idImage', idImage);
      formData.append('selfie', selfieImage);
      formData.append('userId', userId);

      await axios.post('/api/kyc/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      onNext();
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Documents</h2>
        <p className="text-gray-600">Upload your ID card and a selfie</p>
      </div>

      {/* ID Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          📄 Government ID Card
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition">
          {idPreview ? (
            <div className="space-y-4">
              <img src={idPreview} alt="ID Preview" className="max-h-48 mx-auto rounded" />
              <button
                onClick={() => document.getElementById('idInput').click()}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Change Image
              </button>
            </div>
          ) : (
            <div>
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">Click to upload ID card</p>
            </div>
          )}
          <input
            id="idInput"
            type="file"
            accept="image/*"
            onChange={handleIdUpload}
            className="hidden"
          />
        </div>
        {!idPreview && (
          <button
            onClick={() => document.getElementById('idInput').click()}
            className="mt-2 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Choose File
          </button>
        )}
      </div>

      {/* Selfie Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🤳 Selfie Photo
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition">
          {selfiePreview ? (
            <div className="space-y-4">
              <img src={selfiePreview} alt="Selfie Preview" className="max-h-48 mx-auto rounded" />
              <button
                onClick={() => document.getElementById('selfieInput').click()}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Change Image
              </button>
            </div>
          ) : (
            <div>
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">Click to upload selfie</p>
            </div>
          )}
          <input
            id="selfieInput"
            type="file"
            accept="image/*"
            onChange={handleSelfieUpload}
            className="hidden"
          />
        </div>
        {!selfiePreview && (
          <button
            onClick={() => document.getElementById('selfieInput').click()}
            className="mt-2 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Choose File
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !idImage || !selfieImage}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Uploading...' : 'Continue to OCR'}
      </button>
    </div>
  );
}

export default UploadStep;

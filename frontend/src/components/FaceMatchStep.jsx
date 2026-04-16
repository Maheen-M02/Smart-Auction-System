import { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

function FaceMatchStep({ idImage, selfieImage, setFaceMatchScore, onNext }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState('Loading models...');
  const [matchScore, setMatchScore] = useState(null);
  const [confidence, setConfidence] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    performFaceMatch();
  }, []);

  const performFaceMatch = async () => {
    setLoading(true);
    setError('');

    try {
      // Load face-api models
      setProgress('Loading AI models...');
      const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
      
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ]);

      setProgress('Detecting faces...');

      // Create image elements
      const img1 = await createImageElement(idImage);
      const img2 = await createImageElement(selfieImage);

      setProgress('Analyzing ID photo...');
      const detection1 = await faceapi
        .detectSingleFace(img1)
        .withFaceLandmarks()
        .withFaceDescriptor();

      setProgress('Analyzing selfie...');
      const detection2 = await faceapi
        .detectSingleFace(img2)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection1 || !detection2) {
        throw new Error('Could not detect faces in one or both images');
      }

      setProgress('Matching biometrics...');

      // Calculate Euclidean distance
      const distance = faceapi.euclideanDistance(
        detection1.descriptor,
        detection2.descriptor
      );

      // Convert to similarity score (0-1)
      const similarity = Math.max(0, 1 - distance);
      
      setMatchScore(similarity);
      setFaceMatchScore(similarity);

      // Determine confidence level
      if (similarity > 0.7) {
        setConfidence('High');
      } else if (similarity > 0.5) {
        setConfidence('Medium');
      } else {
        setConfidence('Low');
      }

    } catch (err) {
      console.error('Face matching error:', err);
      setError(err.message || 'Face matching failed');
    } finally {
      setLoading(false);
    }
  };

  const createImageElement = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const getScoreColor = (score) => {
    if (score > 0.7) return 'text-green-600';
    if (score > 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBarColor = (score) => {
    if (score > 0.7) return 'bg-green-500';
    if (score > 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Face Matching</h2>
        <p className="text-gray-600">Verifying facial biometrics</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-lg font-medium text-gray-700 mb-2">👤 {progress}</p>
          <p className="text-sm text-gray-500">This may take a moment...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-lg font-medium text-red-600 mb-4">{error}</p>
          <button
            onClick={performFaceMatch}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center py-6">
            <div className="text-6xl mb-4">
              {matchScore > 0.6 ? '✅' : '⚠️'}
            </div>
            <p className="text-lg font-medium text-gray-700">Face Match Complete!</p>
          </div>

          {/* Match Score */}
          <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-2 text-center">Match Score</p>
            <p className={`text-5xl font-bold text-center mb-4 ${getScoreColor(matchScore)}`}>
              {(matchScore * 100).toFixed(1)}%
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className={`h-4 rounded-full transition-all duration-1000 ${getBarColor(matchScore)}`}
                style={{ width: `${matchScore * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Confidence Level */}
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-1">Confidence Level</p>
            <p className={`text-2xl font-bold ${getScoreColor(matchScore)}`}>
              {confidence}
            </p>
          </div>

          {matchScore > 0.6 ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 text-center">
                ✅ Face match successful! Proceeding to verification...
              </p>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 text-center">
                ⚠️ Low match score. Verification may fail.
              </p>
            </div>
          )}

          <button
            onClick={onNext}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Continue to Verification
          </button>
        </div>
      )}
    </div>
  );
}

export default FaceMatchStep;

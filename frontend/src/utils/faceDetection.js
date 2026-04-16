import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export const loadModels = async () => {
  if (modelsLoaded) return;
  
  const MODEL_URL = '/models';
  
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
    ]);
    
    modelsLoaded = true;
    console.log('✅ Face-api.js models loaded');
  } catch (error) {
    console.error('❌ Error loading face-api.js models:', error);
    throw error;
  }
};

export const detectFace = async (imageElement) => {
  try {
    const detection = await faceapi
      .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();
    
    return detection;
  } catch (error) {
    console.error('Face detection error:', error);
    throw error;
  }
};

export const compareFaces = (descriptor1, descriptor2) => {
  if (!descriptor1 || !descriptor2) {
    throw new Error('Invalid face descriptors');
  }
  
  const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
  const similarity = 1 - distance;
  
  return {
    distance,
    similarity,
    score: Math.max(0, Math.min(1, similarity))
  };
};

export const getConfidenceLevel = (score) => {
  if (score >= 0.8) return { level: 'High', color: 'text-green-600' };
  if (score >= 0.6) return { level: 'Medium', color: 'text-yellow-600' };
  return { level: 'Low', color: 'text-red-600' };
};

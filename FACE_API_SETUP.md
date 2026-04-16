# Face-API.js Setup Guide

## Overview
This project uses face-api.js for facial recognition and matching. The library requires pre-trained models to function.

## Model Setup Options

### Option 1: CDN (Recommended for Quick Start)
The current implementation uses CDN models:
```javascript
const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
```

This is already configured in `frontend/src/components/FaceMatchStep.jsx` and requires no additional setup.

### Option 2: Local Models (Better Performance)
For production or offline use, download models locally:

1. **Download Models**
   ```bash
   cd frontend/public
   mkdir models
   cd models
   ```

2. **Get Model Files**
   Download from: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
   
   Required files:
   - `ssd_mobilenetv1_model-weights_manifest.json`
   - `ssd_mobilenetv1_model-shard1`
   - `ssd_mobilenetv1_model-shard2`
   - `face_landmark_68_model-weights_manifest.json`
   - `face_landmark_68_model-shard1`
   - `face_recognition_model-weights_manifest.json`
   - `face_recognition_model-shard1`
   - `face_recognition_model-shard2`

3. **Update Code**
   In `frontend/src/components/FaceMatchStep.jsx`, change:
   ```javascript
   const MODEL_URL = '/models';
   ```

## How Face Matching Works

### 1. Model Loading
```javascript
await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
```

### 2. Face Detection
```javascript
const detection = await faceapi
  .detectSingleFace(imageElement)
  .withFaceLandmarks()
  .withFaceDescriptor();
```

### 3. Face Comparison
```javascript
const distance = faceapi.euclideanDistance(
  descriptor1,
  descriptor2
);
const similarity = 1 - distance;
```

### 4. Score Interpretation
- **> 0.7**: High confidence match (Green)
- **0.5 - 0.7**: Medium confidence (Yellow)
- **< 0.5**: Low confidence (Red)
- **> 0.6**: Passes verification threshold

## Troubleshooting

### CORS Issues
If you encounter CORS errors with local models:
1. Ensure models are in `frontend/public/models/`
2. Access via relative path `/models`
3. Check browser console for specific errors

### Model Loading Fails
- Verify internet connection (for CDN)
- Check model files are complete (for local)
- Ensure correct file paths

### No Face Detected
- Ensure good lighting in photos
- Face should be clearly visible
- Try different images
- Check image format (JPG, PNG supported)

## Performance Tips

1. **Model Caching**: Models are loaded once and cached
2. **Image Size**: Resize large images before processing
3. **Detection Options**: Use `TinyFaceDetector` for faster processing:
   ```javascript
   new faceapi.TinyFaceDetectorOptions({ inputSize: 224 })
   ```

## Testing Face Matching

Use test images with:
- Clear, front-facing faces
- Good lighting
- Minimal obstructions
- Similar angles between ID and selfie

## Integration Status

✅ Face-api.js installed in package.json
✅ Face detection utility created
✅ Face matching component implemented
✅ CDN models configured (no download needed)
✅ Euclidean distance calculation
✅ Similarity score conversion
✅ Confidence level display

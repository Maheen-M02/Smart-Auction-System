import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadStep from '../components/UploadStep';
import OCRStep from '../components/OCRStep';
import FaceMatchStep from '../components/FaceMatchStep';
import ResultStep from '../components/ResultStep';

function KYCVerification({ userId }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [idImage, setIdImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [ocrData, setOcrData] = useState(null);
  const [faceMatchScore, setFaceMatchScore] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const navigate = useNavigate();

  const steps = [
    { number: 1, name: 'Upload', icon: '📤' },
    { number: 2, name: 'OCR', icon: '🔍' },
    { number: 3, name: 'Face Match', icon: '👤' },
    { number: 4, name: 'Result', icon: '✅' }
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">KYC Verification</h1>
          <p className="text-gray-600">Complete your identity verification</p>
        </div>

        {/* Stepper */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition ${
                    currentStep >= step.number 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.icon}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${
                    currentStep >= step.number ? 'text-indigo-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 transition ${
                    currentStep > step.number ? 'bg-indigo-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {currentStep === 1 && (
            <UploadStep
              userId={userId}
              idImage={idImage}
              setIdImage={setIdImage}
              selfieImage={selfieImage}
              setSelfieImage={setSelfieImage}
              onNext={() => setCurrentStep(2)}
            />
          )}
          
          {currentStep === 2 && (
            <OCRStep
              userId={userId}
              setOcrData={setOcrData}
              onNext={() => setCurrentStep(3)}
            />
          )}
          
          {currentStep === 3 && (
            <FaceMatchStep
              idImage={idImage}
              selfieImage={selfieImage}
              setFaceMatchScore={setFaceMatchScore}
              onNext={() => setCurrentStep(4)}
            />
          )}
          
          {currentStep === 4 && (
            <ResultStep
              userId={userId}
              ocrData={ocrData}
              faceMatchScore={faceMatchScore}
              verificationResult={verificationResult}
              setVerificationResult={setVerificationResult}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default KYCVerification;

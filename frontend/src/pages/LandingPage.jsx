import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Environment, MeshDistortMaterial, Sphere, Box, Cylinder } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { Suspense, useRef } from 'react';

function AnimatedSphere({ position, color }) {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[0.5, 32, 32]} position={position}>
        <MeshDistortMaterial color={color} attach="material" distort={0.3} speed={2} roughness={0.2} />
      </Sphere>
    </Float>
  );
}

function AuctionGavel() {
  const gavelRef = useRef();
  const handleRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Animate gavel hitting motion
    const rotation = Math.sin(time * 2) * 0.3 - 0.2;
    if (gavelRef.current) {
      gavelRef.current.rotation.z = rotation;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <group position={[4, -1, -2]} ref={gavelRef}>
        {/* Gavel Head */}
        <Cylinder args={[0.15, 0.15, 0.6, 16]} rotation={[0, 0, Math.PI / 2]} position={[0.3, 0, 0]}>
          <meshStandardMaterial color="#8B4513" metalness={0.3} roughness={0.4} />
        </Cylinder>
        
        {/* Gavel Handle */}
        <Cylinder args={[0.06, 0.06, 1.2, 16]} rotation={[0, 0, Math.PI / 2]} position={[-0.3, 0, 0]} ref={handleRef}>
          <meshStandardMaterial color="#654321" metalness={0.2} roughness={0.5} />
        </Cylinder>
        
        {/* Gavel Base/Block */}
        <Cylinder args={[0.4, 0.4, 0.15, 32]} position={[0, -0.8, 0]}>
          <meshStandardMaterial color="#8B4513" metalness={0.3} roughness={0.4} />
        </Cylinder>
      </group>
    </Float>
  );
}

function BidCard({ position }) {
  return (
    <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.5}>
      <group position={position}>
        {/* Card */}
        <Box args={[1, 0.6, 0.05]}>
          <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.3} />
        </Box>
        
        {/* Price indicator */}
        <Box args={[0.6, 0.15, 0.06]} position={[0, 0, 0.06]}>
          <meshStandardMaterial color="#10B981" metalness={0.5} roughness={0.2} />
        </Box>
      </group>
    </Float>
  );
}

function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#10B981" />
      
      {/* Animated spheres */}
      <AnimatedSphere position={[-3, 2, -2]} color="#10B981" />
      <AnimatedSphere position={[3, -2, -2]} color="#3B82F6" />
      <AnimatedSphere position={[0, 3, -3]} color="#10B981" />
      <AnimatedSphere position={[-2, -2, -1]} color="#3B82F6" />
      <AnimatedSphere position={[2, 2, -1]} color="#10B981" />
      
      {/* Bidding-related 3D components */}
      <AuctionGavel />
      <BidCard position={[-4, 1, -1]} />
      <BidCard position={[-3, -1, -2]} />
      
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} />
      <Environment preset="city" />
    </>
  );
}

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1024 576\'%3E%3Crect fill=\'%23000\' width=\'1024\' height=\'576\'/%3E%3Cg fill=\'none\' stroke=\'%23333\' stroke-width=\'1\'%3E%3Cpath d=\'M0 0h1024M0 72h1024M0 144h1024M0 216h1024M0 288h1024M0 360h1024M0 432h1024M0 504h1024M0 576h1024\'/%3E%3Cpath d=\'M0 0v576M128 0v576M256 0v576M384 0v576M512 0v576M640 0v576M768 0v576M896 0v576M1024 0v576\'/%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3
        }}
      />

      {/* 3D Canvas Overlay */}
      <div className="absolute inset-0 opacity-60">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
        <div className="text-center space-y-8 max-w-5xl">
          {/* Main Title */}
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-bold mb-6 text-white tracking-tighter leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
              Bid Bazaar
            </h1>
            <p className="text-4xl md:text-5xl font-medium mb-8 tracking-tight" style={{ color: '#10B981', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.01em' }}>
              In Trust We Build.
            </p>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              A trust-first transaction infrastructure for high-value collectibles.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 mt-16">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-gray-700 hover:bg-white/10 transition transform hover:scale-105">
              <div className="text-5xl mb-4">🔐</div>
              <h3 className="text-xl font-bold mb-3 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Blockchain Verified KYC</h3>
              <p className="text-sm text-gray-400 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>AI-powered facial recognition with tamper-proof blockchain verification</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-gray-700 hover:bg-white/10 transition transform hover:scale-105">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Instant Verification</h3>
              <p className="text-sm text-gray-400 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>OCR text extraction and real-time identity verification in seconds</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-gray-700 hover:bg-white/10 transition transform hover:scale-105">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Secure Auctions</h3>
              <p className="text-sm text-gray-400 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>Only verified users can bid on high-value collectibles</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            <button
              onClick={() => navigate('/register')}
              className="px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-xl font-bold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition shadow-2xl tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Get Started - Register Now
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-gray-600 rounded-full text-xl font-semibold hover:bg-white/20 hover:border-gray-500 transition tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Already Verified? Login
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-4 gap-8 mt-20 max-w-3xl mx-auto">
            <div className="transform hover:scale-110 transition">
              <div className="text-4xl font-bold tracking-tight" style={{ color: '#10B981', fontFamily: "'Space Grotesk', sans-serif" }}>100%</div>
              <div className="text-sm text-gray-400 mt-1 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Secure</div>
            </div>
            <div className="transform hover:scale-110 transition">
              <div className="text-4xl font-bold tracking-tight" style={{ color: '#10B981', fontFamily: "'Space Grotesk', sans-serif" }}>AI</div>
              <div className="text-sm text-gray-400 mt-1 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Powered</div>
            </div>
            <div className="transform hover:scale-110 transition">
              <div className="text-4xl font-bold tracking-tight" style={{ color: '#10B981', fontFamily: "'Space Grotesk', sans-serif" }}>Web3</div>
              <div className="text-sm text-gray-400 mt-1 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Ready</div>
            </div>
            <div className="transform hover:scale-110 transition">
              <div className="text-4xl font-bold tracking-tight" style={{ color: '#10B981', fontFamily: "'Space Grotesk', sans-serif" }}>Trust</div>
              <div className="text-sm text-gray-400 mt-1 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>First</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40 pointer-events-none"></div>
      
      {/* Animated accent lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-1 h-20 bg-gradient-to-b from-green-500 to-transparent animate-pulse" style={{top: '10%', left: '5%'}}></div>
        <div className="absolute w-1 h-20 bg-gradient-to-b from-blue-500 to-transparent animate-pulse" style={{top: '70%', left: '90%', animationDelay: '1s'}}></div>
        <div className="absolute w-20 h-1 bg-gradient-to-r from-green-500 to-transparent animate-pulse" style={{top: '30%', right: '10%', animationDelay: '2s'}}></div>
      </div>
    </div>
  );
}

export default LandingPage;

import React, { useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative beadwork pattern */}
      <div 
        className="absolute top-0 left-0 right-0 h-24 opacity-20"
        style={{
          backgroundImage: `url('https://d64gsuwffb70l.cloudfront.net/68cecce95e2e2932f627e0b4_1758387608091_9d15d3a1.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <div className="text-center z-10">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/68cecce95e2e2932f627e0b4_1758387604676_0a0fc14b.webp" 
            alt="Lekker Ababili Logo" 
            className="w-32 h-32 mx-auto rounded-2xl shadow-lg"
          />
        </div>
        
        {/* App Name */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Lekker Ababili
        </h1>
        
        {/* Taglines */}
        <div className="space-y-2 mb-8">
          <p className="text-lg text-blue-600 font-medium">
            Waar tale ontmoet
          </p>
          <p className="text-lg text-green-600 font-medium">
            Lapho izilimi zihlangana
          </p>
        </div>
        
        {/* Loading indicator */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
      
      {/* Bottom decorative pattern */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-24 opacity-20"
        style={{
          backgroundImage: `url('https://d64gsuwffb70l.cloudfront.net/68cecce95e2e2932f627e0b4_1758387608091_9d15d3a1.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'rotate(180deg)'
        }}
      />
    </div>
  );
};

export default SplashScreen;
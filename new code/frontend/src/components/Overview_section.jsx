import { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';

const OverviewSection = ({ scrollToSection }) => {
  // Array of static images from public/assets
  const images = [
    '/assets/aditya_image.jpg',
    '/assets/new.jpg',
    '/assets/overview.jpg',
  ];

  // State for current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Cycle images every 5 seconds if images exist
  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section
      id="overview"
      className="bg-gradient-to-br from-[#4b0081] via-[#4b0081] to-[#fdb727] text-white py-20 pt-36 relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400/20 rounded-full animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              NextBigg Tech{' '}
              <span className="inline-block h-16 overflow-hidden">
                <span className="inline-block text-yellow-300 animate-word">
                  Solutions
                </span>
              </span>
            </h1>
            <p className="text-xl text-white">
              Monitor and manage all aspects of Next Bigg Tech's operations, from courses to client interactions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection('contact')}
                className="bg-yellow-400 text-purple-800 px-8 py-3 rounded-full font-semibold hover:bg-yellow-300 hover:scale-105 transition-all duration-300"
              >
                Get Consultation
              </button>
              <button
                onClick={() => scrollToSection('courses')}
                className="border-2 border-yellow-400 text-yellow-400 px-8 py-3 rounded-full font-semibold hover:bg-yellow-400 hover:text-purple-800 hover:scale-105 transition-all duration-300"
              >
                View Courses
              </button>
            </div>
          </div>
          <div className="hidden lg:block relative h-96">
            {images.length > 0 ? (
              <>
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Dashboard overview ${index + 1}`}
                    className={`absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-500 ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ transition: 'opacity 0.5s ease-in-out' }}
                    onError={(e) => {
                      console.error('Failed to load image:', image);
                      e.target.src = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop';
                    }}
                  />
                ))}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1}/{images.length}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200 rounded-lg">
                <p className="text-gray-600">No images available</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-yellow-200" />
      </div>
    </section>
  );
};

export default OverviewSection;
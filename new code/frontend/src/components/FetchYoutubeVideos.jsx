import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const FetchYouTubeVideos = () => {
  const [videos, setVideos] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log('FetchYouTubeVideos section visible'); // Debug log
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      console.log('FetchYouTubeVideos cleanup'); // Debug log
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const fetchYouTubeVideos = async () => {
      const channelId = 'UCVtm5xC3IAvWdvvY4lDcv8A';
      const apiKey = 'AIzaSyDoyPTvnOobIFy7weDr5N5QaFQfl6hYBXE';
      const maxResults = 10;

      try {
        const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}`;
        const response = await axios.get(url);
        setVideos(response.data.items);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError('Failed to load YouTube videos. Please try again later.');
      }
    };

    fetchYouTubeVideos();
  }, [isVisible]);

  const handleCardClick = (videoId) => {
    console.log('Video card clicked, navigating to:', `https://www.youtube.com/watch?v=${videoId}`); // Debug log
  };

  return (
    <section id="youtube-videos" className="py-20 bg-gray-50" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl font-bold text-[#4b0081] mb-4">🎥 Latest YouTube Videos</h2>
          <p className="text-xl text-[#6b21a8]">Discover our latest content and updates</p>
        </div>

        {error && (
          <div className="text-center text-red-600 mb-8 flex items-center justify-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-4 text-sm text-purple-600 hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {isVisible ? (
          videos.length > 0 ? (
            <div className="overflow-hidden group" aria-label="Video carousel">
              <style>
                {`
                  @keyframes slideLeft {
                    0% {
                      transform: translateX(0);
                    }
                    100% {
                      transform: translateX(-50%);
                    }
                  }
                  .carousel {
                    animation: slideLeft 20s linear infinite;
                  }
                  .carousel:hover {
                    animation-play-state: paused;
                  }
                `}
              </style>
              <div className="carousel flex flex-nowrap">
                {[...videos, ...videos].map((video, index) => (
                  <div
                    key={`${video.id.videoId}-${index}`}
                    className={`flex-shrink-0 w-80 mx-4 bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer pointer-events-auto ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: `${index * 200}ms` }}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        console.log('Video card activated via keyboard:', video.id.videoId); // Debug log
                        window.open(`https://www.youtube.com/watch?v=${video.id.videoId}`, '_blank', 'noopener,noreferrer');
                      }
                    }}
                  >
                    <a
                      href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                      onClick={() => handleCardClick(video.id.videoId)}
                    >
                      <div className="relative">
                        <img
                          className="w-full h-48 object-cover group-hover:scale-110 transition-all duration-300"
                          src={video.snippet.thumbnails.medium.url}
                          alt={video.snippet.title}
                        />
                        <div className="absolute inset-0 bg-purple-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                      </div>
                      <div className="p-4">
                        <h4 className="text-md font-semibold text-[#6b21a8] group-hover:text-purple-600 transition-colors duration-300">
                          {video.snippet.title}
                        </h4>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-[#6b21a8]">No videos available</div>
          )
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-[#6b21a8] animate-pulse">Loading videos...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FetchYouTubeVideos;
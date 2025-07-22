
import React, { useState, useEffect, useRef } from 'react';
import { Youtube, Twitter, Instagram, Linkedin } from 'lucide-react';

const SocialMediaStats = () => {
    const [counters, setCounters] = useState({
        youtube: 0,
        twitter: 0,
        instagram: 0,
        linkedin: 0,
    });

    const [isVisible, setIsVisible] = useState(false);
    const [error, setError] = useState(null);
    const sectionRef = useRef(null);

    const apiKey = 'AIzaSyDoyPTvnOobIFy7weDr5N5QaFQfl6hYBXE';
    const channelId = 'UCVtm5xC3IAvWdvvY4lDcv8A'; // Example: xAI's channel ID

    const manualStats = {
        twitter: 1600,
        instagram: 21000,
        linkedin: 75000,
    };


    const stats = {
        youtube: { label: 'YouTube', icon: Youtube, url: 'https://www.youtube.com/channel/UCVtm5xC3IAvWdvvY4lDcv8A' },
        twitter: { label: 'Twitter', icon: Twitter, url: 'https://twitter.com/xAI' },
        instagram: { label: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/24_aj/' },
        linkedin: { label: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/aditya-jain-iit-bombay/' },
    };





    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
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
        };
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const fetchData = async () => {
            try {
                const youtubeResponse = await fetch(
                    `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`
                );
                if (!youtubeResponse.ok) throw new Error('Failed to fetch YouTube data');
                const youtubeData = await youtubeResponse.json();
                const youtubeCount = parseInt(youtubeData.items[0].statistics.subscriberCount) || 80;

                animateCounters({
                    youtube: youtubeCount,
                    twitter: manualStats.twitter,
                    instagram: manualStats.instagram,
                    linkedin: manualStats.linkedin,
                });
            } catch (error) {
                console.error('Error fetching YouTube data:', error);
                setError('Failed to load YouTube stats, showing default values');
                animateCounters({
                    youtube: 80000, // Fallback value
                    twitter: manualStats.twitter,
                    instagram: manualStats.instagram,
                    linkedin: manualStats.linkedin,
                });
            }
        };

        const animateCounters = (targets) => {
            const duration = 2000; // 2 seconds
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                setCounters({
                    youtube: Math.floor(progress * targets.youtube),
                    twitter: Math.floor(progress * targets.twitter),
                    instagram: Math.floor(progress * targets.instagram),
                    linkedin: Math.floor(progress * targets.linkedin),
                });

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        };

        fetchData();
    }, [isVisible]);


    //    const handleCardClick = (url) => {
    //     window.open(url, '_blank', 'noopener,noreferrer');
    //   };

    const handleCardClick = (url) => {
        console.log('Navigating to URL:', url); // Debug log
        try {
            window.location.href = url;
        } catch (err) {
            console.error('Error in handleCardClick:', err);
            setError('Failed to navigate: ' + err.message);
        }
    };

    return (
        <section id="social-stats" className="py-20 bg-gray-50" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl font-bold text-[#4b0081] mb-4">Our Social Impact</h2>
          <p className="text-xl text-[#6b21a8]">Join our growing community across platforms</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.keys(stats).map((platform, index) => {
              const IconComponent = stats[platform].icon;
              return (
                <div
                  key={platform}
                  
                  className={`bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 group cursor-pointer pointer-events-auto ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                  onClick={() => {
                    console.log('Card clicked for:', platform); // Debug log
                    handleCardClick(stats[platform].url);
                  }}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      console.log('Card activated via keyboard for:', platform); // Debug log
                      handleCardClick(stats[platform].url);
                    }
                  }}
                >
                  <div className="p-8 text-center pointer-events-auto">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-200 group-hover:scale-110 transition-all duration-300">
                      <IconComponent className="h-8 w-8 text-[#fdb727]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#4b0081] mb-2 group-hover:text-purple-600 transition-colors duration-300">
                      {stats[platform].label}
                    </h3>
                    <p className="text-[#6b21a8] text-lg">{counters[platform].toLocaleString()} Followers</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-600 animate-pulse">Loading stats...</p>
          </div>
        )}
      </div>
    </section>

    );
};

export default SocialMediaStats;









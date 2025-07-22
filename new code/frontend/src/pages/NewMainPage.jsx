import React, { useState, useEffect } from 'react';
import FetchYouTubeVideos from '../components/FetchYoutubeVideos';
import SocialMediaStats from '../components/SocialMediaStats';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowDown, CheckCircle, Star, Users, BookOpen, Target,
    Mail, MapPin, Clock, User, Tag, HelpCircle, Heart, Award
} from 'lucide-react';

const API_BASE_URL = 'https://nbt-55.onrender.com';

const NewMainPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const [data, setData] = useState({
        clients: [],
        contact: [],
        coupons: [],
        courses: [],
        faqs: [],
        meetOurTeam: [],
        ourMission: [],
        ourServices: [],
        testimonials: [],
        overview: {},
        loading: true,
        error: null,
    });
    const words = ['Dashboard', 'Courses', 'Projects'];
    const [currentWord, setCurrentWord] = useState(words[0]);
    const [animating, setAnimating] = useState(false);

    const values = [
        {
            icon: Target,
            title: 'Excellence',
            description: 'We strive for excellence in everything we do, from our courses to our consultancy services.',
        },
        {
            icon: Heart,
            title: 'Passion',
            description: "We're passionate about helping people achieve their career goals and reach their potential.",
        },
        {
            icon: Users,
            title: 'Community',
            description: 'We believe in building a supportive community where everyone can learn and grow together.',
        },
        {
            icon: Award,
            title: 'Innovation',
            description: 'We stay at the forefront of technology and teaching methods to provide the best experience.',
        },
    ];

    const companies = [
        {
            id: 1,
            name: 'Google',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
        },
        {
            id: 2,
            name: 'Amazon',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        },
        {
            id: 3,
            name: 'Microsoft',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
        },
        {
            id: 4,
            name: 'Apple',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
        },
        {
            id: 5,
            name: 'Meta',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Logo.svg',
        },
    ];

    const images = [
        '/assets/aditya_image.jpg',
        '/assets/new.jpg',
        '/assets/overview.jpg',
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (images.length === 0) return;
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const endpoints = [
                    '/clients',
                    '/api/contact',
                    '/api/coupons',
                    '/api/courses',
                    '/faqs',
                    '/api/meet-our-team',
                    '/api/mission',
                    '/api/services',
                    '/api/testimonials',
                    '/api/overview',
                ];

                const responses = await Promise.all(
                    endpoints.map(async (endpoint) => {
                        try {
                            const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
                                timeout: 5000,
                            });
                            console.log(`Data for ${endpoint}:`, response.data);
                            return response.data;
                        } catch (err) {
                            console.error(`Error fetching ${endpoint}:`, err.message);
                            return endpoint === '/api/overview' ? {} : [];
                        }
                    })
                );

                setData({
                    clients: responses[0] || [],
                    contact: responses[1] || [],
                    coupons: responses[2] || [],
                    courses: responses[3] || [],
                    faqs: responses[4] || [],
                    meetOurTeam: responses[5] || [],
                    ourMission: responses[6] || [],
                    ourServices: responses[7] || [],
                    testimonials: responses[8] || [],
                    overview: responses[9] || {},
                    loading: false,
                    error: null,
                });
            } catch (err) {
                console.error('Major fetch error:', err);
                setData((prev) => ({
                    ...prev,
                    loading: false,
                    error: 'Failed to load some dashboard data. Please check the backend server and try again.',
                }));
            }
        };

        fetchAllData();

        let wordIndex = 0;
        const interval = setInterval(() => {
            setAnimating(true);
            setTimeout(() => {
                wordIndex = (wordIndex + 1) % words.length;
                setCurrentWord(words[wordIndex]);
                setAnimating(false);
            }, 700);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const getDriveImageUrl = (url) => {
        if (!url) {
            console.warn('Image URL is missing');
            return 'https://via.placeholder.com/150';
        }

        if (url.match(/\.(jpeg|jpg|gif|png)$/i) || url.startsWith('https://drive.google.com/uc')) {
            return url;
        }

        const patterns = [
            /\/file\/d\/([-\w]{25,})\/view/,
            /\/open\?id=([-\w]{25,})/,
            /\/uc\?id=([-\w]{25,})/,
            /([-\w]{25,})/,
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                const fileId = match[1];
                const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
                console.log(`Converted Google Drive URL: ${url} -> ${directUrl}`);
                return directUrl;
            }
        }

        console.warn(`Invalid image URL: ${url}`);
        return 'https://via.placeholder.com/150';
    };

    const totalStudents = data.courses.reduce((sum, course) => sum + (course.people || 0), 0);
    const averageRating = data.courses.length > 0
        ? (data.courses.reduce((sum, course) => sum + (course.rating || 0), 0) / data.courses.length).toFixed(1)
        : '0';

    if (data.loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
                <div className="text-center text-white">
                    <div className="relative mb-8">
                        <div className="w-20 h-20 border-4 border-purple-200 border-t-white rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-purple-300 rounded-full animate-ping"></div>
                    </div>
                    <div className="text-3xl font-bold mb-2 animate-pulse">NextBigg Tech</div>
                    <div className="mt-4 text-sm opacity-75">Loading data...</div>
                </div>
            </div>
        );
    }

    if (data.error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
                <div className="max-w-md text-center">
                    <h1 className="text-3xl font-bold mb-4 text-red-600">Dashboard Error</h1>
                    <p className="mb-6 text-gray-700">{data.error}</p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition-all duration-300"
                        >
                            Refresh
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-full transition-all duration-300"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <style>
                {`
                    .animate-word {
                        animation: wordFade 0.7s ease-in-out forwards;
                    }
                    @keyframes wordFade {
                        0% { opacity: 0; transform: translateY(10px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                    .coupon-offer {
                        background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
                        border: 2px dashed #FFD700;
                        position: relative;
                        overflow: hidden;
                    }
                    .coupon-offer::before {
                        content: '';
                        position: absolute;
                        top: -50%;
                        left: -50%;
                        width: 200%;
                        height: 200%;
                        background: radial-gradient(circle, rgba(255,255,255,0.2), transparent);
                        transform: rotate(45deg);
                        animation: shine 3s infinite;
                    }
                    @keyframes shine {
                        0% { transform: translateX(-50%) rotate(45deg); }
                        100% { transform: translateX(50%) rotate(45deg); }
                    }
                    @keyframes scroll-up {
                        0% { transform: translateY(0); }
                        100% { transform: translateY(-50%); }
                    }
                    @keyframes scroll-down {
                        0% { transform: translateY(0); }
                        100% { transform: translateY(50%); }
                    }
                    .animate-scroll-up {
                        animation: scroll-up 22s linear infinite;
                    }
                    .animate-scroll-down {
                        animation: scroll-down 22s linear infinite;
                    }
                    .rich-purple-bg {
                        background: #7C3AED;
                    }
                    .rich-purple-text {
                        color: #7C3AED;
                    }
                    .bright-yellow {
                        color: #FFD600;
                    }
                    .carousel {
                        animation: slideLeft 20s linear infinite;
                    }
                    .carousel:hover {
                        animation-play-state: paused;
                    }
                    @keyframes slideLeft {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                `}
            </style>

            <nav className="bg-purple-900 backdrop-blur-md shadow-lg fixed w-full top-0 z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2 group">
                            <div className="text-2xl font-bold text-yellow-400 group-hover:scale-110 transition-transform duration-300">
                                NBT
                            </div>
                        </div>
                        <div className="hidden md:flex space-x-8">
                            {['overview', 'services', 'courses', 'team', 'testimonials', 'contact', 'faq', 'clients'].map((section) => (
                                <button
                                    key={section}
                                    onClick={() => scrollToSection(section)}
                                    className="text-white hover:text-yellow-400 transition-all duration-300 relative group capitalize font-bold"
                                >
                                    {section}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
                                </button>
                            ))}
                        </div>
                        <div className="hidden md:block">
                            <a
                                href="https://courses.nextbiggtech.com/s/store/courses?query=Testimonials"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-yellow-400 font-bold text-purple-800 px-6 py-2 rounded-full hover:scale-105 hover:bg-yellow-600 transition-all duration-300 shadow-lg"
                            >
                                Login/Signup
                            </a>
                        </div>
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-gray-700 hover:text-purple-600 focus:outline-none"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                {isOpen && (
                    <div className="md:hidden bg-purple-200 shadow-lg">
                        <div className="px-4 pt-2 pb-4 space-y-2">
                            {['overview', 'services', 'courses', 'team', 'testimonials', 'contact', 'faq', 'clients'].map((section) => (
                                <button
                                    key={section}
                                    onClick={() => scrollToSection(section)}
                                    className="block w-full text-left text-gray-700 hover:text-purple-600 transition-all duration-300 capitalize"
                                >
                                    {section}
                                </button>
                            ))}
                            <a
                                href="https://courses.nextbiggtech.com/s/store/courses?query=Testimonials"
                                className="block w-full text-left bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-all duration-300"
                            >
                                Login/Signup
                            </a>
                        </div>
                    </div>
                )}
            </nav>

            <section id="overview" className="bg-gradient-to-br from-[#4b0081] via-[#4b0081] to-[#fdb727] text-white py-20 pt-36 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                                NextBigg Tech{' '}
                                <span className="inline-block h-16 overflow-hidden">
                                    <span className={`inline-block text-yellow-300 ${animating ? 'animate-word' : ''}`}>
                                        {currentWord}
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
                                            className={`absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-500 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
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

            <section id="about" className="py-20 bg-purple-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-purple-100 mb-4">About NBT</h2>
                        <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                            Empowering careers and businesses through cutting-edge courses, expert consultancy, and B2B tech solutions tailored for real-world impact.
                        </p>
                    </div>

                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
                        <div className="bg-white p-8 text-left group rounded-xl">
                            <h2 className="text-4xl font-bold text-[#4b0081] mb-4 group-hover:text-[#6b21a8] transition-colors duration-300">
                                Our Mission
                            </h2>
                            <p className="text-xl text-[#6b21a8] mb-6">
                                At NBT (Next Big Tech), we believe in enabling professionals and businesses to unlock their full potential. We do this by providing future-proof skills, career guidance, and tech-powered B2B solutions.
                                <br />
                                Since 2020, we've empowered over 5,000 individuals and 100+ startups to scale with confidence through our services and educational programs.
                            </p>
                        </div>
                        <div className="hidden lg:block">
                            <img
                                src="/assets/aditya_image.jpg"
                                alt="Our mission illustration"
                                crossOrigin="anonymous"
                                width="400"
                                style={{ border: '2px solid #ccc', borderRadius: '8px' }}
                                className="rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-500 w-full h-auto object-cover"
                                onError={(e) => {
                                    console.error('Failed to load mission image:', e);
                                    e.target.src = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop';
                                }}
                            />
                        </div>
                    </div>

                    {data.ourMission.length > 0 ? (
                        <div className="max-w-6xl mx-auto mb-16">
                            <div className="bg-white p-8 text-left group">
                                <h2 className="text-4xl font-bold text-[#4b0081] mb-4 group-hover:text-[#6b21a8] transition-colors duration-300">
                                    Our Impact
                                </h2>
                                <p className="text-xl text-[#6b21a8] mb-6">Discover the tangible results of our commitment to education and innovation.</p>
                                <h3 className="text-2xl font-bold text-[#6b21a8] mb-4 group-hover:text-[#fdb727] transition-colors duration-300">
                                    {data.ourMission[0].title}
                                </h3>
                                <p className="text-[#6b21a8] mb-6">{data.ourMission[0].description}</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-purple-50 p-4 text-center rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-300 group hover:scale-110">
                                        <div className="text-3xl font-bold text-[#fdb727] mb-2">{data.ourMission[0].students || '0'}</div>
                                        <div className="text-[#6b21a8]">Students</div>
                                    </div>
                                    <div className="bg-purple-50 p-4 text-center rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-300 group hover:scale-110">
                                        <div className="text-3xl font-bold text-[#fdb727] mb-2">{data.ourMission[0].courses || '0'}</div>
                                        <div className="text-[#6b21a8]">Courses</div>
                                    </div>
                                    <div className="bg-purple-50 p-4 text-center rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-300 group hover:scale-110">
                                        <div className="text-3xl font-bold text-[#fdb727] mb-2">{data.ourMission[0].success_rate || '0'}%</div>
                                        <div className="text-[#6b21a8]">Success Rate</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-[#6b21a8] mb-16">No mission data available</p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-16">
                        <div className="bg-purple-50 p-6 rounded-xl group hover:bg-purple-100 transition-all duration-300">
                            <div className="flex justify-center mb-3">
                                <Users className="h-8 w-8 text-[#4b0081] group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <div className="text-3xl font-bold text-[#fdb727] group-hover:animate-pulse">
                                {totalStudents}
                            </div>
                            <div className="text-[#6b21a8]">Students Enrolled</div>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-xl group hover:bg-purple-100 transition-all duration-300">
                            <div className="flex justify-center mb-3">
                                <BookOpen className="h-8 w-8 text-[#4b0081] group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <div className="text-3xl font-bold text-[#fdb727] group-hover:animate-pulse">
                                {data.courses.length}
                            </div>
                            <div className="text-[#6b21a8]">Courses Available</div>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-xl group hover:bg-purple-100 transition-all duration-300">
                            <div className="flex justify-center mb-3">
                                <Star className="h-8 w-8 text-[#4b0081] group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <div className="text-3xl font-bold text-[#fdb727] group-hover:animate-pulse">
                                {averageRating}
                            </div>
                            <div className="text-[#6b21a8]">Average Rating</div>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-xl group hover:bg-purple-100 transition-all duration-300">
                            <div className="flex justify-center mb-3">
                                <User className="h-8 w-8 text-[#4b0081] group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <div className="text-3xl font-bold text-[#fdb727] group-hover:animate-pulse">
                                {data.overview.active_clients || 0}
                            </div>
                            <div className="text-[#6b21a8]">Active Clients</div>
                        </div>
                    </div>

                    <div className="mb-16">
                        <div className="text-center mb-16">
                            <h3 className="text-3xl font-bold text-purple-100 mb-4">Our Core Values</h3>
                            <p className="text-xl text-purple-100">The principles that guide everything we do</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, index) => (
                                <div
                                    key={index}
                                    className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors duration-300">
                                        <value.icon className="h-8 w-8 text-[#4b0081] group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <h4 className="text-xl font-semibold text-[#4b0081] mb-2 group-hover:text-[#6b21a8] transition-colors duration-300">{value.title}</h4>
                                    <p className="text-[#6b21a8]">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <section id="team" className="py-20 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-bold text-[#4b0081] mb-4">Our Team</h2>
                                <p className="text-xl text-[#6b21a8]">Meet the experts managing our platform</p>
                            </div>
                            {data.meetOurTeam.length === 0 ? (
                                <p className="text-center text-[#6b21a8]">No team members available</p>
                            ) : (
                                <div className="overflow-hidden" aria-label="Team member carousel">
                                    <div className="carousel flex flex-nowrap">
                                        {[...data.meetOurTeam, ...data.meetOurTeam].map((member, index) => (
                                            <div key={`${member.id}-${index}`} className="text-center group flex-shrink-0 w-64 mx-4">
                                                <div className="relative overflow-hidden rounded-full w-48 h-48 mx-auto mb-4">
                                                    <img
                                                        src={getDriveImageUrl(member.image)}
                                                        alt={member.name}
                                                        className="w-full h-full object-cover shadow-lg transition-transform duration-500 group-hover:scale-110"
                                                        onError={(e) => {
                                                            console.error(`Failed to load team member image for "${member.name}": ${member.image}`);
                                                            e.target.src = 'https://via.placeholder.com/150';
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                </div>
                                                <h4 className="text-xl font-semibold text-[#4b0081] mb-1 group-hover:text-[#6b21a8] transition-colors duration-300">{member.name}</h4>
                                                <div className="text-[#4b0081] font-medium mb-2">{member.position}</div>
                                                <p className="text-[#6b21a8] text-sm">{member.description}</p>
                                                <p className="text-sm text-[#6b21a8]">
                                                    <a href={`mailto:${member.email}`} className="text-[#6b21a8] hover:underline">{member.email}</a>
                                                </p>
                                                <p className="text-sm text-[#6b21a8]">
                                                    <a href={member.linkedin || '#'} target="_blank" rel="noopener noreferrer" className="text-[#6b21a8] hover:underline">LinkedIn</a>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    <section id="services" className="py-20">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-bold text-purple-100 mb-4">Our Services</h2>
                                <p className="text-xl text-purple-100">Overview of our professional services</p>
                            </div>
                            {data.ourServices.length === 0 ? (
                                <p className="text-center text-[#6b21a8]">No services available</p>
                            ) : (
                                <div className="overflow-hidden" aria-label="Services carousel">
                                    <div className="carousel flex flex-nowrap">
                                        {[...data.ourServices, ...data.ourServices].map((service, index) => (
                                            <div key={`${service.id}-${index}`} className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 group flex-shrink-0 w-80 mx-4">
                                                <div className="p-8">
                                                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-yellow-200 group-hover:scale-110 transition-all duration-300">
                                                        <Target className="h-8 w-8 text-[#4b0081]" />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-[#4b0081] mb-4 group-hover:text-[#6b21a8] transition-colors duration-300">{service.title}</h3>
                                                    <p className="text-[#6b21a8] mb-6">{service.description}</p>
                                                    <div className="space-y-3 mb-6">
                                                        {(service.points ? service.points.split(',').map(item => item.trim()) : []).map((point, i) => (
                                                            <div key={i} className="flex items-center group-hover:translate-x-2 transition-transform duration-300">
                                                                <CheckCircle className="h-5 w-5 text-[#fdb727] mr-3 flex-shrink-0" />
                                                                <span className="text-[#6b21a8]">{point}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="border-t pt-6">
                                                        <div className="text-2xl font-bold text-[#4b0081] mb-4">₹{service.price}</div>
                                                        <button
                                                            onClick={() => scrollToSection('contact')}
                                                            className="bg-[#fdb727] text-[#4b0081] px-6 py-2 rounded-full font-semibold hover:bg-[#f59e0b] hover:scale-105 transition-all duration-300 w-full"
                                                        >
                                                            Get Started
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </section>

            <section id="clients" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#4b0081] mb-4">Our Clients</h2>
                        <p className="text-xl text-[#6b21a8]">Current client projects</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
                            <thead className="bg-purple-600 text-[#fdb727]">
                                <tr>
                                    <th className="py-3 px-4 text-left">Client Name</th>
                                    <th className="py-3 px-4 text-left">Company</th>
                                    <th className="py-3 px-4 text-left">Task</th>
                                    <th className="py-3 px-4 text-left">Duration</th>
                                    <th className="py-3 px-4 text-left">Status</th>
                                    <th className="py-3 px-4 text-left">Contact</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.clients.map((client, index) => (
                                    <tr key={index} className="hover:bg-purple-50 transition-colors duration-200">
                                        <td className="py-4 px-4 text-[#6b21a8]">{client.client_name}</td>
                                        <td className="py-4 px-4 text-[#6b21a8]">{client.company_name}</td>
                                        <td className="py-4 px-4 text-[#6b21a8]">{client.task}</td>
                                        <td className="py-4 px-4 text-[#6b21a8]">{client.duration}</td>
                                        <td className="py-4 px-4 text-[#6b21a8]">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${client.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                client.status === 'in progress' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {client.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <a href={`mailto:${client.contact_email}`} className="text-purple-600 hover:underline">
                                                {client.contact_email}
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section id="courses" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#4b0081] mb-4">Our Courses</h2>
                        <p className="text-xl text-[#6b21a8]">Current course offerings</p>
                    </div>
                    {data.courses.length === 0 ? (
                        <p className="text-center text-[#6b21a8]">No courses available</p>
                    ) : (
                        <div className="overflow-hidden" aria-label="Courses carousel">
                            <div className="carousel flex flex-nowrap">
                                {[...data.courses, ...data.courses].map((course, index) => (
                                    <div key={`${course.id}-${index}`} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group flex-shrink-0 w-80 mx-4">
                                        {course.image_url && (
                                            <div className="relative overflow-hidden">
                                                <img
                                                    src={getDriveImageUrl(course.image_url)}
                                                    alt={course.title}
                                                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                                                    onError={(e) => {
                                                        console.error(`Failed to load course image for "${course.title}": ${course.image_url}`);
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="bg-purple-100 text-[#4b0081] text-xs font-semibold px-2.5 py-0.5 rounded">{course.type}</span>
                                                <div className="flex items-center">
                                                    <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current animate-pulse" />
                                                    <span className="text-sm text-[#6b21a8]">{course.rating || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2 text-[#4b0081] group-hover:text-[#6b21a8] transition-colors duration-300">{course.title}</h3>
                                            <p className="text-[#6b21a8] mb-4 text-sm">{course.description_1}</p>
                                            <p className="text-[#6b21a8] mb-4 text-sm">{course.description_2}</p>
                                            <div className="flex items-center justify-between text-sm text-[#6b21a8] mb-4">
                                                <div className="flex items-center group-hover:text-[#6b21a8] transition-colors duration-300">
                                                    <Users className="h-4 w-4 mr-1 text-[#fdb727]" />
                                                    {course.people || 0} students
                                                </div>
                                                <div className="flex items-center group-hover:text-[#6b21a8] transition-colors duration-300">
                                                    <Clock className="h-4 w-4 mr-1 text-[#fdb727]" />
                                                    {course.timeline || 'N/A'}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between border-t pt-4">
                                                <div>
                                                    <div className="text-xs text-[#6b21a8]">Educator: {course.educator || 'Unknown'}</div>
                                                </div>
                                                <a
                                                    href={course.link || '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-[#fdb727] text-[#4b0081] px-4 py-2 rounded-lg font-semibold hover:bg-[#f59e0b] hover:scale-105 transition-all duration-300"
                                                >
                                                    Enroll Now
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="mt-12">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-[#4b0081] mb-4">Special Offers</h2>
                            <p className="text-xl text-[#6b21a8]">Exclusive discount codes available</p>
                        </div>
                        {data.coupons.length === 0 ? (
                            <p className="text-center text-[#6b21a8]">No coupons available</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {data.coupons.map((coupon) => (
                                    <div key={coupon.id || coupon.code} className="coupon-offer text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="bg-white/20 p-2 rounded-lg">
                                                <Tag className="h-6 w-6 text-[#4b0081]" />
                                            </div>
                                            <div className="text-sm bg-white/20 px-2 py-1 rounded-full text-[#6b21a8]">
                                                {coupon.time_limit} days left
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold mb-1 group-hover:scale-105 transition-transform duration-300 text-[#4b0081]">
                                            {coupon.code}
                                        </div>
                                        <div className="text-4xl font-extrabold mb-2 group-hover:animate-pulse text-[#4b0081]">
                                            {coupon.discount}% OFF
                                        </div>
                                        <div className="text-sm text-[#6b21a8] opacity-80">
                                            Created: {new Date(coupon.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section id="testimonials" className="bg-white py-12 px-2 sm:px-8">
                <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-10 text-gray-900">
                    Trusted By <span className="text-blue-600">Creators</span>
                </h2>
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    <div className="overflow-hidden h-[440px] relative">
                        <div className="flex flex-col gap-6 animate-scroll-up">
                            {[...Array(2)].map((_, repIdx) => (
                                <React.Fragment key={repIdx}>
                                    <div className="bg-white border border-gray-300 rounded-lg p-6 shadow flex flex-col justify-between min-h-[175px]">
                                        <p className="mb-6 text-base font-semibold rich-purple-text">
                                            WebVeda is changing the way people look at their personal lives and careers.
                                            It's incredible to see a platform that prioritizes meaningful learning experiences like WebVeda does.
                                        </p>
                                        <div className="flex items-center gap-3 mt-auto">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full object-cover" />
                                            <div>
                                                <div className="font-semibold leading-tight bright-yellow">Sahil</div>
                                                <div className="text-gray-500 text-sm">@Sahil</div>
                                            </div>
                                        </div>
                                        <div className="h-2 rich-purple-bg rounded-b-lg mt-5" />
                                    </div>
                                    <div className="bg-white border border-gray-300 rounded-lg p-6 shadow flex flex-col justify-between min-h-[175px]">
                                        <p className="mb-6 text-base font-semibold rich-purple-text">
                                            Most of what I do is a skill that I developed through practice, not education. So it was wonderful to contribute to a platform like WebVeda that truly values real-world skills.
                                        </p>
                                        <div className="flex items-center gap-3 mt-auto">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full object-cover" />
                                            <div>
                                                <div className="font-semibold leading-tight bright-yellow">Arjun</div>
                                                <div className="text-gray-500 text-sm">@Arjun</div>
                                            </div>
                                        </div>
                                        <div className="h-2 rich-purple-bg rounded-b-lg mt-5" />
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div className="overflow-hidden h-[440px] relative">
                        <div className="flex flex-col gap-6 animate-scroll-down">
                            {[...Array(2)].map((_, repIdx) => (
                                <React.Fragment key={repIdx}>
                                    <div className="bg-white border border-gray-300 rounded-lg p-6 shadow flex flex-col justify-between min-h-[175px]">
                                        <p className="mb-6 text-base font-semibold rich-purple-text">
                                            As a business owner, I know how important it is to be a master of many skills. WebVeda sets you up for exactly that – excellence across the many facets you need in your professional and personal life.
                                        </p>
                                        <div className="flex items-center gap-3 mt-auto">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full object-cover" />
                                            <div>
                                                <div className="font-semibold leading-tight bright-yellow">Kumar</div>
                                                <div className="text-gray-500 text-sm">@Kumar</div>
                                            </div>
                                        </div>
                                        <div className="h-2 rich-purple-bg rounded-b-lg mt-5" />
                                    </div>
                                    <div className="bg-white border border-gray-300 rounded-lg p-6 shadow flex flex-col justify-between min-h-[175px]">
                                        <p className="mb-6 text-base font-semibold rich-purple-text">
                                            I believe content creation is entrepreneurship 3.0 and WebVeda will teach you just how to conquer this arena. With the guidance of WebVeda and some hard work on your part, you can truly transform your life.
                                        </p>
                                        <div className="flex items-center gap-3 mt-auto">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full object-cover" />
                                            <div>
                                                <div className="font-semibold leading-tight bright-yellow">Manish Pandey</div>
                                                <div className="text-gray-500 text-sm">@join2manish</div>
                                            </div>
                                        </div>
                                        <div className="h-2 rich-purple-bg rounded-b-lg mt-5" />
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div className="overflow-hidden h-[440px] relative">
                        <div className="flex flex-col gap-6 animate-scroll-up">
                            {[...Array(2)].map((_, repIdx) => (
                                <React.Fragment key={repIdx}>
                                    <div className="bg-white border border-gray-300 rounded-lg p-6 shadow flex flex-col justify-between min-h-[175px]">
                                        <p className="mb-6 text-base font-semibold rich-purple-text">
                                            Ankur teaches with clarity, honesty, and transparency. I am sure that their students will learn significantly, grow, and become excellent individuals.
                                        </p>
                                        <div className="flex items-center gap-3 mt-auto">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full object-cover" />
                                            <div>
                                                <div className="font-semibold leading-tight bright-yellow">xyz</div>
                                                <div className="text-gray-500 text-sm">@xyz</div>
                                            </div>
                                        </div>
                                        <div className="h-2 rich-purple-bg rounded-b-lg mt-5" />
                                    </div>
                                    <div className="bg-white border border-gray-300 rounded-lg p-6 shadow flex flex-col justify-between min-h-[175px]">
                                        <p className="mb-6 text-base font-semibold rich-purple-text">
                                            I am a dancer, teacher, creator, and supporter of WebVeda! The courses on WebVeda have the potential to transform your life. All you have to do is take the first step.
                                        </p>
                                        <div className="flex items-center gap-3 mt-auto">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full object-cover" />
                                            <div>
                                                <div className="font-semibold leading-tight bright-yellow">Sumit</div>
                                                <div className="text-gray-500 text-sm">@Sumit</div>
                                            </div>
                                        </div>
                                        <div className="h-2 rich-purple-bg rounded-b-lg mt-5" />
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <FetchYouTubeVideos />

            <SocialMediaStats />

            <section id="partners" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#4b0081] mb-4">Companies We Have Worked With</h2>
                        <p className="text-xl text-[#6b21a8]">Our trusted partners</p>
                    </div>
                    {companies.length === 0 ? (
                        <p className="text-center text-gray-600">No partners available</p>
                    ) : (
                        <div className="overflow-hidden" aria-label="Partners carousel">
                            <div className="carousel flex flex-nowrap">
                                {[...companies, ...companies].map((company, index) => (
                                    <div
                                        key={`${company.id}-${index}`}
                                        className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group flex-shrink-0 w-48 mx-4"
                                    >
                                        <div className="p-6 text-center">
                                            <div className="relative overflow-hidden rounded-lg mb-4">
                                                <img
                                                    src={company.logo}
                                                    alt={`${company.name} logo`}
                                                    className="w-full h-24 object-contain transition-all duration-500 filter grayscale group-hover:filter-none group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                            <h3 className="text-lg font-semibold text-[#4b0081] group-hover:text-[#6b21a8] transition-colors duration-300">
                                                {company.name}
                                            </h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section id="faq" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#4b0081] mb-4">Frequently Asked Questions</h2>
                        <p className="text-xl text-[#6b21a8]">Common questions from our users</p>
                    </div>
                    {data.faqs.length === 0 ? (
                        <div className="text-center">
                            <p className="text-gray-600 mb-4">No FAQs available at the moment.</p>
                            <p className="text-sm text-gray-500">
                                Please check back later or contact support at{' '}
                                <a href="mailto:support@nbt.com" className="text-blue-600 hover:underline">
                                    support@nbt.com
                                </a>{' '}
                                for assistance.
                            </p>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto space-y-6">
                            {data.faqs.map((faq) => (
                                <div
                                    key={faq.id || `faq-${Math.random().toString(36).substr(2, 9)}`}
                                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 group"
                                >
                                    <h3 className="text-xl font-semibold mb-2 text-[#6b21a8] group-hover:text-purple-600 transition-colors duration-300 flex items-center">
                                        <HelpCircle className="h-5 w-5 text-purple-500 mr-2" />
                                        {faq.question || 'No question provided'}
                                    </h3>
                                    <p className="text-gray-600 pl-7">{faq.answer || 'No answer provided'}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section id="contact" className="py-20 bg-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
                        <p className="text-xl text-gray-600">
                            Ready to start your journey? Get in touch with our team today
                        </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h3>
                            <div className="space-y-6">
                                {[
                                    {
                                        icon: Mail,
                                        title: "Email",
                                        content: [
                                            "adityajainiitb24@gmail.com",
                                            "nbt.media.24@gmail.com"
                                        ],
                                    },
                                    {
                                        icon: MapPin,
                                        title: "Location",
                                        content: ["India"],
                                    },
                                    {
                                        icon: Clock,
                                        title: "Office Hours",
                                        content: [
                                            "Monday - Friday: 9:00 AM - 6:00 PM",
                                            "Saturday: 10:00 AM - 4:00 PM",
                                            "Sunday: Closed",
                                        ],
                                    },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start group hover:transform hover:translate-x-2 transition-all duration-300"
                                    >
                                        <div className="bg-purple-100 p-3 rounded-full mr-4 group-hover:bg-yellow-200 group-hover:scale-110 transition-all duration-300">
                                            <item.icon className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors duration-300">
                                                {item.title}
                                            </h4>
                                            {item.content.map((line, i) => (
                                                <p key={i} className="text-gray-600">
                                                    {line}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8">
                                <h4 className="font-semibold text-gray-900 mb-2">Find Us</h4>
                                <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                    <iframe
                                        src="https://www.google.com/maps?q=India&output=embed"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Google Map"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <h3 className="text-3xl font-bold text-purple-700 mb-8">Send us a Message</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-purple-700 font-medium mb-2" htmlFor="name">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="full_name"
                                        required
                                        className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-purple-400 text-purple-700"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-purple-700 font-medium mb-2" htmlFor="email">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email_address"
                                        required
                                        className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-purple-400 text-purple-700"
                                        placeholder="Enter your email address"
                                    />
                                </div>
                                <div>
                                    <label className="block text-purple-700 font-medium mb-2" htmlFor="subject">
                                        Subject *
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        required
                                        className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-700"
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="General Inquiry">General Inquiry</option>
                                        <option value="Support">Support</option>
                                        <option value="Feedback">Feedback</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-purple-700 font-medium mb-2" htmlFor="message">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        required
                                        className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-purple-400 text-purple-700"
                                        placeholder="Tell us about your goals and how we can help you..."
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="w-full py-3 bg-yellow-400 text-white font-semibold rounded-lg transition-colors hover:bg-yellow-500"
                                >
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-[#4b0081] text-[#ffffff] py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-2 group">
                                <div className="text-2xl font-bold text-[#fdb727] group-hover:scale-110 transition-transform duration-300">
                                    NBT
                                </div>
                                <span>Next Bigg Tech</span>
                            </div>
                            <p className="text-[#ffffff] mb-4 hover:text-[#fdb727] transition-colors duration-300">
                                Empowering careers through expert consultancy, cutting-edge tech services, and comprehensive online/offline courses in web development, data science, and digital marketing.
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                                <div className="flex items-center hover:text-[#fdb727] transition-colors duration-300 group">
                                    <Mail className="h-4 w-4 mr-2 text-[#fdb727] group-hover:scale-110 transition-transform duration-300" />
                                    <span className="text-[#ffffff]"><a href="mailto:info@nbt.com" className="hover:text-[#fdb727] transition-colors duration-300">adityajainiitb24@gmail.com</a></span>
                                </div>
                                <div className="flex items-center hover:text-[#fdb727] transition-colors duration-300 group">
                                    <MapPin className="h-4 w-4 mr-2 text-[#fdb727] group-hover:scale-110 transition-transform duration-300" />
                                    <span className="text-[#ffffff]">India</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-[#fdb727]">Quick Links</h3>
                            <ul className="space-y-2">
                                {['overview', 'services', 'courses', 'team', 'testimonials', 'contact', 'faq', 'clients'].map(section => (
                                    <li key={section}>
                                        <button
                                            onClick={() => scrollToSection(section)}
                                            className="text-[#ffffff] hover:text-[#fdb727] transition-all duration-300 capitalize hover:translate-x-2 transform block"
                                        >
                                            {section.replace('-', ' ')}
                                        </button>
                                    </li>
                                ))}
                                <li className="mt-4">
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="bg-[#fdb727] text-black px-4 py-1 rounded-full hover:bg-[#f59e0b] hover:scale-105 transition-all duration-300 shadow-lg w-32 text-sm"
                                    >
                                        Admin Login
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-[#ffffff] mt-8 pt-8 text-center">
                        <p className="text-[#ffffff] hover:text-[#fdb727] transition-colors duration-300">
                            © 2025 Next Big Tech. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default NewMainPage;
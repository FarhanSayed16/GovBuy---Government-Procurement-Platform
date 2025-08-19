import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    title: 'Seamless Government Procurement',
    subtitle: 'Connect with verified suppliers. Hassle-free bidding, one platform.',
    image: '/images/1.webp',
  },
  {
    title: 'Find the Right Suppliers Fast',
    subtitle: 'Powerful search and instant communication with trusted vendors.',
    image: '/images/up2.jpeg',
  },
  {
    title: 'Transparent & Secure Bidding',
    subtitle: 'Ensure fairness and compliance with smart e-procurement tools.',
    image: '/images/trans2.jpeg',
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((current + 1) % slides.length);
  const prevSlide = () => setCurrent((current - 1 + slides.length) % slides.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000); // Auto slide every 7s
    return () => clearInterval(interval);
  }, [current]);

  return (
    <section className="relative h-[32rem] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center bg-no-repeat ${
            index === current ? 'opacity-100 z-20' : 'opacity-0 z-10'
          }`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="w-full h-full bg-black bg-opacity-60 flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{slide.title}</h1>
            <p className="text-lg md:text-2xl text-gray-200 mb-6">{slide.subtitle}</p>
            <div className="flex space-x-4">
              <Link
                to="/tenders"
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
              >
                Browse Tenders
              </Link>
              {/* <Link
                to="/customize"
                className="px-6 py-3 bg-white text-green-700 hover:bg-gray-100 font-semibold rounded-lg transition"
              >
                Post Requirement
              </Link> */}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-40 p-2 rounded-full hover:bg-opacity-70 transition z-30"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-40 p-2 rounded-full hover:bg-opacity-70 transition z-30"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-3 w-3 rounded-full cursor-pointer ${
              current === index ? 'bg-white' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;

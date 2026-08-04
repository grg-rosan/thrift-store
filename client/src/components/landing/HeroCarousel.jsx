import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SkeletonCard from './SkeletonCard';

export default function HeroCarousel({ items, isLoading }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isLoading || isPaused || items.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % items.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isLoading, isPaused, items.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index % items.length);
  };

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-ink text-lg font-medium">Be the first to list near you</p>
        <p className="text-gray-600 mt-2">Listings will appear here as people share</p>
      </div>
    );
  }

  const displayItems = items.slice(currentIndex, currentIndex + 3).concat(
    items.slice(0, Math.max(0, currentIndex + 3 - items.length))
  );

  return (
    <div className="space-y-4">
      {/* Carousel */}
      <div
        className="relative rounded-xl overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="grid grid-cols-3 gap-4">
          {displayItems.map((item, idx) => (
            <div 
              key={`${currentIndex}-${idx}`}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square overflow-hidden bg-card">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-medium text-ink line-clamp-2">{item.title}</h3>
                <div className="flex justify-between items-end">
                  <p className="font-bold text-primary">Rs {item.price}</p>
                  <p className="text-sm text-gray-600">{item.distance} km</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-ink p-2 rounded-full shadow-md transition-all z-10"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-ink p-2 rounded-full shadow-md transition-all z-10"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? 'bg-primary w-6' : 'bg-card'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

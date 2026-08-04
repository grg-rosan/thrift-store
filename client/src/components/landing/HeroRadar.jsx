import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

export default function HeroRadar({ items }) {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Simulate positioning items around the center pin based on distance
  const getItemPosition = (index, distance) => {
    const totalItems = items.length;
    const angle = (index / totalItems) * Math.PI * 2;
    const radius = Math.min(150, distance * 100); // Scale distance to pixels
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  return (
    <div className="flex items-center justify-center h-96 relative">
      {/* Radar background circles */}
      <div className="absolute w-80 h-80 rounded-full border border-card opacity-30" />
      <div className="absolute w-64 h-64 rounded-full border border-card opacity-20" />
      <div className="absolute w-48 h-48 rounded-full border border-card opacity-10" />

      {/* Distance pulse lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        {items.map((item, idx) => {
          const pos = getItemPosition(idx, item.distance);
          return (
            <line
              key={`line-${idx}`}
              x1="50%"
              y1="50%"
              x2={`calc(50% + ${pos.x}px)`}
              y2={`calc(50% + ${pos.y}px)`}
              stroke="#DCE5D8"
              strokeWidth="1"
              opacity="0.4"
            />
          );
        })}
      </svg>

      {/* Center pin */}
      <div className="absolute z-10 flex flex-col items-center">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
          <MapPin size={24} className="text-background" />
        </div>
        <p className="text-xs text-ink mt-2 font-medium">You</p>
      </div>

      {/* Item cards positioned around radar */}
      {items.map((item, idx) => {
        const pos = getItemPosition(idx, item.distance);
        const isCloser = idx < 2;
        const animationDelay = idx * 50;
        const scale = isCloser ? 1 : 0.8;
        
        return (
          <div
            key={item.id}
            className={`absolute transition-all duration-700 ease-out ${
              animationComplete ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              left: `calc(50% + ${pos.x}px)`,
              top: `calc(50% + ${pos.y}px)`,
              transform: animationComplete 
                ? `translate(-50%, -50%) scale(${scale})` 
                : 'translate(-50%, -50%) scale(0)',
              transitionDelay: `${animationDelay}ms`,
              zIndex: isCloser ? 20 : 5,
            }}
          >
            <div className={`bg-white rounded-lg shadow-md overflow-hidden w-32 border border-border/50 ${
              isCloser ? 'ring-2 ring-primary ring-opacity-20' : ''
            }`}>
              <div className="aspect-square overflow-hidden bg-card">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2 space-y-1">
                <p className="text-xs font-medium text-ink line-clamp-1">{item.title}</p>
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-primary">Rs {item.price}</p>
                  <p className="text-xs text-gray-500">{item.distance}km</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

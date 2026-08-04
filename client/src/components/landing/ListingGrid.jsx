import SkeletonCard from './SkeletonCard';

export default function ListingGrid({ items, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div 
          key={item.id}
          className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="aspect-square overflow-hidden bg-card">
            <img 
              src={item.image} 
              alt={item.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>
          <div className="p-4 space-y-3">
            <h3 className="font-medium text-ink line-clamp-2">{item.title}</h3>
            <div className="flex justify-between items-end">
              <p className="font-bold text-lg text-primary">Rs {item.price}</p>
              <p className="text-sm text-gray-600">{item.distance} km away</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

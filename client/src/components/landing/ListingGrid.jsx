import SkeletonCard from './SkeletonCard';

export default function ListingGrid({ items, isLoading, onSignIn }) {
  const displayItems = items.slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-56">
            <SkeletonCard />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {displayItems.map((item) => (
          <div 
            key={item.id}
            className="flex-shrink-0 w-56 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
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
      
      {/* Sign in to view more button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onSignIn}
          className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-background transition-colors"
        >
          Sign in to view more
        </button>
      </div>
    </div>
  );
}

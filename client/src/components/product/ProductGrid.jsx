

import ProductCard from './ProductCard'

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">No listings found. Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((listing) => (
        <ProductCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}

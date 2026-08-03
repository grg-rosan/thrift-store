
import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { formatPrice, formatRelativeTime } from '../../utils/formatters'
import { STATUS } from '../../utils/constants'
import { useFavourites } from '../../hooks/useFavourites'

export default function ProductCard({ listing }) {
  const navigate = useNavigate()
  const { isFavourited, toggleFavourite } = useFavourites()

  const handleClick = () => {
    navigate(`/product/${listing.id}`)
  }

  const handleFavouriteClick = (e) => {
    e.stopPropagation()
    toggleFavourite(listing.id)
  }

  const isReserved = listing.status === STATUS.RESERVED
  const isSold = listing.status === STATUS.SOLD
  const isUnavailable = isReserved || isSold
  const favourited = isFavourited(listing.id)

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer ${
        isUnavailable ? 'opacity-60' : ''
      }`}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-100 aspect-square">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover hover:scale-105 transition"
        />

        {/* Status Badge */}
        {isUnavailable && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white px-3 py-1 rounded-lg font-semibold text-gray-800">
              {listing.status}
            </div>
          </div>
        )}

        {/* Heart Icon */}
        <button
          onClick={handleFavouriteClick}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition"
          aria-label={favourited ? 'Remove from favourites' : 'Add to favourites'}
        >
          <Heart
            size={18}
            className={favourited ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
          {listing.title}
        </h3>

        {/* Price */}
        <p className="text-lg font-bold text-orange-600 mb-2">
          {formatPrice(listing.price, listing.isFree)}
        </p>

        {/* Neighborhood & Time */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>{listing.neighborhood}</span>
          <span>{formatRelativeTime(listing.createdAt)}</span>
        </div>

        {/* Seller Info */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <img
            src={listing.seller.profileImage}
            alt={listing.seller.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-xs text-gray-700 font-medium">{listing.seller.name}</span>
          <div className="flex items-center ml-auto">
            <span className="text-xs text-yellow-500">★</span>
            <span className="text-xs text-gray-600 ml-1">{listing.seller.avgRating}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { useFavourites } from "../hooks/useFavourites";
import { formatPrice, formatRelativeTime } from "../utils/formatters";
import ProductGrid from "../components/product/ProductGrid";
import { STATUS } from "../utils/constants";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, getUserListings } = useProducts();
  const { isFavourited, toggleFavourite } = useFavourites();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const listing = getProductById(id);

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Listing not found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isAvailable = listing.status === STATUS.AVAILABLE;
  const relatedProducts = getUserListings(listing.seller.id)
    .filter((p) => p.id !== listing.id)
    .slice(0, 4);

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + listing.images.length) % listing.images.length,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  };

  const handleSellerClick = () => {
    navigate(`/profile/${listing.seller.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky back bar */}
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-gray-50/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700"
          >
            <ChevronLeft size={20} />
            Back to listings
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Carousel */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative bg-gray-100 aspect-square">
              <img
                src={listing.images[currentImageIndex]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white transition"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white transition"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>

                  {/* Dots Indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {listing.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImageIndex(i)}
                        className={`w-2 h-2 rounded-full transition ${
                          i === currentImageIndex
                            ? "bg-white"
                            : "bg-white/50 hover:bg-white/75"
                        }`}
                        aria-label={`View image ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {listing.images.length > 1 && (
              <div className="bg-gray-50 border-t border-gray-200 p-2 flex gap-2 overflow-x-auto">
                {listing.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition ${
                      i === currentImageIndex
                        ? "border-orange-600"
                        : "border-transparent hover:border-gray-300"
                    }`}
                    aria-label={`Thumbnail ${i + 1}`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  {listing.category.toUpperCase()}
                </p>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {listing.title}
                </h1>
                {!isAvailable && (
                  <div className="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold mb-4">
                    {listing.status}
                  </div>
                )}
              </div>
              <button
                onClick={() => toggleFavourite(listing.id)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label={
                  isFavourited(listing.id)
                    ? "Remove from favourites"
                    : "Add to favourites"
                }
              >
                <Heart
                  size={24}
                  className={
                    isFavourited(listing.id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400"
                  }
                />
              </button>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold text-orange-600 mb-6">
              {formatPrice(listing.price, listing.isFree)}
            </div>

            {/* Meta Info */}
            <div className="bg-gray-100 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Location</span>
                <span className="font-medium text-gray-900">
                  {listing.neighborhood}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Posted</span>
                <span className="font-medium text-gray-900">
                  {formatRelativeTime(listing.createdAt)}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={listing.seller.profileImage}
                  alt={listing.seller.name}
                  className="w-12 h-12 rounded-full cursor-pointer hover:opacity-80"
                  onClick={handleSellerClick}
                />
                <div>
                  <p
                    className="font-semibold text-gray-900 cursor-pointer hover:text-orange-600"
                    onClick={handleSellerClick}
                  >
                    {listing.seller.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    ★ {listing.seller.avgRating} ({listing.seller.ratingCount}{" "}
                    reviews)
                  </p>
                </div>
              </div>
              <button
                onClick={handleSellerClick}
                className="w-full px-4 py-2 text-sm font-medium text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition"
              >
                View Profile
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                disabled={!isAvailable}
                className={`w-full px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                  isAvailable
                    ? "bg-orange-600 text-white hover:bg-orange-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <MessageCircle size={20} />
                Chat with Seller
              </button>
              <button className="w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition">
                Save Item
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              More from {listing.seller.name}
            </h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}

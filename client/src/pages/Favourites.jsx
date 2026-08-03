import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Heart } from "lucide-react";
import { useFavourites } from "../hooks/useFavourites";
import { useProducts } from "../hooks/useProducts";
import ProductGrid from "../components/product/ProductGrid";

export default function Favourites() {
  const navigate = useNavigate();
  const { getFavouriteIds } = useFavourites();
  const { products: allProducts } = useProducts();

  const favouritedListings = useMemo(() => {
    const favouriteIds = getFavouriteIds();
    return allProducts.filter((product) => favouriteIds.includes(product.id));
  }, [getFavouriteIds]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
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
        <div className="flex items-center gap-3 mb-8">
          <Heart size={32} className="text-red-500 fill-red-500" />
          <h1 className="text-3xl font-bold text-gray-900">Favourites</h1>
        </div>

        {favouritedListings.length > 0 ? (
          <>
            <p className="text-gray-600 mb-6">
              You have {favouritedListings.length} favourite
              {favouritedListings.length !== 1 ? "s" : ""}
            </p>
            <ProductGrid products={favouritedListings} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <Heart size={48} className="text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              No favourites yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start by adding listings to your favourites
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              Browse Listings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { useProducts } from "../hooks/useProducts";
import ProfileCard from "../components/profile/ProfileCard";
import ProfileStats from "../components/profile/ProfileStats";
import ReviewList from "../components/profile/ReviewList";
import ProductGrid from "../components/product/ProductGrid";

export default function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { getProfileByUserId, getUserReviews } = useProfile();
  const { getUserListings } = useProducts();
  const [activeTab, setActiveTab] = useState("listings");

  const profile = getProfileByUserId(userId);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Profile not found
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

  const userListings = getUserListings(profile.id);
  const reviews = getUserReviews(profile.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky back bar */}
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-gray-50 md:bg-gray-50/95 md:backdrop-blur">
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <ProfileCard profile={profile} />

        {/* Stats */}
        <div className="mt-6">
          <ProfileStats profile={profile} listingsCount={userListings.length} />
        </div>

        {/* Action Button */}
        <div className="mt-6 mb-8">
          <button
            onClick={() => navigate("/create-listing")}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition"
          >
            <Plus size={20} />
            Sell an item
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-b border-gray-200 flex gap-6">
          <button
            onClick={() => setActiveTab("listings")}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "listings"
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Listings ({userListings.length})
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "reviews"
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === "listings" && (
            <>
              {userListings.length > 0 ? (
                <ProductGrid products={userListings} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No listings yet.</p>
                </div>
              )}
            </>
          )}

          {activeTab === "reviews" && <ReviewList reviews={reviews} />}
        </div>
      </div>
    </div>
  );
}

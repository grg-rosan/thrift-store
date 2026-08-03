import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import { useProducts } from "../hooks/useProducts";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import ProductGrid from "../components/product/ProductGrid";
import ProductDetailPage from "../pages/ProductDetailPage";
import ProfilePage from "../pages/ProfilePage";
import CreateListing from "../pages/CreateListing";
import Favourites from "../pages/Favourites";

function HomePage() {
  const { currentUser } = useProfile();
  const {
    filteredProducts,
    selectedCategory,
    priceRange,
    filterByCategory,
    filterByPrice,
    clearFilters,
  } = useProducts();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="shrink-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          currentUser={currentUser}
        />
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar - Independent scroll container */}
        <div className="w-64 border-r border-gray-200 bg-white overflow-y-auto hidden lg:block">
          <div className="sticky top-0">
            <Sidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              selectedCategory={selectedCategory}
              onCategoryChange={filterByCategory}
              priceRange={priceRange}
              onPriceChange={filterByPrice}
              onClear={clearFilters}
            />
          </div>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white z-40 overflow-y-auto lg:hidden">
            <Sidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              selectedCategory={selectedCategory}
              onCategoryChange={filterByCategory}
              priceRange={priceRange}
              onPriceChange={filterByPrice}
              onClear={clearFilters}
            />
          </div>
        )}

        {/* Main Content - Independent scroll container */}
        <main className="flex-1 min-h-0 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Browse Listings
              </h2>
              <p className="text-gray-600 mt-1">
                {filteredProducts.length} items available
              </p>
            </div>

            <ProductGrid products={filteredProducts} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/profile/:userId" element={<ProfilePage />} />
      <Route path="/create-listing" element={<CreateListing />} />
      <Route path="/favourites" element={<Favourites />} />
    </Routes>
  );
}

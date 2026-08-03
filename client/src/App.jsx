import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import ProductGrid from "./components/product/ProductGrid";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProfilePage from "./pages/ProfilePage";
import CreateListing from "./pages/CreateListing";
import Favourites from "./pages/Favourites";
import { useProfile } from "./hooks/useProfile";
import { useProducts } from "./hooks/useProducts";

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
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="shrink-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          currentUser={currentUser}
        />
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          selectedCategory={selectedCategory}
          onCategoryChange={filterByCategory}
          priceRange={priceRange}
          onPriceChange={filterByPrice}
          onClear={clearFilters}
        />

        {/* Main Content - Independent scroll container */}
        <main className="flex-1 min-h-0 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-8 h-full">
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

function AppRoutes() {
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

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import ProductGrid from "./components/product/ProductGrid";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProfilePage from "./pages/ProfilePage";
import CreateListing from "./pages/CreateListing";
import Favourites from "./pages/Favourites";
import { useProfile } from "./hooks/useProfile";
import { useProducts } from "./hooks/useProducts";

// Lazy load landing page to avoid circular dependencies
const LandingPage = () => <div className="bg-background h-screen">Loading...</div>;

const HomePage = () => <LandingPage />;

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

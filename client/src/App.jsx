import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user has device token (already authenticated)
    const deviceToken = localStorage.getItem('karrot_device_token');
    if (deviceToken) {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('karrot_device_token');
    localStorage.removeItem('karrot_user_email');
    localStorage.removeItem('karrot_user_name');
    localStorage.removeItem('karrot_user_location');
    setIsAuthenticated(false);
  };

  if (isChecking) {
    return (
      <div className="w-full h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-card rounded-full animate-pulse mx-auto mb-4" />
          <p className="text-ink">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? (
    <HomePage onLogout={handleLogout} />
  ) : (
    <LandingPage onAuthSuccess={handleAuthSuccess} />
  );
}

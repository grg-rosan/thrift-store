import { useState, useEffect } from 'react';
import { MessageCircle, MapPin, Handshake } from 'lucide-react';
import AuthModal from '../components/auth/AuthModal';
import HeroRadar from '../components/landing/HeroRadar';
import HeroCarousel from '../components/landing/HeroCarousel';
import ListingGrid from '../components/landing/ListingGrid';
import { getNearbyItems } from '../utils/mockApi';

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      const mockItems = await getNearbyItems();
      setItems(mockItems);
      setIsLoading(false);
    };

    loadItems();
  }, []);

  const handleAuthSuccess = (userData) => {
    console.log('User authenticated:', userData);
    // Navigate to dashboard or update app state
  };

  return (
    <div className="bg-background text-ink">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <MapPin size={18} className="text-background" />
            </div>
            <span className="text-xl font-bold text-primary">Karrot</span>
          </div>
          
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-6 py-2 bg-primary text-background font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Sign in
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4 text-balance">
              Your neighborhood has a garage sale. You just can&apos;t see it yet.
            </h1>
            <p className="text-xl text-gray-600 mb-8 text-pretty max-w-2xl mx-auto">
              Karrot connects you with people who live close enough to just walk over.
            </p>
            
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-8 py-4 bg-primary text-background font-bold rounded-lg hover:opacity-90 transition-opacity text-lg inline-block"
            >
              Find your street
            </button>
          </div>

          {/* Distance Radar Visualization */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-border mb-12">
            <HeroRadar items={items} />
          </div>

          {/* Nearby Items Carousel */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-ink mb-6">Nearby you right now</h2>
            <HeroCarousel items={items} isLoading={isLoading} />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
              Real people. Real proximity.
            </p>
            <h2 className="text-3xl font-bold text-ink mb-4">How it works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Three simple steps to find great deals in your neighborhood without leaving home.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Browse */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <MapPin size={32} className="text-background" />
              </div>
              <h3 className="text-lg font-semibold text-ink mb-2">Browse nearby</h3>
              <p className="text-gray-600">
                See what&apos;s being sold by people within walking distance of your home.
              </p>
            </div>

            {/* Chat */}
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <MessageCircle size={32} className="text-background" />
              </div>
              <h3 className="text-lg font-semibold text-ink mb-2">Chat directly</h3>
              <p className="text-gray-600">
                Message sellers to ask questions or negotiate. No middleman, no fees.
              </p>
            </div>

            {/* Meetup */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Handshake size={32} className="text-background" />
              </div>
              <h3 className="text-lg font-semibold text-ink mb-2">Meet up locally</h3>
              <p className="text-gray-600">
                Complete the transaction in person. Safe, easy, and supports your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-ink mb-6">More listings</h2>
          <ListingGrid items={items} isLoading={isLoading} />
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/30 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-4">
            Community first
          </p>
          <h2 className="text-2xl font-bold text-ink mb-4">Built for neighborhoods</h2>
          <p className="text-gray-600 text-lg">
            Karrot keeps marketplaces local and personal. By limiting listings to your neighborhood, we ensure every transaction is between real neighbors — no shipping, no shipping costs, no strangers.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-background/90 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-background/20 rounded-full flex items-center justify-center">
                  <MapPin size={14} />
                </div>
                <span className="font-bold">Karrot</span>
              </div>
              <p className="text-sm opacity-80">
                The neighborhood marketplace for you.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100">Browse</a></li>
                <li><a href="#" className="hover:opacity-100">Sell</a></li>
                <li><a href="#" className="hover:opacity-100">Safety</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100">About</a></li>
                <li><a href="#" className="hover:opacity-100">Contact</a></li>
                <li><a href="#" className="hover:opacity-100">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100">Privacy</a></li>
                <li><a href="#" className="hover:opacity-100">Terms</a></li>
                <li><a href="#" className="hover:opacity-100">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-background/20 pt-8 text-sm opacity-80 text-center">
            <p>&copy; 2024 Karrot. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

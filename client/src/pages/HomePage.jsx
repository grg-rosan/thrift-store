import { useState, useEffect } from 'react';
import { LogOut, Plus, MapPin, MessageCircle } from 'lucide-react';
import HeroCarousel from '../components/landing/HeroCarousel';
import ListingGrid from '../components/landing/ListingGrid';
import { getNearbyItems } from '../utils/mockApi';

export default function HomePage({ onLogout }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // Load user data from localStorage
    const email = localStorage.getItem('karrot_user_email');
    const name = localStorage.getItem('karrot_user_name');
    const location = localStorage.getItem('karrot_user_location');
    
    setUserData({
      email,
      name: name || email?.split('@')[0],
      location: location || 'My neighborhood'
    });

    // Load items
    const loadItems = async () => {
      setIsLoading(true);
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Loading timeout')), 5000)
        );
        
        const mockItems = await Promise.race([
          getNearbyItems(),
          timeoutPromise
        ]);
        
        setItems(mockItems);
      } catch (err) {
        console.log('[v0] Failed to load items:', err.message);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, []);

  return (
    <div className="bg-background text-ink min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <MapPin size={18} className="text-background" />
            </div>
            <span className="text-xl font-bold text-primary">Karrot</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              className="px-6 py-2 bg-accent text-background font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              title="Create a new listing"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Sell</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="text-right text-sm">
                <p className="font-semibold">{userData.name}</p>
                <p className="text-xs text-gray-600">{userData.location}</p>
              </div>
              
              <button
                onClick={onLogout}
                className="p-2 hover:bg-card rounded-lg transition-colors"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut size={20} className="text-ink" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-2">
            Welcome, {userData.name}!
          </h1>
          <p className="text-gray-600">
            Browse items near {userData.location} or start selling your unused items.
          </p>
        </div>
      </section>

      {/* Nearby Items Carousel */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-ink mb-6">Nearby you right now</h2>
          <HeroCarousel items={items} isLoading={isLoading} />
        </div>
      </section>

      {/* Browse All Listings */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-ink mb-6">Browse all listings</h2>
          <ListingGrid items={items} isLoading={isLoading} onSignIn={() => {}} />
        </div>
      </section>

      {/* Actions Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Sell Item */}
            <div className="bg-white rounded-lg p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                <Plus size={24} className="text-background" />
              </div>
              <h3 className="text-xl font-bold text-ink mb-2">List something to sell</h3>
              <p className="text-gray-600 mb-4">
                Have something you don&apos;t need? List it for free and connect with buyers in your neighborhood.
              </p>
              <button className="px-6 py-2 bg-accent text-background font-medium rounded-lg hover:opacity-90 transition-opacity">
                Create listing
              </button>
            </div>

            {/* Messages */}
            <div className="bg-white rounded-lg p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <MessageCircle size={24} className="text-background" />
              </div>
              <h3 className="text-xl font-bold text-ink mb-2">Check your messages</h3>
              <p className="text-gray-600 mb-4">
                Connect directly with neighbors interested in your items or items you want to buy.
              </p>
              <button className="px-6 py-2 bg-primary text-background font-medium rounded-lg hover:opacity-90 transition-opacity">
                View messages
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-background/90 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center text-sm opacity-80">
          <p>&copy; 2024 Karrot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

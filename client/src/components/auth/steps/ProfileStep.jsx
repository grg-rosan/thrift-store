import { useState, useEffect } from 'react';
import { getGeolocation } from '../../../utils/mockApi';

export default function ProfileStep({ onSubmit, isLoading, onBack }) {
  const [formData, setFormData] = useState({
    name: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [locationStatus, setLocationStatus] = useState('idle'); // idle, loading, granted, denied
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    // Request geolocation on component mount
    const requestLocation = async () => {
      setLoadingLocation(true);
      setLocationStatus('loading');
      const geo = await getGeolocation();
      
      if (geo) {
        setLocationStatus('granted');
        setFormData(prev => ({
          ...prev,
          location: 'Current Location'
        }));
      } else {
        setLocationStatus('denied');
        setFormData(prev => ({
          ...prev,
          location: 'Kathmandu'
        }));
      }
      setLoadingLocation(false);
    };

    requestLocation();
  }, []);

  const handleLocationRetry = async () => {
    setLoadingLocation(true);
    setLocationStatus('loading');
    const geo = await getGeolocation();
    
    if (geo) {
      setLocationStatus('granted');
      setFormData(prev => ({
        ...prev,
        location: 'Current Location'
      }));
    } else {
      setLocationStatus('denied');
      setFormData(prev => ({
        ...prev,
        location: 'Kathmandu'
      }));
    }
    setLoadingLocation(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!formData.location.trim()) {
      setError('Please select a location');
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-ink mb-2">
          Your name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, name: e.target.value }));
            setError('');
          }}
          placeholder="Your full name"
          disabled={isLoading}
          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-ink placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-ink mb-2">
          Neighborhood
        </label>
        <div className="space-y-3">
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Your neighborhood"
            disabled={isLoading}
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-ink placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          
          {locationStatus === 'denied' && !loadingLocation && (
            <div className="p-3 bg-card/50 rounded-lg border border-border">
              <p className="text-sm text-gray-600">
                Showing listings near <span className="font-medium">Kathmandu</span> — 
                <button
                  type="button"
                  onClick={handleLocationRetry}
                  className="text-primary font-medium hover:underline ml-1"
                >
                  enable location
                </button>
              </p>
            </div>
          )}
          
          {loadingLocation && locationStatus === 'loading' && (
            <div className="p-3 bg-card/50 rounded-lg border border-border flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
              <p className="text-sm text-gray-600">Getting your location...</p>
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-accent text-sm">{error}</p>}

      <div className="space-y-3 pt-2">
        <button
          type="submit"
          disabled={isLoading || loadingLocation}
          className="w-full px-4 py-3 bg-primary text-background font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
              <span>Setting up...</span>
            </>
          ) : (
            'Finish setup'
          )}
        </button>

        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="w-full px-4 py-2 text-primary font-medium hover:bg-primary/5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Back
        </button>
      </div>
    </form>
  );
}

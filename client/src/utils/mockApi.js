// Mock API functions for authentication flow
// To be replaced with real API calls later

let deviceToken = null;
let attemptCount = 0;
const MAX_ATTEMPTS = 5;

export const requestOtp = async (email) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  console.log('[mockApi] OTP requested for:', email);
  
  // Mock response
  return {
    success: true,
    message: 'OTP sent to email',
    email
  };
};

export const verifyOtp = async (email, code) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Mock validation - accept any 6-digit code for demo
  if (!/^\d{6}$/.test(code)) {
    throw new Error('Invalid code format');
  }
  
  console.log('[mockApi] OTP verified for:', email);
  
  // Mock response - randomly determine if new or returning user
  const isNewUser = Math.random() > 0.5;
  
  return {
    success: true,
    email,
    isNewUser,
    token: `mock-token-${Date.now()}`
  };
};

export const completeProfile = async (data) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('[mockApi] Profile completed:', data);
  
  // Generate a device token for "remember this device"
  deviceToken = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Store in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('karrot_device_token', deviceToken);
    localStorage.setItem('karrot_user_name', data.name);
    localStorage.setItem('karrot_user_location', data.location);
  }
  
  return {
    success: true,
    message: 'Profile setup complete',
    deviceToken
  };
};

export const checkDeviceToken = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('karrot_device_token');
    const name = localStorage.getItem('karrot_user_name');
    
    if (token && name) {
      console.log('[mockApi] Device token found:', token);
      return {
        valid: true,
        name,
        token
      };
    }
  }
  
  return {
    valid: false
  };
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('karrot_device_token');
    localStorage.removeItem('karrot_user_name');
    localStorage.removeItem('karrot_user_location');
  }
  deviceToken = null;
};

export const getGeolocation = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    
    const timeout = setTimeout(() => {
      resolve(null);
    }, 3000);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeout);
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          source: 'user'
        });
      },
      () => {
        clearTimeout(timeout);
        resolve(null);
      }
    );
  });
};

// Mock nearby items data
const mockItems = [
  { id: 1, title: 'Vintage wooden desk', price: 2500, distance: 0.3, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop' },
  { id: 2, title: 'Used bicycle', price: 800, distance: 0.5, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop' },
  { id: 3, title: 'Bookshelf', price: 1200, distance: 0.7, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop' },
  { id: 4, title: 'Coffee table', price: 1500, distance: 0.9, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop' },
  { id: 5, title: 'Wall mirror', price: 600, distance: 1.1, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop' },
  { id: 6, title: 'Lamp set', price: 450, distance: 1.3, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop' },
];

export const getNearbyItems = async () => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockItems;
};

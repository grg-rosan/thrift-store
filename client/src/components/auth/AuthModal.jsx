import { useState } from 'react';
import { X } from 'lucide-react';
import EmailStep from './steps/EmailStep';
import OtpStep from './steps/OtpStep';
import ProfileStep from './steps/ProfileStep';
import { requestOtp, verifyOtp, completeProfile } from '../../utils/mockApi';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [currentStep, setCurrentStep] = useState('email');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const handleEmailSubmit = async (emailValue) => {
    setIsLoading(true);
    try {
      await requestOtp(emailValue);
      setEmail(emailValue);
      setCurrentStep('otp');
    } catch (err) {
      console.error('Email submission failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (code) => {
    setIsLoading(true);
    try {
      const response = await verifyOtp(email, code);
      setIsNewUser(response.isNewUser);
      
      if (response.isNewUser) {
        setCurrentStep('profile');
      } else {
        // Returning user - auto-login
        localStorage.setItem('karrot_device_token', response.token);
        localStorage.setItem('karrot_user_email', email);
        onAuthSuccess({ email, isNewUser: false });
        onClose();
      }
    } catch (err) {
      console.error('OTP verification failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (profileData) => {
    setIsLoading(true);
    try {
      await completeProfile(profileData);
      localStorage.setItem('karrot_device_token', `token-${Date.now()}`);
      localStorage.setItem('karrot_user_email', email);
      localStorage.setItem('karrot_user_name', profileData.name);
      localStorage.setItem('karrot_user_location', profileData.location);
      
      onAuthSuccess({ 
        email, 
        name: profileData.name, 
        location: profileData.location,
        isNewUser: true 
      });
      onClose();
    } catch (err) {
      console.error('Profile completion failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'otp') {
      setCurrentStep('email');
      setEmail('');
    } else if (currentStep === 'profile') {
      setCurrentStep('otp');
    }
  };

  if (!isOpen) return null;

  const stepTitles = {
    email: 'Sign in or sign up',
    otp: 'Verify your email',
    profile: 'Complete your profile'
  };

  const stepIndex = {
    email: 0,
    otp: 1,
    profile: 2
  };

  const maxSteps = isNewUser ? 3 : 2;
  const currentStepIndex = stepIndex[currentStep] + 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background rounded-2xl shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-ink">{stepTitles[currentStep]}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-card rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-ink" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex gap-2">
            {Array.from({ length: maxSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i < currentStepIndex ? 'bg-primary' : 'bg-card'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 'email' && (
            <EmailStep 
              onSubmit={handleEmailSubmit} 
              isLoading={isLoading}
            />
          )}
          
          {currentStep === 'otp' && (
            <OtpStep 
              email={email}
              onSubmit={handleOtpSubmit}
              isLoading={isLoading}
              onBack={handleBack}
            />
          )}
          
          {currentStep === 'profile' && (
            <ProfileStep 
              onSubmit={handleProfileSubmit}
              isLoading={isLoading}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
}

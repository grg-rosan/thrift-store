import { useState, useEffect, useRef } from 'react';

export default function OtpStep({ email, onSubmit, isLoading, onBack }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next field
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when last digit is entered
    if (index === 5 && value) {
      submitOtp(newOtp);
    }
  };

  const handleBackspace = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submitOtp = async (otpValues) => {
    const code = otpValues.join('');
    if (code.length !== 6) return;

    try {
      await onSubmit(code);
    } catch (err) {
      setError(err.message || 'Verification failed');
      setAttemptsLeft(Math.max(0, attemptsLeft - 1));
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = () => {
    setTimeLeft(45);
    setCanResend(false);
    setError('');
    setAttemptsLeft(5);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-ink mb-1">Check your email</h3>
        <p className="text-sm text-gray-600">We sent a code to <span className="font-medium">{email}</span></p>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-3">Enter verification code</label>
        <div className="flex gap-2 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => inputRefs.current[index] = el}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleBackspace(index, e)}
              disabled={isLoading}
              className="w-12 h-12 text-center text-lg font-semibold border-2 border-border rounded-lg bg-background text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            />
          ))}
        </div>

        {error && (
          <p className="text-accent text-sm mt-3 text-center">
            {error} — {attemptsLeft} attempts left
          </p>
        )}
      </div>

      <div className="space-y-3">
        <div className="text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={isLoading}
              className="text-primary font-medium hover:text-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              Resend code
            </button>
          ) : (
            <p className="text-sm text-gray-600">
              Resend code in <span className="font-semibold">{formatTime(timeLeft)}</span>
            </p>
          )}
        </div>
      </div>

      <button
        onClick={onBack}
        disabled={isLoading}
        className="w-full px-4 py-2 text-primary font-medium hover:bg-primary/5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Back
      </button>
    </div>
  );
}

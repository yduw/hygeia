import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactSchema = z.object({
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().regex(/^\(\d{3}\)\d{3}-\d{4}$/, 'Invalid phone number format').optional().or(z.literal(''))
}).refine((data) => data.email || data.phone, {
  message: "Please enter either an email address or phone number",
  path: ["email"]
});

const otpSchema = z.object({
  otp: z.array(z.string()).length(6).refine((arr) => arr.every(digit => /^\d$/.test(digit)), {
    message: "Please enter a valid 6-digit code"
  })
});

type ContactFormData = z.infer<typeof contactSchema>;
type OTPFormData = z.infer<typeof otpSchema>;

const PASForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [contactMethod, setContactMethod] = useState<'email' | 'phone' | ''>('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [domainStyle, setDomainStyle] = useState('style2');
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: '',
      phone: ''
    }
  });

  useEffect(() => {
    // Get domain styling
    const domain = window.location.origin;
    const style = getDomainStyle(domain);
    setDomainStyle(style);
    
    // Add body class for background styling
    document.body.classList.add(style);
    
    return () => {
      // Clean up body class
      document.body.classList.remove(style);
    };
  }, []);

  const getDomainStyle = (domain: string): string => {
    switch (domain) {
      case "http://localhost:3000":
      case "http://localhost:3001":
        return "style2";
      case "https://form.moms.abreastpumpandmore.com":
      case "https://form.abreastpumpandmore.com":
        return "style1";
      case "https://form.hygeiahealth.com":
        return "style2";
      case "https://form.momsgetmore.com":
        return "style3";
      default:
        return "style2";
    }
  };

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)})${digits.slice(3)}`;
    return `(${digits.slice(0, 3)})${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    contactForm.setValue('phone', formatted);
  };

  const requestOTP = async (data: ContactFormData) => {
    setSubmitting(true);
    setError('');

    // Determine contact method and payload
    let method: 'email' | 'phone';
    let payload: { email?: string; phone?: string };

    if (data.email && !data.phone) {
      method = 'email';
      payload = { email: data.email };
    } else if (data.phone && !data.email) {
      method = 'phone';
      payload = { phone: data.phone };
    } else if (data.email && data.phone) {
      // If both provided, prefer email
      method = 'email';
      payload = { email: data.email };
    } else {
      setError('Please enter either an email address or phone number');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/PAS/RequestOTP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        setStep(2);
        setContactMethod(method);
        alert(`OTP code sent to your ${method}. Check console for development OTP.`);
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (err) {
      console.error('Error requesting OTP:', err);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const validateOTP = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP code');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/PAS/ValidateOTP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          otp: parseInt(otpCode)
        })
      });

      const result = await response.json();

      if (response.ok && result.vid) {
        // Redirect to Medi-Cal PAS page with contact ID
        alert(`OTP verified successfully! Contact ID: ${result.vid}. In production, this would redirect to: https://www.hygeiahealth.com/medi-cal-pas/?contactId=${result.vid}`);
        // For development, redirect to home page
        navigate('/');
      } else {
        throw new Error(result.message || 'Invalid OTP code');
      }
    } catch (err) {
      console.error('Error validating OTP:', err);
      setError('Invalid OTP code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto focus to next input
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const goBack = () => {
    setStep(1);
    setOtp(['', '', '', '', '', '']);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Loading Spinner */}
          {submitting && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-500"></div>
            </div>
          )}

          {step === 1 ? (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Parts and Accessories Request</h1>
              <p className="text-gray-600 mb-6">Enter your email or phone number to request a verification code.</p>
              
              <form onSubmit={contactForm.handleSubmit(requestOTP)} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="name@server.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    {...contactForm.register('email')}
                  />
                  <p className="text-sm text-gray-500 mt-1">Enter your email address</p>
                  {contactForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">{contactForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="text-center text-gray-500 font-semibold">
                  OR
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    placeholder="(555)123-4567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    {...contactForm.register('phone')}
                    onChange={handlePhoneChange}
                  />
                  <p className="text-sm text-gray-500 mt-1">Enter your phone number</p>
                  {contactForm.formState.errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{contactForm.formState.errors.phone.message}</p>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <button
                    type="submit"
                    disabled={submitting || (!contactForm.watch('email') && !contactForm.watch('phone'))}
                    className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition duration-200"
                  >
                    {submitting ? 'Sending...' : 'Send Verification Code'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Enter Verification Code</h1>
              <p className="text-gray-600 mb-6">
                We've sent a 6-digit verification code to your {contactMethod}.
              </p>
              
              <form onSubmit={(e) => { e.preventDefault(); validateOTP(); }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                    Verification Code
                  </label>
                  <div className="flex justify-center space-x-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => otpRefs.current[index] = el}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Enter the 6-digit code sent to your {contactMethod}
                  </p>
                </div>

                <div className="flex space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={submitting}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || otp.join('').length !== 6}
                    className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition duration-200"
                  >
                    {submitting ? 'Verifying...' : 'Verify Code'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              <button
                onClick={() => setError('')}
                className="float-right text-red-500 hover:text-red-700"
              >
                ×
              </button>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PASForm;
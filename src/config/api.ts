// API Configuration for different environments
const isDevelopment = process.env.NODE_ENV === 'development' || 
                     window.location.hostname === 'localhost' ||
                     window.location.hostname === '127.0.0.1';

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:3002/api' 
  : 'https://api2.hygeiahealth.com/api';

export const API_ENDPOINTS = {
  // Insurance endpoints (use external API in both dev and prod)
  insuranceProviders: (state: string) => `https://api2.hygeiahealth.com/api/v1/utilities/Payor/GetByState/${state}`,
  providerDetails: (provider: string) => `https://api2.hygeiahealth.com/api/v1/Utilities/Payor/GetPayorDetailsByAlias/${provider}`,
  
  // Form submission endpoints (use external API in production)
  userDetails: `${API_BASE_URL}/v1/Form/Submit/UserDetails`,
  insuranceInfo: `${API_BASE_URL}/v1/Form/Submit/InsuranceInfo`,
  confirmHygeia: `${API_BASE_URL}/v1/Form/Submit/ConfirmHygeia`,
  shippingAddress: `${API_BASE_URL}/v1/Form/Submit/ShippingAddress`,
  obInfo: `${API_BASE_URL}/v1/Form/Submit/OBInfo`,
  agreements: `${API_BASE_URL}/v1/Form/Submit/Agreements`,
  pumpPurchase: `${API_BASE_URL}/v1/Form/Payments/PumpPurchase`,
  
  // PAS endpoints (mock in production, real in development)
  pasRequestOTP: isDevelopment ? `${API_BASE_URL}/PAS/RequestOTP` : null,
  pasValidateOTP: isDevelopment ? `${API_BASE_URL}/PAS/ValidateOTP` : null,
};

// Mock functions for production PAS when no backend is available
export const mockPASService = {
  requestOTP: async (payload: { email?: string; phone?: string }) => {
    // In production, you would integrate with a real OTP service
    console.log('Mock OTP request for:', payload);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: `OTP sent to ${payload.email ? 'email' : 'phone'} (Mock)`
    };
  },
  
  validateOTP: async (payload: { otp: number }) => {
    console.log('Mock OTP validation for:', payload.otp);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation - accept 123456 as valid OTP
    if (payload.otp === 123456) {
      return {
        success: true,
        vid: `mock_${Date.now()}`,
        contactKey: 'mock-contact'
      };
    } else {
      throw new Error('Invalid OTP. Try 123456 for demo.');
    }
  }
};

export const isProductionPAS = !isDevelopment;
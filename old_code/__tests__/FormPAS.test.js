import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FormPAS from '../components/FormPAS';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock sweetalert
jest.mock('sweetalert', () => jest.fn());

describe('FormPAS Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders email and phone input fields', () => {
    render(<FormPAS />);
    
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByText(/send verification code/i)).toBeInTheDocument();
  });

  test('validates email format', async () => {
    render(<FormPAS />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  test('enables submit button when valid email is entered', () => {
    render(<FormPAS />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByText(/send verification code/i);
    
    // Initially disabled
    expect(submitButton).toBeDisabled();
    
    // Enter valid email
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    // Should be enabled
    expect(submitButton).toBeEnabled();
  });

  test('requests OTP with email and proceeds to step 2', async () => {
    mockedAxios.post.mockResolvedValueOnce({ status: 200, data: {} });
    
    render(<FormPAS />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByText(/send verification code/i);
    
    // Enter email and submit
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText(/sending.../i)).toBeInTheDocument();
    });
    
    // Should call API with correct payload
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api2.hygeiahealth.com/api/PAS/RequestOTP',
      { email: 'test@example.com' }
    );
  });

  test('shows OTP input fields after successful OTP request', async () => {
    mockedAxios.post.mockResolvedValueOnce({ status: 200, data: {} });
    
    render(<FormPAS />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByText(/send verification code/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/enter verification code/i)).toBeInTheDocument();
      expect(screen.getAllByRole('textbox')).toHaveLength(6); // 6 OTP input boxes
    });
  });

  test('validates OTP and redirects on success', async () => {
    // Mock window.location.href
    delete window.location;
    window.location = { href: '' };
    
    // Mock successful OTP validation
    mockedAxios.post.mockImplementation((url) => {
      if (url.includes('RequestOTP')) {
        return Promise.resolve({ status: 200, data: {} });
      }
      if (url.includes('ValidateOTP')) {
        return Promise.resolve({ status: 200, data: { vid: '80551501' } });
      }
    });
    
    render(<FormPAS />);
    
    // First, request OTP
    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText(/send verification code/i));
    
    // Wait for OTP step
    await waitFor(() => {
      expect(screen.getByText(/enter verification code/i)).toBeInTheDocument();
    });
    
    // Enter OTP code
    const otpInputs = screen.getAllByRole('textbox');
    otpInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: '1' } });
    });
    
    // Submit OTP
    fireEvent.click(screen.getByText(/verify code/i));
    
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api2.hygeiahealth.com/api/PAS/ValidateOTP',
        { otp: 111111 }
      );
      expect(window.location.href).toBe('https://www.hygeiahealth.com/medi-cal-pas/?contactId=80551501');
    });
  });

  test('handles API errors gracefully', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));
    
    render(<FormPAS />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByText(/send verification code/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to send otp/i)).toBeInTheDocument();
    });
  });
});

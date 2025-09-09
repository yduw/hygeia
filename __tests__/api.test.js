// API Integration Tests
// This test suite verifies that the API endpoints work correctly 
// and can properly pipe data to downstream systems (HubSpot simulation)

describe('Hygeia Health API Integration Tests', () => {
  const baseURL = 'https://api2.hygeiahealth.com/api'; // Your existing API
  
  // Test API connectivity (skip this test since it's your production API)
  test.skip('API connectivity test', async () => {
    // This would test your production API - skipped for safety
    console.log('API connectivity test skipped - production API');
  });

  // Test insurance provider lookup
  test('Insurance provider lookup by state', async () => {
    const response = await fetch(`${baseURL}/api/v1/utilities/Payor/GetByState/California`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.Error).toBe(false);
    expect(data.Data[0].Unique).toContain('Aetna');
    expect(data.Data[0].Unique).toContain('Blue Cross Blue Shield');
  });

  // Test insurance provider details
  test('Insurance provider details lookup', async () => {
    const response = await fetch(`${baseURL}/api/v1/Utilities/Payor/GetPayorDetailsByAlias/Aetna`);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.Error).toBe(false);
    expect(data.Data[0].Properties.PASRule).toHaveLength(1);
  });

  // Test user details submission (creates HubSpot contact)
  test('User details submission creates HubSpot contact', async () => {
    const userDetails = {
      email: 'test@example.com',
      phone: '555-123-4567',
      firstName: 'Test',
      lastName: 'User',
      dueDate: '2024-06-15',
      insuranceProvider: 'Aetna',
      memberID: 'TEST123456',
      dobMonth: '01',
      dobDay: '15',
      dobYear: '1990'
    };

    const response = await fetch(`${baseURL}/api/v1/Form/Submit/UserDetails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails)
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.hasError).toBe(false);
    expect(data.vid).toBeDefined();
    expect(data.dealId).toBeDefined();
  });

  // Test pump selection submission
  test('Pump selection updates HubSpot deal', async () => {
    const pumpSelection = {
      vid: '12345',
      dealId: '67890',
      pump: 'Hygeia'
    };

    const response = await fetch(`${baseURL}/api/v1/Form/Submit/ChoosePump`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pumpSelection)
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.hasError).toBe(false);
    expect(data.vid).toBe('12345');
    expect(data.dealId).toBe('67890');
  });

  // Test pump confirmation
  test('Pump confirmation completes order flow', async () => {
    const pumpConfirmation = {
      vid: '12345',
      dealId: '67890',
      pump: 'Hygeia',
      doctorMike: true
    };

    const response = await fetch(`${baseURL}/api/v1/Form/Submit/ConfirmHygeia`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pumpConfirmation)
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.hasError).toBe(false);
    expect(data.vid).toBe('12345');
    expect(data.dealId).toBe('67890');
  });

  // Test payment processing
  test('Payment processing for pump purchase', async () => {
    const paymentData = {
      vid: '12345',
      dealId: '67890',
      token: 'tok_test_12345',
      amount: 6000, // $60.00 in cents
      pumpType: 'elvie-stride'
    };

    const response = await fetch(`${baseURL}/api/v1/Form/Payments/PumpPurchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.hasError).toBe(false);
    expect(data.chargeId).toBeDefined();
    expect(data.status).toBe('succeeded');
  });

  // Test shipping details submission
  test('Shipping details update', async () => {
    const shippingDetails = {
      vid: '12345',
      dealId: '67890',
      address: '123 Test St',
      city: 'Test City',
      state: 'CA',
      zipCode: '90210'
    };

    const response = await fetch(`${baseURL}/api/v1/Form/Submit/ShippingDetails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shippingDetails)
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.hasError).toBe(false);
    expect(data.vid).toBe('12345');
    expect(data.dealId).toBe('67890');
  });

  // Test doctor details submission
  test('Doctor details update', async () => {
    const doctorDetails = {
      vid: '12345',
      dealId: '67890',
      gynFirstName: 'Dr. Jane',
      gynLastName: 'Smith',
      gynPhoneNumber: '555-987-6543'
    };

    const response = await fetch(`${baseURL}/api/v1/Form/Submit/DoctorDetails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doctorDetails)
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.hasError).toBe(false);
    expect(data.vid).toBe('12345');
    expect(data.dealId).toBe('67890');
  });

  // Test final order submission
  test('Final order submission completes flow', async () => {
    const finalOrder = {
      vid: '12345',
      dealId: '67890',
      agreementAccepted: true
    };

    const response = await fetch(`${baseURL}/api/v1/Form/Submit/FinalOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalOrder)
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.hasError).toBe(false);
    expect(data.vid).toBe('12345');
    expect(data.dealId).toBe('67890');
  });

  // Test error handling - missing agreement
  test('Final order requires agreement acceptance', async () => {
    const finalOrder = {
      vid: '12345',
      dealId: '67890',
      agreementAccepted: false
    };

    const response = await fetch(`${baseURL}/api/v1/Form/Submit/FinalOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalOrder)
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.hasError).toBe(true);
    expect(data.message).toContain('Agreement must be accepted');
  });

  // Integration test - Full order flow
  test('Complete order flow integration', async () => {
    // Step 1: Create user details
    const userDetails = {
      email: 'integration@test.com',
      phone: '555-999-8888',
      firstName: 'Integration',
      lastName: 'Test',
      dueDate: '2024-08-15',
      insuranceProvider: 'Blue Cross Blue Shield',
      memberID: 'INTEGRATION123',
      dobMonth: '03',
      dobDay: '20',
      dobYear: '1992'
    };

    const userResponse = await fetch(`${baseURL}/api/v1/Form/Submit/UserDetails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userDetails)
    });

    const userData = await userResponse.json();
    expect(userData.hasError).toBe(false);

    const vid = userData.vid;
    const dealId = userData.dealId;

    // Step 2: Select pump
    const pumpResponse = await fetch(`${baseURL}/api/v1/Form/Submit/ChoosePump`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vid, dealId, pump: 'Spectra S2' })
    });

    const pumpData = await pumpResponse.json();
    expect(pumpData.hasError).toBe(false);

    // Step 3: Add shipping details
    const shippingResponse = await fetch(`${baseURL}/api/v1/Form/Submit/ShippingDetails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        vid, dealId, 
        address: '456 Integration Ave', 
        city: 'Test Town', 
        state: 'NY', 
        zipCode: '10001' 
      })
    });

    const shippingData = await shippingResponse.json();
    expect(shippingData.hasError).toBe(false);

    // Step 4: Add doctor details
    const doctorResponse = await fetch(`${baseURL}/api/v1/Form/Submit/DoctorDetails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        vid, dealId, 
        gynFirstName: 'Dr. Test', 
        gynLastName: 'Doctor', 
        gynPhoneNumber: '555-111-2222' 
      })
    });

    const doctorData = await doctorResponse.json();
    expect(doctorData.hasError).toBe(false);

    // Step 5: Complete order
    const finalResponse = await fetch(`${baseURL}/api/v1/Form/Submit/FinalOrder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vid, dealId, agreementAccepted: true })
    });

    const finalData = await finalResponse.json();
    expect(finalData.hasError).toBe(false);
  });
});
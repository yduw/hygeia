import { serve } from "bun";
import index from "./index.html";

// HubSpot API helper (placeholder for real integration)
async function createHubSpotContact(contactData: any) {
  // This would integrate with HubSpot API
  // For now, returning mock response
  console.log("Creating HubSpot contact:", contactData);
  
  // Mock HubSpot response
  return {
    vid: Date.now().toString(),
    dealId: (Date.now() + 1000).toString(),
    hasError: false
  };
}

async function updateHubSpotDeal(dealData: any) {
  // This would update HubSpot deal
  console.log("Updating HubSpot deal:", dealData);
  
  return {
    vid: dealData.vid,
    dealId: dealData.dealId,
    hasError: false
  };
}

async function processStripePayment(paymentData: any) {
  // This would integrate with Stripe
  console.log("Processing Stripe payment:", paymentData);
  
  return {
    hasError: false,
    chargeId: "ch_" + Date.now(),
    status: "succeeded"
  };
}

// Mock insurance providers by state
const insuranceProviders = {
  "California": ["Aetna", "Anthem Blue Cross", "Blue Cross Blue Shield", "Cigna", "Health Net", "Kaiser Permanente"],
  "Texas": ["Aetna", "Blue Cross Blue Shield of Texas", "Cigna", "Humana", "UnitedHealthcare"],
  "New York": ["Aetna", "Blue Cross Blue Shield", "Cigna", "Empire BlueCross BlueShield", "Fidelis Care"],
  "Florida": ["Aetna", "Blue Cross Blue Shield of Florida", "Cigna", "Florida Blue", "Humana", "UnitedHealthcare"],
  // Add more states as needed
};

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    // Insurance provider lookup by state
    "/api/v1/utilities/Payor/GetByState/:state": async (req) => {
      const state = req.params.state;
      const providers = insuranceProviders[state] || ["Aetna", "Blue Cross Blue Shield", "Cigna", "UnitedHealthcare"];
      
      return Response.json({
        Data: [{
          Unique: providers
        }],
        Error: false
      });
    },

    // Insurance provider details by alias
    "/api/v1/Utilities/Payor/GetPayorDetailsByAlias/:provider": async (req) => {
      const provider = req.params.provider;
      
      // Mock provider information
      const providerInfo = {
        Properties: {
          PASRule: [{
            requiresPAS: provider.toLowerCase().includes("medicaid"),
            description: "Prior Authorization required for Medicaid plans"
          }]
        }
      };

      return Response.json({
        Data: [providerInfo],
        Error: false
      });
    },

    // Form submission - Choose Pump
    "/api/v1/Form/Submit/ChoosePump": {
      async POST(req) {
        try {
          const data = await req.json();
          const { vid, dealId, pump } = data;
          
          // Update HubSpot deal with pump choice
          const result = await updateHubSpotDeal({
            vid,
            dealId,
            breastPumpBrand: pump
          });
          
          return Response.json(result);
        } catch (error) {
          console.error("Error in ChoosePump:", error);
          return Response.json({
            hasError: true,
            message: "Failed to process pump selection"
          });
        }
      }
    },

    // Form submission - Confirm Hygeia or other pump
    "/api/v1/Form/Submit/ConfirmHygeia": {
      async POST(req) {
        try {
          const data = await req.json();
          const { vid, dealId, pump, doctorMike } = data;
          
          // Update HubSpot deal with final pump selection
          const result = await updateHubSpotDeal({
            vid,
            dealId,
            breastPumpBrand: pump,
            doctorMike: doctorMike ? "true" : "false",
            formStep: 8 // Mark as completed
          });
          
          return Response.json(result);
        } catch (error) {
          console.error("Error in ConfirmHygeia:", error);
          return Response.json({
            hasError: true,
            message: "Failed to confirm pump selection"
          });
        }
      }
    },

    // Payment processing for pump purchases
    "/api/v1/Form/Payments/PumpPurchase": {
      async POST(req) {
        try {
          const data = await req.json();
          const { vid, dealId, token, amount, pumpType } = data;
          
          // Process Stripe payment
          const paymentResult = await processStripePayment({
            token,
            amount,
            description: `Breast pump purchase: ${pumpType}`
          });
          
          if (!paymentResult.hasError) {
            // Update HubSpot deal with payment info
            await updateHubSpotDeal({
              vid,
              dealId,
              pumpType,
              paymentAmount: amount,
              paymentStatus: "completed",
              chargeId: paymentResult.chargeId
            });
          }
          
          return Response.json(paymentResult);
        } catch (error) {
          console.error("Error in PumpPurchase:", error);
          return Response.json({
            hasError: true,
            message: "Payment processing failed"
          });
        }
      }
    },

    // Order form submission - User details
    "/api/v1/Form/Submit/UserDetails": {
      async POST(req) {
        try {
          const data = await req.json();
          const { email, phone, firstName, lastName, dueDate, insuranceProvider, memberID, dobMonth, dobDay, dobYear } = data;
          
          // Create HubSpot contact and deal
          const result = await createHubSpotContact({
            email,
            phone,
            firstName,
            lastName,
            dueDate,
            insurance: insuranceProvider,
            memberId: memberID,
            expectedMothersDateOfBirth: `${dobMonth}/${dobDay}/${dobYear}`,
            formStep: 1
          });
          
          return Response.json(result);
        } catch (error) {
          console.error("Error in UserDetails:", error);
          return Response.json({
            hasError: true,
            message: "Failed to create user profile"
          });
        }
      }
    },

    // Order form submission - Shipping details
    "/api/v1/Form/Submit/ShippingDetails": {
      async POST(req) {
        try {
          const data = await req.json();
          const { vid, dealId, address, city, state, zipCode } = data;
          
          const result = await updateHubSpotDeal({
            vid,
            dealId,
            shippingAddress: address,
            shippingCity: city,
            shippingState: state,
            shippingZipCode: zipCode,
            formStep: 6
          });
          
          return Response.json(result);
        } catch (error) {
          console.error("Error in ShippingDetails:", error);
          return Response.json({
            hasError: true,
            message: "Failed to update shipping details"
          });
        }
      }
    },

    // Order form submission - Doctor details
    "/api/v1/Form/Submit/DoctorDetails": {
      async POST(req) {
        try {
          const data = await req.json();
          const { vid, dealId, gynFirstName, gynLastName, gynPhoneNumber } = data;
          
          const result = await updateHubSpotDeal({
            vid,
            dealId,
            obGynFirstName: gynFirstName,
            obGynLastName: gynLastName,
            obGymPhoneNumber: gynPhoneNumber,
            formStep: 7
          });
          
          return Response.json(result);
        } catch (error) {
          console.error("Error in DoctorDetails:", error);
          return Response.json({
            hasError: true,
            message: "Failed to update doctor details"
          });
        }
      }
    },

    // Final order submission
    "/api/v1/Form/Submit/FinalOrder": {
      async POST(req) {
        try {
          const data = await req.json();
          const { vid, dealId, agreementAccepted } = data;
          
          if (!agreementAccepted) {
            return Response.json({
              hasError: true,
              message: "Agreement must be accepted to complete order"
            });
          }
          
          const result = await updateHubSpotDeal({
            vid,
            dealId,
            agreementAccepted: true,
            formStep: 8, // Final step
            orderStatus: "submitted"
          });
          
          return Response.json(result);
        } catch (error) {
          console.error("Error in FinalOrder:", error);
          return Response.json({
            hasError: true,
            message: "Failed to complete order"
          });
        }
      }
    },

    // PAS OTP Request
    "/api/PAS/RequestOTP": {
      async POST(req) {
        try {
          const data = await req.json();
          const { email, phone } = data;
          
          // Generate a 6-digit OTP
          const otp = Math.floor(100000 + Math.random() * 900000);
          
          // Store OTP temporarily (in production, use Redis or database)
          // For now, we'll store in memory with timestamp
          const contactKey = email || phone;
          global.otpStore = global.otpStore || new Map();
          global.otpStore.set(contactKey, {
            otp,
            timestamp: Date.now(),
            expires: Date.now() + (10 * 60 * 1000) // 10 minutes
          });
          
          // In production, send actual email/SMS here
          console.log(`OTP for ${contactKey}: ${otp}`);
          
          return Response.json({
            success: true,
            message: `OTP sent to ${email ? 'email' : 'phone'}`
          });
        } catch (error) {
          console.error("Error in RequestOTP:", error);
          return Response.json({
            hasError: true,
            message: "Failed to send OTP"
          }, { status: 500 });
        }
      }
    },

    // PAS OTP Validation
    "/api/PAS/ValidateOTP": {
      async POST(req) {
        try {
          const data = await req.json();
          const { otp } = data;
          
          // Check OTP against stored values
          global.otpStore = global.otpStore || new Map();
          let isValid = false;
          let contactKey = '';
          
          for (const [key, storedData] of global.otpStore.entries()) {
            if (storedData.otp === otp && storedData.expires > Date.now()) {
              isValid = true;
              contactKey = key;
              // Clean up used OTP
              global.otpStore.delete(key);
              break;
            }
          }
          
          if (isValid) {
            // Generate mock vid for PAS redirection
            const vid = `pas_${Date.now()}`;
            
            return Response.json({
              success: true,
              vid: vid,
              contactKey: contactKey
            });
          } else {
            return Response.json({
              hasError: true,
              message: "Invalid or expired OTP code"
            }, { status: 400 });
          }
        } catch (error) {
          console.error("Error in ValidateOTP:", error);
          return Response.json({
            hasError: true,
            message: "Failed to validate OTP"
          }, { status: 500 });
        }
      }
    },

    // Test endpoint for API connectivity
    "/api/test": {
      async GET(req) {
        return Response.json({
          message: "API is working!",
          timestamp: new Date().toISOString(),
          endpoints: [
            "/api/v1/utilities/Payor/GetByState/{state}",
            "/api/v1/Utilities/Payor/GetPayorDetailsByAlias/{provider}",
            "/api/v1/Form/Submit/ChoosePump",
            "/api/v1/Form/Submit/ConfirmHygeia",
            "/api/v1/Form/Payments/PumpPurchase",
            "/api/v1/Form/Submit/UserDetails",
            "/api/v1/Form/Submit/ShippingDetails",
            "/api/v1/Form/Submit/DoctorDetails",
            "/api/v1/Form/Submit/FinalOrder",
            "/api/PAS/RequestOTP",
            "/api/PAS/ValidateOTP"
          ]
        });
      }
    }
  },

  development: process.env.NODE_ENV !== "production",
});

console.log(`🚀 Server running at ${server.url}`);

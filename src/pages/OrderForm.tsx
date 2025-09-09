import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, CheckCircle, CreditCard } from "lucide-react";
import hygeiaLogo from "../assets/hygeia_logo.png";

const orderSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
  groupNumber: z.string().min(1, "Group number is required"),
  planName: z.string().min(1, "Plan name is required"),
  dueDate: z.string().min(1, "Due date is required"),
  physicianName: z.string().min(1, "Physician name is required"),
  physicianPhone: z.string().min(10, "Valid phone number is required"),
  physicianFax: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Valid zip code is required"),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  billingZip: z.string().optional(),
  finalSaleAcknowledgment: z.boolean().refine((val) => val === true, {
    message: "You must acknowledge the final sale policy",
  }),
  insuranceBillingConsent: z.boolean().refine((val) => val === true, {
    message: "You must consent to insurance billing",
  }),
  physicianContactConsent: z.boolean().refine((val) => val === true, {
    message: "You must consent to physician contact authorization",
  }),
});

type OrderFormData = z.infer<typeof orderSchema>;

export default function OrderForm() {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Insurance Plan");
  
  useEffect(() => {
    const savedPlan = localStorage.getItem("selectedInsurancePlan");
    if (savedPlan) {
      setSelectedPlan(savedPlan);
    } else if (location.state?.selectedPlan) {
      setSelectedPlan(location.state.selectedPlan);
    }
  }, [location.state]);
  
  const product = location.state?.product || { name: "Breast Pump", isUpgrade: false, upgradePrice: 0 };

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      finalSaleAcknowledgment: false,
      insuranceBillingConsent: false,
      physicianContactConsent: false,
    }
  });

  const fillDevData = () => {
    form.setValue("memberId", "12345678");
    form.setValue("groupNumber", "GRP123456");
    form.setValue("planName", "BlueCross BlueShield PPO");
    form.setValue("dueDate", "2024-12-01");
    form.setValue("physicianName", "Dr. Jane Smith");
    form.setValue("physicianPhone", "555-123-4567");
    form.setValue("physicianFax", "555-123-4568");
    form.setValue("firstName", "Sarah");
    form.setValue("lastName", "Johnson");
    form.setValue("email", "sarah.johnson@email.com");
    form.setValue("phone", "555-987-6543");
    form.setValue("address", "123 Main Street, Apt 4B");
    form.setValue("city", "Los Angeles");
    form.setValue("state", "CA");
    form.setValue("zipCode", "90210");
    if (product.isUpgrade) {
      form.setValue("cardNumber", "4111111111111111");
      form.setValue("expiryDate", "12/26");
      form.setValue("cvv", "123");
      form.setValue("billingZip", "90210");
    }
    form.setValue("finalSaleAcknowledgment", true);
    form.setValue("insuranceBillingConsent", true);
    form.setValue("physicianContactConsent", true);
  };

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Order submitted:", data);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="max-w-md mx-auto border border-gray-200">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#192866] mb-2">Order Submitted Successfully</h2>
            <p className="text-gray-700 mb-4">
              Your order has been received and is being processed. We'll contact your physician and verify your insurance coverage.
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Processing time: 4-7 business days<br />
              You'll receive a confirmation email shortly.
            </p>
            <Button 
              onClick={() => navigate("/")} 
              className="bg-blue-400 hover:bg-blue-500 text-white"
            >
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <img 
                  src={hygeiaLogo} 
                  alt="Hygeia Health" 
                  className="w-24 h-24 object-contain"
                />
              </div>
              <div className="flex items-center header-phone text-gray-700">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                (714) 515-7571
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <button 
                onClick={() => navigate("/")}
                className="bg-red-400 hover:bg-red-500 text-white px-6 py-3 rounded-md text-lg font-semibold transition-colors cursor-pointer"
              >
                Reorder Supplies
              </button>
              <a 
                href="https://status.hygeiahealth.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-3 rounded-md text-lg font-semibold transition-colors cursor-pointer"
              >
                Track Order
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3 border-b border-gray-100">
        <div className="flex items-center text-sm text-gray-600">
          <button 
            onClick={() => navigate("/")}
            className="text-[#192866] hover:underline"
          >
            Breast Pumps
          </button>
          <span className="mx-2">&gt;</span>
          <span className="text-[#192866] font-medium">Order Form</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(`/product/${productId}`, { state: { selectedPlan } })}
            className="text-[#192866] hover:text-[#192866] hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Product
          </Button>
          
          <Button 
            onClick={fillDevData}
            variant="outline"
            size="sm"
            className="bg-yellow-100 border-yellow-400 text-yellow-800 hover:bg-yellow-200"
          >
            🧪 Fill Dev Data
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium ${
                  step <= currentStep ? 'bg-blue-400 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    step <= currentStep ? 'text-[#192866]' : 'text-gray-500'
                  }`}>
                    {step === 1 && "Insurance Information"}
                    {step === 2 && "Personal & Physician"}
                    {step === 3 && "Payment & Submit"}
                  </p>
                </div>
                {step < 3 && (
                  <div className="w-16 h-px bg-gray-300 mx-6"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <Card className="mb-8 border border-gray-200">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-[#192866]">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-[#192866]">{product.name}</h3>
                <p className="text-sm text-gray-600">Insurance Plan: {selectedPlan}</p>
              </div>
              <div className="text-right">
                {product.isUpgrade ? (
                  <p className="font-medium text-orange-700">
                    Upgrade Fee: ${product.upgradePrice}
                  </p>
                ) : (
                  <p className="font-medium text-green-700">
                    Covered by Insurance
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Step 1: Insurance Information */}
            {currentStep === 1 && (
              <Card className="border border-gray-200">
                <CardHeader className="bg-gray-50">
                  <CardTitle className="text-[#192866]">Step 1: Insurance Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="memberId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Member ID *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="As shown on insurance card" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="groupNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Group Number *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Group number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="planName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plan Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Exact plan name as shown on card" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date or Baby's Birth Date *</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={nextStep} 
                      type="button" 
                      className="bg-red-400 hover:bg-red-500 text-white"
                    >
                      Next Step
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Personal & Physician Information */}
            {currentStep === 2 && (
              <Card className="border border-gray-200">
                <CardHeader className="bg-gray-50">
                  <CardTitle className="text-[#192866]">Step 2: Personal & Physician Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-[#192866] mb-4">Physician Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="physicianName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Physician Name *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Dr. Full Name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="physicianPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Physician Phone *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="(555) 123-4567" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="physicianFax"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Physician Fax (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="(555) 123-4567" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-[#192866] mb-4">Personal & Shipping Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name *</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name *</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone *</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Address *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City *</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State *</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip Code *</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button 
                      onClick={prevStep} 
                      type="button" 
                      variant="outline"
                      className="border-blue-400 text-blue-500 hover:bg-blue-400 hover:text-white"
                    >
                      Previous
                    </Button>
                    <Button 
                      onClick={nextStep} 
                      type="button" 
                      className="bg-red-400 hover:bg-red-500 text-white"
                    >
                      Next Step
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment & Confirmation */}
            {currentStep === 3 && (
              <Card className="border border-gray-200">
                <CardHeader className="bg-gray-50">
                  <CardTitle className="text-[#192866]">Step 3: Payment & Confirmation</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {product.isUpgrade && (
                    <div>
                      <h3 className="text-lg font-medium text-[#192866] mb-4 flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Payment Information
                      </h3>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                        <p className="text-orange-800 font-medium">
                          Upgrade Fee: ${product.upgradePrice}
                        </p>
                        <p className="text-sm text-orange-600">
                          This amount will be charged to your credit card.
                        </p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Number</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="1234 5678 9012 3456" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="expiryDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="MM/YY" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-medium text-[#192866] mb-4">Required Acknowledgements</h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="finalSaleAcknowledgment"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm leading-relaxed">
                              I understand that breast pumps are personal hygiene products and all sales are final with no returns accepted. *
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="insuranceBillingConsent"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm leading-relaxed">
                              I authorize Hygeia Health to bill my insurance company for this breast pump. *
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="physicianContactConsent"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm leading-relaxed">
                              I authorize Hygeia Health to contact my physician to obtain necessary documentation. *
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button 
                      onClick={prevStep} 
                      type="button" 
                      variant="outline"
                      className="border-blue-400 text-blue-500 hover:bg-blue-400 hover:text-white"
                    >
                      Previous
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-red-400 hover:bg-red-500 text-white"
                    >
                      {isSubmitting ? "Submitting Order..." : "Submit Order"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </Form>
      </div>

      {/* Footer */}
      <footer className="bg-[#192866] text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white text-sm mb-4 md:mb-0">
              © 2025 Hygeia Health. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-white">
              <a href="https://hygeiahealth.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition-colors">Privacy Policy</a>
              <a href="http://hygeiahealth.com/terms-of-use/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition-colors">Terms of Service</a>
              <a href="https://hygeiahealth.com/hipaa/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition-colors">HIPAA Notice</a>
              <a href="https://hygeiahealth.com/warranty-returns/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition-colors">Warranty Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, ArrowLeft, Clock, Truck, Shield, AlertCircle } from "lucide-react";
import hygeiaLogo from "../assets/hygeia_logo.png";

export default function PlanInfoPage() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const decodedPlanId = decodeURIComponent(planId || "");

  const handleContinue = () => {
    navigate("/products", { state: { selectedPlan: decodedPlanId } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <img 
                src={hygeiaLogo} 
                alt="Hygeia Health" 
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-2xl font-bold text-gray-900">Hygeia Health</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Plan Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {decodedPlanId}
          </h2>
          <p className="text-gray-600">Important information about ordering your breast pump</p>
        </div>

        {/* Important Notice */}
        <Alert className="mb-8 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Please enter your insurance plan information exactly as it appears on your insurance card when completing your order.
          </AlertDescription>
        </Alert>

        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Insurance Coverage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                Most insurance plans require a physician's order for breast pump coverage.
              </p>
              <p className="text-sm text-gray-600">
                <strong>We'll handle the paperwork:</strong> Hygeia Health will contact your physician to provide the necessary documentation and obtain any required prescriptions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-green-600" />
                Ordering Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                You can request your breast pump any time before your due date.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Processing time:</strong> Please allow 4-7 business days from your order date to receive your breast pump.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2 text-purple-600" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                You'll receive a shipping notification with tracking information once your order ships.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Delivery time:</strong> Shipping takes 3-5 business days after your order is processed and ships.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                Return Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                <strong>Important:</strong> Breast pumps are personal hygiene products.
              </p>
              <p className="text-sm text-gray-600 font-medium">
                All sales are final and no returns are accepted for health and safety reasons.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Process Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What Happens Next</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-pink-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-pink-600 font-medium text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium">Select Your Breast Pump</p>
                  <p className="text-sm text-gray-600">Browse available pumps covered by your insurance plan.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-medium text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium">Complete Your Order</p>
                  <p className="text-sm text-gray-600">Provide your insurance information and physician details.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 font-medium text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium">We Handle the Rest</p>
                  <p className="text-sm text-gray-600">We contact your physician and verify your insurance coverage.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 font-medium text-sm">4</span>
                </div>
                <div>
                  <p className="font-medium">Receive Your Pump</p>
                  <p className="text-sm text-gray-600">Your breast pump is shipped directly to your address.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="text-center">
          <Button 
            onClick={handleContinue}
            size="lg"
            className="bg-blue-400 hover:bg-blue-500 text-white px-8 py-3"
          >
            Select Breast Pump
          </Button>
        </div>
      </div>
    </div>
  );
}
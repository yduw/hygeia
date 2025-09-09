import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Heart, Shield, Baby } from "lucide-react";
import hygeiaLogo from "../assets/hygeia_logo.png";

const INSURANCE_PROVIDERS = [
  "Aetna",
  "Anthem Blue Cross Blue Shield",
  "Blue Cross Blue Shield",
  "Cigna",
  "Humana",
  "Kaiser Permanente",
  "Medicaid",
  "Medicare",
  "Molina Healthcare",
  "UnitedHealthcare",
  "OTHER/PLAN NOT LISTED"
];

export default function HomePage() {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const filteredProviders = INSURANCE_PROVIDERS.filter(provider =>
    provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlanSelection = () => {
    if (selectedPlan) {
      setIsModalOpen(false);
      navigate(`/plan-info/${encodeURIComponent(selectedPlan)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img 
                src={hygeiaLogo} 
                alt="Hygeia Health" 
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-2xl font-bold text-gray-900">Hygeia Health</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Support</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Your Breast Pump Through Insurance Advocate
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We make it easy to get the breast pump you need through your insurance benefit. 
            No hassle, no paperwork, no stress. Just the support you deserve.
          </p>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 text-lg">
                Get Started
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Select Your Insurance Provider</DialogTitle>
                <DialogDescription>
                  Choose your insurance plan to see available breast pumps covered by your benefits.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Search insurance providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your insurance plan" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {filteredProviders.map((provider) => (
                      <SelectItem key={provider} value={provider}>
                        {provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handlePlanSelection} 
                  disabled={!selectedPlan}
                  className="w-full bg-pink-600 hover:bg-pink-700"
                >
                  OK
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Insurance Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We work directly with your insurance provider to verify coverage and handle all the paperwork.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Baby className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                <CardTitle>Expert Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our team of specialists helps you choose the right breast pump for your needs and lifestyle.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Heart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Fast Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get your breast pump delivered to your door in 4-7 business days, with tracking included.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-pink-600 font-bold text-xl">1</span>
              </div>
              <h4 className="font-semibold mb-2">Select Insurance</h4>
              <p className="text-gray-600">Choose your insurance provider from our comprehensive list.</p>
            </div>
            <div>
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">2</span>
              </div>
              <h4 className="font-semibold mb-2">Browse Pumps</h4>
              <p className="text-gray-600">See which breast pumps are covered by your insurance plan.</p>
            </div>
            <div>
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-xl">3</span>
              </div>
              <h4 className="font-semibold mb-2">Place Order</h4>
              <p className="text-gray-600">Complete your order with insurance and shipping information.</p>
            </div>
            <div>
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-xl">4</span>
              </div>
              <h4 className="font-semibold mb-2">Receive Pump</h4>
              <p className="text-gray-600">Your breast pump is delivered directly to your door.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img 
              src={hygeiaLogo} 
              alt="Hygeia Health" 
              className="w-6 h-6 object-contain"
            />
            <span className="text-xl font-semibold">Hygeia Health</span>
          </div>
          <p className="text-gray-400">Supporting mothers through every step of their journey.</p>
        </div>
      </footer>
    </div>
  );
}
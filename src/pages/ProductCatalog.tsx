import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import hygeiaLogo from "../assets/hygeia_logo.png";
import medelaMaxflowImg from "../assets/medela-maxflow.png";
import spectraS2Img from "../assets/spectra_s2-pump.jpg";
import spectraSynergyImg from "../assets/Spectra_Synergy_Gold.jpg";
import amedaPurelyImg from "../assets/Ameda_Purely_Yours_Ultra.jpg";
import lansinohSmartImg from "../assets/Lansinoh_SmartPump.jpg";
import motifLunaImg from "../assets/Motif_Luna.jpg";
import elviePumpImg from "../assets/Elvie_Pump.jpg";
import willowGoImg from "../assets/Willow_Go.jpg";
import babyBuddhaImg from "../assets/Baby_Buddha.jpg";

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

const BREAST_PUMPS = [
  {
    id: 1,
    name: "Medela Pump in Style Advanced",
    model: "MaxFlow-PF",
    image: medelaMaxflowImg,
    isUpgrade: false,
    upgradePrice: 0,
    brand: "Medela",
    manufacturer: "MEDELA",
    batteryIncluded: true,
    carryBagIncluded: true,
  },
  {
    id: 2,
    name: "Spectra S1 Plus Electric Pump",
    model: "S2-HG",
    image: spectraS2Img, 
    isUpgrade: false,
    upgradePrice: 0,
    brand: "Spectra Baby USA",
    manufacturer: "SPECTRA BABY USA",
    batteryIncluded: true,
    carryBagIncluded: true,
  },
  {
    id: 3,
    name: "Spectra Synergy Gold Portable",
    model: "SG-PORT",
    image: spectraSynergyImg,
    isUpgrade: true,
    upgradePrice: 89.99,
    brand: "Spectra Baby USA",
    manufacturer: "SPECTRA BABY USA",
    batteryIncluded: true,
    carryBagIncluded: true,
  },
  {
    id: 4,
    name: "Ameda Purely Yours Ultra",
    model: "AMJ-DE",
    image: amedaPurelyImg,
    isUpgrade: false,
    upgradePrice: 0,
    brand: "Ameda®",
    manufacturer: "AMEDA INC.",
    batteryIncluded: false,
    carryBagIncluded: true,
  },
  {
    id: 5,
    name: "Lansinoh SmartPump 2.0",
    model: "HE-WEAR",
    image: lansinohSmartImg,
    isUpgrade: true,
    upgradePrice: 129.99,
    brand: "Lansinoh®",
    manufacturer: "LANSINOH",
    batteryIncluded: true,
    carryBagIncluded: false,
  },
  {
    id: 6,
    name: "Motif Luna Electric Breast Pump",
    model: "FIT300-HG",
    image: motifLunaImg,
    isUpgrade: false,
    upgradePrice: 0,
    brand: "Motif Medical",
    manufacturer: "MOTIF MEDICAL",
    batteryIncluded: false,
    carryBagIncluded: false,
  },
  {
    id: 7,
    name: "Elvie Stride Wearable",
    model: "ES-WEAR",
    image: elviePumpImg,
    isUpgrade: true,
    upgradePrice: 249.99,
    brand: "Elvie",
    manufacturer: "ELVIE",
    batteryIncluded: true,
    carryBagIncluded: true,
  },
  {
    id: 8,
    name: "Willow Go Wearable Breast Pump",
    model: "MS12-PRO",
    image: willowGoImg,
    isUpgrade: true,
    upgradePrice: 199.99,
    brand: "Willow",
    manufacturer: "WILLOW INNOVATIONS",
    batteryIncluded: true,
    carryBagIncluded: true,
  },
  {
    id: 9,
    name: "Philips Avent Double Electric",
    model: "M5-PORT",
    image: babyBuddhaImg,
    isUpgrade: false,
    upgradePrice: 0,
    brand: "Philips Avent",
    manufacturer: "PHILIPS HEALTHCARE",
    batteryIncluded: false,
    carryBagIncluded: false,
  },
  {
    id: 10,
    name: "Freemie Independence II",
    model: "FII-001",
    image: medelaMaxflowImg,
    isUpgrade: true,
    upgradePrice: 159.99,
    brand: "Freemie",
    manufacturer: "DAO HEALTH",
    batteryIncluded: true,
    carryBagIncluded: true,
  },
  {
    id: 11,
    name: "Evenflo Advanced Double Electric",
    model: "EV-ADE",
    image: spectraS2Img,
    isUpgrade: false,
    upgradePrice: 0,
    brand: "Evenflo ®",
    manufacturer: "EVENFLO FEEDING",
    batteryIncluded: false,
    carryBagIncluded: true,
  },
  {
    id: 12,
    name: "Freemie Liberty II",
    model: "FLII-002",
    image: spectraSynergyImg,
    isUpgrade: true,
    upgradePrice: 89.99,
    brand: "Freemie",
    manufacturer: "DAO HEALTH",
    batteryIncluded: true,
    carryBagIncluded: false,
  },
  {
    id: 13,
    name: "UNIMOM Opera Breast Pump",
    model: "UNOP-001",
    image: amedaPurelyImg,
    isUpgrade: false,
    upgradePrice: 0,
    brand: "UNIMOM",
    manufacturer: "UNIMOM",
    batteryIncluded: false,
    carryBagIncluded: false,
  },
  {
    id: 14,
    name: "Ameda Mya Joy",
    model: "AMJ-002",
    image: lansinohSmartImg,
    isUpgrade: false,
    upgradePrice: 0,
    brand: "Ameda®",
    manufacturer: "AMEDA INC.",
    batteryIncluded: false,
    carryBagIncluded: true,
  },
  {
    id: 15,
    name: "Philips Avent Manual",
    model: "PAM-001",
    image: motifLunaImg,
    isUpgrade: false,
    upgradePrice: 0,
    brand: "Philips Avent",
    manufacturer: "PHILIPS HEALTHCARE",
    batteryIncluded: false,
    carryBagIncluded: false,
  },
  {
    id: 16,
    name: "Elvie Double Electric",
    model: "ELV-DE",
    image: elviePumpImg,
    isUpgrade: true,
    upgradePrice: 279.99,
    brand: "Elvie",
    manufacturer: "ELVIE",
    batteryIncluded: true,
    carryBagIncluded: true,
  }
];

export default function ProductCatalog() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planSelected, setPlanSelected] = useState(false);

  useEffect(() => {
    const savedPlan = localStorage.getItem("selectedInsurancePlan");
    if (savedPlan) {
      setSelectedPlan(savedPlan);
      setPlanSelected(true);
    }
  }, []);
  const [showCoveredOnly, setShowCoveredOnly] = useState(false);
  const [showUpgradeOnly, setShowUpgradeOnly] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
  const [batteryFilter, setBatteryFilter] = useState<string>(""); // "yes", "no", or ""
  const [carryBagFilter, setCarryBagFilter] = useState<string>(""); // "yes", "no", or ""

  const handlePlanSelection = () => {
    if (selectedPlan) {
      localStorage.setItem("selectedInsurancePlan", selectedPlan);
      setIsModalOpen(false);
      setPlanSelected(true);
    }
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`, { state: { selectedPlan } });
  };

  // Get unique brands and manufacturers for filter options
  const uniqueBrands = [...new Set(BREAST_PUMPS.map(pump => pump.brand))].sort();
  const uniqueManufacturers = [...new Set(BREAST_PUMPS.map(pump => pump.manufacturer))].sort();
  
  // Count products by brand
  const brandCounts = uniqueBrands.reduce((acc, brand) => {
    acc[brand] = BREAST_PUMPS.filter(pump => pump.brand === brand).length;
    return acc;
  }, {} as Record<string, number>);
  
  // Count products by manufacturer
  const manufacturerCounts = uniqueManufacturers.reduce((acc, manufacturer) => {
    acc[manufacturer] = BREAST_PUMPS.filter(pump => pump.manufacturer === manufacturer).length;
    return acc;
  }, {} as Record<string, number>);

  // Filter products based on selected filters
  const filteredProducts = BREAST_PUMPS.filter(pump => {
    if (showCoveredOnly && pump.isUpgrade) return false;
    if (showUpgradeOnly && !pump.isUpgrade) return false;
    if (selectedBrands.length > 0 && !selectedBrands.includes(pump.brand)) return false;
    if (selectedManufacturers.length > 0 && !selectedManufacturers.includes(pump.manufacturer)) return false;
    if (batteryFilter === "yes" && !pump.batteryIncluded) return false;
    if (batteryFilter === "no" && pump.batteryIncluded) return false;
    if (carryBagFilter === "yes" && !pump.carryBagIncluded) return false;
    if (carryBagFilter === "no" && pump.carryBagIncluded) return false;
    return true;
  });
  
  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    }
  };
  
  const handleManufacturerChange = (manufacturer: string, checked: boolean) => {
    if (checked) {
      setSelectedManufacturers([...selectedManufacturers, manufacturer]);
    } else {
      setSelectedManufacturers(selectedManufacturers.filter(m => m !== manufacturer));
    }
  };

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


      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8 items-start">
          {/* Left Sidebar */}
          <div className="w-72 flex-shrink-0">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 sticky top-8">
              <h2 className="text-lg font-bold text-[#192866] mb-6">
                Insurance Coverage
              </h2>
              
              {!planSelected ? (
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full bg-blue-400 hover:bg-blue-500 text-white font-medium py-3 px-4 border-0 rounded-md shadow-sm"
                    >
                      Select Insurance Plan
                    </Button>
                  </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Select Your Insurance Provider</DialogTitle>
                    <DialogDescription>
                      Choose your insurance plan to see available breast pumps.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <select 
                      value={selectedPlan} 
                      onChange={(e) => setSelectedPlan(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent"
                    >
                      <option value="">Select your insurance plan</option>
                      {INSURANCE_PROVIDERS.map((provider) => (
                        <option key={provider} value={provider}>
                          {provider}
                        </option>
                      ))}
                    </select>
                    <Button 
                      onClick={handlePlanSelection} 
                      disabled={!selectedPlan}
                      className="w-full bg-blue-400 hover:bg-blue-500"
                    >
                      OK
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              ) : (
                <div className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-4 h-4 bg-blue-400 rounded-full mr-2 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                    <div className="text-base font-semibold text-blue-600">Coverage Verified</div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 mb-3">
                    <div className="text-xs text-gray-600 mb-1">Your Insurance Plan</div>
                    <div className="font-medium text-gray-800 text-sm">{selectedPlan}</div>
                  </div>
                  <button 
                    onClick={() => {
                      localStorage.removeItem("selectedInsurancePlan");
                      setSelectedPlan("");
                      setPlanSelected(false);
                    }}
                    className="w-full text-xs bg-white/40 hover:bg-white/60 text-blue-600 hover:text-blue-700 py-1.5 px-3 rounded-lg border border-blue-200 transition-all duration-200 font-medium"
                  >
                    Change Plan
                  </button>
                </div>
              )}

              <div className="mt-8 space-y-6">
                <h3 className="font-bold text-[#192866] mb-4 text-lg">
                  Narrow Results
                </h3>
                
                {/* Category */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium text-[#192866] mb-2">Category</h4>
                  <div className="text-sm text-gray-600 mb-2">BREAST PUMPS ({filteredProducts.length})</div>
                </div>
                
                {/* Coverage Type */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium text-[#192866] mb-3">Coverage Type</h4>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mr-2 text-[#192866] rounded focus:ring-[#192866]" 
                        checked={showCoveredOnly}
                        onChange={(e) => setShowCoveredOnly(e.target.checked)}
                      />
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                        Covered by Insurance ({BREAST_PUMPS.filter(p => !p.isUpgrade).length})
                      </div>
                    </label>
                    <label className="flex items-center text-sm cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mr-2 text-[#192866] rounded focus:ring-[#192866]" 
                        checked={showUpgradeOnly}
                        onChange={(e) => setShowUpgradeOnly(e.target.checked)}
                      />
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                        Upgrade Options ({BREAST_PUMPS.filter(p => p.isUpgrade).length})
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Product Brand */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium text-[#192866] mb-3">Product Brand</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {uniqueBrands.map(brand => (
                      <label key={brand} className="flex items-center text-sm cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mr-2 text-[#192866] rounded focus:ring-[#192866]" 
                          checked={selectedBrands.includes(brand)}
                          onChange={(e) => handleBrandChange(brand, e.target.checked)}
                        />
                        {brand} ({brandCounts[brand]})
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Manufacturer */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium text-[#192866] mb-3">Manufacturer</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {uniqueManufacturers.map(manufacturer => (
                      <label key={manufacturer} className="flex items-center text-sm cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mr-2 text-[#192866] rounded focus:ring-[#192866]" 
                          checked={selectedManufacturers.includes(manufacturer)}
                          onChange={(e) => handleManufacturerChange(manufacturer, e.target.checked)}
                        />
                        {manufacturer} ({manufacturerCounts[manufacturer]})
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Battery Included */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium text-[#192866] mb-3">Battery Included</h4>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm cursor-pointer">
                      <input 
                        type="radio" 
                        name="battery" 
                        className="mr-2 text-[#192866] focus:ring-[#192866]" 
                        checked={batteryFilter === ""}
                        onChange={() => setBatteryFilter("")}
                      />
                      All ({BREAST_PUMPS.length})
                    </label>
                    <label className="flex items-center text-sm cursor-pointer">
                      <input 
                        type="radio" 
                        name="battery" 
                        className="mr-2 text-[#192866] focus:ring-[#192866]" 
                        checked={batteryFilter === "no"}
                        onChange={() => setBatteryFilter("no")}
                      />
                      No ({BREAST_PUMPS.filter(p => !p.batteryIncluded).length})
                    </label>
                    <label className="flex items-center text-sm cursor-pointer">
                      <input 
                        type="radio" 
                        name="battery" 
                        className="mr-2 text-[#192866] focus:ring-[#192866]" 
                        checked={batteryFilter === "yes"}
                        onChange={() => setBatteryFilter("yes")}
                      />
                      Yes ({BREAST_PUMPS.filter(p => p.batteryIncluded).length})
                    </label>
                  </div>
                </div>
                
                {/* Carry Bag Included */}
                <div className="pb-4">
                  <h4 className="font-medium text-[#192866] mb-3">Carry Bag Included</h4>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm cursor-pointer">
                      <input 
                        type="radio" 
                        name="carryBag" 
                        className="mr-2 text-[#192866] focus:ring-[#192866]" 
                        checked={carryBagFilter === ""}
                        onChange={() => setCarryBagFilter("")}
                      />
                      All ({BREAST_PUMPS.length})
                    </label>
                    <label className="flex items-center text-sm cursor-pointer">
                      <input 
                        type="radio" 
                        name="carryBag" 
                        className="mr-2 text-[#192866] focus:ring-[#192866]" 
                        checked={carryBagFilter === "no"}
                        onChange={() => setCarryBagFilter("no")}
                      />
                      No ({BREAST_PUMPS.filter(p => !p.carryBagIncluded).length})
                    </label>
                    <label className="flex items-center text-sm cursor-pointer">
                      <input 
                        type="radio" 
                        name="carryBag" 
                        className="mr-2 text-[#192866] focus:ring-[#192866]" 
                        checked={carryBagFilter === "yes"}
                        onChange={() => setCarryBagFilter("yes")}
                      />
                      Yes ({BREAST_PUMPS.filter(p => p.carryBagIncluded).length})
                    </label>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 p-4 bg-blue-50 rounded-md border border-blue-200">
                <h4 className="font-medium text-[#192866] mb-2">Why Choose Hygeia?</h4>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>✓ Insurance verified suppliers</li>
                  <li>✓ FDA approved products only</li>
                  <li>✓ Fast 4-7 day processing</li>
                  <li>✓ Free shipping included</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-[#192866] mb-2">Breast Pumps</h1>
                <p className="text-gray-600">FDA approved pumps covered by your insurance</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#192866]">{filteredProducts.length}</div>
                <div className="text-sm text-gray-600">products available</div>
              </div>
            </div>

            {/* Results Header */}
            {planSelected && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-blue-400 rounded-full mr-3"></div>
                  <div>
                    <div className="font-medium text-green-800">Insurance Coverage Verified</div>
                    <div className="text-sm text-green-700">Showing products available under your {selectedPlan} plan</div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid - Always Show */}
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((pump) => (
                  <Card key={pump.id} className="group border border-gray-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-white">
                    <CardContent className="p-0">
                      <div className="relative">
                        <div className="absolute top-3 left-3 z-10">
                          {pump.isUpgrade ? (
                            <Badge className="bg-gradient-to-r from-red-400 to-red-500 text-white text-xs px-2 py-1 shadow-md">
                              UPGRADE
                            </Badge>
                          ) : (
                            <Badge className="bg-gradient-to-r from-blue-400 to-blue-500 text-white text-xs px-2 py-1 shadow-md">
                              COVERED
                            </Badge>
                          )}
                        </div>
                        
                        <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-lg overflow-hidden">
                          <img 
                            src={pump.image} 
                            alt={pump.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='225' viewBox='0 0 300 225'%3E%3Crect width='300' height='225' fill='%23f3f4f6'/%3E%3Ctext x='150' y='112' font-family='Arial' font-size='14' fill='%23374151' text-anchor='middle'%3EProduct Image%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-[#192866] text-base mb-1 leading-tight">
                          {pump.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-3">Model: {pump.model}</p>
                        
                        <div className="mb-4">
                          {pump.isUpgrade ? (
                            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-3 min-h-[64px] flex flex-col justify-between">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-orange-800">Upgrade Fee:</span>
                                <span className="text-lg font-bold text-orange-800">${pump.upgradePrice}</span>
                              </div>
                              <p className="text-xs text-orange-600">Plus insurance coverage</p>
                            </div>
                          ) : (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 min-h-[64px] flex flex-col justify-between">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                                  <span className="text-sm font-medium text-green-800">Fully Covered</span>
                                </div>
                                <span className="text-lg font-bold text-green-800">$0</span>
                              </div>
                              <p className="text-xs text-green-600">No out of pocket cost</p>
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          onClick={() => planSelected ? handleProductClick(pump.id) : setIsModalOpen(true)}
                          className="w-full bg-blue-400 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm min-h-[44px] flex items-center justify-center"
                          disabled={!planSelected}
                        >
                          <span className="text-center leading-tight">
                            {planSelected ? "View Details" : "Select Insurance First"}
                          </span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#192866] text-white mt-16">
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
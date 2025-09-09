import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check } from "lucide-react";
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

const BREAST_PUMP_DETAILS = {
  1: {
    id: 1,
    name: "Medela MaxFlow with PersonalFit",
    model: "MaxFlow-PF",
    image: medelaMaxflowImg,
    isUpgrade: false,
    upgradePrice: 0,
    shortDescription: "Hospital-grade pumping performance with PersonalFit Flex technology for maximum comfort and efficiency.",
    keyBenefits: [
      "Hospital-grade suction power for efficient milk expression",
      "PersonalFit Flex technology adapts to your unique shape",
      "Rechargeable battery for pumping anywhere",
      "Lightweight and portable design"
    ],
    specifications: {
      "Item Number": "57063",
      "Power Source": "Rechargeable battery + AC adapter",
      "Suction Strength": "Hospital-grade variable suction",
      "System Type": "Closed system",
      "Warranty": "1-year manufacturer warranty",
      "Weight": "3.2 lbs",
      "Pump Cycles": "38-70 cycles per minute"
    },
    includedItems: [
      "Pump in Style Advanced motor",
      "PersonalFit Flex breast shields",
      "Bottles and storage containers",
      "Tubing and connectors",
      "Rechargeable battery pack",
      "AC adapter",
      "Carrying case"
    ]
  },
  2: {
    id: 2,
    name: "Spectra S2 Hospital Grade",
    model: "S2-HG",
    image: spectraS2Img,
    isUpgrade: false,
    upgradePrice: 0,
    shortDescription: "Quiet, efficient pumping with integrated rechargeable battery and night light for convenient use.",
    keyBenefits: [
      "Ultra-quiet operation for discrete pumping",
      "Built-in rechargeable battery with LED display",
      "Night light for nighttime pumping sessions", 
      "Closed system prevents contamination"
    ],
    specifications: {
      "Item Number": "S1PLUS",
      "Power Source": "Built-in rechargeable battery + AC adapter",
      "Suction Strength": "Adjustable vacuum levels",
      "System Type": "Closed system",
      "Warranty": "2-year manufacturer warranty",
      "Weight": "3.3 lbs",
      "Special Features": "Night light, LCD display"
    },
    includedItems: [
      "Spectra S1 Plus pump motor",
      "Breast shields (multiple sizes)",
      "Collection bottles",
      "Tubing system",
      "AC power adapter",
      "Instruction manual",
      "Carrying bag"
    ]
  },
  3: {
    id: 3,
    name: "Spectra Synergy Gold Portable",
    model: "SG-PORT",
    image: spectraSynergyImg,
    isUpgrade: true,
    upgradePrice: 89.99,
    shortDescription: "Advanced portable breast pump with wearable flanges and gold standard performance for ultimate convenience.",
    keyBenefits: [
      "Natural Motion technology mimics baby's sucking",
      "Soft silicone cushions adapt to nipple shape",
      "Upright pumping position for comfort",
      "Memory function stores preferred settings"
    ],
    specifications: {
      "Item Number": "SCF394/11",
      "Power Source": "Micro-USB charging",
      "Suction Strength": "8 adjustable levels",
      "System Type": "Closed system",
      "Warranty": "2-year manufacturer warranty",
      "Special Features": "Memory function, one-touch control",
      "Stimulation Levels": "8 patterns"
    },
    includedItems: [
      "Electric breast pump unit",
      "Breast shields (24mm and 27mm)",
      "Feeding bottles (150ml x2)",
      "Connecting tubes",
      "Micro-USB charging cable",
      "Travel bag",
      "User manual"
    ]
  },
  4: {
    id: 4,
    name: "Ameda Purely Yours Ultra",
    model: "PY-ULTRA",
    image: amedaPurelyImg,
    isUpgrade: false,
    upgradePrice: 0,
    shortDescription: "HygieniKit milk collection system provides proven airlock protection for safe, hygienic pumping.",
    keyBenefits: [
      "HygieniKit system prevents backflow and contamination",
      "Proven airlock protection technology",
      "Double pumping capability for efficiency",
      "Lightweight and compact design"
    ],
    specifications: {
      "Item Number": "17077",
      "Power Source": "AC adapter",
      "System Type": "Closed system with HygieniKit",
      "Warranty": "1-year manufacturer warranty",
      "Weight": "2.8 lbs",
      "Special Features": "Airlock protection, easy assembly"
    },
    includedItems: [
      "Pump motor unit",
      "HygieniKit collection system",
      "Breast shields (multiple sizes)",
      "Collection bottles",
      "Tubing",
      "AC power adapter",
      "Instruction manual"
    ]
  },
  5: {
    id: 5,
    name: "Lansinoh SmartPump 2.0 Bluetooth",
    model: "SP2-BT",
    image: lansinohSmartImg,
    isUpgrade: true,
    upgradePrice: 129.99,
    shortDescription: "Smart connectivity with Bluetooth app tracking for monitoring pumping sessions and milk production.",
    keyBenefits: [
      "Bluetooth connectivity with mobile app",
      "Track pumping sessions and milk volume",
      "Double electric with adjustable suction",
      "Compact and travel-friendly design"
    ],
    specifications: {
      "Item Number": "LSP2.0",
      "Power Source": "Rechargeable battery + AC adapter",
      "Connectivity": "Bluetooth 4.0",
      "System Type": "Closed system",
      "Warranty": "2-year manufacturer warranty",
      "Special Features": "App connectivity, session tracking"
    },
    includedItems: [
      "SmartPump 2.0 motor",
      "Bluetooth connectivity module",
      "Breast shields",
      "Collection bottles",
      "Rechargeable battery",
      "Charging cable",
      "Mobile app access"
    ]
  },
  6: {
    id: 6,
    name: "Motif Luna Hospital Grade",
    model: "LUNA-HG",
    image: motifLunaImg,
    isUpgrade: false,
    upgradePrice: 0,
    shortDescription: "Hospital-grade performance with quiet operation and customizable pumping patterns for optimal comfort.",
    keyBenefits: [
      "Hospital-grade suction strength",
      "Quiet motor operation under 50dB",
      "Customizable pumping patterns",
      "FDA approved closed system"
    ],
    specifications: {
      "Item Number": "MF-DEB-01",
      "Power Source": "AC adapter + battery backup",
      "Suction Strength": "Hospital-grade (-250 mmHg)",
      "System Type": "Closed system, FDA approved",
      "Warranty": "2-year manufacturer warranty",
      "Noise Level": "Less than 50dB"
    },
    includedItems: [
      "Luna motor unit",
      "Breast shields (21mm, 24mm, 27mm)",
      "Collection bottles",
      "Tubing system",
      "Battery backup",
      "AC power adapter",
      "Carrying case"
    ]
  },
  7: {
    id: 7,
    name: "Elvie Pump Wearable Silent",
    model: "ELV-WEAR",
    image: elviePumpImg,
    isUpgrade: true,
    upgradePrice: 249.99,
    shortDescription: "Revolutionary silent, hands-free wearable breast pump with app connectivity for ultimate discretion.",
    keyBenefits: [
      "Completely silent operation",
      "Hands-free wearable design",
      "App-connected with tracking features",
      "Fits inside your bra for discretion"
    ],
    specifications: {
      "Item Number": "ELV-001",
      "Power Source": "Rechargeable battery",
      "Operation": "100% silent",
      "Connectivity": "Smartphone app",
      "Warranty": "1-year manufacturer warranty",
      "Design": "In-bra wearable"
    },
    includedItems: [
      "2x Elvie Pump units",
      "Breast shields (multiple sizes)",
      "Collection cups",
      "Charging hub",
      "USB-C cables",
      "Mobile app access",
      "Travel case"
    ]
  },
  8: {
    id: 8,
    name: "Willow Pump Hands-Free Wearable",
    model: "WILL-HF",
    image: willowGoImg,
    isUpgrade: true,
    upgradePrice: 399.99,
    shortDescription: "Premium hands-free wearable pump with milk bags or reusable containers for ultimate convenience.",
    keyBenefits: [
      "Hands-free wearable technology",
      "Flexible milk bag or container options",
      "Quiet operation for public use",
      "Mobile app for session tracking"
    ],
    specifications: {
      "Item Number": "WLW-003",
      "Power Source": "Rechargeable battery",
      "Storage": "Milk bags or reusable containers",
      "Connectivity": "Bluetooth app",
      "Warranty": "1-year manufacturer warranty",
      "Battery Life": "Up to 5 sessions"
    },
    includedItems: [
      "2x Willow Pump units",
      "Breast flanges (multiple sizes)",
      "Reusable milk containers",
      "Milk storage bags (24-count)",
      "Charging case",
      "Mobile app access",
      "User guide"
    ]
  },
  9: {
    id: 9,
    name: "Baby Buddha Portable Electric",
    model: "BB-PORT",
    image: babyBuddhaImg,
    isUpgrade: false,
    upgradePrice: 0,
    shortDescription: "Compact, lightweight portable pump with hospital-grade suction in an ultra-small design.",
    keyBenefits: [
      "Ultra-compact and lightweight design",
      "Hospital-grade suction strength",
      "Long-lasting rechargeable battery",
      "Compatible with most breast shield brands"
    ],
    specifications: {
      "Item Number": "BB-PE-001",
      "Power Source": "Rechargeable battery",
      "Weight": "1.2 lbs (ultra-lightweight)",
      "Suction": "Hospital-grade strength",
      "System Type": "Closed system",
      "Battery Life": "Up to 8 hours continuous use"
    },
    includedItems: [
      "Baby Buddha pump motor",
      "Rechargeable battery",
      "USB charging cable",
      "Universal tubing",
      "Instruction manual",
      "Warranty card",
      "Compact carry pouch"
    ]
  }
};

export default function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const productId = parseInt(id || "1");
  const product = BREAST_PUMP_DETAILS[productId as keyof typeof BREAST_PUMP_DETAILS] || BREAST_PUMP_DETAILS[1];
  const selectedPlan = location.state?.selectedPlan || "Insurance Plan";

  const handleOrderClick = () => {
    navigate(`/order/${product.id}`, { state: { selectedPlan, product } });
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
                className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-6 py-3 rounded-md text-lg font-semibold transition-colors cursor-pointer"
              >
                Reorder Supplies
              </button>
              <a 
                href="https://status.hygeiahealth.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#192866] hover:bg-[#151d5a] text-white px-6 py-3 rounded-md text-lg font-semibold transition-colors cursor-pointer"
              >
                Track Order
              </a>
            </nav>
          </div>
        </div>
      </header>


      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/")}
          className="mb-6 text-[#192866] hover:text-[#192866] hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <div className="relative bg-gray-50 border border-gray-200 rounded-lg p-8">
              {product.isUpgrade && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-orange-500 text-white">
                    UPGRADE
                  </Badge>
                </div>
              )}
              <div className="aspect-square flex items-center justify-center">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f9fafb'/%3E%3Ctext x='150' y='150' font-family='Arial' font-size='16' fill='%23374151' text-anchor='middle'%3EProduct Image%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-[#192866] mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-1">Model: {product.model}</p>
            <p className="text-sm text-gray-500 mb-6">
              Insurance: <span className="font-medium">{selectedPlan}</span>
            </p>

            {/* Pricing */}
            <div className={`p-4 rounded-lg border mb-6 ${
              product.isUpgrade 
                ? "bg-orange-50 border-orange-200" 
                : "bg-green-50 border-green-200"
            }`}>
              {product.isUpgrade ? (
                <div>
                  <p className="text-lg font-bold text-orange-800 mb-1">
                    Upgrade Fee: ${product.upgradePrice}
                  </p>
                  <p className="text-sm text-orange-700">
                    This premium model requires an additional payment.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-bold text-green-800 mb-1">
                    Covered by Insurance
                  </p>
                  <p className="text-sm text-green-700">
                    No additional cost with your insurance plan.
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">{product.shortDescription}</p>
            </div>

            {/* Order Button */}
            <Button 
              onClick={handleOrderClick}
              className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-medium py-3 mb-4"
            >
              {product.isUpgrade ? "Order & Pay Upgrade" : "Order Now"}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Processing time: 4-7 business days + 3-5 shipping
            </p>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="mt-12 grid lg:grid-cols-2 gap-8">
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-[#192866] mb-4 flex items-center">
                <Check className="h-5 w-5 mr-2 text-green-600" />
                Key Features & Benefits
              </h3>
              <ul className="space-y-3">
                {product.keyBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-[#192866] mb-4">
                Product Specifications
              </h3>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-1 border-b border-gray-100 last:border-b-0">
                    <span className="text-sm font-medium text-gray-900">{key}:</span>
                    <span className="text-sm text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What's Included */}
        <Card className="mt-8 border border-gray-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-[#192866] mb-4">
              What's Included
            </h3>
            <div className="grid md:grid-cols-2 gap-2">
              {product.includedItems.map((item, index) => (
                <div key={index} className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-[#192866] rounded-full mr-3"></div>
                  {item}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-[#192866] mb-3">Important Information</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Processing time: 4-7 business days from order submission</li>
            <li>• Shipping: 3-5 business days with tracking included</li>
            <li>• All breast pumps are final sale - no returns accepted</li>
            <li>• We handle physician orders and insurance verification</li>
          </ul>
        </div>
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
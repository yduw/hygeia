import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductCatalog from "./pages/ProductCatalog";
import ProductDetail from "./pages/ProductDetail";
import OrderForm from "./pages/OrderForm";

export function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<ProductCatalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/order/:productId" element={<OrderForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
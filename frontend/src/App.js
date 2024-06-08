import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Inventory from './components/Inventory';
import AddInventoryItem from './components/AddInventoryItem';
import AddPurchaseOrder from './components/AddPurchaseOrder';
import ProductionOrders from './components/ProductionOrders';
import AddProductionOrder from './components/AddProductionOrder';
import PurchaseOrders from './components/PurchaseOrders';

function App() {
  return (
    <div style={{ margin: "30px"}}>
      <Router>
        <header>
        <h1><Link to="/">Foodie ERP</Link></h1>
        </header>
        <nav style={{ display: "flex", gap: "30px" }}>
          <Link to="/inventory">Inventory</Link>
          <Link to="/purchases">Purchases</Link>
          <Link to="/production">Production Orders</Link>
          <Link to="/sales">Sales</Link>
        </nav>
        <main>
          <Routes>
            <Route path="/inventory" element={<Inventory />} />
            <Route path="inventory/create" element={<AddInventoryItem />} />
            <Route path="/purchases" element={<PurchaseOrders />} />
            <Route path="/purchases/create" element={<AddPurchaseOrder />} />
            <Route path="/production" element={<ProductionOrders />} />
            <Route path="/production/create" element={<AddProductionOrder />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;

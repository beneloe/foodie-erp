import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Inventory from './components/Inventory';
import AddInventoryItem from './components/AddInventoryItem';
import AddPurchaseOrder from './components/AddPurchaseOrder';
import PurchaseOrders from './components/PurchaseOrders';
import ProductionOrders from './components/ProductionOrders';
import AddProductionOrder from './components/AddProductionOrder';
import SalesOrders from './components/SalesOrders';
import AddSalesOrder from './components/AddSalesOrder';
import ServiceCosts from './components/ServiceCosts';

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
          <Link to="/service">Service Costs</Link>
        </nav>
        <main>
          <Routes>
            <Route path="/inventory" element={<Inventory />} />
            <Route path="inventory/create" element={<AddInventoryItem />} />
            <Route path="/purchases" element={<PurchaseOrders />} />
            <Route path="/purchases/create" element={<AddPurchaseOrder />} />
            <Route path="/production" element={<ProductionOrders />} />
            <Route path="/production/create" element={<AddProductionOrder />} />
            <Route path='/sales' element={<SalesOrders />} />
            <Route path='/sales/create' element={<AddSalesOrder />} />
            <Route path='/service' element={<ServiceCosts />} />
          </Routes>
        </main>
      </Router>
    </div>
 );
}

export default App;

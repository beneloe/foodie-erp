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
import AddServiceCost from './components/AddServiceCost';
import OtherCosts from './components/OtherCosts';
import AddOtherCost from './components/AddOtherCost';
import StaffingCosts from './components/StaffingCosts';
import AddStaffingCost from './components/AddStaffingCost';
import KPIs from './components/KPIs';

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
          <Link to="/other">Other Costs</Link>
          <Link to="/staffing">Staffing Costs</Link>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<KPIs />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="inventory/create" element={<AddInventoryItem />} />
            <Route path="/purchases" element={<PurchaseOrders />} />
            <Route path="/purchases/create" element={<AddPurchaseOrder />} />
            <Route path="/production" element={<ProductionOrders />} />
            <Route path="/production/create" element={<AddProductionOrder />} />
            <Route path='/sales' element={<SalesOrders />} />
            <Route path='/sales/create' element={<AddSalesOrder />} />
            <Route path='/service' element={<ServiceCosts />} />
            <Route path='/service/create' element={<AddServiceCost />} />
            <Route path='/other' element={<OtherCosts />} />
            <Route path='/other/create' element={<AddOtherCost />} />
            <Route path='/staffing' element={<StaffingCosts />} />
            <Route path='/staffing/create' element={<AddStaffingCost />} />
          </Routes>
        </main>
      </Router>
    </div>
 );
}

export default App;

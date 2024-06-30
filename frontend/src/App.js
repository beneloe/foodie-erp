import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
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
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <AuthProvider>
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
              <PrivateRoute path="/inventory" element={<Inventory />} />
              <PrivateRoute path="/inventory/create" element={<AddInventoryItem />} />
              <PrivateRoute path="/purchases" element={<PurchaseOrders />} />
              <PrivateRoute path="/purchases/create" element={<AddPurchaseOrder />} />
              <PrivateRoute path="/production" element={<ProductionOrders />} />
              <PrivateRoute path="/production/create" element={<AddProductionOrder />} />
              <PrivateRoute path="/sales" element={<SalesOrders />} />
              <PrivateRoute path="/sales/create" element={<AddSalesOrder />} />
              <PrivateRoute path="/service" element={<ServiceCosts />} />
              <PrivateRoute path="/service/create" element={<AddServiceCost />} />
              <PrivateRoute path="/other" element={<OtherCosts />} />
              <PrivateRoute path="/other/create" element={<AddOtherCost />} />
              <PrivateRoute path="/staffing" element={<StaffingCosts />} />
              <PrivateRoute path="/staffing/create" element={<AddStaffingCost />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;

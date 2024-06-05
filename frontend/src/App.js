import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Inventory from './components/Inventory';
import AddItem from './components/AddItem';

function App() {
  return (
    <div>
      <Router>
        <header>
        <h1><Link to="/">Foodie ERP</Link></h1>
        </header>
        <nav>
          <Link to="/inventory">Inventory</Link>
          <Link to="/add-item">Add Item</Link>
        </nav>
        <main>
          <Routes>
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/add-item" element={<AddItem />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;

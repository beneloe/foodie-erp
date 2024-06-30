import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductionOrders = () => {
  const [productionOrders, setProductionOrders] = useState([]);

  useEffect(() => {
    fetch('/api/production-orders')
      .then(response => response.json())
      .then(data => setProductionOrders(data.productionOrders))
      .catch(error => console.error('Error fetching production orders:', error));
  }, []);

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>Production Orders</h2>
      <table style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}>
        <thead>
          <tr>
            <th style={{ padding: '0 10px' }}>Date</th>
            <th style={{ padding: '0 10px' }}>Product Name</th>
            <th style={{ padding: '0 10px' }}>Quantity</th>
            <th style={{ padding: '0 10px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {productionOrders.map(order => (
            <tr key={order.id}>
              <td style={{ padding: '0 10px' }}>{order.date}</td>
              <td style={{ padding: '0 10px' }}>{order.product_name}</td>
              <td style={{ padding: '0 10px' }}>{order.quantity}</td>
              <td style={{ padding: '0 10px' }}>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '30px' }}>
        <Link to="/production/create">Add New</Link>
      </div>
    </div>
  );
};

export default ProductionOrders;

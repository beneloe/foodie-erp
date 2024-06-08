import React, { useState, useEffect } from 'react';

const ProductionOrders = () => {
  const [productionOrders, setProductionOrders] = useState([]);

  useEffect(() => {
    fetch('/api/production-orders')
      .then(response => response.json())
      .then(data => setProductionOrders(data.productionOrders))
      .catch(error => console.error('Error fetching production orders:', error));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Production Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {productionOrders.map(order => (
            <tr key={order.id}>
              <td>{order.date}</td>
              <td>{order.product_name}</td>
              <td>{order.quantity}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductionOrders;

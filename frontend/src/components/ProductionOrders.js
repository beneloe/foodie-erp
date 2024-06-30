import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProductionOrders = () => {
  const [productionOrders, setProductionOrders] = useState([]);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetch('/api/production-orders')
      .then(response => response.json())
      .then(data => setProductionOrders(data.productionOrders))
      .catch(error => console.error('Error fetching production orders:', error));
  }, []);

  return (
    <div style={{ "margin-top": "50px" }}>
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
      <div style={{ "margin-top": "30px" }}>
        <Link to="/production/create">Add New</Link>
      </div>
    </div>
  );
};

export default ProductionOrders;

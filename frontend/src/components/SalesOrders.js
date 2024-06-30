import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const SalesOrders = () => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [salesOrderItems, setSalesOrderItems] = useState([]);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetch('/api/sales-orders')
      .then(response => response.json())
      .then(data => {
        setSalesOrders(Array.isArray(data.salesOrders) ? data.salesOrders : []);
        setSalesOrderItems(Array.isArray(data.salesOrderItems) ? data.salesOrderItems : []);
      })
      .catch(error => console.error('Error fetching sales orders:', error));
  }, []);

  const getOrderItems = (orderId) => {
    return salesOrderItems.filter((item) => item.sales_order_id === orderId);
  };

  return (
    <div style={{ "margin-top": "50px" }}>
      <h2>Sales Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Paid</th>
            <th>Delivered</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {salesOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.date}</td>
              <td>{order.customer}</td>
              <td>{order.amount}</td>
              <td>{order.paid ? 'Yes' : 'No'}</td>
              <td>{order.delivered ? 'Yes' : 'No'}</td>
              <td>
                {getOrderItems(order.id).map((item) => (
                  <div key={item.id}>
                    {item.quantity} {item.unit}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ "margin-top": "30px" }}>
        <Link to="/sales/create">Add New</Link>
      </div>
    </div>
  );
};

export default SalesOrders;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SalesOrders = () => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [salesOrderItems, setSalesOrderItems] = useState([]);

  useEffect(() => {
    fetch('/api/sales-orders')
      .then(response => response.json())
      .then(data => {
        setSalesOrders(Array.isArray(data.salesOrders) ? data.salesOrders : []);
        setSalesOrderItems(Array.isArray(data.salesOrderItems) ? data.salesOrderItems : []);
      })
      .catch(error => console.error('Error fetching sales orders:', error));
  }, []);

  const getItemsForOrder = (orderId) => {
    return salesOrderItems.filter(item => item.sales_order_id === orderId);
  };

  return (
    <div style={{ padding: '20px' }}>
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
          {salesOrders.map(order => (
            <tr key={order.id}>
              <td>{new Date(order.date).toLocaleDateString()}</td>
              <td>{order.customer}</td>
              <td>{order.amount}</td>
              <td>{order.paid ? 'Yes' : 'No'}</td>
              <td>{order.delivered ? 'Yes' : 'No'}</td>
              <td>
                <ul>
                  {getItemsForOrder(order.id).map(item => (
                    <li key={item.id}>
                      {item.item_name} - {item.quantity} {item.unit} @ {item.unit_price} each, Amount: {item.amount}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/sales/create">Add New</Link>
    </div>
  );
};

export default SalesOrders;

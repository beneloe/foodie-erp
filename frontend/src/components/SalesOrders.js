import React, { useEffect, useState } from 'react';
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

  const getOrderItems = (orderId) => {
    return salesOrderItems.filter((item) => item.sales_order_id === orderId);
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>Sales Orders</h2>
      <table style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}>
        <thead>
          <tr>
            <th style={{ padding: '0 10px' }}>Date</th>
            <th style={{ padding: '0 10px' }}>Customer</th>
            <th style={{ padding: '0 10px' }}>Amount</th>
            <th style={{ padding: '0 10px' }}>Paid</th>
            <th style={{ padding: '0 10px' }}>Delivered</th>
            <th style={{ padding: '0 10px' }}>Items</th>
          </tr>
        </thead>
        <tbody>
          {salesOrders.map((order) => (
            <tr key={order.id}>
              <td style={{ padding: '0 10px' }}>{order.date}</td>
              <td style={{ padding: '0 10px' }}>{order.customer}</td>
              <td style={{ padding: '0 10px' }}>{order.amount}</td>
              <td style={{ padding: '0 10px' }}>{order.paid ? 'Yes' : 'No'}</td>
              <td style={{ padding: '0 10px' }}>{order.delivered ? 'Yes' : 'No'}</td>
              <td style={{ padding: '0 10px' }}>
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
      <div style={{ marginTop: '30px' }}>
        <Link to="/sales/create">Add New</Link>
      </div>
    </div>
  );
};

export default SalesOrders;

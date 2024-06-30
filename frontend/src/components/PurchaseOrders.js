import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [purchaseOrderItems, setPurchaseOrderItems] = useState([]);

  useEffect(() => {
    fetch('/api/purchase-orders')
      .then(response => response.json())
      .then(data => {
        setPurchaseOrders(Array.isArray(data.purchaseOrders) ? data.purchaseOrders : []);
        setPurchaseOrderItems(Array.isArray(data.purchaseOrderItems) ? data.purchaseOrderItems : []);
      })
      .catch(error => console.error('Error fetching purchase orders:', error));
  }, []);

  const getItemsForOrder = (orderId) => {
    return purchaseOrderItems.filter(item => item.purchase_order_id === orderId);
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>Purchase Orders</h2>
      <table style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}>
        <thead>
          <tr>
            <th style={{ padding: '0 10px' }}>Date</th>
            <th style={{ padding: '0 10px' }}>Vendor</th>
            <th style={{ padding: '0 10px' }}>Amount</th>
            <th style={{ padding: '0 10px' }}>Paid</th>
            <th style={{ padding: '0 10px' }}>Received</th>
            <th style={{ padding: '0 10px' }}>Items</th>
          </tr>
        </thead>
        <tbody>
          {purchaseOrders.map(order => (
            <tr key={order.id}>
              <td style={{ padding: '0 10px' }}>{new Date(order.date).toLocaleDateString()}</td>
              <td style={{ padding: '0 10px' }}>{order.vendor}</td>
              <td style={{ padding: '0 10px' }}>{order.amount}</td>
              <td style={{ padding: '0 10px' }}>{order.paid ? 'Yes' : 'No'}</td>
              <td style={{ padding: '0 10px' }}>{order.received ? 'Yes' : 'No'}</td>
              <td style={{ padding: '0 10px' }}>
                <ul style={{ padding: 0, listStyleType: 'none' }}>
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
      <div style={{ marginTop: '30px' }}>
        <Link to="/purchases/create">Add New</Link>
      </div>
    </div>
  );
};

export default PurchaseOrders;

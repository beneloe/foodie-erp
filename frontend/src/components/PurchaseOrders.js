import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [purchaseOrderItems, setPurchaseOrderItems] = useState([]);

  const { token } = useContext(AuthContext);

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
    <div style={{ "margin-top": "50px" }}>
      <h2>Purchase Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Vendor</th>
            <th>Amount</th>
            <th>Paid</th>
            <th>Received</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {purchaseOrders.map(order => (
            <tr key={order.id}>
              <td>{new Date(order.date).toLocaleDateString()}</td>
              <td>{order.vendor}</td>
              <td>{order.amount}</td>
              <td>{order.paid ? 'Yes' : 'No'}</td>
              <td>{order.received ? 'Yes' : 'No'}</td>
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
      <div style={{ "margin-top": "30px" }}>
        <Link to="/purchases/create">Add New</Link>
      </div>
    </div>
  );
};

export default PurchaseOrders;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ServiceCosts = () => {
  const [serviceCosts, setServiceCosts] = useState([]);
  const [serviceCostItems, setServiceCostItems] = useState([]);

  useEffect(() => {
    fetch('/api/service-costs')
      .then(response => response.json())
      .then(data => {
        setServiceCosts(Array.isArray(data.serviceCosts) ? data.serviceCosts : []);
        setServiceCostItems(Array.isArray(data.serviceCostItems) ? data.serviceCostItems : []);
      })
      .catch(error => console.error('Error fetching service cost:', error));
  }, []);

  const getCostItems = (costId) => {
    return serviceCostItems.filter((item) => item.service_cost_id === costId);
  };

  return (
    <div style={{ marginTop: '50px' }}>
      <h2>Service Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Vendor</th>
            <th>Amount</th>
            <th>Paid</th>
            <th>Status</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {serviceCosts.map((order) => (
            <tr key={order.id}>
              <td>{order.date}</td>
              <td>{order.vendor}</td>
              <td>{order.amount}</td>
              <td>{order.paid ? 'Yes' : 'No'}</td>
              <td>{order.status}</td>
              <td>
                {getCostItems(order.id).map((item) => (
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
        <Link to="/service/create">Add New</Link>
      </div>
    </div>
  );
};

export default ServiceCosts;

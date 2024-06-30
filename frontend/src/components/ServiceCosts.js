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
    <div style={{ marginTop: '30px' }}>
      <h2>Service Orders</h2>
      <table style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}>
        <thead>
          <tr>
            <th style={{ padding: '0 10px' }}>Date</th>
            <th style={{ padding: '0 10px' }}>Vendor</th>
            <th style={{ padding: '0 10px' }}>Amount</th>
            <th style={{ padding: '0 10px' }}>Paid</th>
            <th style={{ padding: '0 10px' }}>Status</th>
            <th style={{ padding: '0 10px' }}>Items</th>
          </tr>
        </thead>
        <tbody>
          {serviceCosts.map((order) => (
            <tr key={order.id}>
              <td style={{ padding: '0 10px' }}>{order.date}</td>
              <td style={{ padding: '0 10px' }}>{order.vendor}</td>
              <td style={{ padding: '0 10px' }}>{order.amount}</td>
              <td style={{ padding: '0 10px' }}>{order.paid ? 'Yes' : 'No'}</td>
              <td style={{ padding: '0 10px' }}>{order.status}</td>
              <td style={{ padding: '0 10px' }}>
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

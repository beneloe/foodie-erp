import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const StaffingCosts = () => {
  const [staffingCosts, setStaffingCosts] = useState([]);
  const [staffingCostItems, setStaffingCostItems] = useState([]);

  useEffect(() => {
    fetch('/api/staffing-costs')
      .then(response => response.json())
      .then(data => {
        setStaffingCosts(Array.isArray(data.staffingCosts) ? data.staffingCosts : []);
        setStaffingCostItems(Array.isArray(data.staffingCostItems) ? data.staffingCostItems : []);
      })
      .catch(error => console.error('Error fetching staffing costs:', error));
  }, []);

  const getCostItems = (costId) => {
    return staffingCostItems.filter((item) => item.staffing_cost_id === costId);
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>Staffing Costs</h2>
      <table style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}>
        <thead>
          <tr>
            <th style={{ padding: '0 10px' }}>Date</th>
            <th style={{ padding: '0 10px' }}>Period</th>
            <th style={{ padding: '0 10px' }}>Employee</th>
            <th style={{ padding: '0 10px' }}>Amount</th>
            <th style={{ padding: '0 10px' }}>Paid</th>
            <th style={{ padding: '0 10px' }}>Items</th>
          </tr>
        </thead>
        <tbody>
          {staffingCosts.map((cost) => (
            <tr key={cost.id}>
              <td style={{ padding: '0 10px' }}>{cost.date}</td>
              <td style={{ padding: '0 10px' }}>{cost.period}</td>
              <td style={{ padding: '0 10px' }}>{cost.employee}</td>
              <td style={{ padding: '0 10px' }}>{cost.amount}</td>
              <td style={{ padding: '0 10px' }}>{cost.paid ? 'Yes' : 'No'}</td>
              <td style={{ padding: '0 10px' }}>
                {getCostItems(cost.id).map((item) => (
                  <div key={item.id}>
                    {item.line_item}: {item.quantity} {item.unit} @ {item.unit_price}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '30px' }}>
        <Link to="/staffing/create">Add New</Link>
      </div>
    </div>
  );
};

export default StaffingCosts;

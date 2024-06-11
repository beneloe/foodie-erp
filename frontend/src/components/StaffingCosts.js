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
    <div style={{ marginTop: '50px' }}>
      <h2>Staffing Costs</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Period</th>
            <th>Employee</th>
            <th>Amount</th>
            <th>Paid</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {staffingCosts.map((cost) => (
            <tr key={cost.id}>
              <td>{cost.date}</td>
              <td>{cost.period}</td>
              <td>{cost.employee}</td>
              <td>{cost.amount}</td>
              <td>{cost.paid ? 'Yes' : 'No'}</td>
              <td>
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

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const OtherCosts = () => {
  const [otherCosts, setOtherCosts] = useState([]);
  const [otherCostItems, setOtherCostItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/other-costs');
        const data = await response.json();
        setOtherCosts(Array.isArray(data.otherCosts) ? data.otherCosts : []);
        setOtherCostItems(Array.isArray(data.otherCostItems) ? data.otherCostItems : []);
      } catch (error) {
        console.error('Error fetching other costs:', error);
      }
    };

    fetchData();
  }, []);

  const getCostItems = (costId) => {
    return otherCostItems.filter((item) => item.other_cost_id === costId);
  };

  return (
    <div style={{ marginTop: '50px' }}>
      <h2>Other Costs</h2>
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
          {otherCosts.map((cost) => (
            <tr key={cost.id}>
              <td>{cost.date}</td>
              <td>{cost.vendor}</td>
              <td>{cost.amount}</td>
              <td>{cost.paid ? 'Yes' : 'No'}</td>
              <td>{cost.status}</td>
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
        <Link to="/other/create">Add New</Link>
      </div>
    </div>
  );
};

export default OtherCosts;

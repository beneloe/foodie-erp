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
    <div style={{ marginTop: '30px' }}>
      <h2>Other Costs</h2>
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
          {otherCosts.map((cost) => (
            <tr key={cost.id}>
              <td style={{ padding: '0 10px' }}>{cost.date}</td>
              <td style={{ padding: '0 10px' }}>{cost.vendor}</td>
              <td style={{ padding: '0 10px' }}>{cost.amount}</td>
              <td style={{ padding: '0 10px' }}>{cost.paid ? 'Yes' : 'No'}</td>
              <td style={{ padding: '0 10px' }}>{cost.status}</td>
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
        <Link to="/other/create">Add New</Link>
      </div>
    </div>
  );
};

export default OtherCosts;

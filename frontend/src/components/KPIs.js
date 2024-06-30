import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [revenue, setRevenue] = useState(0);
  const [totalCosts, setTotalCosts] = useState({});
  const [grossProfit, setGrossProfit] = useState({});
  const [profitMargin, setProfitMargin] = useState(null);
  const [breakEvenPoints, setBreakEvenPoints] = useState({});
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');

  useEffect(() => {
    fetch('/api/kpis/revenue')
      .then(response => response.json())
      .then(data => setRevenue(data.revenue))
      .catch(error => console.error('Error fetching revenue:', error));

    fetch('/api/kpis/total-costs')
      .then(response => response.json())
      .then(data => setTotalCosts(data))
      .catch(error => console.error('Error fetching total costs:', error));

    fetch('/api/kpis/gross-profit')
      .then(response => response.json())
      .then(data => setGrossProfit(data))
      .catch(error => console.error('Error fetching gross profit:', error));

    fetch('/api/kpis/profit-margin')
      .then(response => response.json())
      .then(data => setProfitMargin(data.profit_margin))
      .catch(error => console.error('Error fetching profit margin:', error));

    fetch('/api/inventory')
      .then(response => response.json())
      .then(data => {
        setInventoryItems(data);
        if (data.length > 0) {
          setSelectedItem(data[0].item_name);
        }
      })
      .catch(error => console.error('Error fetching inventory items:', error));
  }, []);

  useEffect(() => {
    if (selectedItem) {
      fetch(`/api/kpis/break-even-point/${selectedItem}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch break-even point');
          }
          return response.json();
        })
        .then(data => {
          if (data.breakEvenPoint === null) {
            setBreakEvenPoints(prevState => ({
              ...prevState,
              [selectedItem]: 'Not applicable'
            }));
          } else {
            setBreakEvenPoints(prevState => ({
              ...prevState,
              [selectedItem]: data.breakEvenPoint
            }));
          }
        })
        .catch(error => {
          console.error('Error fetching break-even point:', error);
          setBreakEvenPoints(prevState => ({
            ...prevState,
            [selectedItem]: 'Error calculating'
          }));
        });
    }
  }, [selectedItem]);

  const handleItemChange = (event) => {
    setSelectedItem(event.target.value);
  };

  return (
    <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'start', minHeight: '100vh' }}>
      <h2>Dashboard</h2>
      <div>
        <h3>Revenue</h3>
        <p>{revenue}</p>
      </div>
      <div>
        <h3>Total Costs</h3>
        <p>Purchase Costs: {totalCosts.total_purchase_cost}</p>
        <p>Production Costs: {totalCosts.total_production_cost}</p>
        <p>Other Costs: {totalCosts.total_other_cost}</p>
        <p>Staffing Costs: {totalCosts.total_staffing_cost}</p>
        <p>Total Costs: {totalCosts.total_cost}</p>
      </div>
      <div>
        <h3>Gross Profit</h3>
        <p>{grossProfit.gross_profit}</p>
      </div>
      <div>
        <h3>Profit Margin</h3>
        <p>{profitMargin !== null ? `${profitMargin.toFixed(2)}%` : 'Not available'}</p>
      </div>
      <div>
        <h3>Break-Even Point (in units)</h3>
        <select value={selectedItem} onChange={handleItemChange}>
          {inventoryItems.map(item => (
            <option key={item.id} value={item.item_name}>{item.item_name}</option>
          ))}
        </select>
        <p>{breakEvenPoints[selectedItem] !== undefined ? 
            (breakEvenPoints[selectedItem] === 'Not applicable' ? 'Not applicable (no sales)' : breakEvenPoints[selectedItem]) 
            : 'Calculating...'}</p>
      </div>
    </div>
  );
};

export default Dashboard;

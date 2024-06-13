import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [revenue, setRevenue] = useState(0);
  const [totalCosts, setTotalCosts] = useState({});
  const [grossProfit, setGrossProfit] = useState({});
  const [profitMargin, setProfitMargin] = useState(0);
  const [breakEvenPoint, setBreakEvenPoint] = useState(0);

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
      .then(data => setProfitMargin(data.profitMargin))
      .catch(error => console.error('Error fetching profit margin:', error));

    fetch('/api/kpis/break-even-point')
      .then(response => response.json())
      .then(data => setBreakEvenPoint(data.breakEvenPoint))
      .catch(error => console.error('Error fetching break-even point:', error));
  }, []);

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
        <p>{profitMargin}%</p>
      </div>
      <div>
        <h3>Break-Even Point (in units)</h3>
        <p>{breakEvenPoint}</p>
      </div>
    </div>
  );
};

export default Dashboard;

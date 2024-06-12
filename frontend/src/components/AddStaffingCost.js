import React, { useState } from 'react';

const AddStaffingCost = () => {
  const [date, setDate] = useState('');
  const [period, setPeriod] = useState('');
  const [employee, setEmployee] = useState('');
  const [amount, setAmount] = useState('');
  const [paid, setPaid] = useState(true);
  const [items, setItems] = useState([{ line_item: '', quantity: '', unit: '', unit_price: '', amount: '' }]);

  const handleAddItem = () => {
    setItems([...items, { line_item: '', quantity: '', unit: '', unit_price: '', amount: '' }]);
  };

  const handleItemChange = (index, event) => {
    const { name, value } = event.target;
    const newItems = items.slice();
    newItems[index][name] = value;

    if (name === 'quantity' || name === 'unit_price') {
      newItems[index].amount = (newItems[index].quantity * newItems[index].unit_price).toFixed(2);
    }

    setItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newOrder = {
      date,
      period,
      employee,
      amount: parseFloat(amount).toFixed(2),
      paid,
      items: items.map(item => ({
        line_item: item.line_item,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        amount: item.amount
      }))
    };

    fetch('/api/staffing-costs/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newOrder),
    })
      .then(response => response.json())
      .then(data => {
        setDate('');
        setPeriod('');
        setEmployee('');
        setAmount('');
        setPaid(true);
        setItems([{ line_item: '', quantity: '', unit: '', unit_price: '', amount: '' }]);
        console.log('Staffing Cost created:', data);
      })
      .catch((error) => {
        console.error('Error creating Staffing Cost:', error);
      });
  };

  return (
    <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'start', minHeight: '100vh' }}>
      <form onSubmit={handleSubmit}>
        <h2>Create Staffing Cost</h2>
        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        <label>Period</label>
        <input type="text" value={period} onChange={(e) => setPeriod(e.target.value)} required />

        <label>Employee</label>
        <input type="text" value={employee} onChange={(e) => setEmployee(e.target.value)} required />

        <label>Amount</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />

        <h3>Items</h3>
        {items.map((item, index) => (
          <div key={index}>
            <label>Line Item</label>
            <input type="text" name="line_item" value={item.line_item} onChange={(e) => handleItemChange(index, e)} required />

            <label>Quantity</label>
            <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} required />

            <label>Unit</label>
            <input type="text" name="unit" value={item.unit} onChange={(e) => handleItemChange(index, e)} required />

            <label>Unit Price</label>
            <input type="number" name="unit_price" value={item.unit_price} onChange={(e) => handleItemChange(index, e)} required />

            <label>Amount</label>
            <input type="number" name="amount" value={item.amount} onChange={(e) => handleItemChange(index, e)} required />
          </div>
        ))}
        <button type="button" onClick={handleAddItem}>Add Item</button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddStaffingCost;

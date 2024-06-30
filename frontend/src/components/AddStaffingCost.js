import React, { useState } from 'react';

const AddStaffingCost = () => {
  const [date, setDate] = useState('');
  const [period, setPeriod] = useState('');
  const [employee, setEmployee] = useState('');
  const [amount, setAmount] = useState('');
  const [paid, setPaid] = useState(true);
  const [items, setItems] = useState([{ line_item: '', quantity: '', unit: '', unit_price: '', amount: '' }]);
  const [errors, setErrors] = useState({});

  const handleAddItem = () => {
    setItems([...items, { line_item: '', quantity: '', unit: '', unit_price: '', amount: '' }]);
  };

  const handleItemChange = (index, event) => {
    const { name, value } = event.target;
    const newItems = [...items];
    newItems[index][name] = value;

    if (name === 'quantity' || name === 'unit_price') {
      newItems[index].amount = (newItems[index].quantity * newItems[index].unit_price).toFixed(2);
    }

    setItems(newItems);
  };

  const validateInput = () => {
    const errors = {};

    if (!date) errors.date = 'Date is required.';
    if (!period) errors.period = 'Period is required.';
    if (!employee) errors.employee = 'Employee is required.';
    if (!amount || amount <= 0) errors.amount = 'Amount must be a positive number.';

    items.forEach((item, index) => {
      if (!item.line_item) errors[`items[${index}].line_item`] = 'Line item is required.';
      if (!item.quantity || item.quantity <= 0) errors[`items[${index}].quantity`] = 'Quantity must be a positive number.';
      if (!item.unit) errors[`items[${index}].unit`] = 'Unit is required.';
      if (!item.unit_price || item.unit_price <= 0) errors[`items[${index}].unit_price`] = 'Unit price must be a positive number.';
      if (!item.amount || item.amount <= 0) errors[`items[${index}].amount`] = 'Amount must be a positive number.';
    });

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateInput();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

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
        setErrors({});
      })
      .catch((error) => {
        console.error('Error creating Staffing Cost:', error);
      });
  };

  return (
    <div style={{ marginTop: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', width: '100%' }}>
        <h2>Create Staffing Cost</h2>
        {errors.date && <p style={{ color: 'red' }}>{errors.date}</p>}
        <label htmlFor="date">Date</label>
        <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        {errors.period && <p style={{ color: 'red' }}>{errors.period}</p>}
        <label htmlFor="period">Period</label>
        <input id="period" type="text" value={period} onChange={(e) => setPeriod(e.target.value)} required />

        {errors.employee && <p style={{ color: 'red' }}>{errors.employee}</p>}
        <label htmlFor="employee">Employee</label>
        <input id="employee" type="text" value={employee} onChange={(e) => setEmployee(e.target.value)} required />

        <h3>Items</h3>
        {items.map((item, index) => (
          <div key={index}>
            {errors[`items[${index}].line_item`] && <p style={{ color: 'red' }}>{errors[`items[${index}].line_item`]}</p>}
            <label htmlFor={`line_item_${index}`}>Line Item</label>
            <input id={`line_item_${index}`} type="text" name="line_item" value={item.line_item} onChange={(e) => handleItemChange(index, e)} required />

            {errors[`items[${index}].quantity`] && <p style={{ color: 'red' }}>{errors[`items[${index}].quantity`]}</p>}
            <label htmlFor={`quantity_${index}`}>Quantity</label>
            <input id={`quantity_${index}`} type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} required />

            {errors[`items[${index}].unit`] && <p style={{ color: 'red' }}>{errors[`items[${index}].unit`]}</p>}
            <label htmlFor={`unit_${index}`}>Unit</label>
            <input id={`unit_${index}`} type="text" name="unit" value={item.unit} onChange={(e) => handleItemChange(index, e)} required />

            {errors[`items[${index}].unit_price`] && <p style={{ color: 'red' }}>{errors[`items[${index}].unit_price`]}</p>}
            <label htmlFor={`unit_price_${index}`}>Unit Price</label>
            <input id={`unit_price_${index}`} type="number" name="unit_price" value={item.unit_price} onChange={(e) => handleItemChange(index, e)} required />

            {errors[`items[${index}].amount`] && <p style={{ color: 'red' }}>{errors[`items[${index}].amount`]}</p>}
            <label htmlFor={`amount_${index}`}>Amount</label>
            <input id={`amount_${index}`} type="number" name="amount" value={item.amount} onChange={(e) => handleItemChange(index, e)} required />
          </div>
        ))}
        <button type="button" onClick={handleAddItem}>Add Item</button>
        <h3>Total Amount: {items.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0).toFixed(2)}</h3>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddStaffingCost;

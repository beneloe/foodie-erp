import React, { useState } from 'react';

const AddOtherCost = () => {
  const [date, setDate] = useState('');
  const [vendor, setVendor] = useState('');
  const [paid, setPaid] = useState(true);
  const [status, setStatus] = useState('done');
  const [items, setItems] = useState([{ line_item: '', quantity: '', unit: '', unit_price: '', amount: '' }]);
  const [errors, setErrors] = useState([]);

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

  const validateForm = () => {
    const validationErrors = [];

    if (!date) validationErrors.push('Date is required.');
    if (!vendor) validationErrors.push('Vendor is required.');
    items.forEach((item, index) => {
      if (!item.line_item) validationErrors.push(`Item ${index + 1}: Line item is required.`);
      if (!item.quantity || item.quantity <= 0) validationErrors.push(`Item ${index + 1}: Quantity must be a positive number.`);
      if (!item.unit) validationErrors.push(`Item ${index + 1}: Unit is required.`);
      if (!item.unit_price || item.unit_price <= 0) validationErrors.push(`Item ${index + 1}: Unit price must be a positive number.`);
      if (!item.amount || item.amount <= 0) validationErrors.push(`Item ${index + 1}: Amount must be a positive number.`);
    });

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newOrder = {
      date,
      vendor,
      amount: items.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0).toFixed(2),
      paid,
      status,
      items: items.map(item => ({
        line_item: item.line_item,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        amount: item.amount
      }))
    };

    fetch("/api/other-costs/add", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newOrder),
    })
      .then(response => response.json())
      .then(data => {
        setDate('');
        setVendor('');
        setPaid(true);
        setStatus('done');
        setItems([{ line_item: '', quantity: '', unit: '', unit_price: '', amount: '' }]);
      })
      .catch((error) => {
        console.error('Error creating Other Cost:', error);
      });
  };

  const totalAmount = items.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0).toFixed(2);

  return (
    <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'start', minHeight: '100vh' }}>
      <form onSubmit={handleSubmit}>
        <h2>Create Other Cost</h2>
        {errors.length > 0 && (
          <div style={{ color: 'red' }}>
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
        <label htmlFor="date">Date</label>
        <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        <label htmlFor="vendor">Vendor</label>
        <input id="vendor" type="text" value={vendor} onChange={(e) => setVendor(e.target.value)} required />

        <h3>Items</h3>
        {items.map((item, index) => (
          <div key={index}>
            <label htmlFor={`line_item_${index}`}>Line Item</label>
            <input id={`line_item_${index}`} type="text" name="line_item" value={item.line_item} onChange={(e) => handleItemChange(index, e)} required />

            <label htmlFor={`quantity_${index}`}>Quantity</label>
            <input id={`quantity_${index}`} type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} required />

            <label htmlFor={`unit_${index}`}>Unit</label>
            <input id={`unit_${index}`} type="text" name="unit" value={item.unit} onChange={(e) => handleItemChange(index, e)} required />

            <label htmlFor={`unit_price_${index}`}>Unit Price</label>
            <input id={`unit_price_${index}`} type="number" name="unit_price" value={item.unit_price} onChange={(e) => handleItemChange(index, e)} required />

            <label htmlFor={`amount_${index}`}>Amount</label>
            <input id={`amount_${index}`} type="number" name="amount" value={item.amount} onChange={(e) => handleItemChange(index, e)} required />
          </div>
        ))}
        <button type="button" onClick={handleAddItem}>Add Item</button>
        <h3>Total Amount: {totalAmount}</h3>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddOtherCost;

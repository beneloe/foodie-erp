import React, { useState } from 'react';

const AddServiceCost = () => {
  const [date, setDate] = useState('');
  const [vendor, setVendor] = useState('');
  const [paid, setPaid] = useState(true);
  const [status, setStatus] = useState('done');
  const [items, setItems] = useState([{ service_description: '', quantity: '', unit: '', unit_price: '', amount: '' }]);

  const handleAddItem = () => {
    setItems([...items, { service_description: '', quantity: '', unit: '', unit_price: '', amount: '' }]);
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
      vendor,
      amount: items.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0).toFixed(2),
      paid,
      status,
      items: items.map(item => ({
        service_description: item.service_description,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        amount: item.amount
      }))
    };

    fetch('/api/service-costs/add', {
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
        setItems([{ service_description: '', quantity: '', unit: '', unit_price: '', amount: '' }]);
        console.log('Service Cost created:', data);
      })
      .catch((error) => {
        console.error('Error creating Service Cost:', error);
      });
  };

  const totalAmount = items.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0).toFixed(2);

  return (
    <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'start', minHeight: '100vh' }}>
      <form onSubmit={handleSubmit}>
        <h2>Create Service Cost</h2>
        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        <label>Vendor</label>
        <input type="text" value={vendor} onChange={(e) => setVendor(e.target.value)} required />

        <h3>Items</h3>
        {items.map((item, index) => (
          <div key={index}>
            <label>Service Description</label>
            <input type="text" name="service_description" value={item.service_description} onChange={(e) => handleItemChange(index, e)} required />

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
        <h3>Total Amount: {totalAmount}</h3>
        <button type="submit">Submit</button>
        </form>
    </div>
  );
};

export default AddServiceCost;

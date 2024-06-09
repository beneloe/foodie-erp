import React, { useState, useEffect } from 'react';

const AddSalesOrder = () => {
  const [date, setDate] = useState('');
  const [customer, setCustomer] = useState('');
  const [paid, setPaid] = useState(true);
  const [delivered, setDelivered] = useState(true);
  const [items, setItems] = useState([{ item_name: '', quantity: '', unit: '', unit_price: '', amount: '' }]);
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    fetch('/api/inventory')
      .then(response => response.json())
      .then(data => setInventoryItems(data))
      .catch(error => console.error('Error fetching inventory items:', error));
  }, []);

  const handleAddItem = () => {
    setItems([...items, { item_name: '', quantity: '', unit: '', unit_price: '', amount: '' }]);
  };

  const handleItemChange = (index, event) => {
    const { name, value } = event.target;
    const newItems = items.slice();
    newItems[index][name] = value;

    if (name === 'item_name') {
      const selectedItem = inventoryItems.find(item => item.item_name === value);
      if (selectedItem) {
        newItems[index].unit = selectedItem.unit;
        newItems[index].unit_price = selectedItem.price;
      }
    }

    if (name === 'quantity') {
      const selectedItem = inventoryItems.find(item => item.item_name === newItems[index].item_name);
      if (selectedItem) {
        newItems[index].amount = (selectedItem.price * value).toFixed(2);
      }
    }

    setItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newOrder = {
      date,
      customer,
      amount: items.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0).toFixed(2),
      paid,
      delivered,
      items: items.map(item => ({
        inventory_item_id: inventoryItems.find(i => i.item_name === item.item_name)?.id,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        amount: item.amount
      }))
    };

    fetch('/api/sales-orders/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newOrder),
    })
      .then(response => response.json())
      .then(data => {
        setDate('');
        setCustomer('');
        setPaid(true);
        setDelivered(true);
        setItems([{ item_name: '', quantity: '', unit: '', unit_price: '', amount: '' }]);
        console.log('Sales Order created:', data);
      })
      .catch((error) => {
        console.error('Error creating Sales Order:', error);
      });
  };

  const totalAmount = items.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0).toFixed(2);

  return (
    <div style={{ "margin-top": "30px", display: 'flex', flexDirection: 'column', alignItems: 'start', minHeight: '100vh' }}>
      <form onSubmit={handleSubmit}>
        <h2>Create Sales Order</h2>
        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        <label>Customer</label>
        <input type="text" value={customer} onChange={(e) => setCustomer(e.target.value)} required />

        <h3>Items</h3>
        {items.map((item, index) => (
          <div key={index}>
            <label>Item Name</label>
            <select name="item_name" value={item.item_name} onChange={(e) => handleItemChange(index, e)} required>
              <option value="">Select Item</option>
              {inventoryItems.map((inventoryItem) => (
                <option key={inventoryItem.id} value={inventoryItem.item_name}>{inventoryItem.item_name}</option>
              ))}
            </select>

            <label>Quantity</label>
            <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} required />

            <label>Unit</label>
            <input type="text" name="unit" value={item.unit} readOnly />

            <label>Unit Price</label>
            <input type="number" name="unit_price" value={item.unit_price} readOnly />

            <label>Amount</label>
            <input type="number" name="amount" value={item.amount} readOnly />
          </div>
        ))}
        <button type="button" onClick={handleAddItem}>Add Item</button>
        <h3>Total Amount: {totalAmount}</h3>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddSalesOrder;

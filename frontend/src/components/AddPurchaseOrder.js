import React, { useState, useEffect } from 'react';

const AddPurchaseOrder = () => {
  const [date, setDate] = useState('');
  const [vendor, setVendor] = useState('');
  const [paid, setPaid] = useState(true);
  const [received, setReceived] = useState(true);
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
        newItems[index].quantity = Math.min(newItems[index].quantity, selectedItem.stock);
      } else {
        newItems[index].unit = '';
        newItems[index].unit_price = '';
      }
    } else if (name === 'quantity') {
      const selectedItem = inventoryItems.find(item => item.item_name === newItems[index].item_name);
      if (selectedItem) {
        newItems[index].amount = (newItems[index].quantity * newItems[index].unit_price).toFixed(2);
      }
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
      received,
      items: items.map(item => ({
        inventory_item_id: inventoryItems.find(i => i.item_name === item.item_name)?.id,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        amount: item.amount
      }))
    };

    fetch('/api/purchase-orders/add', {
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
        setReceived(true);
        setItems([{ item_name: '', quantity: '', unit: '', unit_price: '', amount: '' }]);
        console.log('Purchase Order created:', data);
      })
      .catch((error) => {
        console.error('Error creating Purchase Order:', error);
      });
  };

  const totalAmount = items.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0).toFixed(2);

  return (
    <div style={{ "margin-top": "30px", display: 'flex', flexDirection: 'column', alignItems: 'start', minHeight: '100vh' }}>
      <form onSubmit={handleSubmit}>
        <h2>Create Purchase Order</h2>
        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        <label>Vendor</label>
        <input type="text" value={vendor} onChange={(e) => setVendor(e.target.value)} required />

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

export default AddPurchaseOrder;

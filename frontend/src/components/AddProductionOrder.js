import React, { useState, useEffect } from 'react';

const AddProductionOrder = () => {
  const [date, setDate] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [status, setStatus] = useState('done');
  const [items, setItems] = useState([{ item_name: '', quantity_used: '', unit: '', unit_price: '', amount: '' }]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetch('/api/inventory')
      .then(response => response.json())
      .then(data => setInventoryItems(data))
      .catch(error => console.error('Error fetching inventory items:', error));
  }, []);

  const handleAddItem = () => {
    setItems([...items, { item_name: '', quantity_used: '', unit: '', unit_price: '', amount: '' }]);
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

    if (name === 'quantity_used') {
      const selectedItem = inventoryItems.find(item => item.item_name === newItems[index].item_name);
      if (selectedItem) {
        newItems[index].amount = (selectedItem.price * value).toFixed(2);
      }
    }

    setItems(newItems);
    updateTotalAmount(newItems);
  };

  const updateTotalAmount = (items) => {
    const total = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    setTotalAmount(total.toFixed(2));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newOrder = {
      date,
      product_name: productName,
      quantity,
      status,
      items: items.map(item => ({
        inventory_item_id: inventoryItems.find(i => i.item_name === item.item_name)?.id,
        quantity_used: item.quantity_used,
        unit: item.unit,
        unit_price: item.unit_price,
        amount: item.amount
      }))
    };

    fetch('/api/production-orders/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newOrder),
    })
      .then(response => response.json())
      .then(data => {
        setDate('');
        setProductName('');
        setQuantity('');
        setStatus('done');
        setItems([{ item_name: '', quantity_used: '', unit: '', unit_price: '', amount: '' }]);
        setTotalAmount(0);
        console.log('Production Order created:', data);
      })
      .catch((error) => {
        console.error('Error creating Production Order:', error);
      });
  };

  return (
    <div style={{ "margin-top": "30px", display: 'flex', flexDirection: 'column', alignItems: 'start', minHeight: '100vh' }}>
      <form onSubmit={handleSubmit}>
        <h2>Create Production Order</h2>
        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        <label>Product Name</label>
        <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required />

        <label>Quantity</label>
        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />

        <h3>Items</h3>
        {items.map((item, index) => (
          <div key={index}>
            <label>Item Name</label>
            <select name="item_name" value={item.item_name} onChange={(e) => handleItemChange(index, e)} required>
              <option value="">Select Item</option>
              {inventoryItems.map(inventoryItem => (
                <option key={inventoryItem.id} value={inventoryItem.item_name}>{inventoryItem.item_name}</option>
              ))}
            </select>

            <label>Quantity Used</label>
            <input type="number" name="quantity_used" value={item.quantity_used} onChange={(e) => handleItemChange(index, e)} required />

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

export default AddProductionOrder;

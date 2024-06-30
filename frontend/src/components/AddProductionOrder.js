import React, { useState, useEffect } from 'react';

const AddProductionOrder = () => {
  const [date, setDate] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [status, setStatus] = useState('done');
  const [items, setItems] = useState([{ item_name: '', quantity_used: '', unit: '', unit_price: '', amount: '' }]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [errors, setErrors] = useState([]);

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
    const newItems = [...items];
  
    if (['item_name', 'quantity_used', 'unit', 'unit_price', 'amount'].includes(name)) {
      newItems[index] = { ...newItems[index], [name]: name === 'quantity_used' || name === 'unit_price' ? parseFloat(value) : value };
    }
  
    if (name === 'item_name') {
      const selectedItem = inventoryItems.find(item => item.item_name === value);
      if (selectedItem) {
        newItems[index] = {
          ...newItems[index],
          unit: selectedItem.unit,
          unit_price: selectedItem.price,
        };
      }
    }
  
    if (name === 'quantity_used') {
      const selectedItem = inventoryItems.find(item => item.item_name === newItems[index].item_name);
      if (selectedItem) {
        newItems[index] = {
          ...newItems[index],
          amount: (selectedItem.price * parseFloat(value)).toFixed(2),
        };
      }
    }
  
    setItems(newItems);
    updateTotalAmount(newItems);
  };
  
  const updateTotalAmount = (items) => {
    const total = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    setTotalAmount(total.toFixed(2));
  };
  
  const validateForm = () => {
    const validationErrors = [];
    if (!date) validationErrors.push('Date is required.');
    if (!productName) validationErrors.push('Product name is required.');
    if (!quantity || quantity <= 0) validationErrors.push('Quantity must be a positive number.');
    items.forEach((item, index) => {
      if (!item.item_name) validationErrors.push(`Item ${index + 1}: Item name is required.`);
      if (!item.quantity_used || item.quantity_used <= 0) validationErrors.push(`Item ${index + 1}: Quantity used must be a positive number.`);
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
      product_name: productName,
      quantity: parseFloat(quantity),
      status,
      items: items.map(item => ({
        inventory_item_id: inventoryItems.find(i => i.item_name === item.item_name)?.id,
        quantity_used: parseFloat(item.quantity_used),
        unit: item.unit,
        unit_price: parseFloat(item.unit_price),
        amount: parseFloat(item.amount)
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
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setDate('');
          setProductName('');
          setQuantity('');
          setStatus('done');
          setItems([{ item_name: '', quantity_used: '', unit: '', unit_price: '', amount: '' }]);
          setTotalAmount(0);
        }
      })
      .catch((error) => {
        console.error('Error creating Production Order:', error);
      });
  };
  
  return (
    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px', width: '100%' }}>
        <h2>Create Production Order</h2>
        {errors.length > 0 && (
          <div style={{ color: 'red' }}>
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
        <label htmlFor="date">Date</label>
        <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
  
        <label htmlFor='productName'>Product Name</label>
        <input id="productName" type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required />
  
        <label htmlFor='quantity'>Quantity</label>
        <input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
  
        <h3>Items</h3>
        {items.map((item, index) => (
          <div key={index}>
            <label htmlFor={`item_name_${index}`}>Item Name</label>
            <select id={`item_name_${index}`} name="item_name" value={item.item_name} onChange={(e) => handleItemChange(index, e)} required>
              <option value="">Select Item</option>
              {inventoryItems.map(inventoryItem => (
                <option key={inventoryItem.id} value={inventoryItem.item_name}>{inventoryItem.item_name}</option>
              ))}
            </select>
  
            <label htmlFor={`quantity_used_${index}`}>Quantity Used</label>
            <input id={`quantity_used_${index}`} type="number" name="quantity_used" value={item.quantity_used} onChange={(e) => handleItemChange(index, e)} required />
  
            <label htmlFor={`unit_${index}`}>Unit</label>
            <input id={`unit_${index}`} type="text" name="unit" value={item.unit} onChange={(e) => handleItemChange(index, e)} required />
  
            <label htmlFor={`unit_price_${index}`}>Unit Price</label>
            <input id={`unit_price_${index}`} type="number" name="unit_price" value={item.unit_price} onChange={(e) => handleItemChange(index, e)} required />
  
            <label htmlFor={`amount_${index}`}>Amount</label>
            <input id={`amount_${index}`} type="number" name="amount" value={item.amount} readOnly />
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

import React, { useState } from 'react';

const AddInventoryItem = () => {
  const [itemName, setItemName] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateInput = () => {
    if (!itemName || !stock || !unit || !price) {
      return 'All fields are required.';
    }
    if (!/^[a-zA-Z0-9\s]+$/.test(itemName)) {
      return 'Item Name contains invalid characters.';
    }
    if (isNaN(stock) || stock <= 0) {
      return 'Stock must be a positive number.';
    }
    if (!/^[a-zA-Z]+$/.test(unit)) {
      return 'Unit contains invalid characters.';
    }
    if (isNaN(price) || price <= 0) {
      return 'Price must be a positive number.';
    }
    return null;
  };

  const sanitizeInput = (input) => {
    return input.replace(/[<>]/g, '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const errorMessage = validateInput();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    const newItem = {
      item_name: sanitizeInput(itemName),
      stock: parseFloat(stock),
      unit: sanitizeInput(unit),
      price: parseFloat(price)
    };

    fetch("/api/inventory/add", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setItemName('');
      setStock('');
      setUnit('');
      setPrice('');
      setSuccess('Item added successfully!');
    })
    .catch((error) => {
      console.error('There was an error adding the item!', error);
      setError('There was an error adding the item!');
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <h2>Add New Item</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', width: '100%' }}>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>{success}</div>}
        
        <label htmlFor="itemName">Item Name</label>
        <input id="itemName" type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
        
        <label htmlFor="stock">Stock</label>
        <input id="stock" type="text" value={stock} onChange={(e) => setStock(e.target.value)} required />
        
        <label htmlFor="unit">Unit</label>
        <input id="unit" type="text" value={unit} onChange={(e) => setUnit(e.target.value)} required />
        
        <label htmlFor="price">Price</label>
        <input id="price" type="text" value={price} onChange={(e) => setPrice(e.target.value)} required />
        
        <button type="submit">Add New</button>
      </form>
    </div>
  );
};

export default AddInventoryItem;

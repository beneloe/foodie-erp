import React, { useState } from 'react';

const AddItem = () => {
  const [itemName, setItemName] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState('');
  const [startingQuantity, setStartingQuantity] = useState('');
  const [picture, setPicture] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newItem = {
      item_name: itemName,
      stock,
      unit,
      price,
      starting_quantity: startingQuantity,
      picture
    };

    fetch('/api/inventory/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem),
    })
    .then(response => response.json())
    .then(data => {
      setItemName('');
      setStock('');
      setUnit('');
      setPrice('');
      setStartingQuantity('');
      setPicture('');
    })
    .catch((error) => {
      console.error('There was an error adding the item!', error);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <h2>Add New Item</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', width: '100%' }}>
        <label>Item Name</label>
        <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} required />

        <label>Stock</label>
        <input type="text" value={stock} onChange={(e) => setStock(e.target.value)} required />

        <label>Unit</label>
        <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} required />

        <label>Price</label>
        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} required />

        <label>Starting Quantity</label>
        <input type="text" value={startingQuantity} onChange={(e) => setStartingQuantity(e.target.value)} required />

        <label>Picture</label>
        <input type="file" onChange={(e) => setPicture(e.target.files[0])} required />

        <button type="submit">Add New</button>
      </form>
    </div>
  );
};

export default AddItem;

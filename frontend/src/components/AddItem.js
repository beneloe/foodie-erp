import React, { useState } from 'react';

const AddItem = () => {
  const [itemName, setItemName] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState('');
  const [startingQuantity, setStartingQuantity] = useState('');
  const [picture, setPicture] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('/api/inventory/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        item_name: itemName,
        stock,
        unit,
        price,
        starting_quantity: startingQuantity,
        picture
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('There was an error adding the item!', error);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Item Name</label>
        <input 
          type="text" 
          value={itemName} 
          onChange={e => setItemName(e.target.value)} 
        />
      </div>
      <div>
        <label>Stock</label>
        <input 
          type="text" 
          value={stock} 
          onChange={e => setStock(e.target.value)} 
        />
      </div>
      <div>
        <label>Unit</label>
        <input 
          type="text" 
          value={unit} 
          onChange={e => setUnit(e.target.value)} 
        />
      </div>
      <div>
        <label>Price</label>
        <input 
          type="text" 
          value={price} 
          onChange={e => setPrice(e.target.value)} 
        />
      </div>
      <div>
        <label>Starting Quantity</label>
        <input 
          type="text" 
          value={startingQuantity} 
          onChange={e => setStartingQuantity(e.target.value)} 
        />
      </div>
      <div>
        <label>Picture URL</label>
        <input 
          type="text" 
          value={picture} 
          onChange={e => setPicture(e.target.value)} 
        />
      </div>
      <button type="submit">Add Item</button>
    </form>
  );
};

export default AddItem;

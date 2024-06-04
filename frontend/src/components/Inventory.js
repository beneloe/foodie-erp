import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Inventory = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('/api/inventory').then(response => {
      setItems(response.data);
    });
  }, []);

  return (
    <div>
      <h1>Inventory</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <strong>{item.item_name}</strong>
            <ul>
              <li>Stock: {item.stock}</li>
              <li>Unit: {item.unit}</li>
              <li>Price: ${item.price}</li>
              <li>Starting Quantity: {item.starting_quantity}</li>
              <li>Picture: <img src={item.picture} alt={item.item_name} width="50" /></li>
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Inventory;

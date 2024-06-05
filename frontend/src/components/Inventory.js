import React, { useEffect, useState } from 'react';

const Inventory = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/inventory')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('There was an error fetching the inventory!', error));
  }, []);

  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          {item.item_name}: Stock: {item.stock} Unit: {item.unit} Price: ${item.price} Starting Quantity: {item.starting_quantity}
        </div>
      ))}
    </div>
  );
};

export default Inventory;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
      <h1>Inventory</h1>
      <input type="text" placeholder="Search Inventory..." />
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.item_name}</td>
              <td>{item.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/inventory/create">Add New</Link>
    </div>
  );
};

export default Inventory;

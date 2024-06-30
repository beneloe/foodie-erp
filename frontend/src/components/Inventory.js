import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/inventory')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setItems(data))
      .catch(error => {
        console.error('There was an error fetching the inventory!', error);
        setError('There was an error fetching the inventory!');
      });
  }, []);

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>Inventory</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}>
        <thead>
          <tr>
            <th style={{ padding: '0 10px' }}>#</th>
            <th style={{ padding: '0 10px' }}>Item</th>
            <th style={{ padding: '0 10px' }}>Stock</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td style={{ padding: '0 10px' }}>{index + 1}</td>
              <td style={{ padding: '0 10px' }}>{item.item_name}</td>
              <td style={{ padding: '0 10px' }}>{item.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '30px' }}>
        <Link to="/inventory/create">Add New</Link>
      </div>
    </div>
  );
};

export default Inventory;

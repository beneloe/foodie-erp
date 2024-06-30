import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const { token } = useContext(AuthContext);

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
    <div style={{ marginTop: '50px' }}>
      <h2>Inventory</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
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
      <div style={{ marginTop: '30px' }}>
        <Link to="/inventory/create">Add New</Link>
      </div>
    </div>
  );
};

export default Inventory;

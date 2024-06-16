import React, { useState, useEffect } from 'react';

const AddSalesOrder = () => {
  const [date, setDate] = useState('');
  const [customer, setCustomer] = useState('');
  const [paid, setPaid] = useState(true);
  const [delivered, setDelivered] = useState(true);
  const [items, setItems] = useState([{ item_name: '', quantity: '', unit: '', unit_price: '', amount: '' }]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch('/api/inventory')
      .then(response => response.json())
      .then(data => setInventoryItems(data))
      .catch(error => console.error('Error fetching inventory items:', error));
  }, []);

  const handleAddItem = () => {
    setItems([...items, { item_name: '', quantity: '', unit: '', unit_price: '', amount: '' }]);
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

    if (name === 'quantity') {
      const selectedItem = inventoryItems.find(item => item.item_name === newItems[index].item_name);
      if (selectedItem) {
        newItems[index].amount = (selectedItem.price * value).toFixed(2);
      }
    }

    setItems(newItems);
  };

  const validateInput = () => {
    const errors = {};

    if (!date) {
      errors.date = 'Date is required';
    }
    if (!customer) {
      errors.customer = 'Customer is required';
    }
    if (items.length === 0) {
      errors.items = 'At least one item is required';
    }

    items.forEach((item, index) => {
      if (!item.item_name) {
        errors[`items[${index}].item_name`] = 'Item name is required';
      }
      if (!item.quantity || item.quantity <= 0) {
        errors[`items[${index}].quantity`] = 'Quantity must be a positive number';
      }
      if (!item.unit) {
        errors[`items[${index}].unit`] = 'Unit is required';
      }
      if (!item.unit_price || item.unit_price <= 0) {
        errors[`items[${index}].unit_price`] = 'Unit price must be a positive number';
      }
      if (!item.amount || item.amount <= 0) {
        errors[`items[${index}].amount`] = 'Amount must be a positive number';
      }
    });

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateInput();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const newOrder = {
      date,
      customer,
      amount: items.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0).toFixed(2),
      paid,
      delivered,
      items: items.map(item => ({
        inventory_item_id: inventoryItems.find(i => i.item_name === item.item_name)?.id,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        amount: item.amount
      }))
    };

    fetch('/api/sales-orders/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newOrder),
    })
      .then(response => response.json())
      .then(data => {
        setDate('');
        setCustomer('');
        setPaid(true);
        setDelivered(true);
        setItems([{ item_name: '', quantity: '', unit: '', unit_price: '', amount: '' }]);
        setErrors({});
        console.log('Sales Order created:', data);
      })
      .catch((error) => {
        console.error('Error creating Sales Order:', error);
      });
  };

  const totalAmount = items.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0).toFixed(2);

  return (
    <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'start', minHeight: '100vh' }}>
      <form onSubmit={handleSubmit}>
        <h2>Create Sales Order</h2>
        {errors.date && <p style={{ color: 'red' }}>{errors.date}</p>}
        <label htmlFor="date">Date</label>
        <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        {errors.customer && <p style={{ color: 'red' }}>{errors.customer}</p>}
        <label htmlFor="customer">Customer</label>
        <input id="customer" type="text" value={customer} onChange={(e) => setCustomer(e.target.value)} required />

        <h3>Items</h3>
        {items.map((item, index) => (
          <div key={index}>
            {errors[`items[${index}].item_name`] && <p style={{ color: 'red' }}>{errors[`items[${index}].item_name`]}</p>}
            <label htmlFor={`item_name_${index}`}>Item Name</label>
            <select id={`item_name_${index}`} name="item_name" value={item.item_name} onChange={(e) => handleItemChange(index, e)} required>
              <option value="">Select Item</option>
              {inventoryItems.map((inventoryItem) => (
                <option key={inventoryItem.id} value={inventoryItem.item_name}>{inventoryItem.item_name}</option>
              ))}
            </select>

            {errors[`items[${index}].quantity`] && <p style={{ color: 'red' }}>{errors[`items[${index}].quantity`]}</p>}
            <label htmlFor={`quantity_${index}`}>Quantity</label>
            <input id={`quantity_${index}`} name="quantity" type="number" value={item.quantity} onChange={(e) => handleItemChange(index, e)} required />

            {errors[`items[${index}].unit`] && <p style={{ color: 'red' }}>{errors[`items[${index}].unit`]}</p>}
            <label htmlFor={`unit_${index}`}>Unit</label>
            <input id={`unit_${index}`} name="unit" type="text" value={item.unit} onChange={(e) => handleItemChange(index, e)} required />

            {errors[`items[${index}].unit_price`] && <p style={{ color: 'red' }}>{errors[`items[${index}].unit_price`]}</p>}
            <label htmlFor={`unit_price_${index}`}>Unit Price</label>
            <input id={`unit_price_${index}`} name="unit_price" type="number" value={item.unit_price} onChange={(e) => handleItemChange(index, e)} required />

            {errors[`items[${index}].amount`] && <p style={{ color: 'red' }}>{errors[`items[${index}].amount`]}</p>}
            <label htmlFor={`amount_${index}`}>Amount</label>
            <input id={`amount_${index}`} name="amount" type="number" value={item.amount} onChange={(e) => handleItemChange(index, e)} required />
          </div>
        ))}
        <button type="button" onClick={handleAddItem}>Add Item</button>
        <h3>Total Amount: {totalAmount}</h3>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddSalesOrder;

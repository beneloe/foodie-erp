import React from 'react';
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import Inventory from '../Inventory';

jest.mock('axios');

test('fetches and displays inventory items', async () => {
  axios.get.mockResolvedValue({
    data: [
      {
        id: 1,
        item_name: "Tomato",
        stock: 450,
        unit: "grams",
        price: 0.10,
        starting_quantity: 300,
        picture: "picture.jpeg"
      }
    ]
  });

  render(<Inventory />);

  const itemName = await screen.findByText('Tomato');
  expect(itemName).toBeInTheDocument();

  const itemStock = await screen.findByText('Stock: 450');
  expect(itemStock).toBeInTheDocument();

  const itemUnit = await screen.findByText('Unit: grams');
  expect(itemUnit).toBeInTheDocument();

  const itemPrice = await screen.findByText('Price: $0.10');
  expect(itemPrice).toBeInTheDocument();

  const itemStartingQuantity = await screen.findByText('Starting Quantity: 300');
  expect(itemStartingQuantity).toBeInTheDocument();

  const itemPicture = await screen.findByAltText('Tomato');
  expect(itemPicture).toBeInTheDocument();
});

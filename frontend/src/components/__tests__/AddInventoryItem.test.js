import React from 'react';
import { render, screen } from '@testing-library/react';
import AddInventoryItem from '../AddInventoryItem';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: 'Item added successfully' }),
  })
);

test('renders AddInventoryItem component', () => {
  render(<AddInventoryItem />);
  expect(screen.getByText(/Add New Item/i)).toBeInTheDocument();
});

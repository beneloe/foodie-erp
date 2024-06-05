import React from 'react';
import { render, screen } from '@testing-library/react';
import AddItem from '../AddItem';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: 'Item added successfully' }),
  })
);

test('renders AddItem component', () => {
  render(<AddItem />);
  expect(screen.getByText(/Add Item/i)).toBeInTheDocument();
});

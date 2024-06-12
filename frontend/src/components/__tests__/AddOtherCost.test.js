import React from 'react';
import { render, screen } from '@testing-library/react';
import AddOtherCost from '../AddOtherCost';

test('renders form for adding other cost', () => {
  render(<AddOtherCost />);

  expect(screen.getByText(/Create Other Cost/i)).toBeInTheDocument();
  expect(screen.getByText(/Items/i)).toBeInTheDocument();
  expect(screen.getByText(/Add Item/i)).toBeInTheDocument();
  expect(screen.getByText(/Total Amount:/i)).toBeInTheDocument();
  expect(screen.getByText(/Submit/i)).toBeInTheDocument();
});

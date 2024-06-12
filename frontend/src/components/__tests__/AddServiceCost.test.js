import React from 'react';
import { render, screen } from '@testing-library/react';
import AddServiceCost from '../AddServiceCost';

test('renders form for adding service cost', () => {
  render(<AddServiceCost />);

  expect(screen.getByText(/Create Service Cost/i)).toBeInTheDocument();
  expect(screen.getByText(/Items/i)).toBeInTheDocument();
  expect(screen.getByText(/Add Item/i)).toBeInTheDocument();
  expect(screen.getByText(/Total Amount:/i)).toBeInTheDocument();
  expect(screen.getByText(/Submit/i)).toBeInTheDocument();
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddOtherCost from '../AddOtherCost';

test('renders form for adding other cost', () => {
  render(<AddOtherCost />);

  expect(screen.getByText(/Create Other Cost/i)).toBeInTheDocument();
  expect(screen.getByText(/Items/i)).toBeInTheDocument();
  expect(screen.getByText(/Add Item/i)).toBeInTheDocument();
  expect(screen.getByText(/Total Amount:/i)).toBeInTheDocument();
  expect(screen.getByText(/Submit/i)).toBeInTheDocument();
});

test('validates form inputs', () => {
  render(<AddOtherCost />);
  fireEvent.click(screen.getByText(/Submit/i));

  expect(screen.getByText(/Date is required./i)).toBeInTheDocument();
  expect(screen.getByText(/Vendor is required./i)).toBeInTheDocument();
  expect(screen.getByText(/Item 1: Line item is required./i)).toBeInTheDocument();
  expect(screen.getByText(/Item 1: Quantity must be a positive number./i)).toBeInTheDocument();
  expect(screen.getByText(/Item 1: Unit is required./i)).toBeInTheDocument();
  expect(screen.getByText(/Item 1: Unit price must be a positive number./i)).toBeInTheDocument();
  expect(screen.getByText(/Item 1: Amount must be a positive number./i)).toBeInTheDocument();
});

test('calculates total amount correctly', () => {
  render(<AddOtherCost />);

  fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2024-01-01' } });
  fireEvent.change(screen.getByLabelText(/Vendor/i), { target: { value: 'Vendor 1' } });
  fireEvent.change(screen.getAllByLabelText(/Line Item/i)[0], { target: { value: 'Consulting' } });
  fireEvent.change(screen.getAllByLabelText(/Quantity/i)[0], { target: { value: '10' } });
  fireEvent.change(screen.getAllByLabelText(/Unit/i)[0], { target: { value: 'hours' } });
  fireEvent.change(screen.getAllByLabelText(/Unit Price/i)[0], { target: { value: '20' } });

  expect(screen.getAllByLabelText(/Amount/i)[0].value).toBe('200.00');
  expect(screen.getByText(/Total Amount: 200.00/i)).toBeInTheDocument();
});

test('adds additional items', () => {
  render(<AddOtherCost />);

  fireEvent.click(screen.getByText(/Add Item/i));

  expect(screen.getAllByLabelText(/Line Item/i).length).toBe(2);
  expect(screen.getAllByLabelText(/Quantity/i).length).toBe(2);
  expect(screen.getAllByLabelText("Unit").length).toBe(2);
  expect(screen.getAllByLabelText(/Unit Price/i).length).toBe(2);
  expect(screen.getAllByLabelText(/Amount/i).length).toBe(2);
});

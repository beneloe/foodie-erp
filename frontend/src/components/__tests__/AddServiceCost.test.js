import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddServiceCost from '../AddServiceCost';

test('renders form for adding service cost', () => {
  render(<AddServiceCost />);

  expect(screen.getByText(/Create Service Cost/i)).toBeInTheDocument();
  expect(screen.getByText(/Items/i)).toBeInTheDocument();
  expect(screen.getByText(/Add Item/i)).toBeInTheDocument();
  expect(screen.getByText(/Total Amount:/i)).toBeInTheDocument();
  expect(screen.getByText(/Submit/i)).toBeInTheDocument();
});

test('validates form inputs', () => {
  render(<AddServiceCost />);
  fireEvent.click(screen.getByText(/Submit/i));

  expect(screen.getByText(/Date is required./i)).toBeInTheDocument();
  expect(screen.getByText(/Vendor is required./i)).toBeInTheDocument();
  expect(screen.getByText(/Item 1: Service description is required./i)).toBeInTheDocument();
  expect(screen.getByText(/Item 1: Quantity must be a positive number./i)).toBeInTheDocument();
  expect(screen.getByText(/Item 1: Unit is required./i)).toBeInTheDocument();
  expect(screen.getByText(/Item 1: Unit price must be a positive number./i)).toBeInTheDocument();
});

test('calculates total amount correctly', () => {
  render(<AddServiceCost />);

  fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2024-01-01' } });
  fireEvent.change(screen.getByLabelText(/Vendor/i), { target: { value: 'Vendor 1' } });
  fireEvent.change(screen.getAllByLabelText(/Service Description/i)[0], { target: { value: 'Consulting' } });
  fireEvent.change(screen.getAllByLabelText(/Quantity/i)[0], { target: { value: '10' } });
  fireEvent.change(screen.getAllByLabelText(/Unit/i)[0], { target: { value: 'hours' } });
  fireEvent.change(screen.getAllByLabelText(/Unit Price/i)[0], { target: { value: '20' } });

  expect(screen.getAllByLabelText(/Amount/i)[0].value).toBe('200.00');
});

test('adds additional items', () => {
  render(<AddServiceCost />);

  fireEvent.click(screen.getByText(/Add Item/i));

  expect(screen.getAllByLabelText(/Service Description/i).length).toBe(2);
  expect(screen.getAllByLabelText(/Quantity/i).length).toBe(2);
  expect(screen.getAllByLabelText("Unit").length).toBe(2);
  expect(screen.getAllByLabelText(/Unit Price/i).length).toBe(2);
  expect(screen.getAllByLabelText(/Amount/i).length).toBe(2);
});

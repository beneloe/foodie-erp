import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddStaffingCost from '../AddStaffingCost';

test('renders form for adding staffing cost', () => {
  render(<AddStaffingCost />);

  expect(screen.getByText(/Create Staffing Cost/i)).toBeInTheDocument();
  expect(screen.getByText(/Items/i)).toBeInTheDocument();
  expect(screen.getByText(/Add Item/i)).toBeInTheDocument();
  expect(screen.getByText(/Submit/i)).toBeInTheDocument();
});

test('validates form inputs', () => {
  render(<AddStaffingCost />);
  fireEvent.click(screen.getByText(/Submit/i));

  expect(screen.getByText(/Date is required./i)).toBeInTheDocument();
  expect(screen.getByText(/Period is required./i)).toBeInTheDocument();
  expect(screen.getByText(/Employee is required./i)).toBeInTheDocument();
  expect(screen.getByText(/Line item is required./i)).toBeInTheDocument();
  expect(screen.getByText(/Quantity must be a positive number./i)).toBeInTheDocument();
  expect(screen.getByText(/Unit is required./i)).toBeInTheDocument();
  expect(screen.getByText(/Unit price must be a positive number./i)).toBeInTheDocument();
});

test('calculates total amount correctly', () => {
  render(<AddStaffingCost />);

  fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2024-01-01' } });
  fireEvent.change(screen.getByLabelText(/Period/i), { target: { value: 'Q1' } });
  fireEvent.change(screen.getByLabelText(/Employee/i), { target: { value: 'Employee 1' } });
  fireEvent.change(screen.getAllByLabelText(/Line Item/i)[0], { target: { value: 'Consulting' } });
  fireEvent.change(screen.getAllByLabelText(/Quantity/i)[0], { target: { value: '10' } });
  fireEvent.change(screen.getAllByLabelText(/Unit/i)[0], { target: { value: 'hours' } });
  fireEvent.change(screen.getAllByLabelText(/Unit Price/i)[0], { target: { value: '20' } });

  expect(screen.getAllByLabelText(/Amount/i)[0].value).toBe('200.00');
});

test('adds additional items', () => {
  render(<AddStaffingCost />);

  fireEvent.click(screen.getByText(/Add Item/i));

  expect(screen.getAllByLabelText(/Line Item/i).length).toBe(2);
  expect(screen.getAllByLabelText(/Quantity/i).length).toBe(2);
  expect(screen.getAllByLabelText(/Unit/i).length).toBe(4);
  expect(screen.getAllByLabelText(/Unit Price/i).length).toBe(2);
  expect(screen.getAllByLabelText(/Amount/i).length).toBe(2);
});

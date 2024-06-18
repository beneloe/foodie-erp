import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddInventoryItem from '../AddInventoryItem';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'Item added successfully' }),
    })
  );
});

test('renders AddInventoryItem component', () => {
  render(<AddInventoryItem />);
  expect(screen.getByText(/Add New Item/i)).toBeInTheDocument();
});

test('shows validation error if fields are empty', async () => {
  render(<AddInventoryItem />);
  fireEvent.click(screen.getByRole('button', { name: /Add New/i }));

  await waitFor(() => {
    expect(screen.getByText('All fields are required.')).toBeInTheDocument();
  });
});

test('shows validation error if item name contains invalid characters', async () => {
  render(<AddInventoryItem />);

  fireEvent.change(screen.getByLabelText(/Item Name/i), { target: { value: 'Item<>Name' } });
  fireEvent.change(screen.getByLabelText(/Stock/i), { target: { value: '10' } });
  fireEvent.change(screen.getByLabelText(/Unit/i), { target: { value: 'pcs' } });
  fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '5' } });
  fireEvent.click(screen.getByRole('button', { name: /Add New/i }));

  await waitFor(() => {
    expect(screen.getByText('Item Name contains invalid characters.')).toBeInTheDocument();
  });
});

test('shows validation error if stock is not a positive number', async () => {
  render(<AddInventoryItem />);

  fireEvent.change(screen.getByLabelText(/Item Name/i), { target: { value: 'ItemName' } });
  fireEvent.change(screen.getByLabelText(/Stock/i), { target: { value: '-10' } });
  fireEvent.change(screen.getByLabelText(/Unit/i), { target: { value: 'pcs' } });
  fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '5' } });
  fireEvent.click(screen.getByRole('button', { name: /Add New/i }));

  await waitFor(() => {
    expect(screen.getByText('Stock must be a positive number.')).toBeInTheDocument();
  });
});

test('shows validation error if unit contains invalid characters', async () => {
  render(<AddInventoryItem />);

  fireEvent.change(screen.getByLabelText(/Item Name/i), { target: { value: 'ItemName' } });
  fireEvent.change(screen.getByLabelText(/Stock/i), { target: { value: '10' } });
  fireEvent.change(screen.getByLabelText(/Unit/i), { target: { value: 'pc$' } });
  fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '5' } });
  fireEvent.click(screen.getByRole('button', { name: /Add New/i }));

  await waitFor(() => {
    expect(screen.getByText('Unit contains invalid characters.')).toBeInTheDocument();
  });
});

test('shows validation error if price is not a positive number', async () => {
  render(<AddInventoryItem />);

  fireEvent.change(screen.getByLabelText(/Item Name/i), { target: { value: 'ItemName' } });
  fireEvent.change(screen.getByLabelText(/Stock/i), { target: { value: '10' } });
  fireEvent.change(screen.getByLabelText(/Unit/i), { target: { value: 'pcs' } });
  fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '-5' } });
  fireEvent.click(screen.getByRole('button', { name: /Add New/i }));

  await waitFor(() => {
    expect(screen.getByText('Price must be a positive number.')).toBeInTheDocument();
  });
});

test('sanitizes input and submits form successfully', async () => {
  render(<AddInventoryItem />);

  fireEvent.change(screen.getByLabelText(/Item Name/i), { target: { value: 'ItemName' } });
  fireEvent.change(screen.getByLabelText(/Stock/i), { target: { value: '10' } });
  fireEvent.change(screen.getByLabelText(/Unit/i), { target: { value: 'pcs' } });
  fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '5' } });
  fireEvent.click(screen.getByRole('button', { name: /Add New/i }));

  await waitFor(() => {
    expect(screen.getByText('Item added successfully!')).toBeInTheDocument();
  });
});

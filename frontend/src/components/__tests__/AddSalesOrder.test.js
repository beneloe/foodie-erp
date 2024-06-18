import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AddSalesOrder from '../AddSalesOrder';

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.endsWith('/api/inventory')) {
      return Promise.resolve({
        json: () => Promise.resolve([
          { id: 1, item_name: 'Tomato', unit: 'grams', price: 0.1, stock: 100 }
        ]),
      });
    } else if (url.endsWith('/api/sales-orders/add')) {
      return Promise.resolve({
        json: () => Promise.resolve({ id: 1, date: '2024-01-01', customer: 'Edeka', amount: 5.0, paid: true, delivered: true }),
      });
    }
  });
});

afterEach(() => {
  global.fetch.mockClear();
});

test('renders form and fetches inventory items', async () => {
  render(<AddSalesOrder />);
  
  expect(screen.getByText(/Create Sales Order/i)).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText(/Tomato/i)).toBeInTheDocument();
  });
});

test('shows validation errors if fields are empty', async () => {
  render(<AddSalesOrder />);

  fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

  await waitFor(() => {
    expect(screen.getByText('Date is required')).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText('Customer is required')).toBeInTheDocument();
  });
});

test('shows validation errors if item fields are invalid', async () => {
  render(<AddSalesOrder />);

  fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2024-01-01' } });
  fireEvent.change(screen.getByLabelText(/Customer/i), { target: { value: 'Edeka' } });

  fireEvent.click(screen.getByRole('button', { name: /Add Item/i }));
  fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

  await waitFor(() => {
    expect(screen.getAllByText('Item name is required').length).toBeGreaterThan(0);
  });
  
  await waitFor(() => {
    expect(screen.getAllByText('Quantity must be a positive number').length).toBeGreaterThan(0);
  });
  
  await waitFor(() => {
    expect(screen.getAllByText('Unit is required').length).toBeGreaterThan(0);
  });
  
  await waitFor(() => {
    expect(screen.getAllByText('Unit price must be a positive number').length).toBeGreaterThan(0);
  });
  
  await waitFor(() => {
    expect(screen.getAllByText('Amount must be a positive number').length).toBeGreaterThan(0);
  });
});

test('submits form successfully with valid input', async () => {
  render(<AddSalesOrder />);

  fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2024-01-01' } });
  fireEvent.change(screen.getByLabelText(/Customer/i), { target: { value: 'Edeka' } });

  fireEvent.change(screen.getByLabelText(/Item Name/i), { target: { value: 'Tomato' } });
  fireEvent.change(screen.getByLabelText(/Quantity/i), { target: { value: '10' } });

  fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
});

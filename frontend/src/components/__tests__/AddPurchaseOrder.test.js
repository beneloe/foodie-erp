import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AddPurchaseOrder from '../AddPurchaseOrder';

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.endsWith('/api/inventory')) {
      return Promise.resolve({
        json: () => Promise.resolve([
          { id: 1, item_name: 'Tomato', unit: 'grams', price: 0.1 },
          { id: 2, item_name: 'Cheese', unit: 'grams', price: 0.5 },
        ]),
      });
    } else if (url.endsWith('/api/purchase-orders/add')) {
      return Promise.resolve({
        json: () => Promise.resolve({ id: 1, date: '2024-01-01', vendor: 'Test Vendor', amount: 1 }),
      });
    }
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test('shows validation errors if fields are empty', async () => {
  render(<AddPurchaseOrder />);

  fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

  await waitFor(() => {
    expect(screen.getByText('Date is required')).toBeInTheDocument();
    expect(screen.getByText('Vendor is required')).toBeInTheDocument();
  });
});

test('shows validation errors if item fields are invalid', async () => {
  render(<AddPurchaseOrder />);

  fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2024-01-01' } });
  fireEvent.change(screen.getByLabelText(/Vendor/i), { target: { value: 'Test Vendor' } });

  fireEvent.click(screen.getByRole('button', { name: /Add Item/i }));
  fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

  await waitFor(() => {
    expect(screen.getAllByText('Item name is required').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Quantity must be a positive number').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Unit is required').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Unit price must be a positive number').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Amount must be a positive number').length).toBeGreaterThan(0);
  });
});

test('submits form successfully with valid input', async () => {
  render(<AddPurchaseOrder />);

  fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2024-01-01' } });
  fireEvent.change(screen.getByLabelText(/Vendor/i), { target: { value: 'Test Vendor' } });

  fireEvent.click(screen.getByRole('button', { name: /Add Item/i }));

  const itemNameInputs = screen.getAllByLabelText(/Item Name/i);
  fireEvent.change(itemNameInputs[0], { target: { value: 'Tomato' } });

  const quantityInputs = screen.getAllByLabelText(/Quantity/i);
  fireEvent.change(quantityInputs[0], { target: { value: '10' } });

  const unitInputs = screen.getAllByLabelText(/Unit/i);
  fireEvent.change(unitInputs[0], { target: { value: 'grams' } });

  const unitPriceInputs = screen.getAllByLabelText(/Unit Price/i);
  fireEvent.change(unitPriceInputs[0], { target: { value: '0.1' } });

  const amountInputs = screen.getAllByLabelText(/Amount/i);
  fireEvent.change(amountInputs[0], { target: { value: '1' } });

  fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
});

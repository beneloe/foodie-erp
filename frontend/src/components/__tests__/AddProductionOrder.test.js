import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AddProductionOrder from '../AddProductionOrder';

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.endsWith('/api/inventory')) {
      return Promise.resolve({
        json: () => Promise.resolve([
          { id: 1, item_name: 'Tomato', unit: 'grams', price: 0.1 },
          { id: 2, item_name: 'Cheese', unit: 'grams', price: 0.5 },
        ]),
      });
    } else if (url.endsWith('/api/production-orders/add')) {
      return Promise.resolve({
        json: () => Promise.resolve({ id: 1, date: '2024-01-02', product_name: 'Test Product', quantity: 50.0, status: 'done' }),
      });
    }
  });
});

afterEach(() => {
  global.fetch.mockClear();
});

test('renders form and fetches inventory items', async () => {
  render(<AddProductionOrder />);
  
  expect(screen.getByText(/Create Production Order/i)).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText(/Tomato/i)).toBeInTheDocument();
  });
});

test('shows validation errors if fields are empty', async () => {
  render(<AddProductionOrder />);

  fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

  await waitFor(() => {
    expect(screen.getByText('Date is required.')).toBeInTheDocument();
  });
  
  await waitFor(() => {
    expect(screen.getByText('Product name is required.')).toBeInTheDocument();
  });
  
  await waitFor(() => {
    expect(screen.getByText('Quantity must be a positive number.')).toBeInTheDocument();
  });
});

test('shows validation errors if item fields are invalid', async () => {
  render(<AddProductionOrder />);

  fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2024-01-01' } });
  fireEvent.change(screen.getByLabelText(/Product Name/i), { target: { value: 'Test Product' } });
  fireEvent.change(screen.getByLabelText(/^Quantity$/i), { target: { value: '10' } });

  fireEvent.click(screen.getByRole('button', { name: /Add Item/i }));
  fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

  await waitFor(() => {
    expect(screen.getAllByText(/Item name is required./i).length).toBeGreaterThan(0);
  });
  
  await waitFor(() => {
    expect(screen.getAllByText(/Quantity used must be a positive number./i).length).toBeGreaterThan(0);
  });
  
  await waitFor(() => {
    expect(screen.getAllByText(/Unit is required./i).length).toBeGreaterThan(0);
  });
  
  await waitFor(() => {
    expect(screen.getAllByText(/Unit price must be a positive number./i).length).toBeGreaterThan(0);
  });
  
  await waitFor(() => {
    expect(screen.getAllByText(/Amount must be a positive number./i).length).toBeGreaterThan(0);
  });
});

test('submits form successfully with valid input', async () => {
  render(<AddProductionOrder />);

  fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2024-01-01' } });
  fireEvent.change(screen.getByLabelText(/Product Name/i), { target: { value: 'Test Product' } });
  fireEvent.change(screen.getByLabelText(/^Quantity$/i), { target: { value: '10' } });

  fireEvent.click(screen.getByRole('button', { name: /Add Item/i }));

  const itemNameInputs = screen.getAllByLabelText(/Item Name/i);
  fireEvent.change(itemNameInputs[0], { target: { value: 'Tomato' } });

  const quantityUsedInputs = screen.getAllByLabelText(/Quantity Used/i);
  fireEvent.change(quantityUsedInputs[0], { target: { value: '10' } });

  const unitInputs = screen.getAllByLabelText(/Unit/i);
  fireEvent.change(unitInputs[0], { target: { value: 'grams' } });

  const unitPriceInputs = screen.getAllByLabelText(/Unit Price/i);
  fireEvent.change(unitPriceInputs[0], { target: { value: '0.1' } });

  const amountInputs = screen.getAllByLabelText(/Amount/i);
  fireEvent.change(amountInputs[0], { target: { value: '1' } });

  fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
});

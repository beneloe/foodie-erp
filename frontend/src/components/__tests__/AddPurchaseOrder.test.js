import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AddPurchaseOrder from '../AddPurchaseOrder';

// Mock the fetch API
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.endsWith('/api/inventory')) {
      return Promise.resolve({
        json: () => Promise.resolve([
          { id: 1, item_name: 'Tomato', unit: 'grams', price: 0.1, stock: 100 }
        ]),
      });
    } else if (url.endsWith('/api/purchase-orders/add')) {
      return Promise.resolve({
        json: () => Promise.resolve({ id: 1, date: '2024-01-01', vendor: 'Test Vendor', amount: 5.0, paid: true, received: true }),
      });
    }
  });
});

// Clear fetch mock after each test
afterEach(() => {
  global.fetch.mockClear();
});

test('renders form and fetches inventory items', async () => {
  render(<AddPurchaseOrder />);
  
  expect(screen.getByText(/Create Purchase Order/i)).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText(/Tomato/i)).toBeInTheDocument();
  });
});

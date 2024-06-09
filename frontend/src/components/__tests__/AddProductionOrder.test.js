import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

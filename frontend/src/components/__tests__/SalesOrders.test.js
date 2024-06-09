import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SalesOrders from '../SalesOrders';

// Mock the fetch API
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.endsWith('/api/sales-orders')) {
      return Promise.resolve({
        json: () => Promise.resolve({
          salesOrders: [
            { id: 1, date: '2024-01-01', customer: 'Edeka', amount: 50.00, paid: true, delivered: true },
          ],
          salesOrderItems: [
            { id: 1, sales_order_id: 1, item_name: 'Item1', quantity: 10, unit: 'pcs', price: 5.00 },
          ],
        }),
      });
    }
  });
});

// Clear fetch mock to avoid issues with other tests
afterEach(() => {
  global.fetch.mockClear();
});

test('fetches and displays sales orders', async () => {
  render(
    <MemoryRouter>
      <SalesOrders />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Edeka')).toBeInTheDocument();
  });
});

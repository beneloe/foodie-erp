import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SalesOrders from '../SalesOrders';

// Mock fetch API
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          salesOrders: [
            {
              id: 1,
              date: '2023-12-31T23:00:00.000Z',
              customer: 'Customer1',
              amount: '500.00',
              paid: true,
              delivered: true,
            },
          ],
          salesOrderItems: [
            {
              id: 1,
              sales_order_id: 1,
              inventory_item_id: 1,
              item_name: 'Item1',
              quantity: '10.00',
              unit: 'pcs',
              unit_price: '5.00',
              amount: '50.00',
            },
          ],
        }),
    })
  );
});

// Clear fetch mock to avoid issues with other tests
afterEach(() => {
  global.fetch.mockClear();
});

test('fetches and displays sales orders', async () => {
  render(<SalesOrders />);

  await waitFor(() => {
    const item = screen.getByText('Item1 - 10.00 pcs @ 5.00 each, Amount: 50.00');
    expect(item).toBeInTheDocument();
  });
});

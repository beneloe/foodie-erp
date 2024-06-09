import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PurchaseOrders from '../PurchaseOrders';

// Mock fetch API
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({
        purchaseOrders: [
          {
            id: 1,
            date: '2023-12-31T23:00:00.000Z',
            vendor: 'Metro',
            amount: '500.00',
            paid: true,
            received: true
          }
        ],
        purchaseOrderItems: [
          {
            id: 1,
            purchase_order_id: 1,
            inventory_item_id: 1,
            item_name: 'Bread',
            quantity: '20000.00',
            unit: 'grams',
            unit_price: '0.01',
            amount: '200.00'
          }
        ]
      }),
    })
  );
});

// Clear fetch mock to avoid issues with other tests
afterEach(() => {
  global.fetch.mockClear();
});

test('fetches and displays purchase orders and their items', async () => {
  render(
    <MemoryRouter>
      <PurchaseOrders />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Metro')).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText('Bread - 20000.00 grams @ 0.01 each, Amount: 200.00')).toBeInTheDocument();
  });
});

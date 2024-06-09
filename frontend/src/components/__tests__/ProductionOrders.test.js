import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductionOrders from '../ProductionOrders';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({
        productionOrders: [
          { id: 1, date: '2024-01-01', product_name: 'Product A', quantity: 100, status: 'done' }
        ]
      }),
    })
  );
});

afterEach(() => {
  global.fetch.mockClear();
});

test('renders production orders list', async () => {
  render(
    <MemoryRouter>
      <ProductionOrders />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Product A')).toBeInTheDocument();
  });
});

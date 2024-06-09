import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Inventory from '../Inventory';

// Set up a mock for the fetch API
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([{ item_name: 'Tomato', stock: 450, unit: 'grams', price: 0.1 }]),
    })
  );
});

// Clear fetch mock to avoid issues with other tests
afterEach(() => {
  global.fetch.mockClear();
});

test('fetches and displays inventory items', async () => {
  render(
    <MemoryRouter>
      <Inventory />
    </MemoryRouter>
  );
  await waitFor(() => {
    const item = screen.getByText(/Tomato/);
    expect(item).toBeInTheDocument();
  });
});

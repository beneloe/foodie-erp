import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OtherCosts from '../OtherCosts';

describe('OtherCosts', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            otherCosts: [
              {
                id: 1,
                date: '2024-01-31',
                vendor: 'Transporter',
                amount: 300.00,
                paid: true,
                status: 'done',
              },
            ],
            otherCostItems: [
              {
                id: 1,
                other_cost_id: 1,
                line_item: 'Transportation',
                quantity: 1,
                unit: 'service',
                unit_price: 300.00,
                amount: 300.00,
              },
            ],
          })
      })
    );
  });

  test('fetches and displays other costs and items', async () => {
    render(
      <MemoryRouter>
        <OtherCosts />
      </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByText('Transporter')).toBeInTheDocument();
    });
  });

test('displays a link to add new other cost', () => {
    render(
        <MemoryRouter>
            <OtherCosts />
        </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Add New' })).toHaveAttribute('href', '/other/create');
    });  
});

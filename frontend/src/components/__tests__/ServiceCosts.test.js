import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ServiceCosts from '../ServiceCosts';

describe('ServiceCosts', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            serviceCosts: [
              {
                id: 1,
                date: '2024-01-31',
                vendor: 'Consultant',
                amount: 500.00,
                paid: true,
                status: 'done'
              }
            ],
            serviceCostItems: [
              {
                id: 1,
                service_cost_id: 1,
                service_description: 'Consulting',
                quantity: 10,
                unit: 'hours',
                unit_price: 20.00,
                amount: 200.00
              }
            ]
          })
      })
    );
  });

  test('fetches and displays service costs and items', async () => {
    render(
      <MemoryRouter>
        <ServiceCosts />
      </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByText('Consultant')).toBeInTheDocument();
    });
  });

test('displays a link to add new service cost', () => {
    render(
        <MemoryRouter>
            <ServiceCosts />
        </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Add New' })).toHaveAttribute('href', '/service/create');
    });  
});

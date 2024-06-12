import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import StaffingCosts from '../StaffingCosts';

describe('StaffingCosts', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            staffingCosts: [
              {
                id: 1,
                date: '2024-01-31',
                period: 'Q1 2024',
                employee: 'Employee 1',
                amount: 300.00,
                paid: true,
              },
            ],
            staffingCostItems: [
              {
                id: 1,
                staffing_cost_id: 1,
                line_item: 'Work',
                quantity: 160,
                unit: 'hours',
                unit_price: 20.00,
                amount: 3200.00,
              },
            ],
          })
      })
    );
  });

  test('fetches and displays staffing costs and items', async () => {
    render(
      <MemoryRouter>
        <StaffingCosts />
      </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByText('Employee 1')).toBeInTheDocument();
    });
  });

test('displays a link to add new staffing cost', () => {
    render(
        <MemoryRouter>
            <StaffingCosts />
        </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Add New' })).toHaveAttribute('href', '/staffing/create');
    });  
});

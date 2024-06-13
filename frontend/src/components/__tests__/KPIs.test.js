import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import KPIs from '../KPIs';

describe('KPIs', () => {
  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      switch (url) {
        case '/api/kpis/revenue':
          return Promise.resolve({
            json: () => Promise.resolve({ revenue: 5000 }),
          });
        case '/api/kpis/total-costs':
          return Promise.resolve({
            json: () => Promise.resolve({
              total_purchase_cost: 1000,
              total_production_cost: 2000,
              total_other_cost: 500,
              total_staffing_cost: 1500,
              total_cost: 5000,
            }),
          });
        case '/api/kpis/gross-profit':
          return Promise.resolve({
            json: () => Promise.resolve({ gross_profit: 2000 }),
          });
        case '/api/kpis/profit-margin':
          return Promise.resolve({
            json: () => Promise.resolve({ profitMargin: 40 }),
          });
        case '/api/kpis/break-even-point':
          return Promise.resolve({
            json: () => Promise.resolve({ breakEvenPoint: 300 }),
          });
        default:
          return Promise.reject(new Error('unknown URL'));
      }
    });
  });

  test('fetches and displays revenue', async () => {
    render(
      <MemoryRouter>
        <KPIs />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Revenue: $5000')).toBeInTheDocument();
    });
  });

  test('fetches and displays total costs', async () => {
    render(
      <MemoryRouter>
        <KPIs />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('1000')).toBeInTheDocument();
      expect(screen.getByText('2000')).toBeInTheDocument();
      expect(screen.getByText('500')).toBeInTheDocument();
      expect(screen.getByText('1500')).toBeInTheDocument();
      expect(screen.getByText('5000')).toBeInTheDocument();
    });
  });

  test('fetches and displays gross profit', async () => {
    render(
      <MemoryRouter>
        <KPIs />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('2000')).toBeInTheDocument();
    });
  });

  test('fetches and displays profit margin', async () => {
    render(
      <MemoryRouter>
        <KPIs />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('40%')).toBeInTheDocument();
    });
  });

  test('fetches and displays break-even point', async () => {
    render(
      <MemoryRouter>
        <KPIs />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('300')).toBeInTheDocument();
    });
  });
});

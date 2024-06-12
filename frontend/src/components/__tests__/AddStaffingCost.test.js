import React from 'react';
import { render, screen } from '@testing-library/react';
import AddStaffingCost from '../AddStaffingCost';

// Mock the fetch API
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.endsWith('/api/staffing-costs/add')) {
      return Promise.resolve({
        json: () => Promise.resolve({ id: 1, date: '2024-01-01', period: 'Q1 2024', employee: 'Employee 1', amount: 5000.00, paid: true }),
      });
    }
  });
});

// Clear fetch mock after each test
afterEach(() => {
  global.fetch.mockClear();
});

test('renders form for adding staffing cost', () => {
  render(<AddStaffingCost />);

  expect(screen.getByText(/Create Staffing Cost/i)).toBeInTheDocument();
  expect(screen.getByText(/Items/i)).toBeInTheDocument();
  expect(screen.getByText(/Add Item/i)).toBeInTheDocument();
  expect(screen.getByText(/Submit/i)).toBeInTheDocument();
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../App';

test('renders Foodie ERP link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Foodie ERP/i);
  expect(linkElement).toBeInTheDocument();
});

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Login from '../Login';

beforeEach(() => {
  global.fetch = jest.fn((url, options) => {
    if (url.endsWith('/api/authentication/login') && options.method === 'POST') {
      const { email, password } = JSON.parse(options.body);
      if (email === 'test@example.com' && password === 'StrongPassw0rd!') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ token: 'fake-jwt-token' }),
        });
      } else {
        return Promise.resolve({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ message: 'Invalid email or password' }),
        });
      }
    }
  });
});

afterEach(() => {
  global.fetch.mockClear();
});

test('shows validation errors if fields are empty', async () => {
  render(<Login />);

  fireEvent.submit(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(screen.getByText('Valid email is required')).toBeInTheDocument();
  });
  
  await waitFor(() => {
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });
});

test('shows error when email or password is incorrect', async () => {
  render(<Login />);

  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'WrongPassword' } });
  fireEvent.submit(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
  });
});

test('submits form successfully with valid input', async () => {
  render(<Login />);

  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'StrongPassw0rd!' } });
  fireEvent.submit(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(screen.getByText(/login successful/i)).toBeInTheDocument();
  });
});

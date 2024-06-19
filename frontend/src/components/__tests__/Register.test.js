import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Register from '../Register';

beforeEach(() => {
  global.fetch = jest.fn((url, options) => {
    if (url.endsWith('/api/authentication/register') && options.method === 'POST') {
      const { username, email, password } = JSON.parse(options.body);
      if (username === 'testuser' && email === 'test@example.com' && password === 'StrongPassw0rd!') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 1, username, email }),
        });
      } else {
        return Promise.resolve({
          ok: false,
          status: 409,
          json: () => Promise.resolve({ message: 'User with this username or email already exists.' }),
        });
      }
    }
  });
});

afterEach(() => {
  global.fetch.mockClear();
});

test('shows validation errors if fields are empty', async () => {
  render(<Register />);

  fireEvent.submit(screen.getByRole('button', { name: /register/i }));

  await waitFor(() => {
    expect(screen.getByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Valid email is required')).toBeInTheDocument();
    expect(screen.getByText('Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.')).toBeInTheDocument();
  });
});

test('shows error when email or username already exists', async () => {
  render(<Register />);

  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'existinguser' } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'existing@example.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'StrongPassw0rd!' } });
  fireEvent.submit(screen.getByRole('button', { name: /register/i }));

  await waitFor(() => {
    expect(screen.getByText(/user with this username or email already exists/i)).toBeInTheDocument();
  });
});

test('submits form successfully with valid input', async () => {
  render(<Register />);

  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'StrongPassw0rd!' } });
  fireEvent.submit(screen.getByRole('button', { name: /register/i }));

  await waitFor(() => {
    expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
  });
});

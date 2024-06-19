const request = require('supertest');
const app = require('../index');
const pool = require('../config/db');

describe('Authentication', () => {
  beforeAll(async () => {
    await pool.query('DELETE FROM users');
  });

  afterAll(async () => {
    await pool.end();
  });

  const validUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'StrongPassw0rd!'
  };

  const invalidUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'weak'
  };

  test('should register a new user', async () => {
    const res = await request(app)
      .post('/api/authentication/register')
      .send(validUser)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username', validUser.username);
    expect(res.body).toHaveProperty('email', validUser.email);
  });

  test('should not register a user with a weak password', async () => {
    const res = await request(app)
      .post('/api/authentication/register')
      .send(invalidUser)
      .expect(400);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toContainEqual(expect.objectContaining({
      msg: 'Password must be at least 8 characters long'
    }));
  });

  test('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/authentication/login')
      .send({ email: validUser.email, password: validUser.password })
      .expect(200);

    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('username', validUser.username);
    expect(res.body).toHaveProperty('email', validUser.email);
  });

  test('should not login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/authentication/login')
      .send({ email: validUser.email, password: 'wrongpassword' })
      .expect(401);

    expect(res.body).toHaveProperty('error', 'Invalid email or password');
  });

  test('should not register a user with existing email', async () => {
    const res = await request(app)
      .post('/api/authentication/register')
      .send(validUser)
      .expect(409);

    expect(res.body).toHaveProperty('error', 'User with this username or email already exists');
  });
});

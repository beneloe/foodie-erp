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

  const user = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'testpassword'
  };

  test('should register a new user', async () => {
    const res = await request(app)
      .post('/api/authentication/register')
      .send(user)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username', user.username);
    expect(res.body).toHaveProperty('email', user.email);
  });

  test('should login an existing user', async () => {
    await request(app)
      .post('/api/authentication/register')
      .send(user)
      .expect(409);

    const res = await request(app)
      .post('/api/authentication/login')
      .send({ email: user.email, password: user.password })
      .expect(200);

    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('username', user.username);
    expect(res.body).toHaveProperty('email', user.email);
  });

  test('should not login with incorrect password', async () => {
    await request(app)
      .post('/api/authentication/register')
      .send(user)
      .expect(409);

    await request(app)
      .post('/api/authentication/login')
      .send({ email: user.email, password: 'wrongpassword' })
      .expect(401);
  });

  test('should not register a user with existing email', async () => {
    await request(app)
      .post('/api/authentication/register')
      .send(user)
      .expect(409);
  });
});

const request = require('supertest');
const app = require('../index');
const { setupDatabase, teardownDatabase } = require('./testUtils');
const pool = require('../config/db');
let server;

beforeAll(async () => {
  server = app.listen(5002);
  await setupDatabase();
});

afterAll(async () => {
  await teardownDatabase();
  await pool.end();
  server.close();
});

describe('GET /', () => {
  it('should respond with API is working', async () => {
    const response = await request(app).get('/');
    expect(response.text).toBe('API is working');
    expect(response.statusCode).toBe(200);
  });
});

describe('GET /api/inventory', () => {
  it('should fetch all inventory items', async () => {
    const response = await request(app).get('/api/inventory');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].item_name).toBe('Test Item');
  });
});

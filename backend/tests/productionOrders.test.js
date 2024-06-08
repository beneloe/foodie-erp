const request = require('supertest');
const app = require('../index');
const { setupDatabase, teardownDatabase } = require('./testUtils');
const pool = require('../config/db');
let server;

beforeAll(async () => {
  server = app.listen(5004);
  await setupDatabase();
});

afterAll(async () => {
  await teardownDatabase();
  await pool.end();
  server.close();
});

describe('POST /api/production-orders/add', () => {
  it('should create a new production order', async () => {
    const response = await request(app)
      .post('/api/production-orders/add')
      .send({
        date: '2024-01-02',
        product_name: 'Test Product 2',
        quantity: 50.0,
        status: 'In Progress',
        items: [
          {
            inventory_item_id: 1,
            quantity_used: 20.0,
            unit: 'pcs'
          },
        ],
      });

    expect(response.status).toBe(201);
    expect(new Date(response.body.date).toISOString().split('T')[0]).toBe('2024-01-01');
    expect(response.body.product_name).toBe('Test Product 2');
  });
});

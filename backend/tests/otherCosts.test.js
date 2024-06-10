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

describe('POST /api/other-costs/add', () => {
  it('should create a new other cost', async () => {
    const response = await request(app)
      .post('/api/other-costs/add')
      .send({
        date: '2024-01-02',
        vendor: 'test other cost vendor',
        amount: 200.0,
        paid: true,
        status: 'done',
        items: [
          {
            line_item: 'other cost',
            quantity: 10.0,
            unit: 'hrs',
            unit_price: 20.0,
            amount: 200.0
          },
        ],
      });

    expect(response.status).toBe(201);
    expect(new Date(response.body.date).toISOString().split('T')[0]).toBe('2024-01-01');
    expect(response.body.vendor).toBe('test other cost vendor');
  });
});

describe('GET /api/other-costs', () => {
  it('should fetch all other costs', async () => {
    const response = await request(app).get('/api/other-costs');
    expect(response.status).toBe(200);
    expect(response.body.otherCosts).toBeInstanceOf(Array);
    expect(response.body.otherCostItems).toBeInstanceOf(Array);
  });
});

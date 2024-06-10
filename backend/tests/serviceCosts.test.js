const request = require('supertest');
const app = require('../index');
const { setupDatabase, teardownDatabase } = require('./testUtils');
const pool = require('../config/db');
let server;

beforeAll(async () => {
  server = app.listen(5006);
  await setupDatabase();
});

afterAll(async () => {
  await teardownDatabase();
  await pool.end();
  server.close();
});

describe('POST /api/service-costs/add', () => {
  it('should create a new service cost', async () => {
    const response = await request(app)
      .post('/api/service-costs/add')
      .send({
        date: '2024-01-02',
        vendor: 'Service Vendor 1',
        amount: 150.0,
        paid: true,
        status: 'Completed',
        items: [
          {
            service_description: 'Consulting',
            quantity: 5.0,
            unit: 'hours',
            unit_price: 30.0,
            amount: 150.0
          },
        ],
      });

    expect(response.status).toBe(201);
    expect(new Date(response.body.date).toISOString().split('T')[0]).toBe('2024-01-01');
    expect(response.body.vendor).toBe('Service Vendor 1');
  });
});

describe('GET /api/service-costs', () => {
  it('should fetch all service costs', async () => {
    const response = await request(app).get('/api/service-costs');
    expect(response.status).toBe(200);
    expect(response.body.serviceCosts).toBeInstanceOf(Array);
    expect(response.body.serviceCostItems).toBeInstanceOf(Array);
  });
});

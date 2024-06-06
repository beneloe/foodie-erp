const request = require('supertest');
const app = require('../index');
const { setupDatabase, teardownDatabase } = require('./testUtils');
const pool = require('../config/db');
let server;

beforeAll(async () => {
  server = app.listen(5005);
  await setupDatabase();
});

afterAll(async () => {
  await teardownDatabase();
  await pool.end();
  server.close();
});

describe('GET /api/sales-orders', () => {
  it('should fetch all sales orders', async () => {
    const response = await request(app).get('/api/sales-orders');
    expect(response.status).toBe(200);
    expect(response.body.salesOrders).toBeDefined();
    expect(response.body.salesOrderItems).toBeDefined();
  });
});

describe('POST /api/sales-orders/add', () => {
  it('should create a new sales order', async () => {
    const response = await request(app)
      .post('/api/sales-orders/add')
      .send({
        date: '2024-01-02',
        customer: 'Test Customer',
        amount: 200.0,
        paid: true,
        delivered: false,
        items: [
          {
            inventory_item_id: 1,
            quantity: 20.0,
            unit: 'pcs',
            unit_price: 10.0,
            amount: 200.0,
          },
        ],
      });

    expect(response.status).toBe(201);
    expect(new Date(response.body.date).toISOString().split('T')[0]).toBe('2024-01-01');
    expect(response.body.customer).toBe('Test Customer');
  });
});

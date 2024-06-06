const request = require('supertest');
const app = require('../index');
const { setupDatabase, teardownDatabase } = require('./testUtils');
const pool = require('../config/db');
let server;

beforeAll(async () => {
  server = app.listen(5003);
  await setupDatabase();
});

afterAll(async () => {
  await teardownDatabase();
  await pool.end();
  server.close();
});

describe('GET /api/purchase-orders', () => {
  it('should fetch all purchase orders', async () => {
    const response = await request(app).get('/api/purchase-orders');
    expect(response.status).toBe(200);
    expect(response.body.purchaseOrders).toBeDefined();
    expect(response.body.purchaseOrderItems).toBeDefined();
  });
});

describe('POST /api/purchase-orders/add', () => {
  it('should create a new purchase order', async () => {
    const response = await request(app)
      .post('/api/purchase-orders/add')
      .send({
        date: '2024-01-02',
        vendor: 'Test Vendor',
        amount: 200.0,
        paid: true,
        received: false,
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
    expect(response.body.vendor).toBe('Test Vendor');
  });
});

const request = require('supertest');
const app = require('../index');
const { setupDatabase, teardownDatabase } = require('./testUtils');
const pool = require('../config/db');
let server;

beforeAll(async () => {
  server = app.listen(5009);
  await setupDatabase();
});

afterAll(async () => {
  await teardownDatabase();
  await pool.end();
  server.close();
});

describe('GET /api/other-costs', () => {
  it('should fetch all other costs', async () => {
    const response = await request(app).get('/api/other-costs');
    expect(response.status).toBe(200);
    expect(response.body.otherCosts).toBeInstanceOf(Array);
    expect(response.body.otherCostItems).toBeInstanceOf(Array);
  });
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

  it('should return 400 if input data is invalid', async () => {
    const response = await request(app)
      .post('/api/other-costs/add')
      .send({
        date: '',
        vendor: '',
        amount: -200.0,
        paid: 'true',
        status: '',
        items: [
          {
            line_item: '',
            quantity: -10.0,
            unit: '',
            unit_price: -20.0,
            amount: -200.0
          },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: 'Date is required and must be a valid date.', path: 'date' }),
        expect.objectContaining({ msg: 'Vendor is required.', path: 'vendor' }),
        expect.objectContaining({ msg: 'Amount must be a positive number.', path: 'amount' }),
        expect.objectContaining({ msg: 'Status is required.', path: 'status' }),
        expect.objectContaining({ msg: 'Line item is required.', path: 'items[0].line_item' }),
        expect.objectContaining({ msg: 'Quantity must be a positive number.', path: 'items[0].quantity' }),
        expect.objectContaining({ msg: 'Unit is required.', path: 'items[0].unit' }),
        expect.objectContaining({ msg: 'Unit price must be a positive number.', path: 'items[0].unit_price' }),
        expect.objectContaining({ msg: 'Amount must be a positive number.', path: 'items[0].amount' }),
      ])
    );
  });
});

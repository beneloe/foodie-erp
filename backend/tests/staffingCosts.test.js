const request = require('supertest');
const app = require('../index');
const { setupDatabase, teardownDatabase } = require('./testUtils');
const pool = require('../config/db');
let server;

beforeAll(async () => {
  server = app.listen(5007);
  await setupDatabase();
});

afterAll(async () => {
  await teardownDatabase();
  await pool.end();
  server.close();
});

describe('POST /api/staffing-costs/add', () => {
  it('should create a new staffing cost', async () => {
    const response = await request(app)
      .post('/api/staffing-costs/add')
      .send({
        date: '2024-01-02',
        period: 'Q1',
        employee: 'employee 1',
        amount: 1000.0,
        paid: true,
        items: [
          {
            line_item: 'work',
            quantity: 40,
            unit: 'hrs',
            unit_price: 25.0,
            amount: 1000.0
          },
        ],
      });

    expect(response.status).toBe(201);
    expect(new Date(response.body.date).toISOString().split('T')[0]).toBe('2024-01-01');
    expect(response.body.employee).toBe('employee 1');
  });
});

describe('GET /api/staffing-costs', () => {
  it('should fetch all staffing costs', async () => {
    const response = await request(app).get('/api/staffing-costs');
    expect(response.status).toBe(200);
    expect(response.body.staffingCosts).toBeInstanceOf(Array);
    expect(response.body.staffingCostItems).toBeInstanceOf(Array);
  });
});

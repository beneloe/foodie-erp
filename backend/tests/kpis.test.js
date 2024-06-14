const request = require('supertest');
const app = require('../index');
const { setupDatabase, teardownDatabase } = require('./testUtils');
const pool = require('../config/db');
let server;

beforeAll(async () => {
  server = app.listen(5008);
  await setupDatabase();
});

afterAll(async () => {
  await teardownDatabase();
  await pool.end();
  server.close();
});

describe('GET /api/kpis/revenue', () => {
  it('should return the revenue', async () => {
    const res = await request(app).get('/api/kpis/revenue');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('revenue');
  });
});

describe('GET /api/kpis/total-costs', () => {
  it('should return the total costs', async () => {
    const res = await request(app).get('/api/kpis/total-costs');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('total_purchase_cost');
    expect(res.body).toHaveProperty('total_production_cost');
    expect(res.body).toHaveProperty('total_other_cost');
    expect(res.body).toHaveProperty('total_staffing_cost');
    expect(res.body).toHaveProperty('total_cost');
  });
});

describe('GET /api/kpis/gross-profit', () => {
  it('should return the gross profit', async () => {
    const res = await request(app).get('/api/kpis/gross-profit');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('gross_profit');
  });
});

describe('GET /api/kpis/profit-margin', () => {
  it('should return the profit margin', async () => {
    const res = await request(app).get('/api/kpis/profit-margin');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('profit_margin');
  });
});

describe('GET /api/kpis/break-even-point', () => {
  it('should return the break-even point', async () => {
    const res = await request(app).get('/api/kpis/break-even-point');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('breakEvenPoint');
  });
});

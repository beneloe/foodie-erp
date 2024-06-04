const request = require('supertest');
const app = require('../server');
const { pool } = require('../config/db');
require('dotenv').config();

describe('POST /api/inventory/add', () => {
  beforeAll(async () => {
    // Make sure pool is connected
    await pool.connect();
  });

  afterAll(async () => {
    // Make sure pool is closed
    await pool.end();
  });

  it('should create a new inventory item', async () => {
    const response = await request(app)
      .post('/api/inventory/add')
      .send({ item_name: 'Bread', stock: 30000, unit: 'grams', price: 0.001, starting_quantity: 20000, picture: 'picture.jpeg' });

    expect(response.status).toBe(201);
    expect(response.body.item_name).toBe('Bread');
  }, 5000);
});

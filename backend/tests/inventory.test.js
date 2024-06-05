const request = require('supertest');
const app = require('../index');
const pool = require('../config/db');
let server;

beforeAll(async () => {
  server = app.listen(5001);
  await pool.query('DELETE FROM inventory_item');
});

afterAll(async () => {
  await pool.query('DELETE FROM inventory_item');
  await pool.end();
  server.close();
}, 5000);

describe('GET /', () => {
  it('should respond with API is working', async () => {
    const response = await request(app).get('/');
    expect(response.text).toBe('API is working');
    expect(response.statusCode).toBe(200);
  });
});

describe('POST /api/inventory/add', () => {
  it('should create a new inventory item', async () => {
    const response = await request(app)
      .post('/api/inventory/add')
      .send({ item_name: 'Bread', stock: 30000, unit: 'grams', price: 0.001, starting_quantity: 20000, picture: 'picture.jpeg' });

    expect(response.status).toBe(201);
    expect(response.body.item_name).toBe('Bread');
  });
});

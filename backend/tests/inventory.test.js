const request = require('supertest');
const app = require('../index');
const { setupDatabase, teardownDatabase } = require('./testUtils');
const pool = require('../config/db');
let server;

beforeAll(async () => {
  server = app.listen(5002);
  await setupDatabase();
});

afterAll(async () => {
  await teardownDatabase();
  await pool.end();
  server.close();
});

describe('GET /', () => {
  it('should respond with API is working', async () => {
    const response = await request(app).get('/');
    expect(response.text).toBe('API is working');
    expect(response.statusCode).toBe(200);
  });
});

describe('GET /api/inventory', () => {
  it('should fetch all inventory items', async () => {
    const response = await request(app).get('/api/inventory');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(7);
    expect(response.body[0].item_name).toBe('Bread');
  });
});

describe('POST /api/inventory/add', () => {
  it('should add a new inventory item', async () => {
    const newItem = {
      item_name: 'New Item',
      stock: 50,
      unit: 'pcs',
      price: 5.0,
    };

    const response = await request(app).post('/api/inventory/add').send(newItem);
    expect(response.status).toBe(201);
    expect(response.body.item_name).toBe('New Item');
  });

  it('should not add an item with invalid data', async () => {
    const invalidItem = {
      item_name: '',
      stock: -10,
      unit: 'pcs',
      price: -5.0,
    };

    const response = await request(app).post('/api/inventory/add').send(invalidItem);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors).toHaveLength(3);
  });

  it('should not add an item with missing fields', async () => {
    const missingFieldsItem = {
      item_name: 'Incomplete Item',
    };

    const response = await request(app).post('/api/inventory/add').send(missingFieldsItem);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

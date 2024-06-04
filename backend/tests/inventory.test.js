const request = require('supertest');
const app = require('../server');

describe('POST /api/inventory/add', () => {
  it('should create a new inventory item', async () => {
    const response = await request(app)
      .post('/api/inventory/add')
      .send({ item_name: 'Bread', stock: 30000, unit: 'grams', price: 0.001, starting_quantity: 20000, picture: 'picture.jpeg' });
    expect(response.statusCode).toBe(201);
    expect(response.body.item_name).toBe('Tomato');
  });
});

const request = require('supertest');
const app = require('../index');

describe('GET /', () => {
  it('should respond with API is working', async () => {
    const response = await request(app).get('/');
    expect(response.text).toBe('API is working');
    expect(response.statusCode).toBe(200);
  });
});

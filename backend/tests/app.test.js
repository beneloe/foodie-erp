const request = require('supertest');
const app = require('../server');

describe('GET /', () => {
  it('should respond with test', async () => {
    const response = await request(app).get('/');
    expect(response.text).toBe('test');
    expect(response.statusCode).toBe(200);
  });
});

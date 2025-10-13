import request from 'supertest';
import app from '../server.js'; 

describe('API de coches', () => {

  test('GET /api - Health check', async () => {
    const res = await request(app).get('/api');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  test('GET /api/coches - Lista de coches', async () => {
    const res = await request(app).get('/api/coches');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});
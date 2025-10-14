import request from 'supertest';
import app from '../../server.js'; 

describe('API de coches', () => {

  test('GET /api/test - Health check', async () => {
    const res = await request(app).get('/api/test');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  test('GET /api/vehiculos - Lista de vehículos', async () => {
    const res = await request(app).get('/api/vehiculos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body) || res.body.data).toBeTruthy();
  });

  test('GET /api/fabricantes - Lista de fabricantes', async () => {
    const res = await request(app).get('/api/fabricantes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/modelos - Lista de modelos', async () => {
    const res = await request(app).get('/api/modelos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});
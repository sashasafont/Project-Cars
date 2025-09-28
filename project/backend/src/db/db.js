import pkg from 'pg';
import 'dotenv/config';
const {Pool} = pkg;

export const pool = new Pool ({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'coches123',
    password: process.env.DB_PASSWORD || 'coches123',
    database: process.env.DB_NAME || 'ventacoches'
});
pool.on('connect', client => {
    console.log('✅ Connected to PostgreSQL database');
    client.query(`SET search_path TO ${process.env.DB_SCHEMA}, public`);
});

pool.on('error', (err) => {
    console.error('❌ Database connection error:', err);
    process.exit(-1);
});

// Test de connexió inicial
pool.query('SELECT NOW()', (err, result) => {
    if (err) {
        console.error('❌ Database test query failed:', err);
    } else {
        console.log('✅ Database test query successful:', result.rows[0]);
    }
});

export default pool;
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import cochesRoutes from './routes/coches.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/coches', cochesRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Venta Coches API funciona!'});
});

export default app;
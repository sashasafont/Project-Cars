import {Router} from 'express';
import pool from '../db/db.js'

const router = Router();


// ===== FABRICANTES =====
router.get("/fabricantes", async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM ventacoches.dim_fabricantes ORDER BY fabricante_id ASC");
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No se encontraron fabricantes" });
    }
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get("/fabricantes/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM ventacoches.dim_fabricantes WHERE fabricante_id = $1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Fabricante no encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});


router.put("/fabricantes/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fabricante } = req.body;

    const { rows } = await pool.query(
      "UPDATE ventacoches.dim_fabricantes SET fabricante = $1 WHERE fabricante_id = $2 RETURNING *",
      [fabricante, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Fabricante no encontrado" });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});


// ===== MODELOS =====
router.get("/modelos", async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM ventacoches.dim_modelos ORDER BY modelo_id ASC");
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No se encontraron modelos" });
    }
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get("/modelos/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM ventacoches.dim_modelos WHERE modelo_id = $1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Modelo no encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});






/* ================================
   🧪 RUTA DE PROVA
================================ */
router.get("/test", async (_req, res, next) => {
  try {
    res.json({ message: "API is working perfectly!", timestamp: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
});

/* ================================
   🚗 CRUD PRINCIPAL - COCHES
================================ */

/**
 * GET tots els cotxes
 */
router.get("/coches", async (req, res, next) => {
  try {
    const { 
      page = 1, 
      page_size = 10, 
      fabricante_id, 
      modelo_id, 
      fuel_id, 
      provincia_id,
      precio_min,
      precio_max 
    } = req.query;
    
    let query = `
      SELECT c.*, 
             f.fabricante,
             m.modelo,
             fu.fuel,
             p.puertas_numero,
             t.tipo_nombre,
             pr.provincia
      FROM ventacoches.coches c
      LEFT JOIN ventacoches.dim_fabricantes f ON c.fabricante_id = f.fabricante_id
      LEFT JOIN ventacoches.dim_modelos m ON c.modelo_id = m.modelo_id
      LEFT JOIN ventacoches.dim_fuel fu ON c.fuel_id = fu.fuel_id
      LEFT JOIN ventacoches.dim_puertas p ON c.puertas_id = p.puertas_id
      LEFT JOIN ventacoches.dim_tipo t ON c.tipo_id = t.tipo_id
      LEFT JOIN ventacoches.dim_provincias pr ON c.provincia_id = pr.provincia_id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 0;
    
    // Filtres
    if (fabricante_id) {
      query += ` AND c.fabricante_id = $${++paramCount}`;
      params.push(fabricante_id);
    }
    if (modelo_id) {
      query += ` AND c.modelo_id = $${++paramCount}`;
      params.push(modelo_id);
    }
    if (fuel_id) {
      query += ` AND c.fuel_id = $${++paramCount}`;
      params.push(fuel_id);
    }
    if (provincia_id) {
      query += ` AND c.provincia_id = $${++paramCount}`;
      params.push(provincia_id);
    }
    if (precio_min) {
      query += ` AND c.precio >= $${++paramCount}`;
      params.push(precio_min);
    }
    if (precio_max) {
      query += ` AND c.precio <= $${++paramCount}`;
      params.push(precio_max);
    }
    
    query += ` ORDER BY c.fecha DESC LIMIT $${++paramCount} OFFSET $${++paramCount}`;
    params.push(page_size, (page - 1) * page_size);
    
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * GET un cotxe per id
 */
router.get("/coches/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(`
      SELECT c.*, 
             f.fabricante,
             m.modelo,
             fu.fuel,
             p.puertas_numero,
             t.tipo_nombre,
             pr.provincia
      FROM ventacoches.coches c
      LEFT JOIN ventacoches.dim_fabricantes f ON c.fabricante_id = f.fabricante_id
      LEFT JOIN ventacoches.dim_modelos m ON c.modelo_id = m.modelo_id
      LEFT JOIN ventacoches.dim_fuel fu ON c.fuel_id = fu.fuel_id
      LEFT JOIN ventacoches.dim_puertas p ON c.puertas_id = p.puertas_id
      LEFT JOIN ventacoches.dim_tipo t ON c.tipo_id = t.tipo_id
      LEFT JOIN ventacoches.dim_provincias pr ON c.provincia_id = pr.provincia_id
      WHERE c.id = $1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Coche no encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * POST crear nou cotxe
 */
router.post("/coches", async (req, res, next) => {
  try {
    const {
      fecha, cliente, fabricante_id, modelo_id, version,
      fuel_id, puertas_id, tipo_id, provincia_id,
      precio, precio_financiado, cantidad
    } = req.body;

    const { rows } = await pool.query(`
      INSERT INTO ventacoches.coches (
        fecha, cliente, fabricante_id, modelo_id, version,
        fuel_id, puertas_id, tipo_id, provincia_id,
        precio, precio_financiado, cantidad
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *
    `, [
      fecha, cliente, fabricante_id, modelo_id, version,
      fuel_id, puertas_id, tipo_id, provincia_id,
      precio, precio_financiado, cantidad
    ]);

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});


/**
 * DELETE eliminar cotxe per id
 */
router.delete("/coches/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query("DELETE FROM ventacoches.coches WHERE id=$1", [id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: "Coche no encontrado" });
    }
    res.json({ message: "Coche eliminado correctamente" });
  } catch (err) {
    next(err);
  }
});

/* ================================
   📊 ENDPOINTS AVANÇATS - FILTRES
================================ */

/**
 * Filtrar cotxes per fabricant
 */
router.get("/coches/fabricante/:fabricante_id", async (req, res, next) => {
  try {
    const { fabricante_id } = req.params;
    const { rows } = await pool.query(`
      SELECT c.*, f.fabricante, m.modelo
      FROM ventacoches.coches c
      LEFT JOIN ventacoches.dim_fabricantes f ON c.fabricante_id = f.fabricante_id
      LEFT JOIN ventacoches.dim_modelos m ON c.modelo_id = m.modelo_id
      WHERE c.fabricante_id = $1
      ORDER BY c.precio DESC
    `, [fabricante_id]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * Filtrar cotxes per model
 */
router.get("/coches/modelo/:modelo_id", async (req, res, next) => {
  try {
    const { modelo_id } = req.params;
    const { rows } = await pool.query(`
      SELECT c.*, f.fabricante, m.modelo
      FROM ventacoches.coches c
      LEFT JOIN ventacoches.dim_fabricantes f ON c.fabricante_id = f.fabricante_id
      LEFT JOIN ventacoches.dim_modelos m ON c.modelo_id = m.modelo_id
      WHERE c.modelo_id = $1
      ORDER BY c.precio DESC
    `, [modelo_id]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * Filtrar cotxes per combustible
 */
router.get("/coches/fuel/:fuel_id", async (req, res, next) => {
  try {
    const { fuel_id } = req.params;
    const { rows } = await pool.query(`
      SELECT c.*, fu.fuel, f.fabricante, m.modelo
      FROM ventacoches.coches c
      LEFT JOIN ventacoches.dim_fuel fu ON c.fuel_id = fu.fuel_id
      LEFT JOIN ventacoches.dim_fabricantes f ON c.fabricante_id = f.fabricante_id
      LEFT JOIN ventacoches.dim_modelos m ON c.modelo_id = m.modelo_id
      WHERE c.fuel_id = $1
      ORDER BY c.precio DESC
    `, [fuel_id]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * Filtrar cotxes per província
 */
router.get("/coches/provincia/:provincia_id", async (req, res, next) => {
  try {
    const { provincia_id } = req.params;
    const { rows } = await pool.query(`
      SELECT c.*, pr.provincia, f.fabricante, m.modelo
      FROM ventacoches.coches c
      LEFT JOIN ventacoches.dim_provincias pr ON c.provincia_id = pr.provincia_id
      LEFT JOIN ventacoches.dim_fabricantes f ON c.fabricante_id = f.fabricante_id
      LEFT JOIN ventacoches.dim_modelos m ON c.modelo_id = m.modelo_id
      WHERE c.provincia_id = $1
      ORDER BY c.precio DESC
    `, [provincia_id]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * Filtrar cotxes per rang de preus
 */
router.get("/coches/precio/:min/:max", async (req, res, next) => {
  try {
    const { min, max } = req.params;
    const { rows } = await pool.query(`
      SELECT c.*, f.fabricante, m.modelo
      FROM ventacoches.coches c
      LEFT JOIN ventacoches.dim_fabricantes f ON c.fabricante_id = f.fabricante_id
      LEFT JOIN ventacoches.dim_modelos m ON c.modelo_id = m.modelo_id
      WHERE c.precio BETWEEN $1 AND $2
      ORDER BY c.precio ASC
    `, [min, max]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});


export default router;
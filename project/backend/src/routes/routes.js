import {Router} from 'express';
import {pool} from '../db/db.js'

const router = Router();

/* ================================
   🏗️ TAULES DIMENSIONALS - CRUD
================================ */

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

router.post("/fabricantes", async (req, res, next) => {
  try {
    const { fabricante } = req.body;
    if (!fabricante) return res.status(400).json({ error: "El campo 'fabricante' es requerido" });

    const { rows } = await pool.query(
      "INSERT INTO ventacoches.dim_fabricantes (fabricante) VALUES ($1) RETURNING *",
      [fabricante]
    );
    res.status(201).json(rows[0]);
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

router.delete("/fabricantes/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query("DELETE FROM ventacoches.dim_fabricantes WHERE fabricante_id = $1", [id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: "Fabricante no encontrado" });
    }

    res.json({ message: "Fabricante eliminado correctamente" });
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

router.post("/modelos", async (req, res, next) => {
  try {
    const { modelo } = req.body;
    if (!modelo) return res.status(400).json({ error: "El campo 'modelo' es requerido" });

    const { rows } = await pool.query(
      "INSERT INTO ventacoches.dim_modelos (modelo) VALUES ($1) RETURNING *",
      [modelo]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put("/modelos/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { modelo } = req.body;

    const { rows } = await pool.query(
      "UPDATE ventacoches.dim_modelos SET modelo = $1 WHERE modelo_id = $2 RETURNING *",
      [modelo, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Modelo no encontrado" });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete("/modelos/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query("DELETE FROM ventacoches.dim_modelos WHERE modelo_id = $1", [id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: "Modelo no encontrado" });
    }

    res.json({ message: "Modelo eliminado correctamente" });
  } catch (err) {
    next(err);
  }
});

// ===== FUEL =====
router.get("/fuel", async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM ventacoches.dim_fuel ORDER BY fuel_id ASC");
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No se encontraron tipos de fuel" });
    }
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get("/fuel/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM ventacoches.dim_fuel WHERE fuel_id = $1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Fuel no encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post("/fuel", async (req, res, next) => {
  try {
    const { fuel } = req.body;
    if (!fuel) return res.status(400).json({ error: "El campo 'fuel' es requerido" });

    const { rows } = await pool.query(
      "INSERT INTO ventacoches.dim_fuel (fuel) VALUES ($1) RETURNING *",
      [fuel]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put("/fuel/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fuel } = req.body;

    const { rows } = await pool.query(
      "UPDATE ventacoches.dim_fuel SET fuel = $1 WHERE fuel_id = $2 RETURNING *",
      [fuel, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Fuel no encontrado" });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete("/fuel/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query("DELETE FROM ventacoches.dim_fuel WHERE fuel_id = $1", [id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: "Fuel no encontrado" });
    }

    res.json({ message: "Fuel eliminado correctamente" });
  } catch (err) {
    next(err);
  }
});

// ===== TIPOS =====
router.get("/tipos", async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM ventacoches.dim_tipo ORDER BY tipo_id ASC");
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No se encontraron tipos" });
    }
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get("/tipos/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM ventacoches.dim_tipo WHERE tipo_id = $1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Tipo no encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post("/tipos", async (req, res, next) => {
  try {
    const { tipo_nombre } = req.body;
    if (!tipo_nombre) return res.status(400).json({ error: "El campo 'tipo_nombre' es requerido" });

    const { rows } = await pool.query(
      "INSERT INTO ventacoches.dim_tipo (tipo_nombre) VALUES ($1) RETURNING *",
      [tipo_nombre]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put("/tipos/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tipo_nombre } = req.body;

    const { rows } = await pool.query(
      "UPDATE ventacoches.dim_tipo SET tipo_nombre = $1 WHERE tipo_id = $2 RETURNING *",
      [tipo_nombre, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Tipo no encontrado" });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete("/tipos/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query("DELETE FROM ventacoches.dim_tipo WHERE tipo_id = $1", [id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: "Tipo no encontrado" });
    }

    res.json({ message: "Tipo eliminado correctamente" });
  } catch (err) {
    next(err);
  }
});

// ===== PUERTAS =====
router.get("/puertas", async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM ventacoches.dim_puertas ORDER BY puertas_id ASC");
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No se encontraron puertas" });
    }
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get("/puertas/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM ventacoches.dim_puertas WHERE puertas_id = $1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Puerta no encontrada" });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post("/puertas", async (req, res, next) => {
  try {
    const { puertas_numero } = req.body;
    if (!puertas_numero) return res.status(400).json({ error: "El campo 'puertas_numero' es requerido" });

    const { rows } = await pool.query(
      "INSERT INTO ventacoches.dim_puertas (puertas_numero) VALUES ($1) RETURNING *",
      [puertas_numero]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put("/puertas/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { puertas_numero } = req.body;

    const { rows } = await pool.query(
      "UPDATE ventacoches.dim_puertas SET puertas_numero = $1 WHERE puertas_id = $2 RETURNING *",
      [puertas_numero, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Puerta no encontrada" });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete("/puertas/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query("DELETE FROM ventacoches.dim_puertas WHERE puertas_id = $1", [id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: "Puerta no encontrada" });
    }

    res.json({ message: "Puerta eliminada correctamente" });
  } catch (err) {
    next(err);
  }
});

// ===== PROVINCIAS =====
router.get("/provincias", async (_req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM ventacoches.dim_provincias ORDER BY provincia_id ASC");
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No se encontraron provincias" });
    }
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get("/provincias/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM ventacoches.dim_provincias WHERE provincia_id = $1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Provincia no encontrada" });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post("/provincias", async (req, res, next) => {
  try {
    const { provincia } = req.body;
    if (!provincia) return res.status(400).json({ error: "El campo 'provincia' es requerido" });

    const { rows } = await pool.query(
      "INSERT INTO ventacoches.dim_provincias (provincia) VALUES ($1) RETURNING *",
      [provincia]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put("/provincias/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { provincia } = req.body;

    const { rows } = await pool.query(
      "UPDATE ventacoches.dim_provincias SET provincia = $1 WHERE provincia_id = $2 RETURNING *",
      [provincia, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Provincia no encontrada" });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete("/provincias/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query("DELETE FROM ventacoches.dim_provincias WHERE provincia_id = $1", [id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: "Provincia no encontrada" });
    }

    res.json({ message: "Provincia eliminada correctamente" });
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
 * PUT actualitzar cotxe per id
 */
router.put("/coches/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      fecha, cliente, fabricante_id, modelo_id, version,
      fuel_id, puertas_id, tipo_id, provincia_id,
      precio, precio_financiado, cantidad
    } = req.body;

    const { rows } = await pool.query(`
      UPDATE ventacoches.coches
      SET fecha=$1, cliente=$2, fabricante_id=$3, modelo_id=$4, version=$5,
          fuel_id=$6, puertas_id=$7, tipo_id=$8, provincia_id=$9,
          precio=$10, precio_financiado=$11, cantidad=$12
      WHERE id=$13
      RETURNING *
    `, [
      fecha, cliente, fabricante_id, modelo_id, version,
      fuel_id, puertas_id, tipo_id, provincia_id,
      precio, precio_financiado, cantidad, id
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Coche no encontrado" });
    }
    res.json(rows[0]);
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
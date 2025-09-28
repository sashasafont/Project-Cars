-- 04_INDEXES_VIEWS.SQL
-- Creació d'índexs i vistes per optimització

-- ===============================
-- ÍNDEXS PER OPTIMITZAR CONSULTES
-- ===============================
CREATE OR REPLACE VIEW ventacoches.v_coches_completa AS
SELECT 
    c.id,
    c.fecha,
    c.cliente,
    f.fabricante,
    m.modelo,
    c.version,
    fu.fuel,
    p.puertas_numero,
    t.tipo_nombre,
    pr.provincia,
    c.precio,
    c.precio_financiado
FROM ventacoches.coches c
LEFT JOIN ventacoches.dim_fabricantes f ON c.fabricante_id = f.fabricante_id
LEFT JOIN ventacoches.dim_modelos m ON c.modelo_id = m.modelo_id
LEFT JOIN ventacoches.dim_fuel fu ON c.fuel_id = fu.fuel_id
LEFT JOIN ventacoches.dim_puertas p ON c.puertas_id = p.puertas_id
LEFT JOIN ventacoches.dim_tipo t ON c.tipo_id = t.tipo_id
LEFT JOIN ventacoches.dim_provincias pr ON c.provincia_id = pr.provincia_id;

-- Vista de resum per fabricant
CREATE OR REPLACE VIEW ventacoches.v_resum_fabricant AS
SELECT 
    f.fabricante,
    COUNT(*) as total_coches,
    ROUND(AVG(c.precio), 2) as precio_medio,
    MIN(c.precio) as precio_min,
    MAX(c.precio) as precio_max,
    SUM(c.precio) as facturacion_total,
    COUNT(DISTINCT c.modelo_id) as modelos_diferentes
FROM ventacoches.coches c
JOIN ventacoches.dim_fabricantes f ON c.fabricante_id = f.fabricante_id
WHERE c.precio IS NOT NULL
GROUP BY f.fabricante, f.fabricante_id
ORDER BY total_coches DESC;

-- Vista de vendes per província
CREATE OR REPLACE VIEW ventacoches.v_vendes_provincia AS
SELECT 
    pr.provincia,
    COUNT(*) as total_coches,
    ROUND(AVG(c.precio), 2) as precio_medio,
    SUM(c.precio) as facturacion_total,
    COUNT(DISTINCT c.fabricante_id) as fabricantes_diferentes,
    MIN(c.fecha) as primera_venda,
    MAX(c.fecha) as ultima_venda
FROM ventacoches.coches c
JOIN ventacoches.dim_provincias pr ON c.provincia_id = pr.provincia_id
WHERE c.precio IS NOT NULL
GROUP BY pr.provincia, pr.provincia_id
ORDER BY total_coches DESC;

-- Vista de models per fabricant
CREATE OR REPLACE VIEW ventacoches.v_models_fabricant AS
SELECT 
    f.fabricante,
    m.modelo,
    COUNT(*) as total_coches,
    ROUND(AVG(c.precio), 2) as precio_medio,
    MIN(c.precio) as precio_min,
    MAX(c.precio) as precio_max
FROM ventacoches.coches c
JOIN ventacoches.dim_fabricantes f ON c.fabricante_id = f.fabricante_id
JOIN ventacoches.dim_modelos m ON c.modelo_id = m.modelo_id
WHERE c.precio IS NOT NULL
GROUP BY f.fabricante, m.modelo, f.fabricante_id, m.modelo_id
ORDER BY f.fabricante, total_coches DESC;

-- Vista de statistiques per combustible
CREATE OR REPLACE VIEW ventacoches.v_stats_fuel AS
SELECT 
    fu.fuel,
    COUNT(*) as total_coches,
    ROUND(AVG(c.precio), 2) as precio_medio,
    ROUND(AVG(c.precio_financiado), 2) as precio_financiado_medio,
    ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()), 2) as porcentaje_mercado
FROM ventacoches.coches c
JOIN ventacoches.dim_fuel fu ON c.fuel_id = fu.fuel_id
WHERE c.precio IS NOT NULL
GROUP BY fu.fuel, fu.fuel_id
ORDER BY total_coches DESC;

-- Exemple: Obtenir tots els fabricants
SELECT * FROM ventacoches.dim_fabricantes ORDER BY fabricante_id ASC;

-- Exemple: Obtenir tots els models  
SELECT * FROM ventacoches.dim_modelos ORDER BY modelo_id ASC;

-- Exemple: Obtenir tots els tipus de fuel
SELECT * FROM ventacoches.dim_fuel ORDER BY fuel_id ASC;

-- Exemple: Dashboard principal
SELECT 
    COUNT(*) AS total_coches,
    COUNT(DISTINCT fabricante_id) AS total_fabricantes,
    COUNT(DISTINCT modelo_id) AS total_modelos,
    ROUND(AVG(precio), 2) AS precio_medio,
    MIN(precio) AS precio_min,
    MAX(precio) AS precio_max
FROM ventacoches.coches
WHERE precio IS NOT NULL;

-- ===============================
-- CONSULTES ANALÍTIQUES AVANÇADES
-- ===============================

-- Anàlisi temporal de vendes (per mes)
SELECT 
    DATE_TRUNC('month', fecha) as mes,
    COUNT(*) as total_vendes,
    ROUND(AVG(precio), 2) as precio_medio,
    SUM(precio) as facturacion_mes
FROM ventacoches.coches
WHERE fecha IS NOT NULL AND precio IS NOT NULL
GROUP BY DATE_TRUNC('month', fecha)
ORDER BY mes DESC;

-- Top 10 combinacions fabricant-model més populars
SELECT 
    f.fabricante,
    m.modelo,
    COUNT(*) as total_coches,
    ROUND(AVG(c.precio), 2) as precio_medio
FROM ventacoches.coches c
JOIN ventacoches.dim_fabricantes f ON c.fabricante_id = f.fabricante_id
JOIN ventacoches.dim_modelos m ON c.modelo_id = m.modelo_id
WHERE c.precio IS NOT NULL
GROUP BY f.fabricante, m.modelo
ORDER BY total_coches DESC
LIMIT 10;

-- Anàlisi per tipus de combustible
SELECT 
    fu.fuel,
    COUNT(*) as total_coches,
    ROUND(AVG(c.precio), 2) as precio_medio,
    ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()), 2) as porcentaje_mercado
FROM ventacoches.coches c
JOIN ventacoches.dim_fuel fu ON c.fuel_id = fu.fuel_id
WHERE c.precio IS NOT NULL
GROUP BY fu.fuel
ORDER BY total_coches DESC;

-- Comparació preu normal vs financiat
SELECT 
    f.fabricante,
    COUNT(*) as total_coches,
    ROUND(AVG(c.precio), 2) as precio_normal,
    ROUND(AVG(c.precio_financiado), 2) as precio_financiado,
    ROUND(AVG(c.precio - COALESCE(c.precio_financiado, c.precio)), 2) as diferencia_media
FROM ventacoches.coches c
JOIN ventacoches.dim_fabricantes f ON c.fabricante_id = f.fabricante_id
WHERE c.precio IS NOT NULL AND c.precio_financiado IS NOT NULL
GROUP BY f.fabricante
ORDER BY diferencia_media DESC;

-- Segments de preus
WITH segments AS (
    SELECT 
        CASE 
            WHEN precio < 20000 THEN 'Económico (< 20k)'
            WHEN precio BETWEEN 20000 AND 35000 THEN 'Medio (20k-35k)'
            WHEN precio BETWEEN 35000 AND 50000 THEN 'Premium (35k-50k)'
            WHEN precio > 50000 THEN 'Lujo (> 50k)'
        END as segmento,
        precio
    FROM ventacoches.coches
    WHERE precio IS NOT NULL
)
SELECT 
    segmento,
    COUNT(*) as total_coches,
    ROUND(AVG(precio), 2) as precio_medio,
    ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()), 2) as porcentaje
FROM segments
GROUP BY segmento
ORDER BY precio_medio;

-- ===============================
-- CONSULTES DE VALIDACIÓ
-- ===============================

-- Verificar qualitat de dades
SELECT 
    'Total registros' as descripcion,
    COUNT(*) as cantidad
FROM ventacoches.coches
UNION ALL
SELECT 
    'Con precio',
    COUNT(*)
FROM ventacoches.coches 
WHERE precio IS NOT NULL
UNION ALL
SELECT 
    'Con precio financiado',
    COUNT(*)
FROM ventacoches.coches 
WHERE precio_financiado IS NOT NULL
UNION ALL
SELECT 
    'Con versión',
    COUNT(*)
FROM ventacoches.coches 
WHERE version IS NOT NULL AND TRIM(version) != '';

-- Verificar relacions entre taules
SELECT 
    'Coches' as tabla,
    COUNT(*) as registros
FROM ventacoches.coches
UNION ALL
SELECT 
    'Fabricantes',
    COUNT(*)
FROM ventacoches.dim_fabricantes
UNION ALL
SELECT 
    'Modelos',
    COUNT(*)
FROM ventacoches.dim_modelos
UNION ALL
SELECT 
    'Fuel',
    COUNT(*)
FROM ventacoches.dim_fuel
UNION ALL
SELECT 
    'Provincias',
    COUNT(*)
FROM ventacoches.dim_provincias;

-- Exemple de test de rendiment
EXPLAIN (ANALYZE, BUFFERS)
SELECT c.*, f.fabricante, m.modelo
FROM ventacoches.coches c
JOIN ventacoches.dim_fabricantes f ON c.fabricante_id = f.fabricante_id
JOIN ventacoches.dim_modelos m ON c.modelo_id = m.modelo_id
WHERE c.precio BETWEEN 20000 AND 50000
ORDER BY c.fecha DESC
LIMIT 10;
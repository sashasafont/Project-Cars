-- 03_DIM_FACT.SQL
-- Creació de taules dimensionals i de fets
DROP TABLE IF EXISTS ventacoches.coches;
DROP TABLE IF EXISTS ventacoches.dim_provincias;
DROP TABLE IF EXISTS ventacoches.dim_fabricantes;
DROP TABLE IF EXISTS ventacoches.dim_modelos;
DROP TABLE IF EXISTS ventacoches.dim_fuel;
DROP TABLE IF EXISTS ventacoches.dim_puertas;
DROP TABLE IF EXISTS ventacoches.dim_tipo;

-- Verificació de dades raw
SELECT COUNT(*) as total_raw FROM ventacoches.coches_raw;
SELECT * FROM ventacoches.coches_raw LIMIT 5;

-- Estadístiques de dades úniques
SELECT COUNT(DISTINCT provincia) as provincias_unicas FROM ventacoches.coches_raw;
SELECT COUNT(DISTINCT fabricante) as fabricantes_unicos FROM ventacoches.coches_raw;
SELECT COUNT(DISTINCT modelo) as modelos_unicos FROM ventacoches.coches_raw;
SELECT COUNT(DISTINCT fuel) as fuel_unicos FROM ventacoches.coches_raw;
SELECT COUNT(DISTINCT tipo) as tipos_unicos FROM ventacoches.coches_raw;

-- Crear taules dimensionals
CREATE TABLE ventacoches.dim_provincias(
    provincia_id SERIAL PRIMARY KEY,
    provincia TEXT UNIQUE
);

CREATE TABLE ventacoches.dim_fabricantes(
    fabricante_id SERIAL PRIMARY KEY,
    fabricante TEXT UNIQUE
);

CREATE TABLE ventacoches.dim_modelos(
    modelo_id SERIAL PRIMARY KEY,
    modelo TEXT UNIQUE
);

CREATE TABLE ventacoches.dim_fuel(
    fuel_id SERIAL PRIMARY KEY,
    fuel TEXT UNIQUE
);

CREATE TABLE ventacoches.dim_puertas(
    puertas_id SERIAL PRIMARY KEY,
    puertas_numero INT UNIQUE
);

CREATE TABLE ventacoches.dim_tipo(
    tipo_id SERIAL PRIMARY KEY,
    tipo_nombre TEXT UNIQUE
);

-- Inserir dades a dimensions
INSERT INTO ventacoches.dim_provincias (provincia)
SELECT DISTINCT
    NULLIF(regexp_replace(lower(coalesce(provincia,'')), '\s+',' ','g'),'')
FROM ventacoches.coches_raw
WHERE provincia IS NOT NULL;

INSERT INTO ventacoches.dim_fabricantes (fabricante)
SELECT DISTINCT
    NULLIF(regexp_replace(lower(coalesce(fabricante,'')), '\s+',' ','g'),'')
FROM ventacoches.coches_raw
WHERE fabricante IS NOT NULL;

INSERT INTO ventacoches.dim_modelos (modelo)
SELECT DISTINCT
    NULLIF(regexp_replace(lower(coalesce(modelo,'')), '\s+',' ','g'),'')
FROM ventacoches.coches_raw
WHERE modelo IS NOT NULL;

INSERT INTO ventacoches.dim_fuel (fuel)
SELECT DISTINCT
    NULLIF(regexp_replace(lower(coalesce(fuel,'')), '\s+',' ','g'),'')
FROM ventacoches.coches_raw
WHERE fuel IS NOT NULL;

INSERT INTO ventacoches.dim_puertas (puertas_numero)
SELECT DISTINCT 
    CAST(puertas AS INT) 
FROM ventacoches.coches_raw
WHERE puertas IS NOT NULL;

INSERT INTO ventacoches.dim_tipo (tipo_nombre)
SELECT DISTINCT
    NULLIF(regexp_replace(lower(coalesce(tipo,'')), '\s+',' ','g'),'')
FROM ventacoches.coches_raw
WHERE tipo IS NOT NULL;

-- Crear taula de fets
CREATE TABLE ventacoches.coches(
    id SERIAL PRIMARY KEY,
    fecha DATE,
    cliente TEXT,
    fabricante_id INT REFERENCES ventacoches.dim_fabricantes(fabricante_id),
    modelo_id INT REFERENCES ventacoches.dim_modelos(modelo_id),
    version TEXT,
    fuel_id INT REFERENCES ventacoches.dim_fuel(fuel_id),
    puertas_id INT REFERENCES ventacoches.dim_puertas(puertas_id),
    tipo_id INT REFERENCES ventacoches.dim_tipo(tipo_id),
    provincia_id INT REFERENCES ventacoches.dim_provincias(provincia_id),
    precio INT,
    precio_financiado INT,
    cantidad INT DEFAULT 1
);

-- Inserir dades a taula principal
INSERT INTO ventacoches.coches (
    fecha, cliente, 
    fabricante_id, modelo_id, version,
    fuel_id, puertas_id, tipo_id, provincia_id,
    precio, precio_financiado, cantidad
)
SELECT
    CAST(s.fecha_publicacion AS DATE),
    NULL AS cliente,
    f.fabricante_id,
    m.modelo_id,
    s.version,
    fu.fuel_id,
    p.puertas_id,
    t.tipo_id,
    pr.provincia_id,
    CAST(s.precio AS INT),
    CAST(s.precio_financiado AS INT),
    1 AS cantidad
FROM ventacoches.coches_raw s
LEFT JOIN ventacoches.dim_fabricantes f ON 
    NULLIF(regexp_replace(lower(coalesce(s.fabricante,'')), '\s+',' ','g'),'') = f.fabricante
LEFT JOIN ventacoches.dim_modelos m ON 
    NULLIF(regexp_replace(lower(coalesce(s.modelo,'')), '\s+',' ','g'),'') = m.modelo
LEFT JOIN ventacoches.dim_fuel fu ON 
    NULLIF(regexp_replace(lower(coalesce(s.fuel,'')), '\s+',' ','g'),'') = fu.fuel
LEFT JOIN ventacoches.dim_puertas p ON 
    CAST(s.puertas AS INT) = p.puertas_numero
LEFT JOIN ventacoches.dim_tipo t ON 
    NULLIF(regexp_replace(lower(coalesce(s.tipo,'')), '\s+',' ','g'),'') = t.tipo_nombre
LEFT JOIN ventacoches.dim_provincias pr ON 
    NULLIF(regexp_replace(lower(coalesce(s.provincia,'')), '\s+',' ','g'),'') = pr.provincia;

-- Verificació final
SELECT COUNT(*) as total_records FROM ventacoches.coches;
SELECT COUNT(*) as missing_fabricante FROM ventacoches.coches WHERE fabricante_id IS NULL;
SELECT COUNT(*) as missing_modelo FROM ventacoches.coches WHERE modelo_id IS NULL;
SELECT COUNT(*) as missing_fuel FROM ventacoches.coches WHERE fuel_id IS NULL;
SELECT COUNT(*) as missing_tipo FROM ventacoches.coches WHERE tipo_id IS NULL;
SELECT COUNT(*) as missing_provincia FROM ventacoches.coches WHERE provincia_id IS NULL;
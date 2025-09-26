DROP TABLE IF EXISTS ventacoches.coches;
DROP TABLE IF EXISTS ventacoches.dim_provincias;
DROP TABLE IF EXISTS ventacoches.dim_fabricantes;
DROP TABLE IF EXISTS ventacoches.dim_modelos;
DROP TABLE IF EXISTS ventacoches.dim_fuel;
DROP TABLE IF EXISTS ventacoches.dim_puertas;
DROP TABLE IF EXISTS ventacoches.dim_tipo;
--cuenta todos los coches
SELECT COUNT(*) FROM ventacoches.coches_raw;
--muestra los 5 primeros
SELECT * FROM ventacoches.coches_raw limit 5;

--cuenta provincias distintas(52)
SELECT COUNT(DISTINCT provincia)
FROM ventacoches.coches_raw;
--seleciona las provincias
SELECT DISTINCT provincia
FROM ventacoches.coches_raw;

--cuenta fabricante (75) son muchos????
SELECT COUNT(DISTINCT fabricante)
FROM ventacoches.coches_raw;
--seleciona fabricantes
SELECT DISTINCT fabricante
FROM ventacoches.coches_raw;

SELECT COUNT(DISTINCT modelo)
FROM ventacoches.coches_raw;
--seleciona modelos
SELECT DISTINCT modelo
FROM ventacoches.coches_raw;

--cuenta fuel (7) -> foreing
SELECT COUNT(DISTINCT fuel)
FROM ventacoches.coches_raw;
--seleciona fuel -> foreing
SELECT DISTINCT fuel
FROM ventacoches.coches_raw;
 
--cuenta puertas (4) ->foreing
SELECT COUNT(DISTINCT puertas)
FROM ventacoches.coches_raw;
--seleciona puertas
SELECT DISTINCT puertas
FROM ventacoches.coches_raw;

--cuenta tipo (2)
SELECT COUNT(DISTINCT tipo)
FROM ventacoches.coches_raw;
--seleciona tipo
SELECT DISTINCT tipo
FROM ventacoches.coches_raw;

DROP TABLE IF EXISTS ventacoches.dim_provincias;
CREATE TABLE ventacoches.dim_provincias(
provincia_id SERIAL PRIMARY KEY,
provincia TEXT UNIQUE);

DROP TABLE IF EXISTS ventacoches.dim_fabricantes;
CREATE TABLE ventacoches.dim_fabricantes(
fabricante_id SERIAL PRIMARY KEY,
fabricante TEXT UNIQUE
);

DROP TABLE IF EXISTS ventacoches.dim_modelos;
CREATE TABLE ventacoches.dim_modelos(
	modelo_id SERIAL PRIMARY KEY,
	modelo TEXT UNIQUE
);

DROP TABLE IF EXISTS ventacoches.dim_fuel;
CREATE TABLE ventacoches.dim_fuel(
fuel_id SERIAL PRIMARY KEY,
fuel TEXT UNIQUE
);

DROP TABLE IF EXISTS ventacoches.dim_puertas;
CREATE TABLE ventacoches.dim_puertas(
puertas_id SERIAL PRIMARY KEY,
puertas_numero INT UNIQUE
);

DROP TABLE IF EXISTS ventacoches.dim_tipo;
CREATE TABLE ventacoches.dim_tipo(
tipo_id SERIAL PRIMARY KEY,
tipo_nombre TEXT UNIQUE
);


INSERT INTO ventacoches.dim_provincias (provincia)
SELECT DISTINCT
    NULLIF(regexp_replace(lower(coalesce(provincia,'')), '\s+',' ','g'),'')
FROM
    ventacoches.coches_raw
WHERE
    provincia IS NOT NULL;

INSERT INTO ventacoches.dim_fabricantes (fabricante)
SELECT DISTINCT
	NULLIF(regexp_replace(lower(coalesce(fabricante,'')), '\s+',' ','g'),'')
FROM ventacoches.coches_raw
WHERE
	fabricante IS NOT NULL;

INSERT INTO ventacoches.dim_modelos (modelo)
SELECT DISTINCT
	NULLIF(regexp_replace(lower(coalesce(modelo,'')), '\s+',' ','g'),'')
FROM ventacoches.coches_raw
WHERE
	modelo IS NOT NULL;

INSERT INTO ventacoches.dim_fuel (fuel)
SELECT DISTINCT
	NULLIF(regexp_replace(lower(coalesce(fuel,'')), '\s+',' ','g'),'')
FROM 
	ventacoches.coches_raw
WHERE
	fuel IS NOT NULL;

INSERT INTO ventacoches.dim_puertas (puertas_numero)
SELECT DISTINCT 
	puertas 
FROM 
	ventacoches.coches_raw
WHERE 
	puertas IS NOT NULL;

INSERT INTO ventacoches.dim_tipo (tipo_nombre)
SELECT DISTINCT
    NULLIF(regexp_replace(lower(coalesce(tipo,'')), '\s+',' ','g'),'')
FROM
    ventacoches.coches_raw
WHERE
    tipo IS NOT NULL;

DROP TABLE IF EXISTS ventacoches.coches;
CREATE TABLE ventacoches.coches(
	id SERIAL PRIMARY KEY,
	fecha DATE,
	cliente TEXT,
	email TEXT,

	fabricante_id INT REFERENCES ventacoches.dim_fabricantes(fabricante_id),
	modelo_id INT REFERENCES ventacoches.dim_modelos(modelo_id),
	version TEXT,
	
	fuel_id INT REFERENCES ventacoches.dim_fuel(fuel_id),
	puertas_id INT REFERENCES ventacoches.dim_puertas(puertas_id),
	tipo_id INT REFERENCES ventacoches.dim_tipo(tipo_id),
	provincia_id INT REFERENCES ventacoches.dim_provincias(provincia_id),

	precio INT,
	precio_financiado INT,
	cantidad INT
);

INSERT INTO ventacoches.coches (
	fecha, cliente, email, 
	fabricante_id, modelo_id, version,
	fuel_id, puertas_id, tipo_id, provincia_id,
	precio, precio_financiado, cantidad
	)
SELECT
	CAST(s.fecha_publicacion AS DATE),
	NULL AS cliente,
	NULL AS email,
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
LEFT JOIN ventacoches.dim_fabricantes f ON lower(s.fabricante) = f.fabricante
LEFT JOIN ventacoches.dim_modelos m ON lower(s.modelo) = m.modelo
LEFT JOIN ventacoches.dim_fuel fu ON lower(s.fuel) = fu.fuel
LEFT JOIN ventacoches.dim_puertas p ON s.puertas = p.puertas_numero
LEFT JOIN ventacoches.dim_tipo t ON lower(s.tipo) = t.tipo_nombre
LEFT JOIN ventacoches.dim_provincias pr ON lower(s.provincia) = pr.provincia;
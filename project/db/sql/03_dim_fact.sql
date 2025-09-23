--cuenta todos los coches
SELECT COUNT(*) FROM ventacoches.coches_raw;
--muestra los 5 primeros
SELECT * FROM ventacoches.coches_raw limit 5;

--cuenta provincias distintas(52)
SELECT count(DISTINCT provincia)
FROM ventacoches.coches_raw;
--seleciona las provincias
SELECT DISTINCT provincia
FROM ventacoches.coches_raw;

--cuenta marca -> sólo hay una, la eliminaremos
SELECT count(DISTINCT marca)
FROM ventacoches.coches_raw;

--cuenta fabricante (75) son muchos????
SELECT count(DISTINCT fabricante)
FROM ventacoches.coches_raw;
--seleciona fabricantes
SELECT DISTINCT fabricante
FROM ventacoches.coches_raw;

--cuenta fuel (7) -> foreing
SELECT count(DISTINCT fuel)
FROM ventacoches.coches_raw;
--seleciona fuel -> foreing
SELECT DISTINCT fuel
FROM ventacoches.coches_raw;
 
--cuenta puertas (4) ->foreing
SELECT count(DISTINCT puertas)
FROM ventacoches.coches_raw;
--seleciona puertas
SELECT DISTINCT puertas
FROM ventacoches.coches_raw;

--cuenta tipo (2)
SELECT count(DISTINCT tipo)
FROM ventacoches.coches_raw;
--seleciona tipo
SELECT DISTINCT tipo
FROM ventacoches.coches_raw;

DROP TABLE IF EXISTS ventacoches.dim_provincias;
CREATE TABLE ventacoches.dim_provincias(
provincia_id SERIAL PRIMARY KEY,
provincia TEXT UNIQUE);

DROP TABLE IF EXISTS ventacoches.dim_fuel;
CREATE TABLE ventacoches.dim_fuel(
fuel_id SERIAL PRIMARY KEY,
fuel TEXT UNIQUE);

DROP TABLE IF EXISTS ventacoches.dim_puertas;
CREATE TABLE ventacoches.dim_puertas(
puertas_id SERIAL PRIMARY KEY,
puertas_numero INT UNIQUE);

DROP TABLE IF EXISTS ventacoches.dim_tipo;
CREATE TABLE ventacoches.dim_tipo(
tipo_id SERIAL PRIMARY KEY,
tipo_nombre TEXT UNIQUE);


INSERT INTO ventacoches.dim_provincias (provincia)
SELECT DISTINCT
    NULLIF(regexp_replace(lower(coalesce(provincia,'')), '\s+',' ','g'),'')
FROM
    ventacoches.coches_raw
WHERE
    provincia IS NOT NULL;


INSERT INTO ventacoches.dim_fuel (fuel)
SELECT DISTINCT
	NULLIF(regexp_replace(lower(coalesce(fuel,'')), '\s+',' ','g'),'')
FROM 
	ventacoches.coches_raw
WHERE
	fuel IS NOT NULL;

INSERT INTO ventacoches.dim_tipo (tipo_nombre)
SELECT DISTINCT
    NULLIF(regexp_replace(lower(coalesce(tipo,'')), '\s+',' ','g'),'')
FROM
    ventacoches.coches_raw
WHERE
    tipo IS NOT NULL;

INSERT INTO ventacoches.dim_puertas (puertas_numero)
SELECT DISTINCT 
	puertas 
FROM 
	ventacoches.coches_raw
WHERE 
	puertas IS NOT NULL;


DROP TABLE IF EXISTS ventacoches.coches;
CREATE TABLE ventacoches.coches(
	id SERIAL PRIMARY KEY,
	
	fecha DATE,
	cliente TEXT,
	email TEXT,
	fabricante TEXT,
	modelo TEXT,
	version TEXT,
	precio INT,
	cantidad INT
);

INSERT INTO ventacoches.coches (fecha, cliente, email, fabricante, modelo, version, precio, cantidad)
SELECT
	CAST(fecha AS DATE),
	cliente,
	email,
	fabricante,
	modelo,
	version,
	CAST(precio AS INT),
	CAST(cantidad AS INT)
FROM ventacoches.staging_copy;

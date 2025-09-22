CREATE TABLE IF NOT EXISTS ventacoches.coches_raw(
	url TEXT,
	marca TEXT,
	fabricante TEXT,
	modelo TEXT,
	version TEXT,
	precio INT,
	precio_financiado INT,
	fuel TEXT,
	year INT,
	kilometraje INT,
	power TEXT,
	doors INT,
	tipo TEXT,
	color TEXT,
	fotos TEXT,
	profesional BOOLEAN,
	vendedor TEXT,
	provincia TEXT,
	pais TEXT,
	fecha_publicacion DATE,
	fecha_insercion DATE
);

COPY ventacoches.coches_raw 
FROM '/backups/coches.csv'
CSV HEADER
DELIMITER ','
ESCAPE '\';

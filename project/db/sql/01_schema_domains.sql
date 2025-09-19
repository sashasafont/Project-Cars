DROP SCHEMA IF EXISTS cochecitos cascade;
CREATE SCHEMA IF NOT EXISTS cochecitos;

CREATE DOMAIN cochecitos.dom_text_clean as text
	CHECK(value is null or length(btrim(value)) > 0);

CREATE DOMAIN cochecitos.email as text
	CHECK (VALUE ~* '^[\w\.-]+@[\w\.-]+\.\w{2,}$');
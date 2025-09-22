DROP SCHEMA IF EXISTS ventacoches cascade;
CREATE SCHEMA IF NOT EXISTS ventacoches;

CREATE DOMAIN ventacoches.dom_text_clean as text
	CHECK(value is null or length(btrim(value)) > 0);

CREATE DOMAIN ventacoches.email as text
	CHECK (VALUE ~* '^[\w\.-]+@[\w\.-]+\.\w{2,}$');
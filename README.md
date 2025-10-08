cat > README.md <<EOL
# 🚗 Project-Cars

Proyecto full-stack para la gestión y visualización de coches.  
Desarrollado en **Windows** usando **Docker Desktop**, **Node.js** y **React**.

---

## 🧩 Requisitos

- Docker Desktop
- Node.js LTS
- Git (opcional, si clonas desde un repositorio)

---

## ⚙️ Instalación

1. Clona el repositorio:
\`\`\`bash
git clone <URL-del-repo>
cd Project-Cars/Project-Cars/project
\`\`\`

2. (Opcional) Instala dependencias para desarrollo local:
\`\`\`bash
cd web
npm install
cd ../backend
npm install
\`\`\`

---

## 🐳 Uso con Docker Desktop

1. Abre Docker Desktop y espera a que diga:
🟢 *"Docker Desktop is running"*

2. Levanta los servicios (Postgres y pgAdmin):
\`\`\`bash
docker-compose up -d --build
\`\`\`

3. Verifica los contenedores activos:
\`\`\`bash
docker ps
\`\`\`

4. Ver logs:
\`\`\`bash
docker-compose logs -f
\`\`\`

5. Detener y borrar contenedores, redes y volúmenes:
\`\`\`bash
docker-compose down -v
\`\`\`

---

## 🧱 Servicios del proyecto

### Base de datos (Postgres)
- Contenedor: **contenedor_coches**  
- Puerto: `5432:5432`  
- Usuario: `coches123`  
- Contraseña: `coches123`  
- Base de datos: `ventacoches`  
- Volúmenes: `pgdata`, `./init`, `./backups`

### pgAdmin
- Contenedor: **pgadmin_curso**  
- Puerto: `8080:80`  
- Usuario: `admin@example.com`  
- Contraseña: `admin`  
- Depende de: `db`

---

## 🧱 Estructura del proyecto

\`\`\`
project/
├── backend/       # API / servidor Node.js
├── web/           # Aplicación web (React)
├── db/            # Scripts de base de datos
├── backups/       # Copias de seguridad
├── init/          # Scripts iniciales de DB
├── docker-compose.yml
├── package.json
└── README.md
\`\`\`

---

## 🔐 Variables de entorno

Crea un archivo `.env` si lo necesitas para tu backend:

\`\`\`
PORT=3000
DB_HOST=db
DB_PORT=5432
DB_USER=coches123
DB_PASS=coches123
DB_NAME=ventacoches
JWT_SECRET=clave_super_segura
\`\`\`

---

## 🧪 Ejecutar tests

Backend:
\`\`\`bash
cd backend
npm test
\`\`\`

Frontend:
\`\`\`bash
cd ../web
npm test
\`\`\`

---

## 👩‍💻 Contribuir

1. Haz fork del proyecto.
2. Crea una rama:
\`\`\`bash
git checkout -b feature/nueva-funcionalidad
\`\`\`
3. Realiza cambios y haz commit:
\`\`\`bash
git commit -m "Descripción de los cambios"
\`\`\`
4. Envía un Pull Request.

---

## 📄 Licencia

MIT

---

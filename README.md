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
```
git clone <URL-del-repo>
cd Project-Cars/project
```

2. Instala dependencias para desarrollo local:
 # /backend
```
cd backend
npm install
```
 # /frontend 
 ```
cd ../frontend
npm install
```
---

## Cómo ejecutar:

1. Abre Docker Desktop 

2. Abre tres consolas

### **Terminal 1 - Base de Datos (Docker)**

```
cd "ruta/al/proyecto/project"
docker-compose up -d
```

### **Terminal 2 - Backend**

```bash
cd "ruta/al/proyecto/project/backend"
npm install
node server.js
```


### **Terminal 3 - Frontend**

```bash
cd "ruta/al/proyecto/project/frontend"
npm run dev
```
---

### **Configurar Base de Datos (pgAdmin):**
1. **pgAdmin:** http://localhost:8080
   - Email: ``admin@example.com`` / Password: ``admin``
2. **Crear servidor PostgreSQL:**
   - Host: ``db`` / Port: ``5432`` / Database: ``ventacoches``
   - Username: ``coches123`` / Password: ``coches123``
3. **Ejecutar SQLs en orden:** 01→02→03→04→05 (carpeta ``db/sql/``)

### **URLs para probar:**
- **Frontend:** http://localhost:5173/coches
- **Fabricantes:** http://localhost:5173/fabricantes  
- **Modelos:** http://localhost:5173/modelos
- **Estadísticas:** http://localhost:5173/coches/stats

---

## 🧱 Servicios del proyecto

### Base de datos (Postgres)
- Contenedor: **contenedor__coches**  
- Puerto: ``5432:5432``  
- Usuario: ``coches123``  
- Contraseña: ``coches123``  
- Base de datos: ``ventacoches``  
- Volúmenes: ``pgdata``, ``./init``, ``./backups``

### pgAdmin
- Contenedor: **pgadmin__curso**  
- Puerto: ``8080:80``  
- Usuario: ``admin@example.com``  
- Contraseña: ``admin``  
- Depende de: ``db``


## 🧱 Estructura del proyecto

```
project/
├── backend/       # API / servidor Node.js
├── frontend/      # Aplicación web (React)
├── db/            # Scripts de base de datos
├── backups/       # Copias de seguridad
├── init/          # Scripts iniciales de DB
├── docker-compose.yml
├── package.json
└── README.md
```

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


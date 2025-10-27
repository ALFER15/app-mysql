# API Empleados (MySQL)

Proyecto: API REST para gestionar empleados y áreas con autenticación JWT y un frontend React + Vite.

Requisitos:
- Node.js 18+ (o versión compatible)
- MySQL server

Variables de entorno (ejemplo en `.env.example`):
- DB_HOST
- DB_PORT (opcional, default 3306)
- DB_USER
- DB_PASSWORD
- DB_DATABASE
- JWT_SECRET
- JWT_EXPIRES (opcional, default "1d")

Setup rápido:
1. Copia `.env.example` a `.env` y rellena las variables.
2. Crear la base de datos y tablas: `mysql -u root -p < mysql_companydb_schema.sql` (o usa tu cliente SQL).
3. Instalar dependencias: `npm install`.
4. Iniciar servidor en desarrollo:
   - `npm run dev` (arranca node)
   - o `npm run dev:watch` si instalas `nodemon` globalmente o lo agregas al proyecto.

Frontend:
- Entra en `frontend/` y sigue sus scripts (`npm install` + `npm run dev`).
- Por defecto el frontend apunta a `http://localhost:3000`.

Scripts útiles:
- `npm run dev` - iniciar servidor.
- `npm run dev:watch` - iniciar servidor con reinicio automático (requiere nodemon).

Notas:
- Asegúrate de establecer `JWT_SECRET` antes de crear usuarios.
- Hay un script `scripts/seed-admin.js` para crear un usuario admin si lo necesitas.


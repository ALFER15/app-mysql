require("dotenv").config();
const bcrypt = require("bcryptjs");
const { pool } = require("../src/db");

(async () => {
  try {
    const nombre = process.env.SEED_ADMIN_NAME || "Admin";
    const email = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
    const password = process.env.SEED_ADMIN_PASSWORD || "Admin123!";

    const [exists] = await pool.query("SELECT 1 FROM usuarios WHERE email = ?", [email]);
    if (exists.length > 0) { console.log("Usuario admin ya existe:", email); process.exit(0); }

    const hash = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)", [nombre, email, hash]);
    console.log("Usuario admin creado:", email);
    process.exit(0);
  } catch (err) {
    console.error("Error creando admin:", err.message);
    process.exit(1);
  }
})();

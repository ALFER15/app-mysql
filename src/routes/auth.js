const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../db");

router.post("/register", async (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "nombre, email y password son requeridos" });
  }
  try {
    const [rows] = await pool.query("SELECT 1 FROM usuarios WHERE email = ?", [email]);
    if (rows.length > 0) return res.status(409).json({ error: "El email ya está registrado" });

    const hash = await bcrypt.hash(password, 10);
    const [ins] = await pool.query(
      "INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)",
      [nombre, email, hash]
    );
    const id = ins.insertId;
    const token = jwt.sign({ id, email, nombre }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || "1d" });
    res.status(201).json({ token, user: { id, nombre, email } });
  } catch (err) {
    res.status(500).json({ error: "Error al registrar usuario", detail: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "email y password son requeridos" });
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, email, password_hash FROM usuarios WHERE email = ?",
      [email]
    );
    if (rows.length === 0) return res.status(401).json({ error: "Credenciales inválidas" });

    const user = rows[0];
    const ok = await require("bcryptjs").compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = require("jsonwebtoken").sign(
      { id: user.id, email: user.email, nombre: user.nombre },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "1d" }
    );
    res.json({ token, user: { id: user.id, nombre: user.nombre, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Error en login", detail: err.message });
  }
});

const auth = require("../middleware/auth");
router.get("/me", auth, (req, res) => res.json({ user: req.user }));

module.exports = router;

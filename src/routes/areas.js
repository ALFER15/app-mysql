const express = require("express");
const router = express.Router();
const { pool } = require("../db");

router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, nombre FROM areas ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al listar áreas", detail: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, nombre FROM areas WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Área no encontrada" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener área", detail: err.message });
  }
});

router.post("/", async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: "nombre es requerido" });
  try {
    const [ins] = await pool.query("INSERT INTO areas (nombre) VALUES (?)", [nombre]);
    res.status(201).json({ id: ins.insertId, nombre });
  } catch (err) {
    res.status(500).json({ error: "Error al crear área", detail: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: "nombre es requerido" });
  try {
    await pool.query("UPDATE areas SET nombre = ? WHERE id = ?", [nombre, req.params.id]);
    const [rows] = await pool.query("SELECT id, nombre FROM areas WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Área no encontrada" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar área", detail: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [check] = await pool.query("SELECT 1 FROM empleados WHERE area_id = ? LIMIT 1", [req.params.id]);
    if (check.length > 0) return res.status(409).json({ error: "No se puede eliminar: área con empleados asociados" });
    const [del] = await pool.query("DELETE FROM areas WHERE id = ?", [req.params.id]);
    if (del.affectedRows === 0) return res.status(404).json({ error: "Área no encontrada" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar área", detail: err.message });
  }
});

module.exports = router;

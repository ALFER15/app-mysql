const express = require("express");
const router = express.Router();
const { pool } = require("../db");

router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.id AS EmpleadoID, e.nombre AS Nombre, e.email AS Email,
             e.area_id AS AreaID, a.nombre AS Area,
             e.fecha_ingreso AS FechaIngreso, e.salario AS Salario
      FROM empleados e
      INNER JOIN areas a ON a.id = e.area_id
      ORDER BY e.id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al listar empleados", detail: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.id AS EmpleadoID, e.nombre AS Nombre, e.email AS Email,
             e.area_id AS AreaID, a.nombre AS Area,
             e.fecha_ingreso AS FechaIngreso, e.salario AS Salario
      FROM empleados e
      INNER JOIN areas a ON a.id = e.area_id
      WHERE e.id = ?`, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Empleado no encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener empleado", detail: err.message });
  }
});

router.post("/", async (req, res) => {
  const { nombre, email, areaId, fechaIngreso, salario } = req.body;
  if (!nombre || !email || !areaId || salario == null) {
    return res.status(400).json({ error: "nombre, email, areaId y salario son requeridos" });
  }
  try {
    const [ins] = await pool.query(`
      INSERT INTO empleados (nombre, email, area_id, fecha_ingreso, salario)
      VALUES (?, ?, ?, IFNULL(?, CURRENT_DATE), ?)
    `, [nombre, email, areaId, fechaIngreso || null, salario]);
    res.status(201).json({
      EmpleadoID: ins.insertId, Nombre: nombre, Email: email,
      AreaID: areaId, FechaIngreso: fechaIngreso || new Date().toISOString().slice(0,10),
      Salario: Number(salario)
    });
  } catch (err) {
    res.status(500).json({ error: "Error al crear empleado", detail: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { nombre, email, areaId, fechaIngreso, salario } = req.body;
  if (!nombre || !email || !areaId || salario == null) {
    return res.status(400).json({ error: "nombre, email, areaId y salario son requeridos" });
  }
  try {
    await pool.query(`
      UPDATE empleados
      SET nombre = ?, email = ?, area_id = ?, fecha_ingreso = IFNULL(?, fecha_ingreso), salario = ?
      WHERE id = ?
    `, [nombre, email, areaId, fechaIngreso || null, salario, req.params.id]);

    const [rows] = await pool.query(`
      SELECT id AS EmpleadoID, nombre AS Nombre, email AS Email, area_id AS AreaID,
             fecha_ingreso AS FechaIngreso, salario AS Salario
      FROM empleados WHERE id = ?`, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Empleado no encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar empleado", detail: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [del] = await pool.query("DELETE FROM empleados WHERE id = ?", [req.params.id]);
    if (del.affectedRows === 0) return res.status(404).json({ error: "Empleado no encontrado" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar empleado", detail: err.message });
  }
});

module.exports = router;

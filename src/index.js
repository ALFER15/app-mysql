require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { pool } = require("./db");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/auth"));
const auth = require("./middleware/auth");
app.use("/api/areas", auth, require("./routes/areas"));
app.use("/api/empleados", auth, require("./routes/empleados"));

app.get("/", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, service: "API Empleados & Áreas (MySQL)", db: "connected" });
  } catch (e) {
    res.status(500).json({ ok: false, db: "down", error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`API escuchando en http://localhost:${PORT}`)
);

const jwt = require("jsonwebtoken");
module.exports = function auth(req, res, next) {
  try {
    const header = req.headers["authorization"] || "";
    const [type, token] = header.split(" ");
    if (type !== "Bearer" || !token)
      return res.status(401).json({ error: "Token no provisto" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, email: payload.email, nombre: payload.nombre };
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

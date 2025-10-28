import { useState } from "react";

// Por defecto apunta a localhost. Cambia si tu API está en otro host.
// No se modifica la lógica de fetch/jwt: sigue usando '/api/...'
const API_BASE = "";
export default function App() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("Admin123!");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [areas, setAreas] = useState([]);
  const [nuevaArea, setNuevaArea] = useState("");

  const login = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        alert("Login OK");
      } else {
        alert(data.error || JSON.stringify(data));
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  const listarAreas = async () => {
    const tokenLocal = localStorage.getItem("token");
    if (!tokenLocal) { alert("Inicia sesión primero"); return; }
    try {
      const res = await fetch(`${API_BASE}/api/areas`, {
        headers: { Authorization: "Bearer " + tokenLocal },
      });
      const data = await res.json();
      if (res.ok) setAreas(data);
      else alert(data.error || JSON.stringify(data));
    } catch (e) { alert(e.message); }
  };

  const crearArea = async () => {
    const tokenLocal = localStorage.getItem("token");
    if (!tokenLocal) { alert("Inicia sesión primero"); return; }
    if (!nuevaArea.trim()) { alert("Nombre requerido"); return; }
    try {
      const res = await fetch(`${API_BASE}/api/areas`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + tokenLocal },
        body: JSON.stringify({ nombre: nuevaArea })
      });
      const data = await res.json();
      if (res.ok) { alert("Área creada"); setNuevaArea(""); listarAreas(); }
      else alert(data.error || JSON.stringify(data));
    } catch (e) { alert(e.message); }
  };

  return (
    <div style={{ fontFamily: "system-ui, Arial", padding: 24, maxWidth: 900, margin: "auto" }}>
      <h1>Frontend - API Empleados</h1>

      {!token ? (
        <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
          <h3>Login</h3>
          <input style={{width:"100%", padding:8, marginBottom:8}} value={email} onChange={e=>setEmail(e.target.value)} />
          <input style={{width:"100%", padding:8, marginBottom:8}} type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button onClick={login}>Iniciar sesión</button>
        </div>
      ) : (
        <>
          <div style={{marginBottom:16}}>
            <strong>Sesión iniciada</strong>
            <div style={{marginTop:8}}>
              <button onClick={logout}>Cerrar sesión</button>
            </div>
          </div>

          <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
            <h3>Áreas</h3>
            <button onClick={listarAreas}>Listar áreas</button>
            <ul>
              {areas.map(a => <li key={a.id}>{a.id}  {a.nombre}</li>)}
            </ul>

            <h4>Crear área</h4>
            <input style={{width:"100%", padding:8, marginBottom:8}} value={nuevaArea} onChange={e=>setNuevaArea(e.target.value)} />
            <button onClick={crearArea}>Crear</button>
          </div>
        </>
      )}
    </div>
  );
}

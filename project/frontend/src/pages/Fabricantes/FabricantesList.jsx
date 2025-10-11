import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function FabricantesList() {
  const [fabricantes, setFabricantes] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/fabricantes");
      setFabricantes(data);
    } catch (error) {
      console.error("Error loading fabricantes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    load(); 
  }, []);

  const remove = async (id) => {
    if (!confirm("¿Eliminar fabricante?")) return;
    try {
      await api.delete(`/fabricantes/${id}`);
      load();
    } catch (error) {
      console.error("Error deleting fabricante:", error);
      alert("Error al eliminar el fabricante");
    }
  };

  if (loading) {
    return <div className="container mt-4"><div className="text-center">Cargando...</div></div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Fabricantes</h2>
        <Link to="/fabricantes/nuevo" className="btn btn-primary">➕ Nuevo</Link>
      </div>
      
      {fabricantes.length === 0 ? (
        <div className="alert alert-info">No hay fabricantes disponibles</div>
      ) : (
        <ul className="list-group">
          {fabricantes.map(f => (
            <li key={f.fabricante_id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>
                <strong>{f.fabricante}</strong>
                <small className="text-muted ms-2">(ID: {f.fabricante_id})</small>
              </span>
              <div>
                <Link 
                  to={`/fabricantes/edit/${f.fabricante_id}`} 
                  className="btn btn-sm btn-warning me-2"
                >
                  Editar
                </Link>
                <button 
                  onClick={() => remove(f.fabricante_id)} 
                  className="btn btn-sm btn-danger"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function ModelosList() {
  const [modelos, setModelos] = useState([]);
  const [fabricantes, setFabricantes] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const [modelosRes, fabricantesRes] = await Promise.all([
        api.get("/modelos"),
        api.get("/fabricantes")
      ]);
      setModelos(modelosRes.data);
      setFabricantes(fabricantesRes.data);
    } catch (error) {
      console.error("Error loading modelos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    load(); 
  }, []);

  const remove = async (id) => {
    if (!confirm("¿Eliminar modelo?")) return;
    try {
      await api.delete(`/modelos/${id}`);
      load();
    } catch (error) {
      console.error("Error deleting modelo:", error);
      alert("Error al eliminar el modelo");
    }
  };

  const getFabricanteName = (fabricanteId) => {
    const fabricante = fabricantes.find(f => f.fabricante_id === fabricanteId);
    return fabricante ? fabricante.fabricante : "N/A";
  };

  if (loading) {
    return <div className="container mt-4"><div className="text-center">Cargando...</div></div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Modelos</h2>
        <Link to="/modelos/nuevo" className="btn btn-primary">➕ Nuevo</Link>
      </div>
      
      {modelos.length === 0 ? (
        <div className="alert alert-info">No hay modelos disponibles</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Modelo</th>
                <th>Fabricante</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {modelos.map(m => (
                <tr key={m.modelo_id}>
                  <td>
                    <span className="badge bg-secondary">#{m.modelo_id}</span>
                  </td>
                  <td>
                    <strong>{m.modelo}</strong>
                  </td>
                  <td>
                    <span className="badge bg-primary">
                      {getFabricanteName(m.fabricante_id)}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <Link 
                        to={`/modelos/edit/${m.modelo_id}`} 
                        className="btn btn-outline-warning"
                        title="Editar"
                      >
                        ✏️ Editar
                      </Link>
                      <button 
                        onClick={() => remove(m.modelo_id)} 
                        className="btn btn-outline-danger"
                        title="Eliminar"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
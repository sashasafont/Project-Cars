import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

export default function FabricanteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [fabricante, setFabricante] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadFabricante = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/fabricantes/${id}`);
      setFabricante(data.fabricante);
    } catch (error) {
      console.error("Error loading fabricante:", error);
      alert("Error al cargar el fabricante");
      navigate("/fabricantes");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (isEdit) {
      loadFabricante();
    }
  }, [id, isEdit, loadFabricante]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fabricante.trim()) {
      alert("El nombre del fabricante es obligatorio");
      return;
    }

    try {
      setSubmitting(true);
      
      if (isEdit) {
        await api.put(`/fabricantes/${id}`, { fabricante: fabricante.trim() });
      } else {
        await api.post("/fabricantes", { fabricante: fabricante.trim() });
      }
      
      navigate("/fabricantes");
    } catch (error) {
      console.error("Error saving fabricante:", error);
      alert("Error al guardar el fabricante");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container mt-4"><div className="text-center">Cargando...</div></div>;
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">
                {isEdit ? "Editar Fabricante" : "Nuevo Fabricante"}
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="fabricante" className="form-label">
                    Nombre del Fabricante *
                  </label>
                  <input
                    type="text"
                    id="fabricante"
                    className="form-control"
                    value={fabricante}
                    onChange={(e) => setFabricante(e.target.value)}
                    placeholder="Ej: Toyota, BMW, Mercedes..."
                    required
                    disabled={submitting}
                  />
                </div>
                
                <div className="d-flex gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? "Guardando..." : (isEdit ? "Actualizar" : "Crear")}
                  </button>
                  <Link 
                    to="/fabricantes" 
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
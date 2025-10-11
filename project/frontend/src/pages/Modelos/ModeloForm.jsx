import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

export default function ModeloForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [modelo, setModelo] = useState("");
  const [fabricanteId, setFabricanteId] = useState("");
  const [fabricantes, setFabricantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadFabricantes = async () => {
    try {
      const { data } = await api.get("/fabricantes");
      setFabricantes(data);
    } catch (error) {
      console.error("Error loading fabricantes:", error);
    }
  };

  const loadModelo = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/modelos/${id}`);
      setModelo(data.modelo);
      setFabricanteId(data.fabricante_id);
    } catch (error) {
      console.error("Error loading modelo:", error);
      alert("Error al cargar el modelo");
      navigate("/modelos");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadFabricantes();
    if (isEdit) {
      loadModelo();
    }
  }, [id, isEdit, loadModelo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!modelo.trim()) {
      alert("El nombre del modelo es obligatorio");
      return;
    }

    if (!fabricanteId) {
      alert("Debe seleccionar un fabricante");
      return;
    }

    try {
      setSubmitting(true);
      
      const modeloData = {
        modelo: modelo.trim(),
        fabricante_id: parseInt(fabricanteId)
      };

      if (isEdit) {
        await api.put(`/modelos/${id}`, modeloData);
      } else {
        await api.post("/modelos", modeloData);
      }
      
      navigate("/modelos");
    } catch (error) {
      console.error("Error saving modelo:", error);
      alert("Error al guardar el modelo");
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
                {isEdit ? "Editar Modelo" : "Nuevo Modelo"}
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="fabricante" className="form-label">
                    Fabricante *
                  </label>
                  <select
                    id="fabricante"
                    className="form-select"
                    value={fabricanteId}
                    onChange={(e) => setFabricanteId(e.target.value)}
                    required
                    disabled={submitting}
                  >
                    <option value="">Seleccionar fabricante...</option>
                    {fabricantes.map(f => (
                      <option key={f.fabricante_id} value={f.fabricante_id}>
                        {f.fabricante}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="modelo" className="form-label">
                    Nombre del Modelo *
                  </label>
                  <input
                    type="text"
                    id="modelo"
                    className="form-control"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    placeholder="Ej: Corolla, Golf, Serie 3..."
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
                    to="/modelos" 
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
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function CochesList() {
  const [coches, setCoches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCoches = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/vehiculos", { 
          params: { page: 1, page_size: 20 } 
        });
        setCoches(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los coches");
        setCoches([]);
      } finally {
        setLoading(false);
      }
    };

    loadCoches();
  }, []);

  if (loading) return <div className="text-center">Cargando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2>Listado de Coches</h2>
      {coches.length === 0 ? (
        <div className="alert alert-info">No hay coches disponibles</div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fabricante</th>
              <th>Modelo</th>
              <th>Precio</th>
              <th>Provincia</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {coches.map((coche) => (
              <tr key={coche.id}>
                <td>{coche.id}</td>
                <td>{coche.fabricante || 'N/A'}</td>
                <td>{coche.modelo || 'N/A'}</td>
                <td>{coche.precio ? `${coche.precio} €` : 'N/A'}</td>
                <td>{coche.provincia || 'N/A'}</td>
                <td>
                  <Link to={`/coches/${coche.id}`} className="btn btn-primary btn-sm">
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
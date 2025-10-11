import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function CochesDetails() {
  const { id } = useParams();
  const [coche, setCoche] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCoche = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/vehiculos/${id}`);
        setCoche(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar el coche");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCoche();
    }
  }, [id]);

  if (loading) return <div className="text-center">Cargando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!coche) return <div className="alert alert-warning">Coche no encontrado</div>;

  return (
    <div>
      <h2>Detalles del Coche</h2>
      <ul className="list-group">
        <li className="list-group-item"><b>ID:</b> {coche.id}</li>
        <li className="list-group-item"><b>Fabricante:</b> {coche.fabricante || 'N/A'}</li>
        <li className="list-group-item"><b>Modelo:</b> {coche.modelo || 'N/A'}</li>
        <li className="list-group-item"><b>Versión:</b> {coche.version || 'N/A'}</li>
        <li className="list-group-item"><b>Precio:</b> {coche.precio ? `${coche.precio} €` : 'N/A'}</li>
        <li className="list-group-item"><b>Precio Financiado:</b> {coche.precio_financiado ? `${coche.precio_financiado} €` : 'N/A'}</li>
        <li className="list-group-item"><b>Provincia:</b> {coche.provincia || 'N/A'}</li>
        <li className="list-group-item"><b>Fuel:</b> {coche.fuel || 'N/A'}</li>
        <li className="list-group-item"><b>Puertas:</b> {coche.puertas_numero || 'N/A'}</li>
        <li className="list-group-item"><b>Tipo:</b> {coche.tipo_nombre || 'N/A'}</li>
        <li className="list-group-item"><b>Cliente:</b> {coche.cliente || 'N/A'}</li>
        <li className="list-group-item"><b>Fecha:</b> {coche.fecha ? new Date(coche.fecha).toLocaleDateString() : 'N/A'}</li>
      </ul>
      <Link to="/coches" className="btn btn-secondary mt-3">Volver</Link>
    </div>
  );
}
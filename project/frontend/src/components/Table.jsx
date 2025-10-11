import { Link } from "react-router-dom";

export default function Table({ data, loading, onDelete }) {
  if (loading) {
    return (
      <div className="d-flex justify-content-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="alert alert-info text-center">
        <h5>No hay vehículos disponibles</h5>
        <p className="mb-0">Prueba a cambiar los filtros o agregar nuevos vehículos.</p>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Fabricante</th>
            <th>Modelo</th>
            <th>Versión</th>
            <th>Combustible</th>
            <th>Precio</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((vehiculo) => (
            <tr key={vehiculo.id}>
              <td>
                <Link 
                  to={`/coches/${vehiculo.id}`} 
                  className="fw-bold text-decoration-none"
                >
                  #{vehiculo.id}
                </Link>
              </td>
              <td>{vehiculo.cliente}</td>
              <td>
                <span className="badge bg-primary">
                  {vehiculo.fabricante}
                </span>
              </td>
              <td>{vehiculo.modelo}</td>
              <td>
                <small className="text-muted">{vehiculo.version}</small>
              </td>
              <td>
                <span className={`badge ${
                  vehiculo.fuel === 'Gasolina' ? 'bg-warning' :
                  vehiculo.fuel === 'Diesel' ? 'bg-dark' :
                  vehiculo.fuel === 'Eléctrico' ? 'bg-success' :
                  'bg-secondary'
                }`}>
                  {vehiculo.fuel}
                </span>
              </td>
              <td className="fw-bold text-success">
                {formatPrice(vehiculo.precio)}
              </td>
              <td>
                <small>{formatDate(vehiculo.fecha)}</small>
              </td>
              <td>
                <div className="btn-group btn-group-sm">
                  <Link 
                    to={`/coches/edit/${vehiculo.id}`}
                    className="btn btn-outline-warning"
                    title="Editar"
                  >
                    ✏️
                  </Link>
                  <button 
                    onClick={() => onDelete && onDelete(vehiculo.id)}
                    className="btn btn-outline-danger"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">🚗 Coches Admin</NavLink>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink className="nav-link" to="/coches">Vehículos</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/coches/stats">Estadísticas</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/fabricantes">Fabricantes</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/modelos">Modelos</NavLink></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
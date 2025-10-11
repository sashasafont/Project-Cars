import { useMemo } from "react";

export default function Chart({ data, type = "bar", title }) {
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Preparar datos para el gráfico
    return data.map(item => ({
      label: item.label || item.name || item.fabricante || item.modelo,
      value: item.value || item.count || item.total || 0,
      color: generateColor(item.label || item.name)
    }));
  }, [data]);

  const generateColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  const maxValue = useMemo(() => {
    return Math.max(...processedData.map(d => d.value), 0);
  }, [processedData]);

  if (!processedData || processedData.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <h5 className="card-title">{title}</h5>
          <p className="text-muted">No hay datos disponibles para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">{title}</h5>
      </div>
      <div className="card-body">
        {type === "bar" && (
          <div className="chart-container">
            {processedData.map((item, index) => (
              <div key={index} className="chart-bar-item mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-medium">{item.label}</span>
                  <span className="badge bg-primary">{item.value}</span>
                </div>
                <div className="progress" style={{ height: "20px" }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${(item.value / maxValue) * 100}%`,
                      backgroundColor: item.color
                    }}
                    role="progressbar"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {type === "pie" && (
          <div className="row">
            <div className="col-md-8">
              <div className="chart-pie-container d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                <div className="text-center">
                  <div className="fs-4 fw-bold">📊</div>
                  <p className="text-muted">Gráfico circular</p>
                  <small className="text-muted">Implementación visual pendiente</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="chart-legend">
                <h6>Leyenda</h6>
                {processedData.map((item, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <div
                      className="chart-legend-color me-2"
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundColor: item.color,
                        borderRadius: "2px"
                      }}
                    />
                    <span className="flex-grow-1">{item.label}</span>
                    <span className="badge bg-secondary">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {type === "stats" && (
          <div className="row g-3">
            {processedData.map((item, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="card bg-light">
                  <div className="card-body text-center">
                    <div className="display-6 fw-bold text-primary">{item.value}</div>
                    <div className="text-muted">{item.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

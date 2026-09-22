export default function MetricCard({
  icon,
  label,
  value,
  range,
  status = "OK",
  statusClass = "ok",
}) {
  return (
    <div className="card metric-card">
      <div className="metric-icon">{icon}</div>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-range">{range}</div>
      <span className={`metric-badge ${statusClass}`}>{status}</span>
    </div>
  );
}
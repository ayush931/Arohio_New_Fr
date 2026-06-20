export default function Card({ title, children, className = "" }) {
  return (
    <div className={`card shadow-sm mb-3 ${className}`}>
      {title && <div className="card-header fw-semibold">{title}</div>}
      <div className="card-body">{children}</div>
    </div>
  );
}

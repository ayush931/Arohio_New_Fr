import { Link } from "react-router-dom";

export default function PrimaryButton({
  children,
  to,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) {
  const baseClass =
    "btn btn-teal-slim px-4 py-2 fw-semibold";

  if (to) {
    return (
      <Link
        to={to}
        className={`${baseClass} ${className}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${className}`}
    >
      {children}
    </button>
  );
}
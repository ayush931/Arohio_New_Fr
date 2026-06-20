import { useState } from "react";

function Eye({ open = false, size = 18 }) {
  return open ? (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2.5A2.5 2.5 0 1 0 12 9a2.5 2.5 0 0 0 0 5z"/>
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M2 4.27 3.28 3 21 20.72 19.73 22l-3.2-3.2A12.2 12.2 0 0 1 12 19C7 19 2.73 15.89 1 12a12.84 12.84 0 0 1 5.06-5.86L2 4.27zM12 7a5 5 0 0 1 5 5c0 .64-.13 1.25-.37 1.8L9.2 6.37C9.75 6.13 10.36 6 11 6zm9 5c-.38.86-.9 1.68-1.52 2.42l-1.43-1.43c.29-.31.55-.64.77-1-.86-1.53-2.5-3.23-4.82-4.08l-1.7-1.7C17 5.62 20.14 8.11 21 12z"/>
    </svg>
  );
}

function LockIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M6 10V8a6 6 0 1 1 12 0v2h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1zm2 0h8V8a4 4 0 1 0-8 0v2z"/>
    </svg>
  );
}

export default function ResetPassword() {
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: handle reset
  };

  return (
    <div className="container auth-shell py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-7">
          <div className="reset-wrap mx-auto">
            <h1 className="fw-bold text-center" style={{fontFamily:'"Times New Roman", Times, serif'}}>
              Reset your password
            </h1>
            <p className="text-muted text-center mb-4">
              Enter and confirm your new password below.
            </p>

            <form className="text-start" onSubmit={onSubmit} noValidate>
              {/* New password */}
              <div className="mb-3 position-relative input-with-toggle">
                <label className="form-label" htmlFor="newPass">New Password</label>
                <input
                  id="newPass"
                  type={show1 ? "text" : "password"}
                  className="form-control form-control-lg auth-input pe-5"
                  placeholder="Enter your new password"
                  required
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  aria-label={show1 ? "Hide password" : "Show password"}
                  onClick={() => setShow1(s => !s)}
                >
                  <Eye open={show1} />
                </button>
              </div>

              {/* Confirm password */}
              <div className="mb-3 position-relative input-with-toggle">
                <label className="form-label" htmlFor="confirmPass">Confirm Password</label>
                <input
                  id="confirmPass"
                  type={show2 ? "text" : "password"}
                  className="form-control form-control-lg auth-input pe-5"
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  aria-label={show2 ? "Hide password" : "Show password"}
                  onClick={() => setShow2(s => !s)}
                >
                  <Eye open={show2} />
                </button>
              </div>

              <button type="submit" className="btn btn-teal-slim btn-lg w-100">
                Change Password
              </button>
            </form>

            {/* thin divider with centered lock */}
            <div className="divider-lock">
              <span className="lock-icon">
                <LockIcon />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

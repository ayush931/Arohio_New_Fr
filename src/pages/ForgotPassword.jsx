import { NavLink } from "react-router-dom";

function Icon({ name, size = 18 }) {
    const c = "currentColor";
    switch (name) {
        case "user":
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
                    <path fill={c} d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-5.33 0-8 2.67-8 6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1c0-3.33-2.67-6-8-6z" />
                </svg>
            );
        case "mail-send":
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
                    <path fill={c} d="M2 4l20 8-20 8 4-8-4-8zm6.7 8l-2.1 4.2L18 12 6.6 7.8 8.7 12z" />
                </svg>
            );
        case "lock":
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
                    <path fill={c} d="M6 10V8a6 6 0 1 1 12 0v2h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1zm2 0h8V8a4 4 0 1 0-8 0v2z" />
                </svg>
            );
       case "google":
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#EA4335" d="M12 10.2v3.7h5.2c-.2 1.2-1.6 3.6-5.2 3.6-3.1 0-5.7-2.6-5.7-5.8s2.6-5.8 5.7-5.8c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.8 3.2 14.7 2.4 12 2.4 6.9 2.4 2.8 6.5 2.8 11.6S6.9 20.8 12 20.8c5.8 0 9.6-4.1 9.6-9.9 0-.7-.1-1.1-.2-1.6H12z" />
                    <path fill="#34A853" d="M3.1 7.9l3 2.2c.8-2.3 3-3.9 5.9-3.9 1.8 0 3 .8 3.7 1.5l2.5-2.4C16.8 3.2 14.7 2.4 12 2.4 8.3 2.4 5.2 4.6 3.1 7.9z" opacity=".6" />
                </svg>
            );
        case "linkedin":
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#0A66C2" d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.29 8.98h4.98V24H.29zM8 8.98h4.8v2.05h.07C13.54 9.77 15.17 8.44 17.6 8.44c5.05 0 5.98 3.32 5.98 7.64V24h-5v-6.7c0-1.6-.03-3.66-2.23-3.66-2.23 0-2.57 1.74-2.57 3.54V24H8z" />
                </svg>
            );
        case "github":
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.2c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.33-1.77-1.33-1.77-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48.99.11-.78.42-1.3.76-1.6-2.67-.31-5.48-1.33-5.48-5.93 0-1.31.47-2.38 1.23-3.21-.12-.31-.53-1.57.12-3.27 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.7.24 2.96.12 3.27.77.83 1.23 1.9 1.23 3.21 0 4.61-2.81 5.62-5.49 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5z" />
                </svg>
            );
        case "check-circle":
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm-1 14.3-4.3-4.3 1.4-1.4L11 13.5l5.9-5.9 1.4 1.4L11 16.3z" />
                </svg>
            );

        case "youtube":
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#FF0000" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.4.6A3 3 0 0 0 .5 6.2C0 8 0 12 0 12s0 4 .5 5.8a3 3 0 0 0 2.1 2.1c1.8.6 9.4.6 9.4.6s7.6 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 16 24 12 24 12s0-4-.5-5.8z" />
                    <path fill="#fff" d="M9.8 15.5v-7l6.4 3.5-6.4 3.5z" />
                </svg>
            );
        default:
            return null;
    }
}

export default function ForgotPassword() {
    const onSubmit = (e) => {
        e.preventDefault();
        // TODO: call your API
    };

    return (
        <div className="container auth-shell py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-xl-10">
                    <div className="row g-0 rounded-4 overflow-hidden shadow-sm">
                        {/* LEFT: form (centered) */}
                        <div className="col-12 col-lg-6 bg-white p-4 p-md-5 d-flex align-items-center">
                            <div className="w-100" style={{ maxWidth: 480, marginInline: "auto" }}>
                                {/* tiny brand mark */}
                                <div className="brand-dot mx-auto mb-3"></div>

                                <h1 className="fw-bold text-center" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                                    Forgot your password?
                                </h1>
                                <p className="text-muted text-center mb-4">
                                    No problem. Enter your email below and we&apos;ll send you a link to reset it.
                                </p>

                                <form className="text-start" onSubmit={onSubmit} noValidate>
                                    <label className="visually-hidden" htmlFor="fp-email">Email Address</label>
                                    <input
                                        id="fp-email"
                                        type="email"
                                        className="form-control form-control-lg auth-input mb-3"
                                        placeholder="you@example.com"
                                        required
                                    />

                                    <button type="submit" className="btn btn-teal-slim btn-lg w-100 mb-3">
                                        Send Reset Link
                                    </button>

                                    {/* divider */}
                                    <div className="d-flex align-items-center my-3">
                                        <div className="flex-grow-1 border-top"></div>
                                        <span className="px-3 text-muted small">Or continue with</span>
                                        <div className="flex-grow-1 border-top"></div>
                                    </div>

                                     {/* Social */}
                                <div className="row g-3">
                                    <div className="col-12 col-md-6">
                                        <button type="button" className="btn btn-outline-light w-100 social-btn">
                                            <Icon name="google" /> <span>Google</span>
                                        </button>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <button type="button" className="btn btn-outline-light w-100 social-btn">
                                            <Icon name="linkedin" /> <span>LinkedIn</span>
                                        </button>
                                    </div>
                                    <div className="col-12">
                                        <button type="button" className="btn btn-outline-light w-100 social-btn">
                                            <Icon name="github" /> <span>GitHub</span>
                                        </button>
                                    </div>
                                </div>

                                    <p className="text-center mt-3 small">
                                        Remember your password?{" "}
                                        <NavLink to="/login" className="link-teal text-decoration-none">Log in</NavLink>
                                    </p>
                                </form>
                            </div>
                        </div>

                        {/* RIGHT: flow content (hidden on mobile) */}
                        <div className="col-lg-6 d-none d-lg-block position-relative forgot-aside">
                            {/* decorative bubbles */}
                            <span className="bubble bubble-tl"></span>
                            <span className="bubble bubble-br"></span>

                            <div className="p-4 p-xl-5 h-100">
                                <div className="flow-panel bg-white-ghost">
                                    {/* connector line */}
                                    <div className="flow-connector" aria-hidden="true"></div>

                                    {/* card 1 */}
                                    <div className="flow-card shadow-sm">
                                        <div className="flow-icon">
                                            <Icon name="user" size={18} />
                                        </div>
                                        <div>
                                            <div className="flow-title">Your Account</div>
                                            <div className="flow-sub">Forgot Password Request</div>
                                        </div>
                                    </div>

                                    {/* card 2 */}
                                    <div className="flow-card shadow-sm">
                                        <div className="flow-icon">
                                            <Icon name="mail-send" size={18} />
                                        </div>
                                        <div>
                                            <div className="flow-title">Email Dispatch</div>
                                            <div className="flow-sub">Sending reset instructions</div>
                                        </div>
                                    </div>

                                    {/* card 3 */}
                                    <div className="flow-card shadow-sm">
                                        <div className="flow-icon">
                                            <Icon name="lock" size={18} />
                                        </div>
                                        <div>
                                            <div className="flow-title">Reset Link</div>
                                            <div className="flow-sub">Click to set a new password</div>
                                        </div>
                                    </div>

                                    {/* card 4 (new) */}
                                    <div className="flow-card shadow-sm">
                                        <div className="flow-icon flow-icon-success">
                                            <Icon name="check-circle" size={18} />
                                        </div>
                                        <div>
                                            <div className="flow-title">Password Updated</div>
                                            <div className="flow-sub">You can now log in with the new password</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>{/* /RIGHT */}

                    </div>
                </div>
            </div>
        </div>
    );
}

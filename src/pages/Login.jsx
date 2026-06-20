// src/pages/Login.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import AuthAside from "../components/auth/AuthAside";
import AuthForm from "../components/auth/AuthForm";

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ email: "", password: "", remember: false });
    const BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!form.email.trim() || !form.password) {
            toast.error("Please enter your email and password");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}/users/login`, {
                email: form.email.trim(),
                password: form.password,
            });

            const token = res?.data?.token || res?.data?.access_token || "";
            const user = res?.data?.user || {};
            if (!token) throw new Error("Missing token in response");
            const storage = form.remember ? localStorage : sessionStorage;
            storage.setItem("auth_token", token);
            storage.setItem(
                "auth_user",
                JSON.stringify({
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role_id: user.role_id,
                })
            );

            const first = user?.first_name || "there";
            toast.success(`Welcome back to AROHIO, ${first}. You're now logged in.`, {
                duration: 3000,
                style: {
                    padding: "14px 16px",
                    fontSize: "14px",
                    borderRadius: "10px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                },
            });

            setTimeout(() => navigate("/dashboard"), 3000);
        } catch (err) {
            const msg =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                err?.message ||
                "Login failed";
            toast.error(`Login failed: ${msg}`, {
                duration: 3000,
                style: {
                    padding: "14px 16px",
                    fontSize: "14px",
                    borderRadius: "10px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                },
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="w-100 min-vh-100 auth-shell">
            <Toaster
                position="top-right"
                gutter={10}
                containerStyle={{ top: 12, right: 12 }}
                toastOptions={{
                    duration: 3000,
                    style: {
                        padding: "14px 16px",
                        fontSize: "14px",
                        lineHeight: 1.35,
                        borderRadius: "10px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    },
                    success: { duration: 3000, iconTheme: { primary: "#0fb9b1", secondary: "#fff" } },
                    error: { duration: 3000, iconTheme: { primary: "#ff4757", secondary: "#fff" } },
                }}
            />
            <div className="row g-0 min-vh-100">
                <div className="col-12">
                    <div className="row g-0 shadow-lg overflow-hidden auth-wrap w-100 min-vh-100">
                        <AuthAside />
                        <AuthForm
                            title="Welcome to Arohio"
                            subtitle="Log in to continue to your account."
                            form={form}
                            onChange={onChange}
                            onSubmit={onSubmit}
                            loading={loading}
                            footerText="Don’t have an account?"
                            footerLink="/signup"
                            footerLinkText="Sign up"
                            type="login"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

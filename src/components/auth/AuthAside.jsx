"use client";

import { useEffect, useState } from "react";
import {
    Upload,
    Image,
    Wand2,
    CheckCircle,
    Download
} from "lucide-react";

const steps = [
    {
        icon: Upload,
        title: "Upload PDF",
        desc: "Upload your PDF securely in seconds with a simple drag and drop."
    },
    {
        icon: Image,
        title: "Extract Images",
        desc: "Automatically detect and extract all visuals from your document."
    },
    {
        icon: Wand2,
        title: "Generate Alt Text",
        desc: "AI generates accurate, context-aware descriptions for each image."
    },
    {
        icon: CheckCircle,
        title: "Verify Content",
        desc: "Review and refine results to ensure accuracy and clarity."
    },
    {
        icon: Download,
        title: "Export",
        desc: "Download your optimized document ready for accessibility use."
    }
];

export default function AuthAside() {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActive((prev) => (prev + 1) % steps.length);
        }, 1600);
        return () => clearInterval(timer);
    }, []);

    return (
        <div
            className="col-lg-6 d-none p-4 p-md-12 d-lg-flex align-items-center justify-content-center position-relative"
            style={{
                background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)"
            }}
        >
            <div className="w-100 p-24" style={{ maxWidth: 560 }}>

                <div className="mb-5">
                    <h2
                        className="fw-bold text-white mb-2"
                        style={{ fontSize: "34px", letterSpacing: "-0.4px" }}
                    >
                        How Arohio Works
                    </h2>
                    <p
                        className="text-light opacity-75 mb-0"
                        style={{ fontSize: "15.5px" }}
                    >
                        AI-powered accessibility in a seamless workflow
                    </p>
                </div>

                <div className="position-relative">

                    <div
                        style={{
                            position: "absolute",
                            left: 26,
                            top: 8,
                            bottom: 8,
                            width: 2,
                            background:
                                "linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)"
                        }}
                    />

                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index <= active;

                        return (
                            <div
                                key={index}
                                className="d-flex align-items-start mb-5"
                                style={{
                                    opacity: isActive ? 1 : 0.3,
                                    transform: isActive ? "translateY(0)" : "translateY(12px)",
                                    transition: "all 0.5s ease"
                                }}
                            >

                                <div
                                    className="me-4 d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{
                                        width: 52,
                                        height: 52,
                                        borderRadius: "50%",
                                        background: isActive
                                            ? "linear-gradient(135deg,#2EC4B6,#0fb9b1)"
                                            : "rgba(255,255,255,0.08)",
                                        boxShadow: isActive
                                            ? "0 10px 28px rgba(0,0,0,0.45)"
                                            : "none",
                                        transition: "all 0.4s ease"
                                    }}
                                >
                                    <Icon size={22} color="#fff" />
                                </div>

                                <div style={{ maxWidth: "420px" }}>
                                    <div
                                        style={{
                                            color: "#fff",
                                            fontWeight: 600,
                                            fontSize: "18px",
                                            letterSpacing: "0.2px",
                                            marginBottom: 4
                                        }}
                                    >
                                        {step.title}
                                    </div>

                                    <div
                                        style={{
                                            color: "rgba(255,255,255,0.72)",
                                            fontSize: "14.5px",
                                            lineHeight: "1.6"
                                        }}
                                    >
                                        {step.desc}
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>

            </div>

            <div
                style={{
                    position: "absolute",
                    width: 340,
                    height: 340,
                    background: "#2EC4B6",
                    filter: "blur(150px)",
                    opacity: 0.18,
                    bottom: -90,
                    right: -90
                }}
            />
        </div>
    );
}
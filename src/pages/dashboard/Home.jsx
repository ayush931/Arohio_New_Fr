import { useEffect, useState } from "react";
import { FaCreditCard, FaFileExcel, FaFilePdf, FaFolderOpen } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Home() {

    const [user, setUser] = useState(null);
    const [plan, setPlan] = useState(null);
    const [recentUploads, setRecentUploads] = useState([]);
    useEffect(() => {
        if (!user?.id) return;

        fetch(`${import.meta.env.VITE_API_BASE}/user-plans/user/${user.id}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    const activePlan = data.find(p => p.is_active);
                    setPlan(activePlan || data[0]);
                }
            });
    }, [user]);
    useEffect(() => {
        try {
            const storedUser = sessionStorage.getItem("auth_user");

            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            }
        } catch (err) {
            console.error("User fetch error", err);
            setUser(null);
        }
    }, []);
    useEffect(() => {
        if (!user?.id) return;

        fetch(`${import.meta.env.VITE_API_BASE}/projects/user/${user.id}`)
            .then(res => res.json())
            .then(data => {
                setRecentUploads(data || []);
            })
            .catch(() => {
                setRecentUploads([]);
            });
    }, [user]);
    // mock data — swap with live data later
    const notifications = [
        { id: 1, text: "Your PDF extraction is complete.", time: "2 min ago" },
        { id: 2, text: "New SEO alt text feature released.", time: "1 day ago" },
        { id: 3, text: "Subscription renewal due in 5 days.", time: "3 days ago" },
    ];

    const uploads = [
        { name: "Annual_Report_2023.pdf", date: "2024-09-05", status: "Completed", alt: 124 },
        { name: "Marketing_Sheet.xlsx", date: "2024-09-03", status: "Processing", alt: null },
        { name: "Design_Mockups_v1.pdf", date: "2024-09-01", status: "Failed", alt: 0 },
        { name: "Product_Catalogue.pdf", date: "2024-08-28", status: "Completed", alt: 89 },
    ];

    const handleDelete = async (id) => {
        try {
            await fetch(`${import.meta.env.VITE_API_BASE}/project-files/${id}`, {
                method: "DELETE",
            });

            setRecentUploads(prev => prev.filter(f => f.id !== id));
        } catch (err) { }
    };
    const pdfUsed = plan?.pdf_used ?? 0;
    const pdfLimit = plan?.pdf_limit ?? 0;

    const imageUsed = plan?.image_used ?? 0;
    const imageLimit = plan?.image_limit ?? 0;

    const totalUsed = pdfUsed + imageUsed;
    const totalLimit = pdfLimit + imageLimit;

    const creditsLeft = totalLimit - totalUsed;
    const usedPercent =
        totalLimit > 0
            ? Math.min(100, Math.round((totalUsed / totalLimit) * 100))
            : 0;

    return (
        <div style={{ background: "#f5f7fb", minHeight: "100vh" }}>
            {/* Page-scoped styles */}
            <style>{`
        .card-soft      { background:#ffffff; border:1px solid #e8eef5; border-radius:4px; }
        .card-title     { font-weight:700; color:#0f172a; font-size:1.1rem; margin:0; }
        .subtle         { color:#6b7280; } /* muted gray */
        .pill           { border-radius:999px; padding:.25rem .6rem; font-size:.75rem; font-weight:600; }
        .pill-success   { background:#e7f9f4; color:#0b7a65; }
        .pill-warn      { background:#fff7e6; color:#9b6a09; }
        .pill-danger    { background:#ffecec; color:#b42318; }
        .btn-upload     { background:#21c7b8; color:#fff; border:none; padding:.6rem 1rem; border-radius:5px; font-weight:700; }
        .btn-upload:hover{ background:#21c7b8;filter:brightness(.95); color:#fff; }
        .btn-darkpill   { background:#0f172a; color:#fff; border:none; padding:.45rem .8rem; border-radius:5px; font-weight:700; }
        .btn-darkpill:hover { background:#0f172a; filter:brightness(.95); color:#fff; }
        .link-action    { text-decoration:none; font-weight:600; }
        .link-view      { color:#0f172a; }
        .link-delete    { color:#b42318; }
        .quick-tile     { border-radius:12px; border:1px dashed #e0e7ef; padding:14px; background:#fff; display:flex; align-items:center; gap:10px; text-align:left; transition:box-shadow .15s ease, transform .15s ease; }
        .quick-tile:hover { box-shadow:0 8px 24px rgba(15,23,42,.08); transform:translateY(-1px); }
        .quick-icon     { width:36px; height:36px; border-radius:5px; background:#21c7b820; display:grid; place-items:center; font-weight:700; color:#21c7b8; }
        .bar-wrap       { height:160px; display:flex; align-items:flex-end; gap:14px; }
        .bar            { width:38px; background:#21c7b8; border-radius:8px 8px 0 0; }
        .upgrade-band   { background:#21c7b8; color:#fff; border-radius:12px; padding:14px 18px; display:flex; align-items:center; justify-content:space-between; }
        .progress-teal  { background:#eafaf8; height:10px; border-radius:999px; overflow:hidden; }
        .progress-fill  { background:#21c7b8; height:100%; }
        .table td, .table th { vertical-align:middle; }
        .table thead th { background:#f3f6fb; font-weight:700; color:#0f172a; border-bottom:1px solid #e5edf5; }
        .kpi            { font-size:24px; font-weight:800; color:#0f172a; }
        .header-wrap    { gap:.25rem; }
      `}</style>

            {/* Header */}
            <div className="container py-4">
                <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
                    <div className="header-wrap d-flex flex-column">
                        <h1 className="h4 mb-0" style={{ color: "#0f172a", fontWeight: 800 }}>
                            Welcome back, <span style={{ color: "#21c7b8" }}>{user ? `${user.first_name} ${user.last_name}` : ""}</span>!
                        </h1>
                        <div className="subtle" style={{ fontSize: 14 }}>
                            Here’s your accessibility progress today.
                        </div>
                    </div>

                    {/* <div className="d-flex gap-2">
                        <Link to="/dashboard/uploads" className="btn btn-upload">+ Upload PDF</Link>
                    </div> */}
                </div>

                <div className="row g-4">
                    <div className="col-12 col-lg-8">
                        <div className="card-soft p-3 p-md-4 mb-4">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <div className="card-title">Credits Overview</div>
                                    <div className="subtle" style={{ fontSize: 14 }}>Remaining Credits</div>
                                </div>
                            </div>

                            <div className="d-flex align-items-baseline gap-2 mb-2">
                                <div className="kpi">{creditsLeft} Credits Left ---</div>
                                <div className="subtle">{totalUsed} / {totalLimit} used</div>
                            </div>

                            <div className="progress-teal">
                                <div className="progress-teal">
                                    <div className="progress-fill"
                                        style={{ width: `${usedPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Recent Uploads */}
                        <div className="card-soft p-3 p-md-4 mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="card-title">Recent Uploads</div>
                                <Link to="/projects" className="text-decoration-none" style={{ color: "#21c7b8", fontWeight: 700 }}>
                                    View All
                                </Link>
                            </div>

                            <div className="table-responsive">
                                <table className="table align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>Project Name</th>
                                            <th style={{ width: 140 }}>Date</th>
                                            <th style={{ width: 140 }}>Status</th>
                                            <th style={{ width: 180 }}>File Name</th>
                                            <th className="text-end" style={{ width: 160 }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentUploads.map((file) => (
                                            <tr key={file.id}>
                                                <td className="fw-semibold">
                                                    <div>{file.project_name}</div>
                                                    <div className="subtle small">{file.original_name}</div>
                                                </td>

                                                <td className="subtle">
                                                    {new Date(file.created_at).toLocaleDateString()}
                                                </td>

                                                <td>
                                                    <span className="pill pill-success">Completed</span>
                                                </td>

                                                <td className="subtle">{file.alt_count ?? "—"}</td>

                                                <td className="text-end">
                                                    <div className="d-inline-flex gap-3">
                                                        <a
                                                            href={file.storage_path}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="link-action link-view"
                                                        >
                                                            Download
                                                        </a>

                                                        <button
                                                            onClick={() => handleDelete(file.id)}
                                                            className="link-action link-delete bg-transparent border-0"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Accessibility Workflow */}
                        <div className="card-soft p-3 p-md-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <div className="card-title mb-1">Accessibility Workflow</div>
                                    <div className="subtle small">
                                        How Arohio helps create structured alt text from different sources
                                    </div>
                                </div>
                                <span
                                    className="small px-3 py-2"
                                    style={{
                                        background: "#eef7f6",
                                        color: "#0f766e",
                                        borderRadius: "999px",
                                        fontWeight: 600,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    Static Guide
                                </span>
                            </div>

                            <div
                                className="p-3 mb-3"
                                style={{
                                    background: "#f8fafc",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "14px",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "15px",
                                        color: "#1f2937",
                                        lineHeight: "1.7",
                                    }}
                                >
                                    Arohio supports accessibility teams by turning visual content into clear,
                                    meaningful alt text. The system can process PDFs, direct image uploads,
                                    and Excel or CSV files containing image URLs or paths. After generation,
                                    users can review, refine, regenerate, and export the final descriptions.
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-12 col-md-4">
                                    <div
                                        className="h-100 p-3"
                                        style={{
                                            background: "#f0fdfa",
                                            border: "1px solid #ccfbf1",
                                            borderRadius: "12px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 42,
                                                height: 42,
                                                borderRadius: "12px",
                                                display: "grid",
                                                placeItems: "center",
                                                background: "#ccfbf1",
                                                color: "#0f766e",
                                                fontWeight: 800,
                                                marginBottom: 12,
                                            }}
                                        >
                                            01
                                        </div>

                                        <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
                                            PDF to Images
                                        </div>

                                        <div className="subtle small" style={{ lineHeight: "1.7" }}>
                                            Upload a PDF and Arohio extracts the available images so each visual
                                            element can be reviewed separately before alt text generation.
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-4">
                                    <div
                                        className="h-100 p-3"
                                        style={{
                                            background: "#fff",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "12px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 42,
                                                height: 42,
                                                borderRadius: "12px",
                                                display: "grid",
                                                placeItems: "center",
                                                background: "#eef2ff",
                                                color: "#3730a3",
                                                fontWeight: 800,
                                                marginBottom: 12,
                                            }}
                                        >
                                            02
                                        </div>

                                        <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
                                            Image to Alt Text
                                        </div>

                                        <div className="subtle small" style={{ lineHeight: "1.7" }}>
                                            For direct image uploads, the assistant creates descriptive alt text
                                            focused on clarity, context, accessibility, and meaningful visual
                                            information.
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-4">
                                    <div
                                        className="h-100 p-3"
                                        style={{
                                            background: "#fff",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "12px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 42,
                                                height: 42,
                                                borderRadius: "12px",
                                                display: "grid",
                                                placeItems: "center",
                                                background: "#fef3c7",
                                                color: "#92400e",
                                                fontWeight: 800,
                                                marginBottom: 12,
                                            }}
                                        >
                                            03
                                        </div>

                                        <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
                                            Excel to Alt Text
                                        </div>

                                        <div className="subtle small" style={{ lineHeight: "1.7" }}>
                                            Upload Excel, CSV, or XLSX files with image paths or URLs. Arohio
                                            can generate alt text row by row and prepare results for export.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="mt-3 p-3"
                                style={{
                                    background: "#fff",
                                    border: "1px dashed #cbd5e1",
                                    borderRadius: "12px",
                                }}
                            >
                                <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
                                    Accessibility Review Flow
                                </div>

                                <div className="row g-3">
                                    <div className="col-12 col-md-6">
                                        <div className="subtle small" style={{ lineHeight: "1.7" }}>
                                            <strong style={{ color: "#334155" }}>Generate:</strong> Create initial
                                            alt text from images, PDFs, or spreadsheet records.
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <div className="subtle small" style={{ lineHeight: "1.7" }}>
                                            <strong style={{ color: "#334155" }}>Review:</strong> Check whether the
                                            description is accurate, concise, and useful for screen reader users.
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <div className="subtle small" style={{ lineHeight: "1.7" }}>
                                            <strong style={{ color: "#334155" }}>Refine:</strong> Edit or regenerate
                                            descriptions when more context or better wording is required.
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <div className="subtle small" style={{ lineHeight: "1.7" }}>
                                            <strong style={{ color: "#334155" }}>Export:</strong> Download the final
                                            alt text in structured formats for documentation or content workflows.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="col-12 col-lg-4">
                        {/* Alt Text Quality Checklist */}
                        <div className="card-soft p-3 p-md-4 mb-4 text-start">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <div className="card-title mb-1">Alt Text Quality Checklist</div>
                                    <div className="subtle small">
                                        Use these points while reviewing generated descriptions
                                    </div>
                                </div>

                                <span
                                    className="small px-3 py-2"
                                    style={{
                                        background: "#eef7f6",
                                        color: "#0f766e",
                                        borderRadius: "999px",
                                        fontWeight: 600,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    Guide
                                </span>
                            </div>

                            <ul className="list-unstyled m-0">
                                {[
                                    {
                                        title: "Describe the main purpose",
                                        text: "Focus on what the image communicates, not every small visual detail.",
                                    },
                                    {
                                        title: "Keep it clear and concise",
                                        text: "Use simple wording that is easy for screen reader users to understand.",
                                    },
                                    {
                                        title: "Add context when needed",
                                        text: "For charts, diagrams, or product images, include the useful meaning behind the visual.",
                                    },
                                    {
                                        title: "Avoid repeated phrases",
                                        text: "Do not start every description with phrases like image of or picture of unless required.",
                                    },
                                ].map((item, index) => (
                                    <li key={index} className="d-flex align-items-start gap-2 mb-3">
                                        <div
                                            className="quick-icon"
                                            style={{
                                                background: "#eef7f6",
                                                color: "#0f766e",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {index + 1}
                                        </div>

                                        <div className="text-start">
                                            <div
                                                style={{
                                                    color: "#0f172a",
                                                    fontWeight: 700,
                                                    textAlign: "left",
                                                }}
                                            >
                                                {item.title}
                                            </div>

                                            <div
                                                className="subtle small"
                                                style={{
                                                    textAlign: "left",
                                                    lineHeight: "1.6",
                                                }}
                                            >
                                                {item.text}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Quick Actions */}
                        <div className="card-soft p-3 p-md-4 mb-4">
                            <div className="card-title mb-3 text-start">Quick Actions</div>
                            <div className="row g-3">
                                <div className="col-6">
                                    <Link to="/tools/pdf-to-excel" className="quick-tile text-decoration-none">
                                        <div className="quick-icon">
                                            <FaFilePdf size={18} />
                                        </div>
                                        <div className="fw-semibold" style={{ color: "#0f172a" }}>
                                            PDF to Excel
                                        </div>
                                    </Link>
                                </div>

                                <div className="col-6">
                                    <Link to="/tools/excel-to-alttext" className="quick-tile text-decoration-none">
                                        <div className="quick-icon">
                                            <FaFileExcel size={18} />
                                        </div>
                                        <div className="fw-semibold" style={{ color: "#0f172a" }}>
                                            Excel to Alt Text
                                        </div>
                                    </Link>
                                </div>

                                <div className="col-6">
                                    <Link to="/dashboard/projects" className="quick-tile text-decoration-none">
                                        <div className="quick-icon">
                                            <FaFolderOpen size={18} />
                                        </div>
                                        <div className="fw-semibold" style={{ color: "#0f172a" }}>
                                            View All Projects
                                        </div>
                                    </Link>
                                </div>

                                <div className="col-6">
                                    <Link to="/dashboard/billing" className="quick-tile text-decoration-none">
                                        <div className="quick-icon">
                                            <FaCreditCard size={18} />
                                        </div>
                                        <div className="fw-semibold" style={{ color: "#0f172a" }}>
                                            Credit Management
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Supported Workflows */}
                        <div className="card-soft p-4 text-center mb-4">
                            <div
                                className="mx-auto mb-3"
                                style={{
                                    width: 58,
                                    height: 58,
                                    borderRadius: "18px",
                                    display: "grid",
                                    placeItems: "center",
                                    background: "#eef7f6",
                                    color: "#0f766e",
                                    fontSize: 28,
                                    fontWeight: 800,
                                }}
                            >
                                AI
                            </div>

                            <div
                                style={{
                                    fontWeight: 800,
                                    fontSize: 22,
                                    color: "#0f172a",
                                    marginBottom: 8,
                                }}
                            >
                                Multi-Source Alt Text
                            </div>

                            <div
                                className="subtle"
                                style={{
                                    fontSize: 14,
                                    lineHeight: "1.7",
                                    maxWidth: 320,
                                    margin: "0 auto",
                                }}
                            >
                                Generate accessibility-focused alt text from PDFs, direct images, and
                                Excel or CSV files containing image paths or URLs.
                            </div>

                            <div
                                className="mt-3 d-flex justify-content-center flex-wrap gap-2"
                            >
                                {["PDF", "Images", "Excel", "CSV"].map((item) => (
                                    <span
                                        key={item}
                                        className="small px-3 py-2"
                                        style={{
                                            background: "#f8fafc",
                                            border: "1px solid #e5e7eb",
                                            color: "#334155",
                                            borderRadius: "999px",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upgrade banner */}
                {/* <div
                    className="upgrade-band mt-4 d-flex flex-wrap justify-content-between align-items-center"
                    style={{
                        background: "linear-gradient(90deg, #21c7b8, #159d90)",
                        color: "#fff",
                        borderRadius: "3px",
                        padding: "20px 24px",
                        boxShadow: "0 6px 18px rgba(0,0,0,.1)",
                    }}
                >
                   
                    <div>
                        <div style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 4 }}>
                            Unlock More Features
                        </div>
                        <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                            Get advanced automation, analytics & priority support with Pro.
                        </div>
                    </div>


                    <Link
                        to="/pricing"
                        className="btn fw-bold"
                        style={{
                            background: "#fff",
                            color: "#21c7b8",
                            borderRadius: "6px",
                            padding: "10px 20px",
                            fontWeight: 700,
                            marginTop: "10px",
                        }}
                    >
                        Upgrade Plan
                    </Link>
                </div> */}

            </div>
        </div>
    );
}

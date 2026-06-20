import { useState } from "react";
import { Link } from "react-router-dom";
import {
    TbChevronLeft,
    TbPlayerPlay,
    TbRefresh,
    TbCopy,
    TbTrash,
    TbCheck,
    TbX,
} from "react-icons/tb";

export default function DashboardAltText() {
    const THEME = "#21c7b8";

    const [editorText, setEditorText] = useState(
        "A close-up of a laptop screen shows a user interface with various charts and graphs, indicating data analysis software. The keyboard is visible in the foreground."
    );
    const [bulkProgress] = useState(45);
    const [tone, setTone] = useState("Friendly");
    const [limit, setLimit] = useState(125);
    const [lang, setLang] = useState("English");

    const wordCount = editorText.trim().split(/\s+/).filter(Boolean).length;
    const charCount = editorText.length;
    const exceeds = charCount > limit;

    const regenerate = () =>
        setEditorText(
            "A modern workspace featuring a laptop displaying analytics charts; the keyboard rests prominently in the foreground."
        );

    const copyText = () => navigator.clipboard.writeText(editorText);

    return (
        <div
            className="container py-4 text-start"
            style={{ background: "#f5f7fb", minHeight: "100vh" }}
        >
            <style>{`
        .title{font-weight:800;color:#0f172a;}
        .subtle{color:#6b7280;}
        .panel{background:#fff;border:1px solid #e8eef5;border-radius:12px;}
        .btn{font-weight:700;border-radius:8px;padding:8px 14px;border:1px solid transparent;cursor:pointer;}
        .btn-teal{background:${THEME};color:#fff;}
        .btn-outline{background:#fff;border-color:#d1d5db;color:#0f172a;}
        .btn-ghost{background:#fff;border-color:#e5e7eb;color:#0f172a;}
        .toolbar-select{border:1px solid #d1d5db;border-radius:8px;padding:6px 10px;background:#fff;font-weight:600;color:#0f172a;}
        .bulkbar{background:#fff;border:1px solid #e8eef5;border-radius:12px;padding:12px;color:#0f172a;}
        .preview-wrap{display:flex;gap:16px;align-items:flex-start;}
        .frame{width:180px;min-width:180px;background:#f9fafb;border:1px solid #e6ebf2;border-radius:12px;padding:10px;display:flex;align-items:center;justify-content:center;}
        .frame img{width:100%;height:auto;border-radius:8px;object-fit:cover;}
        .editor{flex:1;}
        .editor-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;}
        .warn{background:#fff7e6;border:1px solid #ffe4b5;color:#9b6a09;border-radius:8px;padding:8px 10px;font-weight:600;}
        .note{font-size:13px}
        .textarea{width:100%;min-height:120px;border:1px solid #dbe6f0;border-radius:10px;padding:10px;font-size:.95rem;background:#fff;color:#0f172a;resize:vertical;}
        .btn-sm{padding:6px 10px;border-radius:8px;font-weight:600;font-size:.9rem;border:1px solid #d1d5db;background:#fff;cursor:pointer;color:#0f172a;}
        .chip{display:inline-block;border-radius:999px;padding:4px 8px;font-size:.8rem;font-weight:700;}
        .chip-warn{background:#fff7e6;border:1px solid #ffe4b5;color:#9b6a09;}
        .codebox{background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:10px;font-family:ui-monospace, SFMono-Regular, Menlo, monospace;}
        .savebar{display:flex;justify-content:flex-end;}
        .alert{border-radius:10px;padding:10px 12px;font-size:.92rem;margin-top:12px;display:flex;align-items:center;gap:8px;}
        .a-green{background:#e7f9f4;border:1px solid #b8e8dd;color:#0b7a65;}
        .a-red{background:#ffecec;border:1px solid #ffd2d2;color:#b42318;}
        .progress{height:10px;background:#edf2f7;border-radius:999px;overflow:hidden;}
        .progress-fill{height:100%;background:${THEME};}
      `}</style>

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h1 className="h5 title mb-0">AI-Generated Alt Text</h1>
                <Link
                    to="/dashboard/uploads/1/process"
                    className="text-decoration-none"
                    style={{ color: THEME, fontWeight: 700 }}
                >
                    <TbChevronLeft size={18} /> Back to Uploads
                </Link>
            </div>
            <div className="subtle mb-3">
                Review, edit, and customize the alt text before finalizing.
            </div>

            {/* Bulk Tools bar */}
            <div className="bulkbar mb-3 d-flex flex-wrap align-items-center gap-2 ">
                <div className="fw-bold me-2">Bulk Tools</div>
                <select className="toolbar-select">
                    <option>Apply tone to all</option>
                </select>
                <select className="toolbar-select">
                    <option>Apply character limit to all</option>
                </select>
                <select className="toolbar-select">
                    <option>Apply language to all</option>
                </select>
                <div className="ms-auto">
                    <Link to="/dashboard/uploads/1/review" className="text-decoration-none">
                        <button className="btn btn-teal d-flex align-items-center gap-1">
                            Generate in Bulk <TbPlayerPlay size={16} />
                        </button>
                    </Link>
                </div>
            </div>

            {/* Body: preview + editor */}
            <div className="panel p-3">
                <div className="preview-wrap">
                    {/* Framed preview (left) */}
                    <div className="frame">
                        <img
                            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80"
                            alt="Preview"
                        />
                    </div>

                    {/* Editor (right) */}
                    <div className="editor w-100">
                        <div className="editor-head">
                            <div className="fw-bold">Alt Text Editor</div>
                            <div className="note subtle">
                                Word count: {wordCount} | {charCount}/{limit}
                            </div>
                        </div>

                        {/* Warning */}
                        {exceeds && (
                            <div className="warn mb-2">
                                Exceeds {limit} characters for SEO best practices.
                            </div>
                        )}

                        {/* Controls */}
                        <div className="d-flex flex-wrap gap-2 mb-2">
                            <select
                                className="toolbar-select"
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                            >
                                <option>Friendly</option>
                                <option>Formal</option>
                                <option>Neutral</option>
                            </select>
                            <select
                                className="toolbar-select"
                                value={limit}
                                onChange={(e) => setLimit(Number(e.target.value))}
                            >
                                <option value={75}>75</option>
                                <option value={100}>100</option>
                                <option value={125}>125</option>
                                <option value={150}>150</option>
                            </select>
                            <select
                                className="toolbar-select"
                                value={lang}
                                onChange={(e) => setLang(e.target.value)}
                            >
                                <option>English</option>
                                <option>Spanish</option>
                                <option>French</option>
                            </select>
                        </div>

                        {/* Textarea */}
                        <textarea
                            className="textarea"
                            value={editorText}
                            onChange={(e) => setEditorText(e.target.value)}
                        />

                        {/* Actions */}
                        <div className="d-flex gap-2 mt-2 ">
                            <button className="btn-sm" onClick={regenerate}>
                                <TbRefresh /> Regenerate
                            </button>
                            <button className="btn-sm" onClick={copyText}>
                                <TbCopy /> Copy
                            </button>
                            <button className="btn-sm" onClick={() => setEditorText("")}>
                                <TbTrash /> Discard
                            </button>
                        </div>

                        {/* Preview & Validation */}
                        <div className="mt-3">
                            <div className="d-flex align-items-center justify-content-between mb-1">
                                <div className="subtle small">Preview &amp; Validation</div>
                                <span className="chip chip-warn">Needs Edit</span>
                            </div>
                            <div className="codebox small">
                                {`<img src="..." alt="${editorText.slice(0, 48)}..." />`}
                            </div>
                        </div>

                        {/* Save */}
                        <div className="savebar mt-3">
                            <button className="btn btn-teal">Save All & Continue</button>
                        </div>

                        {/* Alerts */}
                        <div className="alert a-green mt-3">
                            <TbCheck /> Alt text saved successfully for 12 images.
                        </div>
                        <div className="alert a-red">
                            <TbX /> Failed to generate alt text for 2 images.&nbsp;
                            <button className="btn btn-ghost btn-sm">Retry?</button>
                        </div>

                        {/* Progress */}
                        <div className="mt-3">
                            <div className="progress">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${bulkProgress}%` }}
                                />
                            </div>
                            <div className="small subtle mt-1">
                                Bulk Processing… {bulkProgress}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

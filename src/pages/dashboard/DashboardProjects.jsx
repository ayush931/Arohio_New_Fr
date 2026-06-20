import { useEffect, useState, useMemo } from "react";
import {
    FaFolderOpen,
    FaSearch,
    FaFilter,
    FaSortAmountDown,
    FaPlus,
    FaEllipsisH,
    FaFilePdf,
    FaCheckCircle,
    FaClock,
    FaTrash,
    FaDownload,
    FaCrop,
    FaEye,
} from "react-icons/fa";
import { useToast } from "../../components/common/ToastProvider";
import CropAndAddImage from "../../components/dashboard/CropAndAddImage";
import ViewPdfImages from "../../components/dashboard/ViewPdfImages";
import DownloadCurrentFile from "../../components/dashboard/DownloadCurrentFile";

export default function DashboardProjects() {
    const INK = "#0f172a";
    const TEAL = "#21c7b8";
    const { showToast } = useToast();
    const [projects, setProjects] = useState([]);
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                console.log("fetchProjects called");

                const userDataRaw =
                    sessionStorage.getItem("auth_user") ||
                    localStorage.getItem("auth_user");

                console.log("userDataRaw:", userDataRaw);

                if (!userDataRaw) {
                    console.log("No user data found");
                    return;
                }

                const userData = JSON.parse(userDataRaw);
                console.log("userData:", userData);

                let url = "";

                if (Number(userData.role_id) === 2) {
                    url = `${import.meta.env.VITE_API_BASE}/projects/`;
                    console.log("Fetching all projects");
                } else {
                    url = `${import.meta.env.VITE_API_BASE}/projects/user/${userData.id}`;
                    console.log("Fetching user projects");
                }

                console.log("API URL:", url);

                const res = await fetch(url);
                console.log("Response status:", res.status);

                if (!res.ok) {
                    const text = await res.text();
                    console.log("Response not ok:", text);
                    return;
                }

                const data = await res.json();
                console.log("API response data:", data);

                setProjects(data);

            } catch (err) {
                console.log("Error:", err);
            }
        };

        fetchProjects();
    }, []);
    const handleDelete = async (fileId) => {
        try {
            showToast("Deleting file...");

            const res = await fetch(`${import.meta.env.VITE_API_BASE}/project-files/${fileId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                showToast("Failed to delete", "error");
                return;
            }

            setFiles((prev) => prev.filter((f) => f.id !== fileId));

            showToast("File deleted successfully");
        } catch (err) {
            showToast("Something went wrong", "error");
        }
    };
    const handleViewImages = (file) => {
        showToast("Opening images");

        setSelectedViewFile({
            fileId: file.id,
            projectId: activeProject?.id?.replace("p", ""),
            fileName: file.original_name,
            filePath: file.storage_path,
            fileData: file,
        });

        setShowViewImages(true);
    };
    const colors = ["#43c4b6", "#b8c1cc", "#9aa6b2", "#b9c0c8"];
    const handleDownload = (file) => {
        setSelectedDownloadFile({
            fileId: file.id,
            projectId: activeProject?.id?.replace("p", ""),
            fileName: file.original_name,
            filePath: file.storage_path,
            fileData: file,
        });

        setShowDownloadModal(true);
    };
    const handleCropAndAddImage = (file) => {
        showToast("Opening crop tool");

        setSelectedCropFile({
            fileId: file.id,
            projectId: activeProject?.id?.replace("p", ""),
            fileName: file.original_name,
            filePath: file.storage_path,
            fileData: file,
        });

        setShowCropTool(true);
    };
    const projectCards = useMemo(() => {
        return projects.map((p, index) => ({
            id: `p${p.id}`,
            title: p.name,
            files: p.file_count_cached || 0,
            updated: p.updated_at
                ? new Date(p.updated_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })
                : "N/A",
            color: colors[index % colors.length],
            badges: p.is_archived ? ["Archived"] : [],
        }));
    }, [projects]);
    const [activeProjectId, setActiveProjectId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("all");
    const [files, setFiles] = useState([]);
    const [showCropTool, setShowCropTool] = useState(false);
    const [selectedCropFile, setSelectedCropFile] = useState(null);
    const [showViewImages, setShowViewImages] = useState(false);
    const [selectedViewFile, setSelectedViewFile] = useState(null);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [selectedDownloadFile, setSelectedDownloadFile] = useState(null);
    useEffect(() => {
        if (projectCards.length > 0 && !activeProjectId) {
            setActiveProjectId(projectCards[0].id);
        }
    }, [projectCards]);
    const activeProject = projectCards.find(p => p.id === activeProjectId) || null;
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                if (!activeProject) return;

                const projectId = activeProject.id.replace("p", "");

                const res = await fetch(
                    `${import.meta.env.VITE_API_BASE}/project-files/project/${projectId}`
                );

                const data = await res.json();

                setFiles(data);

            } catch (err) {
                console.log(err);
            }
        };

        fetchFiles();
    }, [activeProject]);
    const filteredProjects = projectCards.filter((p) => {
        if (searchType === "file") return true;

        return p.title.toLowerCase().includes(searchTerm.toLowerCase());
    });
    const filteredFiles = files.filter((f) => {
        if (searchType === "project") return true;

        return f.original_name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    const isPdfToImagesFile = (file) => {
        const type = (file?.project_type || "")
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();

        return (
            type === "pdf to images" ||
            type === "pdf2 images" ||
            type === "pdf2images" ||
            type === "pdf to image"
        );
    };
    return (
        <div className="container py-4 text-start" style={{ background: "#f6f8fb", minHeight: "100vh" }}>
            <style>{`
        :root{
          --ink:${INK};
          --teal:${TEAL};
          --card:#ffffff;
          --line:#e7edf4;
          --muted:#64748b;
        }
        .page-title{font-weight:800;color:var(--ink);}
        .muted{color:var(--muted);}
        .card{background:var(--card);border:1px solid var(--line);border-radius:4px;}
        /* ----- Controls */
        .toolbar{display:flex;gap:10px;flex-wrap:wrap}
        .search{
          display:flex;align-items:center;gap:8px;
          background:#fff;border:1px solid var(--line);border-radius:3px;padding:10px 12px;min-width:280px;
        }
        .search input{
          border:none;outline:none;flex:1;background:#fff;color:var(--ink);
        }
        .search input::placeholder{color:#9aa6b2}
        /* fix dark-mode / autofill making input black */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus{
          -webkit-text-fill-color: var(--ink);
          -webkit-box-shadow: 0 0 0px 1000px #fff inset;
          box-shadow: 0 0 0px 1000px #fff inset;
        }
        .kbtn{
          border:1px solid var(--line);background:#fff;border-radius:3px;
          padding:10px 12px;display:inline-flex;align-items:center;gap:8px;color:#1f2937;font-weight:700;
        }
        .btn-teal{background:var(--teal);color:#fff;border:none;border-radius:3px;padding:10px 14px;font-weight:800;}
        /* ----- Projects grid (equal height) */
        .project-grid{
          display:grid;gap:14px;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        }
        .project-card{
          background:#fff;border:1px solid var(--line);border-radius:4px;padding:14px 14px;
          display:flex;flex-direction:column;justify-content:space-between;min-height:120px;
          transition:box-shadow .2s, transform .05s;
        }
        .project-card:hover{box-shadow:0 10px 26px rgba(15,23,42,.08)}
        .folder-icon{width:44px;height:34px;border-radius:3px;display:grid;place-items:center;color:#fff;flex:none}
        .badge-row{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px}
        .chip{border-radius:999px;padding:2px 10px;font-size:.72rem;font-weight:800;border:1px solid var(--line);background:#f6f7fa;color:#475569}
        .chip.plan{background:#eaf3ff;border-color:#cfe2ff;color:#1b61b0}
        .chip.live{background:#e8fbf7;border-color:#c6f2ea;color:#0f766e}
        /* ----- Breadcrumb */
        .crumbs{font-size:.95rem;color:#94a3b8;margin-top:2px}
        .crumbs b{color:var(--ink)}
        /* ----- Table list */
        .table{width:100%;border-collapse:separate;border-spacing:0 10px}
        .row-card{background:#fff;border:1px solid var(--line);border-radius:3px}
        .cell{padding:14px 16px;vertical-align:middle}
        .status{display:inline-flex;align-items:center;gap:6px;font-weight:800;font-size:.75rem;padding:6px 12px;border-radius:999px;border:1px solid}
        .s-approved{background:#e7f9f4;color:#0b7a65;border-color:#b8e8dd}
        .s-reviewed{background:#fff8e6;color:#9b6a09;border-color:#ffdfa6}
        .s-processing{background:#eaf3ff;color:#1b61b0;border-color:#cfe2ff}
        .right-panel{position:sticky;top:16px}
        .pill{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);background:#f7fafc;border-radius:999px;padding:6px 10px;color:#1f2937;font-weight:700;font-size:.8rem;}
        .btn-icon{border:1px solid var(--line);background:#fff;border-radius:3px;padding:8px 10px;color:#64748b; }
        /* Hide default */
input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e1;
  border-radius: 2px;
  background: #fff;
  cursor: pointer;
  position: relative;
  transition: all 0.15s ease;
}

/* When checked */
input[type="checkbox"]:checked {
  background: #21c7b8;      /* teal */
  border-color: #21c7b8;
}

/* Add tick icon */
input[type="checkbox"]:checked::after {
  content: "✓";
  color: #fff;
  font-size: 12px;
  position: absolute;
  top: 0;
  left: 3px;
}

      `}</style>
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                    <h1 className="h5 page-title m-0">Projects & Folders</h1>
                    <div className="muted">Keep your PDFs organized with folders, tags, and quick filters.</div>
                </div>
            </div>

            <div className="toolbar mb-4 flex items-center gap-3">
                <div className="search w-full md:w-1/2 flex items-center gap-2 border rounded-md px-3 py-2">
                    <FaSearch style={{ color: "#94a3b8" }} />

                    <input
                        placeholder="Search projects or files…"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full outline-none text-sm"
                    />
                </div>


            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">

                {filteredProjects.length === 0 ? (
                    <div className="col-span-full text-center text-sm text-gray-500 py-6">
                        No projects found
                    </div>
                ) : (
                    filteredProjects.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => setActiveProjectId(p.id)}
                            className={`project-card cursor-pointer ${activeProjectId === p.id ? "ring-2 ring-teal-400" : ""}`}
                        >
                            <div className="d-flex align-items-start gap-3">
                                <div className="folder-icon" style={{ background: p.color }}>
                                    <FaFolderOpen />
                                </div>
                                <div className="flex-grow-1">
                                    <div className="fw-bold" style={{ color: INK }}>{p.title}</div>
                                    {!!p.badges.length && (
                                        <div className="badge-row">
                                            {p.badges.map((b, i) => (
                                                <span key={i} className={`chip ${b === "Planning" ? "plan" : "live"}`}>{b}</span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="muted small mt-2">
                                        Files: {files.length} <span className="mx-1">|</span> Last Updated: {p.updated}
                                    </div>
                                </div>
                                <button className="btn-icon" title="More">
                                    <FaEllipsisH />
                                </button>
                            </div>
                        </div>
                    ))
                )}

            </div>
            <div className="crumbs mb-3">Projects <span className="mx-1">›</span> <b>{activeProject?.title || "No Project"}</b></div>

            <div className="row g-3">
                <div className="col-12">
                    <div className="card p-4">

                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <FaFilePdf className="text-gray-400 text-lg" />
                                <div>
                                    <div className="text-lg font-semibold text-slate-800">
                                        Project Files
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {files.length} items
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-b mb-4"></div>

                        <div className="hidden sm:block">
                            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-gray-50">
                                    <tr className="text-left text-sm text-gray-600">
                                        <th className="py-3 px-3 w-[45%] font-medium">File</th>
                                        <th className="py-3 px-3 w-[15%] font-medium">Project Type</th>
                                        <th className="py-3 px-3 w-[15%] font-medium">Size</th>
                                        <th className="py-3 px-3 w-[15%] font-medium">Created</th>
                                        <th className="py-3 px-3 w-[10%] font-medium">Status</th>
                                        <th className="py-3 px-3 w-[15%] font-medium text-right">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredFiles.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center text-sm text-gray-500 py-6">
                                                No files found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredFiles.map((f) => (
                                            <tr key={f.id} className="border-t hover:bg-gray-50">

                                                <td className="py-4 px-3">
                                                    <div className="flex items-center gap-3">
                                                        <FaFilePdf className="text-gray-400 text-lg" />
                                                        <span className="font-medium text-slate-800 truncate max-w-[400px]">
                                                            {f.original_name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <div className="py-4 px-3 text-sm text-gray-700">
                                                    {f.project_type || "N/A"}
                                                </div>
                                                <td className="py-4 px-3 text-sm text-gray-700">
                                                    {((f.size_bytes || 0) / (1024 * 1024)).toFixed(2)} MB
                                                </td>

                                                <td className="py-4 px-3 text-sm text-gray-700">
                                                    {f.created_at
                                                        ? new Date(f.created_at).toLocaleDateString()
                                                        : "N/A"}
                                                </td>

                                                <td className="py-4 px-3">
                                                    <span className="text-xs px-3 py-1 bg-green-100 text-green-600 rounded-full">
                                                        Active
                                                    </span>
                                                </td>

                                                <td className="py-4 px-3">
                                                    <div className="flex justify-end gap-2">
                                                        {isPdfToImagesFile(f) && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleViewImages(f)}
                                                                    title="View images"
                                                                    className="h-10 px-3 text-sm border rounded-md hover:bg-gray-100 flex items-center gap-2 whitespace-nowrap"
                                                                >
                                                                    <FaEye className="text-base" />
                                                                    View
                                                                </button>

                                                                <button
                                                                    onClick={() => handleCropAndAddImage(f)}
                                                                    title="Crop and add missing image"
                                                                    className="h-10 px-3 text-sm border rounded-md hover:bg-gray-100 flex items-center gap-2 whitespace-nowrap"
                                                                >
                                                                    <FaCrop className="text-base" />
                                                                    Crop
                                                                </button>
                                                            </>
                                                        )}

                                                        <button
                                                            onClick={() => handleDownload(f)}
                                                            title="Download file"
                                                            className="h-10 px-3 text-sm border rounded-md hover:bg-gray-100 flex items-center gap-2 whitespace-nowrap"
                                                        >
                                                            <FaDownload className="text-base" />
                                                            Download
                                                        </button>

                                                        <button
                                                            onClick={() => handleDelete(f.id)}
                                                            title="Remove file"
                                                            className="h-10 px-3 text-sm border rounded-md hover:bg-red-50 text-red-600 flex items-center gap-2 whitespace-nowrap"
                                                        >
                                                            <FaTrash className="text-base" />
                                                            Remove
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="sm:hidden flex flex-col gap-3">
                            {filteredFiles.length === 0 ? (
                                <div className="text-center text-sm text-gray-500 py-6">
                                    No files found
                                </div>
                            ) : (
                                filteredFiles.map((f) => (
                                    <div
                                        key={f.id}
                                        className="border rounded-xl p-3 bg-white shadow-sm"
                                    >

                                        <div className="flex items-center gap-2">
                                            <FaFilePdf className="text-gray-400" />
                                            <div className="text-sm font-medium text-slate-800 truncate">
                                                {f.original_name}
                                            </div>
                                        </div>
                                        <td className="py-4 px-3 text-sm text-gray-700">
                                            <span className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                                                {f.project_type || "Pdf to Images"}
                                            </span>
                                        </td>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {((f.size_bytes || 0) / (1024 * 1024)).toFixed(2)} MB
                                        </div>

                                        <div className="flex justify-between items-center mt-2 text-xs text-gray-600">
                                            <span>
                                                {f.created_at
                                                    ? new Date(f.created_at).toLocaleDateString()
                                                    : "N/A"}
                                            </span>

                                            <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full">
                                                Active
                                            </span>
                                        </div>

                                        <div className={`grid ${isPdfToImagesFile(f) ? "grid-cols-4" : "grid-cols-2"} gap-1 mt-3`}>
                                            {isPdfToImagesFile(f) && (
                                                <>
                                                    <button
                                                        onClick={() => handleViewImages(f)}
                                                        title="View images"
                                                        className="h-10 px-2 text-xs border rounded-md flex justify-center items-center gap-1.5 whitespace-nowrap"
                                                    >
                                                        <FaEye className="text-base shrink-0 inline-block" />
                                                    </button>

                                                    <button
                                                        onClick={() => handleCropAndAddImage(f)}
                                                        title="Crop and add missing image"
                                                        className="h-10 px-2 text-xs border rounded-md flex justify-center items-center gap-1.5 whitespace-nowrap"
                                                    >
                                                        <FaCrop className="text-base shrink-0 inline-block" />
                                                    </button>
                                                </>
                                            )}

                                            <button
                                                onClick={() => handleDownload(f)}
                                                title="Download file"
                                                className="h-10 px-2 text-xs border rounded-md flex justify-center items-center gap-1.5 whitespace-nowrap"
                                            >
                                                <FaDownload className="text-base shrink-0 inline-block" />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(f.id)}
                                                title="Remove file"
                                                className="h-10 px-2 text-xs border rounded-md text-red-600 flex justify-center items-center gap-1.5 whitespace-nowrap"
                                            >
                                                <FaTrash className="text-base shrink-0 inline-block" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showCropTool && selectedCropFile && (
                <CropAndAddImage
                    file={selectedCropFile}
                    onClose={() => {
                        setShowCropTool(false);
                        setSelectedCropFile(null);
                    }}
                    onSaved={(payload) => {
                        console.log("Cropped image payload:", payload);
                        setShowCropTool(false);
                        setSelectedCropFile(null);
                        showToast("Cropped image saved successfully and added to the image list");
                    }}
                />
            )}
            {showViewImages && selectedViewFile && (
                <ViewPdfImages
                    file={selectedViewFile}
                    onClose={() => {
                        setShowViewImages(false);
                        setSelectedViewFile(null);
                    }}
                />
            )}
            {showDownloadModal && selectedDownloadFile && (
                <DownloadCurrentFile
                    file={selectedDownloadFile}
                    onClose={() => {
                        setShowDownloadModal(false);
                        setSelectedDownloadFile(null);
                    }}
                />
            )}
        </div>

    );
}

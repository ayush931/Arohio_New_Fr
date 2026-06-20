import { useState } from "react";
import { FaTimes, FaDownload, FaFileExcel, FaBookOpen, FaFileArchive } from "react-icons/fa";

export default function DownloadCurrentFile({ file, onClose }) {
    const [selectedFormat, setSelectedFormat] = useState("xlsx");
    const [isDownloading, setIsDownloading] = useState(false);

    const formats = [
        {
            key: "xlsx",
            title: "Excel Format",
            subtitle: "Download the latest image list as an Excel file with embedded images.",
            icon: <FaFileExcel />,
        },
        {
            key: "epub",
            title: "EPUB Format",
            subtitle: "Create an EPUB file using the current extracted images.",
            icon: <FaBookOpen />,
        },
        {
            key: "csv",
            title: "CSV Format",
            subtitle: "Download a lightweight CSV file with image names, page numbers, and paths.",
            icon: <FaFileArchive />,
        },
    ];

    const getFilePath = () => {
        return file?.filePath || file?.storage_path || file?.fileData?.storage_path || "";
    };

    const getProjectType = () => {
        return (file?.fileData?.project_type || file?.project_type || "")
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();
    };

    const isPdfToImagesFile = () => {
        const type = getProjectType();

        return (
            type === "pdf to images" ||
            type === "pdf2 images" ||
            type === "pdf2images" ||
            type === "pdf to image"
        );
    };

    const isExcelToAltTextFile = () => {
        const type = getProjectType();

        return (
            type === "excel to alt text" ||
            type === "excel to alttext" ||
            type === "excel2 alt text" ||
            type === "excel2alttext"
        );
    };

    const getStem = () => {
        const filePath = getFilePath();

        if (!filePath) return "";

        const cleanPath = filePath.split("?")[0];
        const parts = cleanPath.split("/").filter(Boolean);
        const uploadsIndex = parts.findIndex((part) => part === "uploads");

        if (uploadsIndex !== -1 && parts[uploadsIndex + 2]) {
            return parts[uploadsIndex + 2];
        }

        if (file?.fileName || file?.original_name || file?.fileData?.original_name) {
            return (file.fileName || file.original_name || file.fileData.original_name).replace(/\.[^/.]+$/, "");
        }

        return "";
    };

    const getUserId = () => {
        const filePath = getFilePath();

        if (filePath) {
            const cleanPath = filePath.split("?")[0];
            const parts = cleanPath.split("/").filter(Boolean);
            const uploadsIndex = parts.findIndex((part) => part === "uploads");

            if (uploadsIndex !== -1 && parts[uploadsIndex + 1]) {
                return String(parts[uploadsIndex + 1]);
            }
        }

        if (file?.fileData?.uploaded_by || file?.uploaded_by) {
            return String(file?.fileData?.uploaded_by || file?.uploaded_by);
        }

        const userDataRaw =
            sessionStorage.getItem("auth_user") ||
            localStorage.getItem("auth_user");

        if (!userDataRaw) return "";

        try {
            const userData = JSON.parse(userDataRaw);
            return userData?.id ? String(userData.id) : "";
        } catch (err) {
            return "";
        }
    };

    const handleDownload = async () => {
        const userId = getUserId();
        const stem = getStem();

        if (!userId || !stem || isDownloading) return;

        setIsDownloading(true);

        try {
            let endpoint = "";
            let body = {};

            if (isPdfToImagesFile()) {
                endpoint = `${import.meta.env.VITE_API_BASE}/uploads-pdf-images/${userId}/download-current`;

                body = {
                    pdf_stem: stem,
                    format: selectedFormat,
                };
            } else if (isExcelToAltTextFile()) {
                endpoint = `${import.meta.env.VITE_API_BASE}/uploads-excel-to-alttext/${userId}/download-current`;

                body = {
                    excel_stem: stem,
                    format: selectedFormat,
                };
            } else {
                throw new Error("Download is not available for this project type");
            }

            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.detail || "Download failed");
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            const disposition = res.headers.get("content-disposition") || "";
            const match = disposition.match(/filename="?([^"]+)"?/);
            const filename = match?.[1] || `${stem}_current.${selectedFormat}`;

            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
            onClose?.();
        } catch (err) {
            console.log(err);
            alert(err.message || "Download failed");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            style={{ zIndex: 999999 }}
        >
            <div className="bg-white w-full max-w-3xl rounded-lg shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b bg-white">
                    <div>
                        <div className="font-bold text-slate-800 flex items-center gap-2 text-base">
                            <span className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
                                <FaDownload />
                            </span>
                            Download Updated File
                        </div>

                        <div className="text-xs text-gray-500 mt-1 ml-11">
                            Generate a fresh download using the latest JSON data.
                        </div>

                        <div className="text-xs text-slate-500 mt-1 ml-11 font-medium">
                            {file?.fileName || file?.original_name || file?.fileData?.original_name || "Selected file"}
                        </div>

                        <div className="text-xs text-slate-400 mt-1 ml-11">
                            {file?.fileData?.project_type || file?.project_type || "Project type not available"}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-md border hover:bg-gray-100 text-slate-700"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="p-5">
                    <div className="mb-4">
                        <div className="text-sm font-semibold text-slate-800">
                            Choose Download Format
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            Select the format you want to export from the current manifest.
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {formats.map((format) => (
                            <button
                                key={format.key}
                                onClick={() => setSelectedFormat(format.key)}
                                className={`text-left border rounded-lg p-4 transition-all ${
                                    selectedFormat === format.key
                                        ? "border-teal-500 ring-2 ring-teal-100 bg-teal-50"
                                        : "border-slate-200 hover:bg-slate-50"
                                }`}
                            >
                                <div className="w-10 h-10 rounded-md bg-white border flex items-center justify-center text-slate-700 mb-3">
                                    {format.icon}
                                </div>

                                <div className="text-sm font-bold text-slate-800">
                                    {format.title}
                                </div>

                                <div className="text-xs text-gray-500 mt-1 leading-5">
                                    {format.subtitle}
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-5 bg-slate-50 border rounded-lg p-4">
                        <div className="text-sm font-semibold text-slate-700">
                            What will be included?
                        </div>
                        <div className="text-xs text-gray-500 mt-1 leading-5">
                            The download will be generated from the current saved JSON manifest for this file.
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-5">
                        <button
                            onClick={onClose}
                            className="h-10 px-4 text-sm border rounded-md hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="h-10 px-5 text-sm rounded-md bg-teal-500 hover:bg-teal-600 text-white font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaDownload />
                            {isDownloading ? "Preparing..." : "Download Now"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
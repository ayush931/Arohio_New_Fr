import { useEffect, useState } from "react";
import { FaTimes, FaEye, FaImage } from "react-icons/fa";

export default function ViewPdfImages({ file, onClose }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const getFilePath = () => {
        return file?.filePath || file?.storage_path || "";
    };

    const getPdfStem = () => {
        const filePath = getFilePath();

        if (filePath) {
            const cleanPath = filePath.split("?")[0];
            const parts = cleanPath.split("/").filter(Boolean);
            const uploadsIndex = parts.findIndex((part) => part === "uploads");

            if (uploadsIndex !== -1 && parts[uploadsIndex + 2]) {
                return parts[uploadsIndex + 2];
            }
        }

        if (file?.fileName || file?.original_name) {
            return (file.fileName || file.original_name).replace(/\.[^/.]+$/, "");
        }

        return "";
    };

    const getUserId = () => {
        if (file?.fileData?.uploaded_by) return String(file.fileData.uploaded_by);
        if (file?.uploaded_by) return String(file.uploaded_by);

        const filePath = getFilePath();

        if (filePath) {
            const cleanPath = filePath.split("?")[0];
            const parts = cleanPath.split("/").filter(Boolean);
            const uploadsIndex = parts.findIndex((part) => part === "uploads");

            if (uploadsIndex !== -1 && parts[uploadsIndex + 1]) {
                return String(parts[uploadsIndex + 1]);
            }
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

    const pdfStem = getPdfStem();
    const userId = getUserId();

    const imagesFolderUrl =
        userId && pdfStem
            ? `${import.meta.env.VITE_API_BASE}/uploads/${userId}/${pdfStem}/images`
            : "";

    const manifestUrl =
        userId && pdfStem
            ? `${import.meta.env.VITE_API_BASE}/uploads/${userId}/${pdfStem}.json`
            : "";

    useEffect(() => {
        const fetchManifest = async () => {
            try {
                setLoading(true);
                setError("");

                if (!manifestUrl) {
                    setError("Manifest path not found");
                    setItems([]);
                    return;
                }

                const res = await fetch(manifestUrl);

                if (!res.ok) {
                    setError("Manifest file not found");
                    setItems([]);
                    return;
                }

                const data = await res.json();

                const visibleItems = (data?.items || [])
                    .filter((item) => item?.is_visible !== false && Number(item?.index || 0) > 0)
                    .sort((a, b) => {
                        const pageA = Number(a.page || 0);
                        const pageB = Number(b.page || 0);
                        const indexA = Number(a.index || 0);
                        const indexB = Number(b.index || 0);

                        if (pageA !== pageB) return pageA - pageB;
                        return indexA - indexB;
                    });

                setItems(visibleItems);
            } catch (err) {
                setError("Something went wrong while loading images");
                setItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchManifest();
    }, [manifestUrl]);

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            style={{ zIndex: 999999 }}
        >
            <style>{`
                .custom-image-scroll::-webkit-scrollbar {
                    width: 7px;
                }

                .custom-image-scroll::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 999px;
                }

                .custom-image-scroll::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 999px;
                }

                .custom-image-scroll::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }

                .custom-image-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: #cbd5e1 #f1f5f9;
                }
            `}</style>

            <div className="bg-white w-full max-w-6xl rounded-lg shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b shrink-0 bg-white">
                    <div>
                        <div className="font-bold text-slate-800 flex items-center gap-2 text-base">
                            <span className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
                                <FaEye />
                            </span>
                            Extracted & Added Images
                        </div>

                        <div className="text-xs text-gray-500 mt-1 ml-11">
                            Review all images extracted from this file, including manually cropped images.
                        </div>

                        <div className="text-xs text-slate-500 mt-1 ml-11 font-medium">
                            {file?.fileName || file?.original_name || "Selected file"}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-md border hover:bg-gray-100 text-slate-700"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="px-5 py-3 border-b bg-slate-50 shrink-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-sm font-semibold text-slate-700">
                            Image Gallery
                        </div>

                        <div className="text-xs text-gray-500">
                            Total Images: <span className="font-semibold text-slate-700">{items.length}</span>
                        </div>
                    </div>
                </div>

                <div className="p-5 overflow-y-auto custom-image-scroll">
                    {loading && (
                        <div className="text-center text-sm text-gray-500 py-10">
                            Loading images...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="text-center text-sm text-red-500 py-10">
                            {error}
                        </div>
                    )}

                    {!loading && !error && items.length === 0 && (
                        <div className="text-center text-sm text-gray-500 py-10">
                            No images found
                        </div>
                    )}

                    {!loading && !error && items.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {items.map((item, index) => {
                                const imageUrl = item.web_path || `${imagesFolderUrl}/${item.file_name}`;

                                return (
                                    <div
                                        key={`${item.page}-${item.index}-${index}`}
                                        className="border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="h-56 bg-slate-100 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={imageUrl}
                                                alt={item.file_name}
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>

                                        <div className="p-3 border-t bg-white">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                                <FaImage className="text-slate-400 shrink-0" />
                                                <span className="truncate">{item.file_name}</span>
                                            </div>

                                            <div className="text-xs text-gray-500 mt-1">
                                                Page {item.page} | Image {item.index}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
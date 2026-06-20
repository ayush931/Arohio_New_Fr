import { useRef, useState } from "react";
import { FaTimes, FaSave, FaCrop, FaRedo, FaImage } from "react-icons/fa";

export default function CropAndAddImage({ file, onClose, onSaved }) {
    const imageRef = useRef(null);
    const previewCanvasRef = useRef(null);

    const [pageNumber, setPageNumber] = useState(1);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [crop, setCrop] = useState(null);
    const [startPoint, setStartPoint] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const getFilePath = () => {
        return file?.filePath || file?.storage_path || file?.fileData?.storage_path || "";
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

    const fullPageImageUrl =
        userId && pdfStem
            ? `${import.meta.env.VITE_API_BASE}/uploads/${userId}/${pdfStem}/images/page_${pageNumber}_full_page_image.png`
            : "";

    const getImagePoint = (e) => {
        const rect = imageRef.current.getBoundingClientRect();

        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        x = Math.max(0, Math.min(x, rect.width));
        y = Math.max(0, Math.min(y, rect.height));

        return { x, y };
    };

    const generatePreview = (cropData) => {
        if (!imageRef.current || !previewCanvasRef.current || !cropData) return;
        if (cropData.width < 8 || cropData.height < 8) return;

        const image = imageRef.current;
        const canvas = previewCanvasRef.current;

        const scaleX = image.naturalWidth / image.clientWidth;
        const scaleY = image.naturalHeight / image.clientHeight;

        canvas.width = Math.round(cropData.width * scaleX);
        canvas.height = Math.round(cropData.height * scaleY);

        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(
            image,
            cropData.x * scaleX,
            cropData.y * scaleY,
            cropData.width * scaleX,
            cropData.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        );

        try {
            setPreviewUrl(canvas.toDataURL("image/png"));
        } catch (err) {
            setPreviewUrl("");
        }
    };

    const handleMouseDown = (e) => {
        if (!imageLoaded || !imageRef.current) return;

        const point = getImagePoint(e);

        const initialCrop = {
            x: point.x,
            y: point.y,
            width: 0,
            height: 0,
        };

        setStartPoint(point);
        setCrop(initialCrop);
        setIsDragging(true);
        setPreviewUrl("");
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !startPoint || !imageLoaded) return;

        const point = getImagePoint(e);

        const nextCrop = {
            x: Math.min(startPoint.x, point.x),
            y: Math.min(startPoint.y, point.y),
            width: Math.abs(point.x - startPoint.x),
            height: Math.abs(point.y - startPoint.y),
        };

        setCrop(nextCrop);
        generatePreview(nextCrop);
    };

    const handleMouseUp = () => {
        setIsDragging(false);

        if (crop && crop.width >= 8 && crop.height >= 8) {
            generatePreview(crop);
        }
    };

    const handleReset = () => {
        setCrop(null);
        setStartPoint(null);
        setPreviewUrl("");
        setIsDragging(false);
    };

    const handleSave = async () => {
        if (!previewCanvasRef.current || !crop || crop.width < 8 || crop.height < 8) return;
        if (!imageRef.current || isSaving) return;

        if (!userId || !pdfStem) return;

        setIsSaving(true);

        try {
            const blob = await new Promise((resolve) => {
                previewCanvasRef.current.toBlob((createdBlob) => {
                    resolve(createdBlob);
                }, "image/png");
            });

            if (!blob) {
                setIsSaving(false);
                return;
            }

            const formData = new FormData();
            formData.append("pdf_stem", pdfStem);
            formData.append("page", String(pageNumber));
            formData.append("image", new File([blob], `manual_crop_page_${pageNumber}.png`, { type: "image/png" }));

            const res = await fetch(`${import.meta.env.VITE_API_BASE}/uploads-pdf-images/${userId}/manual-crop`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.detail || "Failed to save cropped image");
            }

            onSaved?.({
                response: data,
                file,
                pageNumber,
                imageUrl: fullPageImageUrl,
                crop,
            });
        } catch (err) {
            console.log(err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            style={{ zIndex: 999999 }}
        >
            <style>{`
                .crop-scroll::-webkit-scrollbar {
                    width: 7px;
                    height: 7px;
                }

                .crop-scroll::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 999px;
                }

                .crop-scroll::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 999px;
                }

                .crop-scroll::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }

                .crop-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: #cbd5e1 #f1f5f9;
                }
            `}</style>

            <div className="bg-white w-full max-w-6xl rounded-lg shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b shrink-0 bg-white">
                    <div>
                        <div className="font-bold text-slate-800 flex items-center gap-2 text-base">
                            <span className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
                                <FaCrop />
                            </span>
                            Crop & Add Missing Image
                        </div>

                        <div className="text-xs text-gray-500 mt-1 ml-11">
                            Select the missing image area from the full PDF page and save it into the extracted image list.
                        </div>

                        <div className="text-xs text-slate-500 mt-1 ml-11 font-medium">
                            {file?.fileName || "Selected file"}
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
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-semibold text-slate-700">
                                Page Number
                            </label>

                            <input
                                type="number"
                                min="1"
                                value={pageNumber}
                                onChange={(e) => {
                                    setPageNumber(e.target.value);
                                    setCrop(null);
                                    setPreviewUrl("");
                                    setImageLoaded(false);
                                }}
                                className="w-24 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleReset}
                                disabled={!crop && !previewUrl}
                                className="h-9 px-3 text-sm border rounded-md hover:bg-white bg-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaRedo className="text-xs" />
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-5 overflow-y-auto crop-scroll">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <div className="lg:col-span-2">
                            <div className="mb-2 flex items-center justify-between">
                                <div className="text-sm font-semibold text-slate-800">
                                    Full Page Preview
                                </div>
                                <div className="text-xs text-gray-500">
                                    Drag on the image to crop required area
                                </div>
                            </div>

                            <div className="border border-slate-200 rounded-lg overflow-auto bg-slate-100 max-h-[68vh] crop-scroll">
                                <div
                                    className="relative inline-block select-none cursor-crosshair"
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                >
                                    <img
                                        ref={imageRef}
                                        src={fullPageImageUrl}
                                        alt="Full page"
                                        className="max-w-full block"
                                        draggable={false}
                                        crossOrigin="anonymous"
                                        onLoad={() => {
                                            setImageLoaded(true);
                                            setCrop(null);
                                            setPreviewUrl("");
                                        }}
                                        onError={() => {
                                            setImageLoaded(false);
                                            setCrop(null);
                                            setPreviewUrl("");
                                        }}
                                    />

                                    {crop && (
                                        <>
                                            <div
                                                className="absolute bg-black/25 pointer-events-none"
                                                style={{
                                                    left: 0,
                                                    top: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                }}
                                            />

                                            <div
                                                className="absolute border-2 border-teal-400 bg-teal-300/20 pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.28)]"
                                                style={{
                                                    left: crop.x,
                                                    top: crop.y,
                                                    width: crop.width,
                                                    height: crop.height,
                                                }}
                                            >
                                                <div className="absolute -top-7 left-0 bg-teal-500 text-white text-[11px] px-2 py-1 rounded">
                                                    {Math.round(crop.width)} × {Math.round(crop.height)}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <div className="text-sm font-semibold text-slate-800">
                                    Cropped Preview
                                </div>
                                {previewUrl && (
                                    <div className="text-xs text-teal-600 font-semibold">
                                        Ready to save
                                    </div>
                                )}
                            </div>

                            <div className="border border-slate-200 rounded-lg p-3 bg-white">
                                <div className="border rounded-md min-h-[250px] flex items-center justify-center bg-slate-50 overflow-hidden">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="max-w-full max-h-[340px] object-contain"
                                        />
                                    ) : (
                                        <div className="text-sm text-gray-400 text-center px-4">
                                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                                                <FaImage />
                                            </div>
                                            Select an area from the full page image to preview it here.
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleSave}
                                    disabled={!previewUrl || isSaving}
                                    className="mt-4 w-full h-11 px-4 rounded-md bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaSave />
                                    {isSaving ? "Saving..." : "Save Cropped Image"}
                                </button>

                                {crop && (
                                    <div className="mt-3 text-xs text-gray-500 grid grid-cols-2 gap-2">
                                        <div className="bg-slate-50 border rounded px-2 py-2">
                                            Width: {Math.round(crop.width)}
                                        </div>
                                        <div className="bg-slate-50 border rounded px-2 py-2">
                                            Height: {Math.round(crop.height)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <canvas ref={previewCanvasRef} className="hidden" />
                </div>
            </div>
        </div>
    );
}
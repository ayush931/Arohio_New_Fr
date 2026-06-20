import { useState, useEffect } from "react";
import { useToast } from "../common/ToastProvider";

export default function CreditModal({
    isOpen,
    onClose,
    onSubmit,
    title,
    currentPdf,
    currentImage,
    planId,
    modalType
}) {
    const { showToast } = useToast();

    const [pdfAmount, setPdfAmount] = useState(0);
    const [imageAmount, setImageAmount] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setPdfAmount(0);
            setImageAmount(0);
            console.log("Modal opened", { planId, currentPdf, currentImage });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        console.log("Submit triggered", { planId, pdfAmount, imageAmount, modalType });

        if (!planId) {
            console.log("Plan ID missing");
            showToast("Plan not found", "error");
            return;
        }

        let newPdf = currentPdf;
        let newImage = currentImage;

        if (modalType === "add") {
            newPdf += Number(pdfAmount);
            newImage += Number(imageAmount);
        } else {
            newPdf -= Number(pdfAmount);
            newImage -= Number(imageAmount);
        }

        console.log("Calculated values", { newPdf, newImage });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE}/user-plans/${planId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    pdf_limit: newPdf,
                    image_limit: newImage
                })
            });

            const data = await response.json();
            console.log("API response", data);

            showToast("Credits updated successfully", "success");

            onSubmit({
                pdf: Number(pdfAmount),
                image: Number(imageAmount)
            });

            onClose();
        } catch (err) {
            console.log("API error", err);
            showToast("Failed to update credits", "error");
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000
            }}
        >
            <div
                style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "6px",
                    width: "350px"
                }}
            >
                <h6 style={{ fontWeight: 800, marginBottom: 10 }}>
                    {title}
                </h6>

                <div style={{ fontSize: "13px", color: "#64748b", marginBottom: 10 }}>
                    PDF Available: {currentPdf} | Image Available: {currentImage}
                </div>

                <div style={{ fontSize: "13px", marginBottom: 4 }}>PDF Amount</div>
                <input
                    type="number"
                    value={pdfAmount}
                    onChange={(e) => {
                        setPdfAmount(e.target.value);
                        console.log("PDF input changed", e.target.value);
                    }}
                    style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ccc",
                        marginBottom: "10px"
                    }}
                />

                <div style={{ fontSize: "13px", marginBottom: 4 }}>Image Amount</div>
                <input
                    type="number"
                    value={imageAmount}
                    onChange={(e) => {
                        setImageAmount(e.target.value);
                        console.log("Image input changed", e.target.value);
                    }}
                    style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ccc",
                        marginBottom: "10px"
                    }}
                />

                <button
                    onClick={handleSubmit}
                    style={{
                        width: "100%",
                        padding: "10px",
                        background: "#21c7b8",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer"
                    }}
                >
                    Confirm
                </button>

                <button
                    onClick={() => {
                        console.log("Modal closed");
                        onClose();
                    }}
                    style={{
                        width: "100%",
                        padding: "8px",
                        marginTop: "8px",
                        background: "#f1f5f9",
                        border: "none",
                        cursor: "pointer"
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
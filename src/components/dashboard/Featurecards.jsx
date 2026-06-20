import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";

export default function FeatureCardss({
    icon: Icon,
    title,
    files,
    date,
    badges = [],
    active = false,
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div
            className={`relative border p-3 transition-all duration-200 flex flex-col justify-between min-h-[120px]
      ${active
                    ? "bg-[#E6F4EA] border-[#22C55E] shadow-sm"
                    : "bg-white border-neutral-200 hover:shadow-md"
                } rounded-lg`}
            ref={ref}
        >
            <div className="flex items-start justify-between mb-2">
                <div
                    className={`w-9 h-8 flex items-center justify-center rounded-md
          ${active ? "bg-[#22C55E] text-white" : "bg-neutral-200 text-neutral-600"}`}
                >
                    {Icon && <Icon size={16} />}
                </div>

                <div className="flex items-center gap-1 relative">
                    {badges.map((b, i) => (
                        <span
                            key={i}
                            className={`text-[10px] font-medium px-2 py-[1px] rounded-full
              ${b.type === "active"
                                    ? "bg-green-100 text-green-700"
                                    : b.type === "new"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                        >
                            {b.label}
                        </span>
                    ))}

                    <button
                        onClick={() => setOpen(!open)}
                        className="ml-1 p-1 rounded hover:bg-neutral-100"
                    >
                        <MoreVertical size={15} className="text-neutral-500" />
                    </button>

                    {open && (
                        <div className="absolute right-0 top-6 bg-white border border-neutral-200 rounded-md shadow-lg w-28 z-10">
                            <button className="w-full text-left px-3 py-2 text-[11px] text-neutral-700 hover:bg-neutral-100">
                                View
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <h3 className="text-[12px] font-medium text-neutral-800 mb-[2px] mt-3 leading-snug truncate">
                    {title}
                </h3>

                <p className="text-[12px] text-neutral-600">
                    {files} Files • {date}
                </p>
            </div>
        </div>
    );
}
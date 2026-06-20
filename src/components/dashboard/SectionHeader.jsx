import React from "react";
import { useNavigate } from "react-router-dom";

export default function SectionHeader({
    title,
    description,
    buttonText,
    onButtonClick,
    buttonLink,
    buttonIcon,
    className = "",
    buttonClassName = "",
}) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onButtonClick) {
            onButtonClick();
            return;
        }
        if (buttonLink) {
            navigate(buttonLink);
        }
    };

    const showButton = buttonText && (onButtonClick || buttonLink);

    return (
        <div className={`mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}>

            <div>
                <h1 className="text-sm sm:text-base text-slate-900 leading-snug">
                    {title}
                </h1>

                {description && (
                    <p className="mt-1 text-md sm:text-[18px] text-slate-500 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>

            {showButton && (
                <button
                    type="button"
                    onClick={handleClick}
                    className={`inline-flex items-center justify-center gap-2 rounded-md bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600 active:scale-[0.98] ${buttonClassName}`}
                >
                    {buttonIcon && <span className="text-sm">{buttonIcon}</span>}
                    <span>{buttonText}</span>
                </button>
            )}
        </div>
    );
}
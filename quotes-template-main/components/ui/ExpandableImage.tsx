import React, { useState } from "react";

export function ExpandableImage({
    src,
    alt,
    downloadUrl,
    className = "",
}: {
    src: string;
    alt: string;
    downloadUrl?: string;
    className?: string;
}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <img
                src={src}
                alt={alt}
                className={className + " cursor-pointer"}
                onClick={() => setOpen(true)}
            />
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                    <div className="relative">
                        <img
                            src={src}
                            alt={alt}
                            className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
                        />
                        {downloadUrl && (
                            <a
                                href={downloadUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow transition"
                                title="Descargar imagen"
                            >
                                ⬇️
                            </a>
                        )}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-2 left-2 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow transition"
                            title="Cerrar"
                        >
                            ✖️
                        </button>
                    </div>
                </div>
            )}
        </>
    );
} 
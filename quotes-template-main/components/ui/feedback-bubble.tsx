"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { PopoverRoot, PopoverTrigger, PopoverContent, PopoverForm, PopoverLabel, PopoverTextarea, PopoverFooter, PopoverSubmitButton, PopoverCloseButton, usePopoverContext } from "@/components/prismui/popover";
import { cn } from "@/lib/utils";

function FeedbackForm() {
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const { note, closePopover, isOpen } = usePopoverContext()!;

    // Reset status when popover closes
    useEffect(() => {
        if (!isOpen && status !== "idle") {
            setStatus("idle");
        }
    }, [isOpen, status]);

    async function handleSubmit(message: string) {
        if (!message.trim()) return; // Validación adicional

        setStatus("sending");
        try {
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: message.trim() }),
            });
            if (res.ok) {
                setStatus("sent");
                setTimeout(() => {
                    setStatus("idle");
                    closePopover();
                }, 2000);
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    }

    const isMessageEmpty = !note.trim();
    const isSubmitting = status === "sending";

    return (
        <>
            {status === "sent" ? (
                <div className="p-6 text-center text-green-600 font-semibold">¡Gracias por tu sugerencia!</div>
            ) : status === "error" ? (
                <div className="p-6 text-center text-red-600 font-semibold">Ocurrió un error. Intenta de nuevo.</div>
            ) : (
                <PopoverForm onSubmit={handleSubmit}>
                    <PopoverLabel>¿Tienes una sugerencia o feedback?</PopoverLabel>
                    <PopoverTextarea className="min-h-[80px]" id="feedback-message" />
                    <PopoverFooter>
                        <PopoverCloseButton />
                        <PopoverSubmitButton
                            disabled={isMessageEmpty || isSubmitting}
                            className={cn(
                                isMessageEmpty && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {isSubmitting ? "Enviando..." : "Enviar"}
                        </PopoverSubmitButton>
                    </PopoverFooter>
                </PopoverForm>
            )}
        </>
    );
}

export default function FeedbackBubble() {
    const [hover, setHover] = useState(false);

    return (
        <div className="fixed z-50 bottom-6 right-6">
            <PopoverRoot>
                <div
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    className="relative"
                >
                    {hover && (
                        <div className="absolute right-20 bottom-1/2 translate-y-1/2 bg-black text-white text-xs rounded px-3 py-1 shadow-lg whitespace-nowrap animate-fade-in">
                            Feedback
                        </div>
                    )}
                    <PopoverTrigger
                        className={cn(
                            "w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-200 hover:scale-105 transition-all focus:outline-none"
                        )}
                        aria-label="Enviar sugerencia"
                    >
                        <Image src="/Pi7_ud.png" alt="Feedback" width={36} height={36} style={{ filter: "brightness(0)" }} />
                    </PopoverTrigger>
                </div>
                <PopoverContent position="center" className="p-0">
                    <FeedbackForm />
                </PopoverContent>
            </PopoverRoot>
        </div>
    );
} 
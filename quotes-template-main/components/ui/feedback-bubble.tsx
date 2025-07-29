"use client";
import { useState } from "react";
import Image from "next/image";
import { PopoverRoot, PopoverTrigger, PopoverContent, PopoverForm, PopoverLabel, PopoverTextarea, PopoverFooter, PopoverSubmitButton, PopoverCloseButton } from "@/components/prismui/popover";
import { cn } from "@/lib/utils";

export default function FeedbackBubble() {
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [hover, setHover] = useState(false);

    async function handleSubmit(message: string) {
        setStatus("sending");
        try {
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });
            if (res.ok) {
                setStatus("sent");
                setTimeout(() => setStatus("idle"), 2000);
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    }

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
                                <PopoverSubmitButton disabled={status === "sending"}>
                                    {status === "sending" ? "Enviando..." : "Enviar"}
                                </PopoverSubmitButton>
                            </PopoverFooter>
                        </PopoverForm>
                    )}
                </PopoverContent>
            </PopoverRoot>
        </div>
    );
} 
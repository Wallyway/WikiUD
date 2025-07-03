import { cn } from "@/lib/utils"
import { TestimonialCard, TestimonialAuthor } from "@/components/ui/testimonial-card"
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface TestimonialsSectionProps {
    title: string
    description?: string
    testimonials: Array<{
        author: TestimonialAuthor
        text: string
        href?: string
        rating: number
        date: string
        _id?: string
    }>
    className?: string
    // highlightedCommentId?: string
}

export function TestimonialsSection({
    title,
    description,
    testimonials,
    className,
    // highlightedCommentId
}: TestimonialsSectionProps) {
    const [isPaused, setIsPaused] = useState(false);
    const shouldAnimate = testimonials.length > 1;

    // Calcular cuántas veces repetir el array para llenar el carrusel
    // Suponiendo cada tarjeta ~350px y carrusel ~1200px
    const cardWidth = 350;
    const minCarouselWidth = 1200;
    const repeatCount = testimonials.length > 0 ? Math.ceil(minCarouselWidth / (testimonials.length * cardWidth)) + 1 : 1;
    const loopTestimonials = Array.from({ length: repeatCount }, () => testimonials).flat();

    // --- NUEVO: velocidad constante ---
    const baseSpeed = 80; // px por segundo
    const totalWidth = cardWidth * loopTestimonials.length;
    const duration = totalWidth / baseSpeed; // segundos
    // --- ---

    // Sin lógica de highlight ni scroll

    return (
        <section className={cn(
            "bg-background text-foreground",
            "py-4 sm:py-6 md:py-8 px-0",
            "max-w-full w-full mx-auto",
            className
        )}>
            <div className="mx-auto flex flex-col items-center gap-1 text-center sm:gap-8 w-full max-w-10xl">
                <div className="flex flex-col items-center gap-4 px-2 sm:gap-6 w-full">
                    <h2 className="max-w-[720px] text-3xl font-semibold leading-tight sm:text-4xl sm:leading-tight">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-md max-w-[600px] font-medium text-muted-foreground sm:text-lg">
                            {description}
                        </p>
                    )}
                </div>

                <div className="relative flex flex-col items-center justify-center overflow-hidden">
                    <div className="flex overflow-hidden p-1 [--gap:0rem] [gap:var(--gap)] flex-row max-w-[90vw] mx-auto">
                        <div
                            className={cn(
                                "flex shrink-0 justify-around [gap:var(--gap)] flex-row",
                                isPaused && shouldAnimate && "paused"
                            )}
                            style={shouldAnimate ? {
                                animation: `marquee ${duration}s linear infinite`,
                                animationPlayState: isPaused ? "paused" : "running"
                            } : undefined}
                        >
                            {loopTestimonials.map((testimonial, i) => {
                                const key = testimonial._id ? `${testimonial._id}-${i}` : i;
                                return (
                                    <div key={key}>
                                        <TestimonialCard
                                            {...testimonial}
                                            rating={testimonial.rating}
                                            date={testimonial.date}
                                            onMouseEnter={() => setIsPaused(true)}
                                            onMouseLeave={() => setIsPaused(false)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-background sm:block" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-background sm:block" />
                </div>
            </div>
        </section>
    )
}
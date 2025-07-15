import { cn } from "@/lib/utils"
import { TestimonialCard, TestimonialAuthor } from "@/components/ui/testimonial-card"
import React, { useState, useEffect, useRef, useCallback } from "react";
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
    highlightedCommentId?: string
    shinyCommentId?: string
}

export function TestimonialsSection({
    title,
    description,
    testimonials,
    className,
    highlightedCommentId,
    shinyCommentId
}: TestimonialsSectionProps) {
    const [isPaused, setIsPaused] = useState(false);
    const [isHighlighting, setIsHighlighting] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>();
    const scrollPositionRef = useRef(0);
    const shouldAnimate = testimonials.length > 1;

    // Card dimensions
    const cardWidth = 350;
    const cardGap = 16; // gap between cards
    const totalCardWidth = cardWidth + cardGap;

    // Create a loop of testimonials for seamless scrolling
    let loopTestimonials: typeof testimonials = testimonials;
    if (testimonials.length > 3) {
        const repeatCount = Math.ceil(3);
        loopTestimonials = Array.from({ length: repeatCount }, () => testimonials).flat();
    }

    // Animation speed (pixels per second)
    const animationSpeed = 50;

    // Animation loop
    const animate = useCallback(() => {
        if (!shouldAnimate || isPaused || isHighlighting) {
            animationRef.current = requestAnimationFrame(animate);
            return;
        }
        scrollPositionRef.current += (animationSpeed / 60); // 60fps
        const maxScroll = totalCardWidth * testimonials.length;
        if (scrollPositionRef.current >= maxScroll) {
            scrollPositionRef.current = 0;
        }
        if (innerRef.current) {
            innerRef.current.style.transform = `translateX(-${scrollPositionRef.current}px)`;
        }
        animationRef.current = requestAnimationFrame(animate);
    }, [shouldAnimate, isPaused, isHighlighting, totalCardWidth, testimonials.length, animationSpeed]);

    // Start animation
    useEffect(() => {
        if (shouldAnimate) {
            animationRef.current = requestAnimationFrame(animate);
        }
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [animate, shouldAnimate]);

    // Highlight logic
    useEffect(() => {
        if (highlightedCommentId && carouselRef.current && innerRef.current) {
            setIsHighlighting(true);
            setIsPaused(true);
            // Find the highlighted comment in the original testimonials array
            const highlightedIndex = testimonials.findIndex(
                testimonial => testimonial._id === highlightedCommentId
            );
            if (highlightedIndex !== -1) {
                // Calculate the position to center the highlighted comment
                const containerWidth = carouselRef.current.offsetWidth;
                const cardPosition = highlightedIndex * totalCardWidth;
                const centerOffset = (containerWidth - cardWidth) / 2;
                const targetPosition = Math.max(0, cardPosition - centerOffset);
                const startPosition = scrollPositionRef.current;
                const endPosition = targetPosition;
                const duration = 400; // 0.4 second (faster)
                const startTime = Date.now();
                const animateScroll = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const currentPosition = startPosition + (endPosition - startPosition) * easeOut;
                    scrollPositionRef.current = currentPosition;
                    if (innerRef.current) {
                        innerRef.current.style.transform = `translateX(-${currentPosition}px)`;
                    }
                    if (progress < 1) {
                        requestAnimationFrame(animateScroll);
                    } else {
                        setTimeout(() => {
                            setIsHighlighting(false);
                            setIsPaused(false);
                        }, 2000);
                    }
                };
                animateScroll();
            }
        }
    }, [highlightedCommentId, testimonials, cardWidth, totalCardWidth]);

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
                    {isHighlighting && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg"
                        >
                            ✨ Nuevo comentario destacado
                        </motion.div>
                    )}
                    <div
                        ref={carouselRef}
                        className="flex overflow-hidden p-1 max-w-[90vw] mx-auto"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        onWheel={e => {
                            if (testimonials.length > 1 && innerRef.current) {
                                e.preventDefault();
                                scrollPositionRef.current += e.deltaY;
                                const maxScroll = totalCardWidth * testimonials.length;
                                if (scrollPositionRef.current < 0) scrollPositionRef.current = 0;
                                if (scrollPositionRef.current > maxScroll) scrollPositionRef.current = maxScroll;
                                innerRef.current.style.transform = `translateX(-${scrollPositionRef.current}px)`;
                            }
                        }}
                    >
                        <div
                            ref={innerRef}
                            className="flex shrink-0 gap-4 flex-row"
                        >
                            {loopTestimonials.map((testimonial, i) => {
                                const key = testimonial._id ? `${testimonial._id}-${i}` : i;
                                const isHighlighted = testimonial._id === highlightedCommentId && isHighlighting;
                                const isShiny = testimonial._id === shinyCommentId;
                                return (
                                    <div key={key} style={{ width: cardWidth, flexShrink: 0 }}>
                                        <TestimonialCard
                                            {...testimonial}
                                            rating={testimonial.rating}
                                            date={testimonial.date}
                                            onMouseEnter={() => !isHighlighting && setIsPaused(true)}
                                            onMouseLeave={() => !isHighlighting && setIsPaused(false)}
                                            isHighlighted={isHighlighted}
                                            isShiny={isShiny}
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
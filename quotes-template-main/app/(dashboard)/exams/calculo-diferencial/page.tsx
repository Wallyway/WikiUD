"use client";
import { motion } from "framer-motion";
import { Timeline } from "@/components/ui/timeline";
import { ExpandableImage } from "@/components/ui/ExpandableImage";

export default function CalculoIntegralPage() {
    return (
        <div className="min-h-screen flex flex-col items-center w-full pt-16"> {/* pt-32 para espacio arriba */}
            <motion.h1
                initial={{ opacity: 0.5, y: -100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                }}
                className="bg-gradient-to-br from-slate-200 to-slate-400 py-4 bg-clip-text text-center text-4xl font-bold tracking-tight text-transparent md:text-7xl mb-4"
            >
                Cálculo Diferencial
            </motion.h1>
            {/* Timeline debajo del título */}
            <div className="w-full max-w-4xl -mt-10 bg-transparent">
                <Timeline
                    data={[
                        {
                            title: "2025",
                            content: (
                                <div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <ExpandableImage
                                            src="/showcase_exams/calc-dif-2025-I.webp"
                                            alt="startup template"
                                            downloadUrl="https://mkwyvdmpmaibgtmfhsgd.supabase.co/storage/v1/object/public/wikiud-pdfs//calc-dif-2025-I.webp"
                                            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                                        />
                                        <ExpandableImage
                                            src="/showcase_exams/calc-dif-2025-I(2).webp"
                                            alt="startup template"
                                            downloadUrl="https://mkwyvdmpmaibgtmfhsgd.supabase.co/storage/v1/object/public/wikiud-pdfs//calc-dif-2025-I(2).webp"
                                            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                                        />

                                    </div>
                                </div>
                            ),
                        },
                        {
                            title: "2023",
                            content: (
                                <div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <ExpandableImage
                                            src="/showcase_exams/calc-dif-2023-I.webp"
                                            alt="hero template"
                                            downloadUrl="https://mkwyvdmpmaibgtmfhsgd.supabase.co/storage/v1/object/public/wikiud-pdfs//calc-dif-2023-I.webp"
                                            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                                        />
                                        <ExpandableImage
                                            src="/showcase_exams/calc-dif-2023-II.webp"
                                            alt="feature template"
                                            downloadUrl="https://mkwyvdmpmaibgtmfhsgd.supabase.co/storage/v1/object/public/wikiud-pdfs//calc-dif-2023-II.webp"
                                            className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
                                        />

                                    </div>
                                </div>
                            ),
                        },

                    ]}
                />
            </div>
        </div>
    );
} 
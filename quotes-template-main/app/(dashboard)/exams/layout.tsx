import { LampContainer } from "@/components/ui/lamp";

export default function ExamsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen relative bg-slate-950 text-white overflow-hidden">
            {/* Lamp background absoluto */}
            <div className="absolute inset-0 w-full h-full z-0">
                <LampContainer>{null}</LampContainer>
            </div>
            {/* Contenido principal encima de la lámpara */}
            <div className="relative z-10 flex flex-col items-center">
                {children}
            </div>
        </div>
    );
} 
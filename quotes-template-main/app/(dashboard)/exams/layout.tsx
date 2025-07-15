export default function ExamsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen relative bg-black text-white overflow-hidden">
            {/* Gradiente etéreo */}
            <div
                className="pointer-events-none absolute inset-0 z-0"
                aria-hidden="true"
                style={{
                    background: "radial-gradient(ellipse at 50% 30%, rgba(80,80,120,0.18) 0%, rgba(0,0,0,0.95) 70%)"
                }}
            />
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
} 
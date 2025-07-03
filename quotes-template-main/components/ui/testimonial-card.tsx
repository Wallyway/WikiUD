import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export interface TestimonialAuthor {
    name: string
    handle: string
    avatar: string
}

export interface TestimonialCardProps {
    author: TestimonialAuthor
    text: string
    href?: string
    className?: string
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>
    rating?: number // de 1 a 5
    date?: string // fecha opcional
}

function stringToColor(str: string) {
    // Simple hash to pick a color from a palette
    const colors = [
        "bg-red-500", "bg-green-500", "bg-blue-500", "bg-yellow-500",
        "bg-pink-500", "bg-purple-500", "bg-indigo-500", "bg-teal-500",
        "bg-orange-500", "bg-cyan-500"
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

export function TestimonialCard({
    author,
    text,
    href,
    className,
    onMouseEnter,
    onMouseLeave,
    rating,
    date
}: TestimonialCardProps) {
    function TestimonialFooter({ rating, date }: { rating?: number, date?: string }) {
        return (
            <div className="mt-auto">
                <div className="border-t pt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🆙</span>
                        <span>
                            {typeof rating === 'number'
                                ? `${rating.toFixed(1)}/5`
                                : "Sin calificación"}
                        </span>
                        {typeof date === 'string' && (
                            <span className="ml-2 text-gray-400">• {date}</span>
                        )}
                    </div>
                </div>
            </div>
        );
    }
    if (href) {
        return (
            <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                <a
                    href={href}
                    className={cn(
                        "group flex flex-col flex-1 rounded-lg border-t",
                        "bg-gradient-to-b from-muted/50 to-muted/10",
                        "px-6 py-4 text-start",
                        "hover:from-muted/60 hover:to-muted/20",
                        "min-w-[260px] max-w-[340px] min-h-[290px]",
                        "transition-colors duration-300",
                        "mx-4",
                        className
                    )}
                >
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            {author.avatar ? (
                                <AvatarImage src={author.avatar} alt={author.name} />
                            ) : (
                                <AvatarFallback className={stringToColor(author.name)}>
                                    {author.name[0]}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div className="flex flex-col items-start">
                            <h3 className="text-md font-semibold leading-none">
                                {author.name}
                            </h3>
                            {/* <p className="text-sm text-muted-foreground">
                                {author.handle}
                            </p> */}
                        </div>
                    </div>
                    <p className="sm:text-md mt-4 text-sm text-muted-foreground">
                        {text}
                    </p>
                    <TestimonialFooter rating={rating} date={date} />
                </a>
            </div>
        );
    }
    return (
        <div
            className={cn(
                "group flex flex-col flex-1 rounded-lg border-t",
                "bg-gradient-to-b from-muted/50 to-muted/10",
                "px-6 py-4 text-start",
                "hover:from-muted/60 hover:to-muted/20",
                "min-w-[260px] max-w-[340px] min-h-[290px]",
                "transition-colors duration-300",
                "mx-4",
                className
            )}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                    {author.avatar ? (
                        <AvatarImage src={author.avatar} alt={author.name} />
                    ) : (
                        <AvatarFallback className={stringToColor(author.name)}>
                            {author.name[0]}
                        </AvatarFallback>
                    )}
                </Avatar>
                <div className="flex flex-col items-start">
                    <h3 className="text-md font-semibold leading-none">
                        {author.name}
                    </h3>
                    {/* <p className="text-sm text-muted-foreground">
                        {author.handle}
                    </p> */}
                </div>
            </div>
            <p className="sm:text-md mt-4 text-sm text-muted-foreground">
                {text}
            </p>
            <TestimonialFooter rating={rating} date={date} />
        </div>
    );
}
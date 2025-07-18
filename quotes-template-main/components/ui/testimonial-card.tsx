import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"

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
    isHighlighted?: boolean // nuevo prop para destacar comentarios
    isShiny?: boolean // shiny border for new comment
    userSession?: any // Nuevo: info del usuario autenticado
    onDeleteComment?: (commentId: string) => void // Nuevo: función para borrar
    onEditComment?: (commentId: string, newText: string) => void // Nuevo: función para editar
    _id?: string // Nuevo: id del comentario
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
    date,
    isHighlighted,
    isShiny,
    userSession,
    onDeleteComment,
    onEditComment,
    _id
}: TestimonialCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(text);

    const handleEdit = () => {
        setIsEditing(true);
        setEditText(text);
    };
    const handleCancel = () => {
        setIsEditing(false);
        setEditText(text);
    };
    const handleSave = () => {
        if (onEditComment && _id) {
            onEditComment(_id, editText);
            setIsEditing(false);
        }
    };

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

    const cardClassName = cn(
        "group flex flex-col flex-1",
        "bg-gradient-to-b from-muted/50 to-muted/10",
        "px-6 py-4 text-start",
        "hover:from-muted/60 hover:to-muted/20",
        "min-w-[260px] max-w-[340px] min-h-[290px]",
        "transition-all duration-500",
        "rounded-lg",
        isShiny ? ["overflow-hidden", "relative", "shiny-border-pseudo"] : "border-t",
        isHighlighted && [
            "animate-highlight-bounce",
            "z-10"
        ],
        className
    );

    const isOwnComment = userSession && (
        (author.handle && userSession.user?.username === author.handle) ||
        (author.name && userSession.user?.name === author.name)
    );

    if (href) {
        return (
            <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                <a
                    href={href}
                    className={cardClassName}
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
            className={cardClassName}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                    {author.avatar ? (
                        <AvatarImage src={author.avatar} alt={author.name || author.handle || 'Anónimo'} />
                    ) : (
                        <AvatarFallback className={stringToColor(author.name || author.handle || 'A')}>
                            {(author.name || author.handle || 'A')[0]}
                        </AvatarFallback>
                    )}
                </Avatar>
                <div className="flex flex-col items-start">
                    <h3 className="text-md font-semibold leading-none">
                        {author.name ? author.name : (author.handle || "Anónimo")}
                    </h3>
                </div>
            </div>
            {isEditing ? (
                <div className="mt-4 flex flex-col gap-2">
                    <textarea
                        className="w-full rounded border p-2 text-sm"
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        rows={3}
                    />
                    <div className="flex gap-2 justify-end">
                        <button
                            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            onClick={handleSave}
                        >
                            Guardar
                        </button>
                        <button
                            className="px-2 py-1 text-xs bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                            onClick={handleCancel}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            ) : (
                <p className="sm:text-md mt-4 text-sm text-muted-foreground">
                    {text}
                </p>
            )}
            <div className="flex items-center justify-end gap-2 mt-4">
                {isOwnComment && onEditComment && _id && !isEditing && (
                    <button
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        title="Editar comentario"
                        onClick={handleEdit}
                    >
                        Editar
                    </button>
                )}
                {isOwnComment && onDeleteComment && _id && !isEditing && (
                    <button
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                        title="Borrar comentario"
                        onClick={() => onDeleteComment(_id)}
                    >
                        Borrar
                    </button>
                )}
            </div>
            <TestimonialFooter rating={rating} date={date} />
        </div>
    );
}

export function TestimonialCardSkeleton({ count = 2 }: { count?: number }) {
    return (
        <div className="flex gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "flex flex-col flex-1 min-w-[260px] max-w-[340px] min-h-[290px] bg-gradient-to-b from-muted/50 to-muted/10 px-6 py-4 rounded-lg border-t animate-pulse"
                    )}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
                        <div className="flex flex-col items-start gap-2">
                            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
                        </div>
                    </div>
                    <div className="mt-2 mb-4">
                        <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                        <div className="h-4 w-4/6 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                        <div className="h-4 w-3/6 bg-gray-300 dark:bg-gray-700 rounded" />
                    </div>
                    <div className="mt-auto pt-3 border-t flex items-center gap-2">
                        <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded-full" />
                        <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded" />
                        <div className="h-4 w-10 bg-gray-300 dark:bg-gray-700 rounded ml-2" />
                    </div>
                </div>
            ))}
        </div>
    );
}
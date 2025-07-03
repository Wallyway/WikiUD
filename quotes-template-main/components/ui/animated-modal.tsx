"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import React, {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    isValidElement,
    cloneElement,
    ReactElement,
} from "react";

interface ModalContextType {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false);

    return (
        <ModalContext.Provider value={{ open, setOpen }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};

export function Modal({ children }: { children: ReactNode }) {
    return <ModalProvider>{children}</ModalProvider>;
}

export const ModalTrigger = ({
    children,
    className,
    asChild = false,
}: {
    children: React.ReactNode;
    className?: string;
    asChild?: boolean;
}) => {
    const { setOpen } = useModal();
    if (asChild && isValidElement(children)) {
        return cloneElement(children as ReactElement<any>, {
            onClick: (e: any) => {
                e.stopPropagation();
                if (children.props.onClick) children.props.onClick(e);
                setOpen(true);
            },
            className: cn(children.props.className, className),
        });
    }
    return (
        <button
            className={cn(
                "px-4 py-2 rounded-md text-black dark:text-white text-center relative overflow-hidden",
                className
            )}
            onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
            }}
        >
            {children}
        </button>
    );
};

export const ModalBody = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => {
    const { open } = useModal();

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [open]);

    const modalRef = useRef(null);
    const { setOpen } = useModal();
    useOutsideClick(modalRef, () => setOpen(false));

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                        backdropFilter: "blur(10px)",
                    }}
                    exit={{
                        opacity: 0,
                        backdropFilter: "blur(0px)",
                    }}
                    transition={{
                        duration: 0.35,
                        ease: "easeInOut"
                    }}
                    className="fixed [perspective:800px] [transform-style:preserve-3d] inset-0 h-full w-full  flex items-center justify-center z-50"
                >
                    <Overlay />

                    <motion.div
                        ref={modalRef}
                        className={cn(
                            "min-h-[50%] max-h-[90%] md:max-w-6xl bg-white dark:bg-neutral-950 border border-transparent dark:border-neutral-800 md:rounded-2xl relative z-50 flex flex-col flex-1 overflow-hidden",
                            className
                        )}
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                            rotateX: 10,
                            y: 40,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            rotateX: 0,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.9,
                            rotateX: 10,
                            y: 40,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 180,
                            damping: 22,
                            duration: 0.35,
                            ease: "easeInOut"
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <CloseIcon />
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const ModalContent = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col flex-1 p-8 md:p-10", className)}>
            {children}
        </div>
    );
};

export const ModalFooter = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                "flex justify-end p-4 bg-gray-100 dark:bg-neutral-900",
                className
            )}
        >
            {children}
        </div>
    );
};

const Overlay = ({ className }: { className?: string }) => {
    const { setOpen } = useModal();
    return (
        <motion.div
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
                backdropFilter: "blur(10px)",
            }}
            exit={{
                opacity: 0,
                backdropFilter: "blur(0px)",
            }}
            transition={{
                duration: 0.35,
                ease: "easeInOut"
            }}
            className={`fixed inset-0 h-full w-full bg-black bg-opacity-50 z-50 ${className}`}
            onClick={() => setOpen(false)}
        ></motion.div>
    );
};

const CloseIcon = () => {
    const { setOpen } = useModal();
    const [isExiting, setIsExiting] = useState(false);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setOpen(false);
            setIsExiting(false);
        }, 250); // Debe coincidir con la duración de la animación (0.25s)
    };

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.button
                    key="close-x"
                    initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 20 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    onClick={handleClose}
                    className="absolute top-4 right-4 group"
                    style={{ zIndex: 100 }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-black dark:text-white h-4 w-4 group-hover:scale-125 group-hover:rotate-3 transition duration-200"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M18 6l-12 12" />
                        <path d="M6 6l12 12" />
                    </svg>
                </motion.button>
            )}
        </AnimatePresence>
    );
};

// Hook to detect clicks outside of a component.
// Add it in a separate file, I've added here for simplicity
export const useOutsideClick = (
    ref: React.RefObject<HTMLDivElement>,
    callback: Function
) => {
    useEffect(() => {
        const listener = (event: any) => {
            // DO NOTHING if the element being clicked is the target element or their children
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            callback(event);
        };

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, callback]);
};

"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  GitBranch,
  Github,
  MessageSquare,
  StepForwardIcon as Progress,
  Star,
  Users,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { useCallback } from "react";
import { useSpring } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { MagicCard } from "../magicui/magic-card"
import { useTheme } from "next-themes";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
  useModal
} from "../ui/animated-modal";
import { TestimonialsSection } from "@/components/blocks/testimonials-with-marquee";
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverForm,
  PopoverLabel,
  PopoverTextarea,
  PopoverFooter as PopoverFooterComp,
  PopoverCloseButton,
  PopoverSubmitButton,
  usePopoverContext,
} from "@/components/prismui/popover";
import { Slider } from "@/components/ui/slider-number-flow";
import NumberFlow from '@number-flow/react';
import { useSession } from 'next-auth/react';

interface ProjectStatusCardProps {
  id: string;
  title: string;
  progress: number;
  dueDate: string;
  faculty: string;
  contributors: Array<{ name: string; image?: string }>;
  tasks: Array<{ title: string; completed: boolean }>;
  githubStars: number;
  openIssues: number;
  testimonials?: Array<{
    author: {
      name: string;
      handle: string;
      avatar: string;
    };
    text: string;
    href?: string;
    rating: number;
    date: string;
  }>;
}

export function useExpandable(initialState = false) {
  const [isExpanded, setIsExpanded] = useState(initialState);

  const springConfig = { stiffness: 300, damping: 30 };
  const animatedHeight = useSpring(0, springConfig);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return { isExpanded, toggleExpand, animatedHeight };
}

export function ProjectStatusCard({
  id,
  title,
  progress,
  dueDate,
  faculty,
  contributors,
  tasks,
  githubStars,
  openIssues,
}: ProjectStatusCardProps) {
  const { isExpanded, toggleExpand, animatedHeight } = useExpandable();
  const contentRef = useRef<HTMLDivElement>(null);

  const { theme } = useTheme();

  useEffect(() => {
    if (contentRef.current) {
      animatedHeight.set(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded, animatedHeight]);

  return (
    <Card
      className="w-96 cursor-pointer transition-all duration-300 hover:shadow-lg shadow-none"
      onClick={toggleExpand}
    >
      <MagicCard
        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        className="p-0"
      >
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-start w-full">
            <div className="space-y-2">
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-600"
              >
                {faculty}
              </Badge>
              <h3 className="text-2xl font-semibold">{title}</h3>
            </div>

          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">

                <span>{progress}%</span>
              </div>
              <ProgressBar
                value={progress}
                className={
                  progress >= 70
                    ? "bg-green-200 [&>div]:bg-green-500"
                    : progress >= 40
                      ? "bg-yellow-200 [&>div]:bg-yellow-400"
                      : progress >= 20
                        ? "bg-orange-200 [&>div]:bg-orange-500"
                        : "bg-red-200 [&>div]:bg-red-500"
                }
              />
            </div>

            <motion.div
              style={{ height: animatedHeight }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="overflow-hidden"
            >
              <div ref={contentRef}>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4 pt-2"
                    >
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span> {dueDate}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 text-yellow-400" />
                            <span>{githubStars}</span>
                          </div>

                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Contributors
                        </h4>
                        <div className="flex -space-x-2">
                          {contributors.map((contributor, index) => (
                            <TooltipProvider key={index}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Avatar className="border-2 border-white">
                                    {contributor.image ? (
                                      <AvatarImage
                                        src={contributor.image}
                                        alt={contributor.name}
                                      />
                                    ) : (
                                      <AvatarFallback className={stringToColor(contributor.name)}>
                                        {contributor.name[0]}
                                      </AvatarFallback>
                                    )}
                                  </Avatar>
                                </TooltipTrigger>

                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Asignaturas</h4>
                        {tasks.map((task, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-gray-600">{task.title}</span>
                            {task.completed && (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-center">
                        <Modal>
                          <ModalTrigger asChild>
                            <div className="relative w-48 overflow-hidden bg-black dark:bg-white dark:text-black text-white flex justify-center items-center group/modal-btn cursor-pointer px-2 py-6 rounded-md">
                              <span className="absolute left-0 right-0 mx-auto group-hover/modal-btn:translate-x-40 text-center transition duration-500">
                                Comentarios
                              </span>
                              <div className="absolute left-0 right-0 mx-auto -translate-x-32 group-hover/modal-btn:translate-x-0 flex items-center justify-center transition duration-500 text-white z-20">
                                🔎
                              </div>
                            </div>
                          </ModalTrigger>
                          <ModalBody>
                            <ModalContent className="cursor-default">
                              <CommentsModal teacherId={id} />
                            </ModalContent>
                            <ModalFooter className="flex justify-center gap-2">
                              <CancelModalButton />
                              <PopoverRoot>
                                <PopoverTrigger className="bg-black text-white dark:bg-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-28 transition-colors hover:bg-gray-800 dark:hover:bg-gray-200 cursor-pointer">
                                  Comenta ✏️
                                </PopoverTrigger>
                                <PopoverContent className="h-[250px] w-[550px]">
                                  <PopoverFormWithSlider teacherId={id} onCommentAdded={() => { /* TODO: refresh comments here */ }} />
                                </PopoverContent>
                              </PopoverRoot>
                            </ModalFooter>
                          </ModalBody>
                        </Modal>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </CardContent>

        <CardFooter>
          <div className="flex items-center justify-between w-full text-sm text-gray-600">

            <span>{openIssues} Comentarios</span>
          </div>
        </CardFooter>
      </MagicCard >
    </Card >
  );
}

const PlaneIcon = ({ className }: { className?: string }) => {
  return (
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
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2 -7h-4l-2 2h-3l2 -4l-2 -4h3l2 2h4l-2 -7h3z" />
    </svg>
  );
};

const VacationIcon = ({ className }: { className?: string }) => {
  return (
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
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M17.553 16.75a7.5 7.5 0 0 0 -10.606 0" />
      <path d="M18 3.804a6 6 0 0 0 -8.196 2.196l10.392 6a6 6 0 0 0 -2.196 -8.196z" />
      <path d="M16.732 10c1.658 -2.87 2.225 -5.644 1.268 -6.196c-.957 -.552 -3.075 1.326 -4.732 4.196" />
      <path d="M15 9l-3 5.196" />
      <path d="M3 19.25a2.4 2.4 0 0 1 1 -.25a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 1 .25" />
    </svg>
  );
};

const ElevatorIcon = ({ className }: { className?: string }) => {
  return (
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
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 4m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z" />
      <path d="M10 10l2 -2l2 2" />
      <path d="M10 14l2 2l2 -2" />
    </svg>
  );
};

const FoodIcon = ({ className }: { className?: string }) => {
  return (
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
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M20 20c0 -3.952 -.966 -16 -4.038 -16s-3.962 9.087 -3.962 14.756c0 -5.669 -.896 -14.756 -3.962 -14.756c-3.065 0 -4.038 12.048 -4.038 16" />
    </svg>
  );
};

const MicIcon = ({ className }: { className?: string }) => {
  return (
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
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M15 12.9a5 5 0 1 0 -3.902 -3.9" />
      <path d="M15 12.9l-3.902 -3.899l-7.513 8.584a2 2 0 1 0 2.827 2.83l8.588 -7.515z" />
    </svg>
  );
};

const ParachuteIcon = ({ className }: { className?: string }) => {
  return (
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
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M22 12a10 10 0 1 0 -20 0" />
      <path d="M22 12c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3c0 -1.66 -1.57 -3 -3.5 -3s-3.5 1.34 -3.5 3c0 -1.66 -1.46 -3 -3.25 -3c-1.8 0 -3.25 1.34 -3.25 3" />
      <path d="M2 12l10 10l-3.5 -10" />
      <path d="M15.5 12l-3.5 10l10 -10" />
    </svg>
  );
};

const CancelModalButton = () => {
  const { setOpen } = useModal();
  return (
    <button
      className="px-2 py-1 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 transition-colors hover:bg-gray-300 dark:hover:bg-neutral-800 cursor-pointer"
      onClick={() => setOpen(false)}
      type="button"
    >
      Cerrar
    </button>
  );
};

const CommentsModal = ({ teacherId }: { teacherId: string }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/comments?teacherId=${teacherId}`)
      .then(res => res.json())
      .then(data => setComments(data.comments || []))
      .finally(() => setLoading(false));
  }, [teacherId]);

  // Función para agregar comentario
  const handleCommentAdded = (newComment: any) => {
    setComments(prev => [...prev, newComment]);
  };

  return (
    <div>
      <TestimonialsSection
        title="Comentarios"
        testimonials={comments}
        className="max-w-xl w-full mx-auto"
      />
      <div className="py-10 flex w-full flex justify-center gap-x-3">
        <div className="flex  items-center justify-center">
          <MicIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
          <span className="text-neutral-700 dark:text-neutral-300 text-sm">
            Sé respetuoso
          </span>
        </div>
        <div className="flex items-center justify-center">
          <ElevatorIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
          <span className="text-neutral-700 dark:text-neutral-300 text-sm">
            Sé honesto
          </span>
        </div>
        <div className="flex items-center justify-center">
          <VacationIcon className="mr-1 text-neutral-700 dark:text-neutral-300 h-4 w-4" />
          <span className="text-neutral-700 dark:text-neutral-300 text-sm">
            Sé tú
          </span>
        </div>
      </div>
      {loading && <div className="text-center text-sm text-gray-400">Cargando comentarios...</div>}
    </div>
  );
};

// Custom textarea with live character counter for comments
function CommentTextareaWithCounter({ maxLength }: { maxLength: number }) {
  const { note, setNote } = usePopoverContext();
  return (
    <div className="relative">
      <textarea
        className="h-full w-full resize-none rounded-md bg-transparent px-4 py-3 text-sm outline-none pr-16"
        maxLength={maxLength}
        value={note}
        onChange={e => setNote(e.target.value)}
        rows={4}
        placeholder="Escribe tu comentario..."
      />
      <span className="absolute right-4 bottom-2 text-xs text-muted-foreground select-none">
        {note.length}/{maxLength}
      </span>
    </div>
  );
}

interface PopoverFormWithSliderProps {
  teacherId: string;
  onCommentAdded: (comment: any) => void;
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 mr-2 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
  );
}

function PopoverFormWithSlider({ teacherId, onCommentAdded }: PopoverFormWithSliderProps) {
  const { note, setNote, closePopover } = usePopoverContext();
  const [sliderValue, setSliderValue] = useState([3]);
  const { data: session, status } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const isLoggedIn = status === 'authenticated' && session?.user;

  async function sendComment() {
    if (!session) return;
    setSubmitting(true);
    setSent(false);
    const author = {
      name: session.user.name || '',
      handle: session.user.username || session.user.email || '',
      avatar: session.user.image || '',
    };
    const payload = {
      teacherId,
      author,
      text: note,
      rating: sliderValue[0],
      date: new Date().toISOString().slice(0, 10),
    };
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSubmitting(false);
    if (res.ok) {
      setNote('');
      setSliderValue([3]);
      setSent(true);
      const newComment = await res.json();
      onCommentAdded(newComment.comment || payload); // preferir el comentario con _id
      setTimeout(() => {
        setSent(false);
        closePopover();
      }, 800);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn) return;
    setShowConfirm(true);
  }

  function handleConfirmSend() {
    setShowConfirm(false);
    sendComment();
  }

  function handleCancelSend() {
    setShowConfirm(false);
  }

  return (
    <form className="flex h-full flex-col" onSubmit={handleSubmit}>
      <PopoverLabel>Agrega un comentario</PopoverLabel>
      <CommentTextareaWithCounter maxLength={200} />
      <PopoverFooterComp>
        <PopoverCloseButton />
        <div className="flex flex-col items-center gap-1 w-full">
          <Slider
            value={sliderValue}
            onValueChange={setSliderValue}
            min={1}
            max={5}
            step={0.1}
            aria-label="UPS"
            className="w-32"
          />
          <div className="flex items-center justify-center mt-1">
            <NumberFlow
              willChange
              value={sliderValue[0]}
              isolate
              opacityTiming={{ duration: 250, easing: 'ease-out' }}
              transformTiming={{
                easing: `linear(0, 0.0033 0.8%, 0.0263 2.39%, 0.0896 4.77%, 0.4676 15.12%, 0.5688, 0.6553, 0.7274, 0.7862, 0.8336 31.04%, 0.8793, 0.9132 38.99%, 0.9421 43.77%, 0.9642 49.34%, 0.9796 55.71%, 0.9893 62.87%, 0.9952 71.62%, 0.9983 82.76%, 0.9996 99.47%)`,
                duration: 500
              }}
              className="text-lg font-semibold"
            />
            <span className="text-lg ml-1">🆙</span>
          </div>
        </div>
        <PopoverSubmitButton className="ml-2" disabled={!note.trim() || !isLoggedIn || submitting || sent}>
          {submitting ? <Spinner /> : sent ? 'Enviado' : 'Enviar'}
        </PopoverSubmitButton>
      </PopoverFooterComp>
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-background border border-border rounded-xl shadow-xl p-8 flex flex-col items-start gap-4 min-w-[380px] max-w-[90vw] font-sans"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <div className="text-lg font-bold text-foreground">¿Estás absolutamente seguro?</div>
              <div className="text-sm text-muted-foreground">
                Esta acción no se puede deshacer. Tu comentario será enviado y no podrás modificarlo después.
              </div>
              <div className="flex gap-3 mt-2 self-end">
                <button
                  type="button"
                  className="px-4 py-2 rounded-md border border-border bg-transparent text-foreground font-semibold hover:bg-muted transition"
                  onClick={handleCancelSend}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                  onClick={handleConfirmSend}
                >
                  Seguro
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

// Agregar función para color aleatorio consistente
function stringToColor(str: string) {
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
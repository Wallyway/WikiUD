"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { AuroraText } from "@/components/magicui/aurora-text";
import { ChevronUp } from "lucide-react";
import { TeacherCardSkeleton } from "@/components/ui/teacher-card-skeleton";
import { AnimatePresence, motion } from "framer-motion";

interface Teacher {
  _id: string;
  name: string;
  faculty: string;
  degree: string;
  subject: string;
  email: string;
  rating: number;
  reviews: number;
  lastComments?: any[];
}

const ProjectStatusCard = dynamic(
  () => import("@/components/prismui/expandable-card").then(mod => mod.ProjectStatusCard),
  { ssr: false }
);

// Función debounce local para evitar dependencias externas
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
  };
  return debounced as T & { cancel: () => void };
}

function DashboardPage() {
  const [inputTag, setInputTag] = useState("");
  const [facultyTag, setFacultyTag] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const limit = 9; // Define the limit here
  const [commentsByTeacher, setCommentsByTeacher] = useState<Record<string, any[]>>({});
  const [tag, setTag] = useState("");

  // Sistema de cola para evitar múltiples requests simultáneos
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);
  const pendingPagesRef = useRef<Set<number>>(new Set());
  const currentRequestRef = useRef<number | null>(null);

  // Reset state when tag or facultyTag changes
  useEffect(() => {
    setPage(1);
    setTeachers([]);
    setHasMore(true);
    pendingPagesRef.current.clear();
    setIsRequestInProgress(false);
    currentRequestRef.current = null;
  }, [inputTag, facultyTag]);

  // Debounce para el input de búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setTag(inputTag);
    }, 300);
    return () => clearTimeout(handler);
  }, [inputTag]);

  // Add scroll handler for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Función para procesar la cola de requests
  const processQueue = async () => {
    if (isRequestInProgress || pendingPagesRef.current.size === 0) {
      return;
    }

    const nextPage = Math.min(...Array.from(pendingPagesRef.current));
    if (nextPage === currentRequestRef.current) {
      return; // Evitar requests duplicados
    }

    setIsRequestInProgress(true);
    currentRequestRef.current = nextPage;
    pendingPagesRef.current.delete(nextPage);

    try {
      console.log(`Fetching page ${nextPage}...`); // Debug log
      const response = await axios.get(`/api/teachers?name=${encodeURIComponent(tag)}&faculty=${encodeURIComponent(facultyTag)}&page=${nextPage}&limit=${limit}`, {
        timeout: 10000, // 10 segundos de timeout
      });
      const newTeachers = response.data.teachers;

      console.log(`Page ${nextPage} loaded: ${newTeachers.length} teachers`); // Debug log

      if (newTeachers.length === 0) {
        setHasMore(false);
      } else {
        setTeachers(prev => {
          const existingIds = new Set(prev.map((teacher: Teacher) => teacher._id));
          const uniqueNewTeachers = newTeachers.filter((teacher: Teacher) => !existingIds.has(teacher._id));
          return nextPage === 1 ? newTeachers : [...prev, ...uniqueNewTeachers];
        });

        if (newTeachers.length < limit) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      }

      // Actualizar el estado de la página actual
      setPage(nextPage);
    } catch (error: any) {
      console.error(`Error fetching page ${nextPage}:`, error);

      // Si es un error de red, reintentar después de un tiempo
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        console.log(`Network error on page ${nextPage}, will retry...`);
        // Reagregar la página a la cola para reintentar
        setTimeout(() => {
          pendingPagesRef.current.add(nextPage);
          processQueue();
        }, 2000); // Esperar 2 segundos antes de reintentar
      } else {
        // Para otros errores, asumir que no hay más datos
        setHasMore(false);
      }
    } finally {
      setIsRequestInProgress(false);
      currentRequestRef.current = null;

      // Procesar la siguiente página en la cola
      setTimeout(() => {
        processQueue();
      }, 200); // Aumentar la pausa a 200ms
    }
  };

  // Función para agregar una página a la cola
  const addPageToQueue = (pageNumber: number) => {
    console.log(`Adding page ${pageNumber} to queue`); // Debug log

    if (pageNumber === 1) {
      // Para la primera página, limpiar todo y procesar inmediatamente
      setTeachers([]);
      setHasMore(true);
      pendingPagesRef.current.clear();
      setIsRequestInProgress(false);
      currentRequestRef.current = null;
      pendingPagesRef.current.add(pageNumber);
      processQueue();
    } else {
      // Para páginas adicionales, agregar a la cola
      pendingPagesRef.current.add(pageNumber);
      processQueue();
    }
  };

  // Fetch teachers based on tag, facultyTag and page
  useEffect(() => {
    if (page === 1) {
      addPageToQueue(page);
    }
  }, [tag, facultyTag]); // Solo cuando cambian los filtros

  // Infinite scroll effect con cola de requests
  useEffect(() => {
    const debouncedAddPage = debounce((pageNumber: number) => {
      console.log(`Debounced add page ${pageNumber}, hasMore: ${hasMore}, isRequestInProgress: ${isRequestInProgress}`); // Debug log

      if (hasMore && !isRequestInProgress && !pendingPagesRef.current.has(pageNumber)) {
        addPageToQueue(pageNumber);
      }
    }, 300); // Reducir el debounce a 300ms

    const handleScroll = () => {
      const isNearBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 300;
      if (isNearBottom && hasMore && !loading) {
        // Calcular la siguiente página de forma más simple
        const nextPage = page + 1;
        console.log(`Scroll detected, next page would be: ${nextPage}`); // Debug log
        debouncedAddPage(nextPage);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      debouncedAddPage.cancel();
    };
  }, [hasMore, loading, isRequestInProgress, page]);

  // Eliminar el useEffect que hace fetchComments en batch
  // useEffect(() => {
  //   async function fetchComments() {
  //     const newCommentsByTeacher: Record<string, any[]> = {};
  //     await Promise.all(
  //       teachers.map(async (teacher) => {
  //         try {
  //           const res = await axios.get(`/api/comments?teacherId=${teacher._id}`);
  //           newCommentsByTeacher[teacher._id] = res.data.comments || [];
  //         } catch (e) {
  //           newCommentsByTeacher[teacher._id] = [];
  //         }
  //       })
  //     );
  //     setCommentsByTeacher(newCommentsByTeacher);
  //   }
  //   if (teachers.length > 0) {
  //     fetchComments();
  //   } else {
  //     setCommentsByTeacher({});
  //   }
  // }, [teachers]);

  useEffect(() => {
    const handleCommentAdded = () => {
      // Solo reiniciar la paginación y hasMore, no limpiar profesores
      setPage(1);
      setHasMore(true);
      pendingPagesRef.current.clear();
      setIsRequestInProgress(false);
      currentRequestRef.current = null;
    };
    window.addEventListener('commentAdded', handleCommentAdded);
    return () => window.removeEventListener('commentAdded', handleCommentAdded);
  }, []);

  // Actualizar el estado de loading basado en si hay requests en progreso
  useEffect(() => {
    setLoading(isRequestInProgress);
  }, [isRequestInProgress]);

  return (
    <div className="min-h-screen w-auto flex flex-col">
      <div className="flex-1 px-4 sm:px-8"> {/* Aumenta el padding lateral en móviles */}
        <h1 className="mt-12 sm:mt-16 text-3xl sm:text-4xl font-bold tracking-tighter md:text-6xl lg:text-7xl text-center">
          Busca a tu <AuroraText>Profe</AuroraText>
        </h1>
        <div className={cn("grid gap-4 sm:gap-6 mt-4 sm:mt-6 mb-8 sm:mb-10 justify-center w-full max-w-2xl mx-auto px-2 sm:px-0")}> {/* padding lateral en móviles */}
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-1 w-full">
            <div className="grid flex-1 w-full">
              <Label className="sr-only" htmlFor="tag">
                Nombre
              </Label>
              <Input
                id="tag"
                placeholder="Nombre"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                required
                value={inputTag}
                onChange={(e) => setInputTag(e.target.value)}
                className="w-full min-w-0 max-w-xs mx-auto sm:max-w-full" // Limita el ancho en móviles y centra
              />
            </div>

            <div className="grid flex-1 w-full mt-2 sm:mt-0">
              <Label className="sr-only" htmlFor="facultyTag">
                Facultad
              </Label>
              <Input
                id="facultyTag"
                placeholder="Carrera"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                required
                value={facultyTag}
                onChange={(e) => setFacultyTag(e.target.value)}
                className="w-full min-w-0 max-w-xs mx-auto sm:max-w-full" // Limita el ancho en móviles y centra
              />
            </div>
          </div>

          {/* Card Section (always ProjectStatusCard) */}
          <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-full mx-auto px-1 sm:px-0"> {/* padding lateral en móviles */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <TeacherCardSkeleton count={limit} />
                </motion.div>
              ) : (
                <motion.div
                  key="cards"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="flex flex-col gap-1 px-0"
                >
                  {teachers.map((teacher) => {
                    // Usar los últimos 3 comentarios directamente del objeto teacher
                    // Asegurar que lastComments sea un array antes de procesarlo
                    const lastComments = Array.isArray(teacher.lastComments) ? teacher.lastComments : [];
                    const last3 = lastComments.slice(0, 3);
                    const contributors = last3.map((c: any) => ({
                      name: c.author?.name || "-",
                      image: c.author?.avatar || undefined,
                    }));
                    return (
                      <ProjectStatusCard
                        key={teacher._id}
                        id={teacher._id}
                        title={teacher.name}
                        progress={Math.round((teacher.rating / 5) * 100)}
                        dueDate={teacher.email}
                        faculty={teacher.faculty}
                        contributors={contributors}
                        tasks={[
                          { title: teacher.subject, completed: true },
                        ]}
                        githubStars={teacher.reviews}
                        openIssues={teacher.reviews}
                      // className="mb-2 rounded-lg" // Quitado porque no está soportado
                      />
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
            {!loading && !hasMore && teachers.length === 0 && <div className="text-center">Sin resultados</div>} {/* Message when no teachers found after initial load */}
            {!loading && !hasMore && teachers.length > 0 && <div className="text-center">No hay más profesores.</div>} {/* Message when no more teachers after some have loaded */}
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg transition-all duration-300 hover:bg-background/90 z-50",
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}
        aria-label="Back to top"
        style={{ left: 'calc(50% + 2px)' }} // Ajuste menor para evitar que quede pegado al borde
      >
        <ChevronUp className="h-6 w-6" />
      </button>
    </div>
  );
}
export default DashboardPage;

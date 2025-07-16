"use client";

import { useEffect, useState } from "react";
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

  // Reset state when tag or facultyTag changes
  useEffect(() => {
    setPage(1);
    setTeachers([]);
    setHasMore(true);
  }, [inputTag, facultyTag]);

  // Debounce para el input de búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setTag(inputTag);
    }, 500); // Aumentado de 300ms a 500ms para reducir peticiones
    return () => clearTimeout(handler);
  }, [inputTag]);

  // Throttled scroll handler para infinite scroll
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Check if near bottom (e.g., within 300px) of the scrollable content
          const isNearBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 300;

          // Trigger loading next page if near bottom, there's more data, and not currently loading
          if (isNearBottom && hasMore && !loading) {
            setPage(prevPage => prevPage + 1);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

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

  // Fetch teachers based on tag, facultyTag and page
  useEffect(() => {
    const fetchTeachers = async () => {
      if (loading) {
        return;
      }

      if (!hasMore && page > 1) {
        return;
      }

      setLoading(true); // Set loading to true
      try {
        const response = await axios.get(`/api/teachers?name=${encodeURIComponent(tag)}&faculty=${encodeURIComponent(facultyTag)}&page=${page}&limit=${limit}`);
        const newTeachers = response.data.teachers;

        if (newTeachers.length === 0) {
          setHasMore(false); // No more data received, set hasMore to false
        } else {
          setTeachers(prev => {
            const existingIds = new Set(prev.map((teacher: Teacher) => teacher._id));
            const uniqueNewTeachers = newTeachers.filter((teacher: Teacher) => !existingIds.has(teacher._id));
            return page === 1 ? newTeachers : [...prev, ...uniqueNewTeachers];
          });

          // If we received less than the limit, there might not be more pages
          if (newTeachers.length < limit) {
            setHasMore(false);
          } else {
            // If we received exactly the limit, assume there might be more
            // This prevents prematurely setting hasMore to false if there's another full page
            setHasMore(true);
          }
        }
      } catch (error) {
        setHasMore(false); // Assume no more data on error
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    // Fetch data when tag, facultyTag or page changes
    fetchTeachers();

  }, [tag, facultyTag, page]); // Dependencies are tag, facultyTag and page.

  // Fetch comments for all teachers when teachers change
  useEffect(() => {
    async function fetchComments() {
      const newCommentsByTeacher: Record<string, any[]> = {};
      await Promise.all(
        teachers.map(async (teacher) => {
          try {
            const res = await axios.get(`/api/comments?teacherId=${teacher._id}`);
            newCommentsByTeacher[teacher._id] = res.data.comments || [];
          } catch (e) {
            newCommentsByTeacher[teacher._id] = [];
          }
        })
      );
      setCommentsByTeacher(newCommentsByTeacher);
    }
    if (teachers.length > 0) {
      fetchComments();
    } else {
      setCommentsByTeacher({});
    }
  }, [teachers]);

  useEffect(() => {
    const handleCommentAdded = () => {
      // Solo reiniciar la paginación y hasMore, no limpiar profesores
      setPage(1);
      setHasMore(true);
    };
    window.addEventListener('commentAdded', handleCommentAdded);
    return () => window.removeEventListener('commentAdded', handleCommentAdded);
  }, []);

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
                    const last3 = (teacher.lastComments || []).slice(0, 3);
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

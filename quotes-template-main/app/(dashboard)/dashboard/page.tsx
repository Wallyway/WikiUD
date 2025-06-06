"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dynamic from "next/dynamic";

interface Teacher {
  _id: string;
  name: string;
  faculty: string;
  degree: string;
  subject: string;
  email: string;
  rating: number;
  reviews: number;
}

const ProjectStatusCard = dynamic(
  () => import("@/components/prismui/expandable-card").then(mod => mod.ProjectStatusCard),
  { loading: () => <div>Loading...</div> }
);

function DashboardPage() {
  const [tag, setTag] = useState("");
  const [facultyTag, setFacultyTag] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 9; // Define the limit here

  // Reset state when tag or facultyTag changes
  useEffect(() => {
    console.log('Search terms changed:', { tag, facultyTag });
    setPage(1);
    setTeachers([]);
    setHasMore(true);
  }, [tag, facultyTag]);

  // Fetch teachers based on tag, facultyTag and page
  useEffect(() => {
    const fetchTeachers = async () => {
      console.log('Attempting to fetch:', { page, tag, facultyTag, loading, hasMore });

      // Prevent fetching if already loading
      if (loading) {
        console.log('Fetch prevented: currently loading.');
        return;
      }

      // Prevent fetching if no more data and not on the first page
      if (!hasMore && page > 1) {
        console.log('Fetch prevented: no more data and not on page 1.');
        return;
      }

      setLoading(true); // Set loading to true
      console.log('Fetching page:', page, 'with terms:', { tag, facultyTag });
      try {
        const response = await axios.get(`/api/teachers?name=${encodeURIComponent(tag)}&faculty=${encodeURIComponent(facultyTag)}&page=${page}&limit=${limit}`);
        const newTeachers = response.data.teachers;
        console.log('Search results for page', page, ':', newTeachers.length, 'teachers');

        if (newTeachers.length === 0) {
          setHasMore(false); // No more data received, set hasMore to false
          console.log('No more teachers found. hasMore set to false.');
        } else {
          // Append new teachers if not the first page, otherwise set directly
          // When search terms change, page becomes 1 and we replace the list
          setTeachers(prev => page === 1 ? newTeachers : [...prev, ...newTeachers]);

          // If we received less than the limit, there might not be more pages
          if (newTeachers.length < limit) {
             setHasMore(false);
             console.log('Fewer than limit received. hasMore set to false.');
          } else {
             // If we received exactly the limit, assume there might be more
             // This prevents prematurely setting hasMore to false if there's another full page
             setHasMore(true);
          }
        }
      } catch (error) {
        console.error('Error fetching teachers:', error);
        setHasMore(false); // Assume no more data on error
      } finally {
        setLoading(false); // Set loading to false
        console.log('Fetch completed. loading set to false.');
      }
    };

    // Fetch data when tag, facultyTag or page changes
    fetchTeachers();

  }, [tag, facultyTag, page]); // Dependencies are tag, facultyTag and page.

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      // Check if near bottom (e.g., within 300px) of the scrollable content
      // Using documentElement.scrollHeight for potentially more reliable total height
      const isNearBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 300;

      // Trigger loading next page if near bottom, there's more data, and not currently loading
      if (isNearBottom && hasMore && !loading) {
        console.log('Scrolled near bottom. Loading next page...', { hasMore, loading });
        setPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Clean up the event listener when the component unmounts or dependencies change
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]); // Include dependencies hasMore and loading to ensure handler re-creates when these change

  return (
    <div className={cn("grid gap-6 my-2 justify-center w-max mx-auto")}>
      <div className="flex gap-4">
        <div className="grid flex-1">
          <Label className="sr-only" htmlFor="tag">
            ¿Qué profesor buscas?
          </Label>
          <Input
            id="tag"
            placeholder="Nombre"
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            required
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </div>

        <div className="grid flex-1">
          <Label className="sr-only" htmlFor="facultyTag">
            Facultad
          </Label>
          <Input
            id="facultyTag"
            placeholder="Facultad"
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            required
            value={facultyTag}
            onChange={(e) => setFacultyTag(e.target.value)}
          />
        </div>
      </div>

      {/* Card Section (always ProjectStatusCard) */}
      <div className="flex flex-col gap-4 w-full max-w-full mx-auto">
        {teachers.map((teacher) => (
          <ProjectStatusCard
            key={teacher._id}
            title={teacher.name}
            progress={Math.round((teacher.rating / 5) * 100)}
            dueDate={teacher.degree}
            faculty={teacher.faculty}
            contributors={[]}
            tasks={[
              { title: teacher.subject, completed: true },
            ]}
            githubStars={teacher.reviews}
            openIssues={0}
          />
        ))}
        {loading && teachers.length > 0 && <div className="text-center">Cargando...</div>} {/* Show loading only if some teachers are already loaded */}
        {!loading && !hasMore && teachers.length > 0 && <div className="text-center">No hay más profesores.</div>} {/* Message when no more teachers */}
      </div>
    </div>
  );
}

export default DashboardPage;
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const ADMIN_EMAIL = "jsapariciow@udistrital.edu.co";

export default function AdminTeachersPage() {
    const { data: session, status } = useSession();
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        _id: "",
        name: "",
        faculty: "",
        degree: "",
        subject: "",
        email: "",
    });
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Solo permitir acceso al admin
    if (status === "loading") return <div>Cargando...</div>;
    if (!session || session.user?.email !== ADMIN_EMAIL) {
        return <div className="p-8 text-center text-red-600 font-bold">Acceso restringido</div>;
    }

    // Fetch teachers
    const fetchTeachers = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/teachers?page=1&limit=1000");
            const data = await res.json();
            setTeachers(data.teachers || []);
        } catch (e) {
            setError("Error al cargar profesores");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    // Handlers
    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEdit = (teacher: any) => {
        setForm({ ...teacher });
        setEditMode(true);
        setSuccess("");
        setError("");
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("¿Seguro que deseas eliminar este profesor?")) return;
        setLoading(true);
        setError("");
        setSuccess("");
        const res = await fetch(`/api/teachers?id=${id}`, { method: "DELETE" });
        const data = await res.json();
        if (res.ok) {
            setSuccess("Profesor eliminado");
            fetchTeachers();
        } else {
            setError(data.error || "Error al eliminar");
        }
        setLoading(false);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        const method = editMode ? "PUT" : "POST";
        const url = editMode ? `/api/teachers?id=${form._id}` : "/api/teachers";
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: form.name,
                faculty: form.faculty,
                degree: form.degree,
                subject: form.subject,
                email: form.email,
            }),
        });
        const data = await res.json();
        if (res.ok) {
            setSuccess(editMode ? "Profesor actualizado" : "Profesor agregado");
            setForm({ _id: "", name: "", faculty: "", degree: "", subject: "", email: "" });
            setEditMode(false);
            fetchTeachers();
        } else {
            setError(data.error || "Error al guardar");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Administrar Profesores</h1>
            {error && <div className="mb-4 text-red-600">{error}</div>}
            {success && <div className="mb-4 text-green-600">{success}</div>}
            <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                    <Label>Nombre</Label>
                    <Input name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div>
                    <Label>Facultad</Label>
                    <Input name="faculty" value={form.faculty} onChange={handleChange} required />
                </div>
                <div>
                    <Label>Grado</Label>
                    <Input name="degree" value={form.degree} onChange={handleChange} required />
                </div>
                <div>
                    <Label>Materia</Label>
                    <Input name="subject" value={form.subject} onChange={handleChange} required />
                </div>
                <div>
                    <Label>Email</Label>
                    <Input name="email" value={form.email} onChange={handleChange} required type="email" />
                </div>
                <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                        {editMode ? "Actualizar" : "Agregar"}
                    </Button>
                    {editMode && (
                        <Button type="button" variant="secondary" onClick={() => { setEditMode(false); setForm({ _id: "", name: "", faculty: "", degree: "", subject: "", email: "" }); }}>
                            Cancelar
                        </Button>
                    )}
                </div>
            </form>
            <h2 className="text-xl font-semibold mb-2">Profesores existentes</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1">Nombre</th>
                            <th className="border px-2 py-1">Facultad</th>
                            <th className="border px-2 py-1">Grado</th>
                            <th className="border px-2 py-1">Materia</th>
                            <th className="border px-2 py-1">Email</th>
                            <th className="border px-2 py-1">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map((t) => (
                            <tr key={t._id}>
                                <td className="border px-2 py-1">{t.name}</td>
                                <td className="border px-2 py-1">{t.faculty}</td>
                                <td className="border px-2 py-1">{t.degree}</td>
                                <td className="border px-2 py-1">{t.subject}</td>
                                <td className="border px-2 py-1">{t.email}</td>
                                <td className="border px-2 py-1 flex gap-2">
                                    <Button type="button" size="sm" onClick={() => handleEdit(t)}>
                                        Editar
                                    </Button>
                                    <Button type="button" size="sm" variant="destructive" onClick={() => handleDelete(t._id)}>
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 
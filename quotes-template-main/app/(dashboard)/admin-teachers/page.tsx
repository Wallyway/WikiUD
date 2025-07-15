"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";

const ADMIN_EMAIL = "jsapariciow@udistrital.edu.co";

const AdminTeachersPage = () => {
    const { data: session, status } = useSession();
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    // Cambia el estado inicial y el tipo de form para eliminar 'degree'
    const [form, setForm] = useState({
        _id: "",
        name: "",
        faculty: "",
        subject: "",
        email: "",
    });
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [search, setSearch] = useState("");
    const [seedLoading, setSeedLoading] = useState(false);
    const [seedMsg, setSeedMsg] = useState("");

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
                subject: form.subject,
                email: form.email,
            }),
        });
        const data = await res.json();
        if (res.ok) {
            setSuccess(editMode ? "Profesor actualizado" : "Profesor agregado");
            setForm({ _id: "", name: "", faculty: "", subject: "", email: "" });
            setEditMode(false);
            fetchTeachers();
        } else {
            setError(data.error || "Error al guardar");
        }
        setLoading(false);
    };

    // Filtro robusto
    const filteredTeachers = teachers.filter((t) => {
        const q = search.toLowerCase();
        return (
            (t.name?.toLowerCase() || "").includes(q) ||
            (t.faculty?.toLowerCase() || "").includes(q) ||
            (t.subject?.toLowerCase() || "").includes(q) ||
            (t.email?.toLowerCase() || "").includes(q)
        );
    });

    // Función para ejecutar el seed (POST /api/seed)
    const handleSeed = async () => {
        if (!window.confirm("¿Seguro que deseas cargar los profesores desde el archivo JSON? Esto borrará los profesores y comentarios actuales.")) return;
        setSeedLoading(true);
        setSeedMsg("");
        try {
            const res = await fetch("/api/seed", { method: "POST" });
            const data = await res.json();
            if (res.ok && data.success) {
                setSeedMsg("Profesores cargados desde el archivo JSON.");
                fetchTeachers();
            } else {
                setSeedMsg(data.error || "Error al ejecutar el seed");
            }
        } catch (e) {
            setSeedMsg("Error al ejecutar el seed");
        }
        setSeedLoading(false);
    };

    // Función para borrar todo (DELETE /api/seed)
    const handleDeleteAll = async () => {
        if (!window.confirm("¿Seguro que deseas borrar TODOS los profesores y comentarios? Esta acción no se puede deshacer.")) return;
        setSeedLoading(true);
        setSeedMsg("");
        try {
            const res = await fetch("/api/seed", { method: "DELETE" });
            const data = await res.json();
            if (res.ok && data.success) {
                setSeedMsg("Todos los profesores y comentarios han sido eliminados.");
                fetchTeachers();
            } else {
                setSeedMsg(data.error || "Error al borrar todo");
            }
        } catch (e) {
            setSeedMsg("Error al borrar todo");
        }
        setSeedLoading(false);
    };

    // Solo permitir acceso al admin
    if (status === "loading") return <div>Cargando...</div>;
    if (!session || session.user?.email !== ADMIN_EMAIL) {
        return <div className="p-8 text-center text-red-600 font-bold">Acceso restringido</div>;
    }

    return (
        <div className="max-w-6xl w-full mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Administrar Profesores</h1>
            {/* Botones de seed y borrar todo */}
            <div className="flex flex-col sm:flex-row gap-2 mb-6 justify-center">
                <Button onClick={handleSeed} disabled={seedLoading} variant="secondary">
                    Cargar profesores desde archivo JSON (Seed)
                </Button>
                <Button onClick={handleDeleteAll} disabled={seedLoading} variant="destructive">
                    Borrar TODOS los profesores y comentarios
                </Button>
            </div>
            {seedMsg && <div className={seedMsg.includes("eliminados") ? "mb-4 text-red-600" : "mb-4 text-green-600"}>{seedMsg}</div>}
            {error && <div className="mb-4 text-red-600">{error}</div>}
            {success && <div className="mb-4 text-green-600">{success}</div>}
            <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 gap-4 bg-gray-50 dark:bg-neutral-900 p-4 rounded-lg">
                <div>
                    <Label>Nombre</Label>
                    <Input name="name" value={form.name} onChange={handleChange} required className="bg-white dark:bg-neutral-900 text-black dark:text-white border border-neutral-300 dark:border-neutral-700" />
                </div>
                <div>
                    <Label>Facultad</Label>
                    <Input name="faculty" value={form.faculty} onChange={handleChange} required className="bg-white dark:bg-neutral-900 text-black dark:text-white border border-neutral-300 dark:border-neutral-700" />
                </div>
                <div>
                    <Label>Materia</Label>
                    <Input name="subject" value={form.subject} onChange={handleChange} required className="bg-white dark:bg-neutral-900 text-black dark:text-white border border-neutral-300 dark:border-neutral-700" />
                </div>
                <div>
                    <Label>Email</Label>
                    <Input name="email" value={form.email} onChange={handleChange} required type="email" className="bg-white dark:bg-neutral-900 text-black dark:text-white border border-neutral-300 dark:border-neutral-700" />
                </div>
                <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                        {editMode ? "Actualizar" : "Agregar"}
                    </Button>
                    {editMode && (
                        <Button type="button" variant="secondary" onClick={() => { setEditMode(false); setForm({ _id: "", name: "", faculty: "", subject: "", email: "" }); }}>
                            Cancelar
                        </Button>
                    )}
                </div>
            </form>
            <div className="mb-4">
                <Input
                    placeholder="Buscar por nombre, facultad, materia o email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="bg-white dark:bg-neutral-900 text-black dark:text-white border border-neutral-300 dark:border-neutral-700"
                />
            </div>
            <h2 className="text-xl font-semibold mb-2">Profesores existentes</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border text-sm bg-white dark:bg-neutral-900 text-black dark:text-white">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-neutral-800">
                            <th className="border px-4 py-2 border-neutral-300 dark:border-neutral-700">Nombre</th>
                            <th className="border px-4 py-2 border-neutral-300 dark:border-neutral-700">Facultad</th>
                            <th className="border px-4 py-2 border-neutral-300 dark:border-neutral-700">Materia</th>
                            <th className="border px-4 py-2 border-neutral-300 dark:border-neutral-700">Email</th>
                            <th className="border px-4 py-2 border-neutral-300 dark:border-neutral-700 min-w-[180px]">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTeachers.map((t) => (
                            <tr key={t._id}>
                                <td className="border px-4 py-2 border-neutral-300 dark:border-neutral-700">{t.name}</td>
                                <td className="border px-4 py-2 border-neutral-300 dark:border-neutral-700">{t.faculty}</td>
                                <td className="border px-4 py-2 border-neutral-300 dark:border-neutral-700">{t.subject}</td>
                                <td className="border px-4 py-2 border-neutral-300 dark:border-neutral-700">{t.email}</td>
                                <td className="border px-4 py-2 border-neutral-300 dark:border-neutral-700 min-w-[180px]">
                                    <div className="flex gap-2">
                                        <Button type="button" size="sm" onClick={() => handleEdit(t)}>
                                            Editar
                                        </Button>
                                        <Button type="button" size="sm" variant="destructive" onClick={() => handleDelete(t._id)}>
                                            Eliminar
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminTeachersPage;
import { NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { promises as fs } from 'fs';
import path from 'path';

// const sampleCommentsRaw = [
//     {
//         teacherEmail: "juan.perez@ud.edu.co",
//         author: {
//             name: "Emma Thompson",
//             handle: "@emmaai",
//             avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
//         },
//         text: "Excelente profesor, explica muy bien y resuelve todas las dudas.",
//         rating: 4.8,
//         date: "Jun 11, 2025"
//     },
//     {
//         teacherEmail: "juan.perez@ud.edu.co",
//         author: {
//             name: "David Park",
//             handle: "@davidtech",
//             avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
//         },
//         text: "Las clases son muy dinámicas y entretenidas. ¡Recomendado!",
//         rating: 4.5,
//         date: "May 20, 2025"
//     },
//     {
//         teacherEmail: "maria.rodriguez@ud.edu.co",
//         author: {
//             name: "Sofia Rodriguez",
//             handle: "@sofiaml",
//             avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
//         },
//         text: "Muy profesional y atenta con los estudiantes.",
//         rating: 4.9,
//         date: "Apr 2, 2025"
//     },
//     {
//         teacherEmail: "maria.rodriguez@ud.edu.co",
//         author: {
//             name: "Carlos Ruiz",
//             handle: "@carlosruiz",
//             avatar: "https://randomuser.me/api/portraits/men/65.jpg"
//         },
//         text: "Aprendí mucho en su materia, siempre dispuesta a ayudar.",
//         rating: 4.7,
//         date: "Mar 15, 2025"
//     }
// ];

// Para tipado correcto
// type TeacherRatings = { [email: string]: number[] };

export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const file = searchParams.get('file') || 'profesores_ingenieria_sin_duplicados.json';
        const clear = searchParams.get('clear') === 'true';

        const client = await getMongoClient();
        const db = client.db();

        // Leer profesores desde el archivo JSON especificado
        const filePath = path.join(process.cwd(), 'db', file);

        // Verificar si el archivo existe
        try {
            await fs.access(filePath);
        } catch (error) {
            return NextResponse.json(
                { success: false, error: `Archivo ${file} no encontrado` },
                { status: 404 }
            );
        }

        const fileContents = await fs.readFile(filePath, 'utf-8');
        const sampleTeachers = JSON.parse(fileContents);

        // Solo limpiar si se especifica explícitamente
        if (clear) {
            console.log('Limpiando base de datos...');
            await db.collection("teachers").deleteMany({});
            await db.collection("comments").deleteMany({});
        }

        // Verificar si los profesores ya existen (por email)
        const existingEmails = await db.collection("teachers")
            .find({}, { projection: { email: 1 } })
            .toArray();

        const existingEmailSet = new Set(existingEmails.map(t => t.email));

        // Filtrar solo profesores nuevos
        const newTeachers = sampleTeachers.filter((teacher: any) => !existingEmailSet.has(teacher.email));

        if (newTeachers.length === 0) {
            return NextResponse.json({
                success: true,
                message: `Todos los profesores de ${file} ya existen en la base de datos`,
                added: 0,
                skipped: sampleTeachers.length
            });
        }

        // Insertar solo los profesores nuevos
        const teacherInsertResult = await db.collection("teachers").insertMany(newTeachers);
        const emailToId: Record<string, ObjectId> = {};
        Object.values(teacherInsertResult.insertedIds).forEach((id, idx) => {
            emailToId[newTeachers[idx].email] = id;
        });

        // Inicializar rating y reviews para los nuevos profesores
        for (const teacher of newTeachers) {
            await db.collection("teachers").updateOne(
                { _id: emailToId[teacher.email] },
                { $set: { rating: 0.0 } }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Agregados ${newTeachers.length} profesores desde ${file}`,
            added: newTeachers.length,
            skipped: sampleTeachers.length - newTeachers.length,
            file: file
        });
    } catch (error) {
        console.error('Error seeding teachers:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to seed teachers' },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    try {
        const client = await getMongoClient();
        const db = client.db();
        await db.collection("teachers").deleteMany({});
        await db.collection("comments").deleteMany({});
        return NextResponse.json({ success: true });
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
    }
} 
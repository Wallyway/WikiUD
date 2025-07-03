import { NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/db';
import { ObjectId } from 'mongodb';

const sampleTeachers = [
    {
        name: "Dr. Juan Pérez",
        faculty: "Ingeniería",
        degree: "Ingeniería de Sistemas",
        subject: "Programación Avanzada",
        email: "juan.perez@ud.edu.co",
    },
    {
        name: "Dra. María Rodríguez",
        faculty: "Ciencias",
        degree: "Matemáticas",
        subject: "Cálculo Diferencial",
        email: "maria.rodriguez@ud.edu.co",
    }
];

const sampleCommentsRaw = [
    {
        teacherEmail: "juan.perez@ud.edu.co",
        author: {
            name: "Emma Thompson",
            handle: "@emmaai",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
        },
        text: "Excelente profesor, explica muy bien y resuelve todas las dudas.",
        rating: 4.8,
        date: "Jun 11, 2025"
    },
    {
        teacherEmail: "juan.perez@ud.edu.co",
        author: {
            name: "David Park",
            handle: "@davidtech",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        },
        text: "Las clases son muy dinámicas y entretenidas. ¡Recomendado!",
        rating: 4.5,
        date: "May 20, 2025"
    },
    {
        teacherEmail: "maria.rodriguez@ud.edu.co",
        author: {
            name: "Sofia Rodriguez",
            handle: "@sofiaml",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
        },
        text: "Muy profesional y atenta con los estudiantes.",
        rating: 4.9,
        date: "Apr 2, 2025"
    },
    {
        teacherEmail: "maria.rodriguez@ud.edu.co",
        author: {
            name: "Carlos Ruiz",
            handle: "@carlosruiz",
            avatar: "https://randomuser.me/api/portraits/men/65.jpg"
        },
        text: "Aprendí mucho en su materia, siempre dispuesta a ayudar.",
        rating: 4.7,
        date: "Mar 15, 2025"
    }
];

// Para tipado correcto
// type TeacherRatings = { [email: string]: number[] };

export async function POST() {
    try {
        const client = await getMongoClient();
        const db = client.db();

        // Clear existing teachers and comments
        await db.collection("teachers").deleteMany({});
        await db.collection("comments").deleteMany({});

        // Inserta los profesores y obtiene sus _id
        const teacherInsertResult = await db.collection("teachers").insertMany(sampleTeachers);
        const emailToId: Record<string, ObjectId> = {};
        Object.values(teacherInsertResult.insertedIds).forEach((id, idx) => {
            emailToId[sampleTeachers[idx].email] = id;
        });

        // Prepara los comentarios con teacherId
        const sampleComments = sampleCommentsRaw.map(comment => ({
            ...comment,
            teacherId: emailToId[comment.teacherEmail],
        }));
        // Elimina teacherEmail del objeto
        sampleComments.forEach(c => { delete (c as any).teacherEmail; });

        // Inserta los comentarios
        await db.collection("comments").insertMany(sampleComments);

        // Agrupa comentarios por teacherId
        const teacherRatings: Record<string, number[]> = {};
        for (const comment of sampleComments) {
            const tid = comment.teacherId.toString();
            if (!teacherRatings[tid]) {
                teacherRatings[tid] = [];
            }
            teacherRatings[tid].push(comment.rating);
        }

        // Actualiza rating y reviews sincronizados en los profesores
        for (const teacher of sampleTeachers) {
            const tid = emailToId[teacher.email].toString();
            const ratings = teacherRatings[tid] || [];
            const rating = ratings.length
                ? parseFloat((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(2))
                : 0;
            const reviews = ratings.length;
            await db.collection("teachers").updateOne(
                { _id: emailToId[teacher.email] },
                { $set: { rating, reviews } }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Successfully inserted ${sampleTeachers.length} teachers and ${sampleComments.length} comments`
        });
    } catch (error) {
        console.error('Error seeding teachers:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to seed teachers' },
            { status: 500 }
        );
    }
} 
import { NextResponse } from 'next/server'
import { TeacherServiceImpl } from '@/lib/services/teacher.service'
import { TeacherService } from '@/types/teacher'
import redis from '@/lib/redis'
import { getMongoClient } from '@/lib/db'
import { ObjectId } from 'mongodb'

const teacherService: TeacherService = new TeacherServiceImpl()

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const name = searchParams.get('name') || ''
        const faculty = searchParams.get('faculty') || ''
        const page = parseInt(searchParams.get('page') || '1', 10)
        const limit = parseInt(searchParams.get('limit') || '9', 10)

        // Clave única para el caché basada en los parámetros de búsqueda
        const cacheKey = `teachers:${name}:${faculty}:${page}:${limit}`;
        const cached = await redis.get(cacheKey);
        if (cached) {
            return NextResponse.json(JSON.parse(cached));
        }

        const teachers = await teacherService.searchTeachers({ name, faculty, page, limit })

        // Calcular estadísticas en tiempo real para cada profesor
        const client = await getMongoClient();
        const db = client.db();

        const teachersWithRealTimeStats = await Promise.all(
            teachers.map(async (teacher) => {
                const comments = await db.collection('comments').find({
                    teacherId: new ObjectId(teacher._id)
                }).toArray();

                const reviews = comments.length;
                const avgRating = reviews
                    ? parseFloat((comments.reduce((a, c) => a + (c.rating || 0), 0) / reviews).toFixed(2))
                    : 0;

                return {
                    ...teacher,
                    rating: avgRating,
                    reviews
                };
            })
        );

        // Responde al usuario inmediatamente
        const response = { teachers: teachersWithRealTimeStats };
        // Actualiza el caché en segundo plano (no bloquea la respuesta)
        redis.set(cacheKey, JSON.stringify(response), "EX", 60);

        return NextResponse.json(response)
    } catch (error) {
        console.error('Error fetching teachers:', error)
        return NextResponse.json(
            { error: 'Failed to fetch teachers' },
            { status: 500 }
        )
    }
}

export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');

        if (action === 'recalculate-stats') {
            const client = await getMongoClient();
            const db = client.db();

            // Obtener todos los profesores
            const teachers = await db.collection('teachers').find({}).toArray();

            // Para cada profesor, recalcular estadísticas
            for (const teacher of teachers) {
                const comments = await db.collection('comments').find({
                    teacherId: teacher._id
                }).toArray();

                const reviews = comments.length;
                const avgRating = reviews
                    ? parseFloat((comments.reduce((a, c) => a + (c.rating || 0), 0) / reviews).toFixed(2))
                    : 0;

                await db.collection('teachers').updateOne(
                    { _id: teacher._id },
                    { $set: { rating: avgRating, reviews } }
                );
            }

            return NextResponse.json({
                success: true,
                message: `Recalculated stats for ${teachers.length} teachers`
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Error recalculating teacher stats:', error);
        return NextResponse.json({ error: 'Failed to recalculate stats' }, { status: 500 });
    }
} 
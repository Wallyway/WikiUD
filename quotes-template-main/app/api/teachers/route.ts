import { NextResponse } from 'next/server'
import { TeacherServiceImpl } from '@/lib/services/teacher.service'
import { TeacherService } from '@/types/teacher'
import redis from '@/lib/redis'
import { getMongoClient } from '@/lib/db'
import { ObjectId } from 'mongodb'
import getServerSession from 'next-auth';
import authOptions from '@/auth.config';

const teacherService: TeacherService = new TeacherServiceImpl()

// Simple in-memory rate limiter para teachers
const teacherRateLimit = new Map();
const TEACHER_WINDOW_MS = 60000; // 1 minuto
const TEACHER_MAX_REQUESTS = 60; // máximo 60 requests por minuto por IP (más permisivo que comments)

export async function GET(request: Request) {
    let client;
    try {
        // Rate limiting por IP
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const now = Date.now();
        if (!teacherRateLimit.has(ip)) {
            teacherRateLimit.set(ip, []);
        }
        const requests = teacherRateLimit.get(ip);
        const validRequests = requests.filter((time: number) => now - time < TEACHER_WINDOW_MS);
        if (validRequests.length >= TEACHER_MAX_REQUESTS) {
            return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
        }
        validRequests.push(now);
        teacherRateLimit.set(ip, validRequests);

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

        // Reutilizar la misma conexión para todas las operaciones
        client = await getMongoClient();
        const db = client.db();

        const teachersWithLastComments = await Promise.all(
            teachers.map(async (teacher) => {
                const lastComments = await db.collection('comments')
                    .find({ teacherId: new ObjectId(teacher._id) })
                    .sort({ date: -1 })
                    .limit(3)
                    .toArray();
                return {
                    ...teacher,
                    lastComments
                };
            })
        );

        // Responde al usuario inmediatamente
        const response = { teachers: teachersWithLastComments };
        // Actualiza el caché en segundo plano (no bloquea la respuesta)
        redis.set(cacheKey, JSON.stringify(response), "EX", 300);

        return NextResponse.json(response)
    } catch (error) {
        console.error('Error fetching teachers:', error)
        return NextResponse.json(
            { error: 'Failed to fetch teachers' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    let client;
    try {
        const body = await request.json();
        const { name, faculty, degree, subject, email } = body;
        if (!name || !faculty || !degree || !subject || !email) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Reutilizar la misma conexión
        client = await getMongoClient();
        const db = client.db();
        const result = await db.collection('teachers').insertOne({ name, faculty, degree, subject, email });

        // Invalidar cache de profesores
        const teacherCachePattern = `teachers:*`;
        const teacherCacheKeys = await redis.keys(teacherCachePattern);
        if (teacherCacheKeys.length > 0) {
            await redis.del(...teacherCacheKeys);
        }
        return NextResponse.json({ success: true, insertedId: result.insertedId });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create teacher' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    let client;
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');

        // Reutilizar la misma conexión para todas las operaciones
        client = await getMongoClient();
        const db = client.db();

        if (action === 'recalculate-stats') {
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

        // Edición normal
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }
        const body = await request.json();
        const updateFields = { ...body };
        delete updateFields._id;
        const result = await db.collection('teachers').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateFields }
        );

        // Invalidar cache de profesores
        const teacherCachePattern = `teachers:*`;
        const teacherCacheKeys = await redis.keys(teacherCachePattern);
        if (teacherCacheKeys.length > 0) {
            await redis.del(...teacherCacheKeys);
        }
        return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update teacher' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    let client;
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        // Reutilizar la misma conexión
        client = await getMongoClient();
        const db = client.db();
        const result = await db.collection('teachers').deleteOne({ _id: new ObjectId(id) });

        // Invalidar cache de profesores
        const teacherCachePattern = `teachers:*`;
        const teacherCacheKeys = await redis.keys(teacherCachePattern);
        if (teacherCacheKeys.length > 0) {
            await redis.del(...teacherCacheKeys);
        }
        return NextResponse.json({ success: true, deletedCount: result.deletedCount });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete teacher' }, { status: 500 });
    }
} 
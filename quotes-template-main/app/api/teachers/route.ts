import { NextResponse } from 'next/server'
import { TeacherServiceImpl } from '@/lib/services/teacher.service'
import { TeacherService } from '@/types/teacher'
import redis from '@/lib/redis'
import { getMongoClient } from '@/lib/db'
import { ObjectId } from 'mongodb'
import getServerSession from 'next-auth';
import authOptions from '@/auth.config';

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

        // Intentar obtener del caché primero
        try {
            const cached = await redis.get(cacheKey);
            if (cached) {
                return NextResponse.json(JSON.parse(cached));
            }
        } catch (cacheError) {
            console.warn('Cache error, continuing without cache:', cacheError);
        }

        // Obtener profesores con timeout
        const teachers = await Promise.race([
            teacherService.searchTeachers({ name, faculty, page, limit }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Database timeout')), 10000)
            )
        ]) as any[];

        // Optimizar: obtener comentarios en una sola consulta agregada
        const client = await getMongoClient();
        const db = client.db();

        // Usar agregación para obtener los últimos 3 comentarios por profesor en una sola consulta
        const teachersWithComments = await Promise.all(
            teachers.map(async (teacher) => {
                try {
                    const pipeline = [
                        { $match: { teacherId: new ObjectId(teacher._id) } },
                        { $sort: { date: -1 } },
                        { $limit: 3 },
                        {
                            $project: {
                                author: 1,
                                date: 1,
                                content: 1
                            }
                        }
                    ];

                    const lastComments = await db.collection('comments')
                        .aggregate(pipeline)
                        .toArray();

                    return {
                        ...teacher,
                        lastComments
                    };
                } catch (error) {
                    console.error(`Error fetching comments for teacher ${teacher._id}:`, error);
                    return {
                        ...teacher,
                        lastComments: []
                    };
                }
            })
        );

        // Responde al usuario inmediatamente
        const response = { teachers: teachersWithComments };

        // Actualizar el caché en segundo plano (no bloquea la respuesta)
        try {
            redis.set(cacheKey, JSON.stringify(response), "EX", 60);
        } catch (cacheError) {
            console.warn('Failed to update cache:', cacheError);
        }

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error in teachers API:', error);
        return NextResponse.json(
            { error: 'Internal server error', teachers: [] },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, faculty, degree, subject, email } = body;
        if (!name || !faculty || !degree || !subject || !email) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }
        const client = await getMongoClient();
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
        // Edición normal
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }
        const body = await request.json();
        const client = await getMongoClient();
        const db = client.db();
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
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }
        const client = await getMongoClient();
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
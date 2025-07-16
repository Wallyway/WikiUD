import { NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/db';
import { ObjectId } from 'mongodb';
import redis from '@/lib/redis'

export async function GET(request: Request) {
    let client;
    try {
        const { searchParams } = new URL(request.url);
        const teacherId = searchParams.get('teacherId');
        if (!teacherId) {
            return NextResponse.json({ error: 'Missing teacherId' }, { status: 400 });
        }

        // Clave única para el caché
        const cacheKey = `comments:${teacherId}`;
        const cached = await redis.get(cacheKey);
        if (cached) {
            return NextResponse.json(JSON.parse(cached));
        }

        // Reutilizar la misma conexión
        client = await getMongoClient();
        const db = client.db();
        const comments = await db.collection('comments').find({ teacherId: new ObjectId(teacherId) }).toArray();

        // Responde al usuario inmediatamente
        const response = { comments };
        // Actualiza el caché en segundo plano (no bloquea la respuesta)
        redis.set(cacheKey, JSON.stringify(response), "EX", 60);

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    let client;
    try {
        const body = await request.json();
        const { teacherId, author, text, rating, date } = body;
        if (!teacherId || !author || !text || !rating || !date) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Reutilizar la misma conexión para todas las operaciones
        client = await getMongoClient();
        const db = client.db();

        // Clean up author.handle if it looks like a random hash
        let cleanHandle = author.handle;
        if (!isValidHandle(cleanHandle) && author.email) {
            cleanHandle = author.email;
        }
        const comment = {
            teacherId: new ObjectId(teacherId),
            author: { ...author, handle: cleanHandle },
            text,
            rating,
            date: new Date(date), // Asegura que sea tipo Date
        };
        await db.collection('comments').insertOne(comment);

        // Invalidar cache de comentarios para este profesor
        const cacheKey = `comments:${teacherId}`;
        await redis.del(cacheKey);

        // Invalidar cache de profesores para que se actualicen las estadísticas
        const teacherCachePattern = `teachers:*`;
        const teacherCacheKeys = await redis.keys(teacherCachePattern);
        if (teacherCacheKeys.length > 0) {
            await redis.del(...teacherCacheKeys);
        }

        // Optionally, update teacher's rating and reviews count
        const comments = await db.collection('comments').find({ teacherId: new ObjectId(teacherId) }).toArray();
        const reviews = comments.length;
        const avgRating = reviews ? parseFloat((comments.reduce((a, c) => a + (c.rating || 0), 0) / reviews).toFixed(2)) : 0;
        await db.collection('teachers').updateOne(
            { _id: new ObjectId(teacherId) },
            { $set: { rating: avgRating, reviews } }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving comment:', error);
        return NextResponse.json({ error: 'Failed to save comment' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    let client;
    try {
        const { searchParams } = new URL(request.url);
        const commentId = searchParams.get('commentId');
        const userEmail = searchParams.get('userEmail');
        const userHandle = searchParams.get('userHandle');
        const userName = searchParams.get('userName');
        if (!commentId || (!userEmail && !userHandle && !userName)) {
            return NextResponse.json({ error: 'Missing commentId or user identity' }, { status: 400 });
        }

        // Reutilizar la misma conexión para todas las operaciones
        client = await getMongoClient();
        const db = client.db();

        const comment = await db.collection('comments').findOne({ _id: new ObjectId(commentId) });
        if (!comment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
        }
        // Validar que el usuario es el autor
        const author = comment.author || {};
        const isAuthor = (author.email && author.email === userEmail) ||
            (author.handle && author.handle === userHandle) ||
            (author.name && author.name === userName);
        if (!isAuthor) {
            return NextResponse.json({ error: 'Unauthorized: not the author' }, { status: 403 });
        }
        // Borrar el comentario
        await db.collection('comments').deleteOne({ _id: new ObjectId(commentId) });
        // Invalidar cache de comentarios para este profesor
        if (comment.teacherId) {
            const cacheKey = `comments:${comment.teacherId}`;
            await redis.del(cacheKey);
        }
        // Invalidar cache de profesores para que se actualicen las estadísticas
        const teacherCachePattern = `teachers:*`;
        const teacherCacheKeys = await redis.keys(teacherCachePattern);
        if (teacherCacheKeys.length > 0) {
            await redis.del(...teacherCacheKeys);
        }
        // Actualizar rating y reviews del profesor
        if (comment.teacherId) {
            const comments = await db.collection('comments').find({ teacherId: comment.teacherId }).toArray();
            const reviews = comments.length;
            const avgRating = reviews ? parseFloat((comments.reduce((a, c) => a + (c.rating || 0), 0) / reviews).toFixed(2)) : 0;
            await db.collection('teachers').updateOne(
                { _id: comment.teacherId },
                { $set: { rating: avgRating, reviews } }
            );
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    let client;
    try {
        const body = await request.json();
        const { commentId, newText, userEmail, userHandle, userName } = body;
        if (!commentId || !newText || (!userEmail && !userHandle && !userName)) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Reutilizar la misma conexión
        client = await getMongoClient();
        const db = client.db();

        const comment = await db.collection('comments').findOne({ _id: new ObjectId(commentId) });
        if (!comment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
        }
        const author = comment.author || {};
        const isAuthor = (author.email && author.email === userEmail) ||
            (author.handle && author.handle === userHandle) ||
            (author.name && author.name === userName);
        if (!isAuthor) {
            return NextResponse.json({ error: 'Unauthorized: not the author' }, { status: 403 });
        }
        await db.collection('comments').updateOne(
            { _id: new ObjectId(commentId) },
            { $set: { text: newText } }
        );
        // Invalidar cache de comentarios para este profesor
        if (comment.teacherId) {
            const cacheKey = `comments:${comment.teacherId}`;
            await redis.del(cacheKey);
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error editing comment:', error);
        return NextResponse.json({ error: 'Failed to edit comment' }, { status: 500 });
    }
}

function isValidHandle(handle: string) {
    // Simple check: must contain @ or be a valid username (no long random hash)
    return handle.includes('@') || /^[a-zA-Z0-9._-]{3,20}$/.test(handle);
} 
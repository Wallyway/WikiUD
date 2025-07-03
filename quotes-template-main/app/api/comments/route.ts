import { NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const teacherId = searchParams.get('teacherId');
        if (!teacherId) {
            return NextResponse.json({ error: 'Missing teacherId' }, { status: 400 });
        }

        const client = await getMongoClient();
        const db = client.db();
        const comments = await db.collection('comments').find({ teacherId: new ObjectId(teacherId) }).toArray();

        return NextResponse.json({ comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }

}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { teacherId, author, text, rating, date } = body;
        if (!teacherId || !author || !text || !rating || !date) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const client = await getMongoClient();
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
            date,
        };
        await db.collection('comments').insertOne(comment);

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

function isValidHandle(handle: string) {
    // Simple check: must contain @ or be a valid username (no long random hash)
    return handle.includes('@') || /^[a-zA-Z0-9._-]{3,20}$/.test(handle);
} 
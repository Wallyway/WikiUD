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
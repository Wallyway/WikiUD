import { NextRequest, NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();
        if (!message || typeof message !== 'string' || message.length < 3) {
            return NextResponse.json({ error: 'Mensaje inválido' }, { status: 400 });
        }

        const client = await getMongoClient();
        const db = client.db();
        const feedback = {
            message,
            createdAt: new Date(),
            // Puedes agregar más campos como userId, userAgent, etc.
        };
        await db.collection('feedback').insertOne(feedback);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error al guardar feedback' }, { status: 500 });
    }
} 
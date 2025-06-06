import { NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/db';

const sampleTeachers = [
    {
        name: "Dr. Juan Pérez",
        faculty: "Ingeniería",
        degree: "Ingeniería de Sistemas",
        subject: "Programación Avanzada",
        email: "juan.perez@ud.edu.co",
        rating: 4.5,
        reviews: 120
    },
    {
        name: "Dra. María Rodríguez",
        faculty: "Ciencias",
        degree: "Matemáticas",
        subject: "Cálculo Diferencial",
        email: "maria.rodriguez@ud.edu.co",
        rating: 4.8,
        reviews: 95
    },
    {
        name: "Dr. Carlos Gómez",
        faculty: "Ingeniería",
        degree: "Ingeniería Electrónica",
        subject: "Circuitos Digitales",
        email: "carlos.gomez@ud.edu.co",
        rating: 4.2,
        reviews: 78
    },
    {
        name: "Dra. Ana Martínez",
        faculty: "Ciencias",
        degree: "Física",
        subject: "Mecánica Cuántica",
        email: "ana.martinez@ud.edu.co",
        rating: 4.7,
        reviews: 110
    },
    {
        name: "Dr. Luis Sánchez",
        faculty: "Ingeniería",
        degree: "Ingeniería Mecánica",
        subject: "Termodinámica",
        email: "luis.sanchez@ud.edu.co",
        rating: 4.3,
        reviews: 85
    },
    {
        name: "Dr. Pedro Ramírez",
        faculty: "Humanidades",
        degree: "Filosofía",
        subject: "Ética Contemporánea",
        email: "pedro.ramirez@ud.edu.co",
        rating: 4.6,
        reviews: 60
    },
    {
        name: "Dra. Sofia Torres",
        faculty: "Ciencias Económicas",
        degree: "Administración de Empresas",
        subject: "Gerencia Estratégica",
        email: "sofia.torres@ud.edu.co",
        rating: 4.9,
        reviews: 150
    },
    {
        name: "Dr. Javier Castro",
        faculty: "Artes",
        degree: "Arquitectura",
        subject: "Diseño Urbano",
        email: "javier.castro@ud.edu.co",
        rating: 4.1,
        reviews: 55
    },
    {
        name: "Dra. Laura Vargas",
        faculty: "Ciencias de la Salud",
        degree: "Medicina",
        subject: "Fisiología Humana",
        email: "laura.vargas@ud.edu.co",
        rating: 4.7,
        reviews: 200
    },
    {
        name: "Dr. Ricardo Jiménez",
        faculty: "Derecho",
        degree: "Ciencias Políticas",
        subject: "Derecho Constitucional",
        email: "ricardo.jimenez@ud.edu.co",
        rating: 4.4,
        reviews: 90
    },
    {
        name: "Dra. Carolina Díaz",
        faculty: "Educación",
        degree: "Pedagogía Infantil",
        subject: "Desarrollo Cognitivo",
        email: "carolina.diaz@ud.edu.co",
        rating: 4.8,
        reviews: 115
    },
    {
        name: "Dr. Andrés Herrera",
        faculty: "Ciencias Agrícolas",
        degree: "Agronomía",
        subject: "Fertilidad de Suelos",
        email: "andres.herrera@ud.edu.co",
        rating: 4.2,
        reviews: 70
    },
    {
        name: "Dra. Gabriela López",
        faculty: "Ingeniería",
        degree: "Ingeniería Civil",
        subject: "Mecánica de Suelos",
        email: "gabriela.lopez@ud.edu.co",
        rating: 4.5,
        reviews: 130
    },
    {
        name: "Dr. Fernando Silva",
        faculty: "Ciencias",
        degree: "Química",
        subject: "Química Orgánica",
        email: "fernando.silva@ud.edu.co",
        rating: 4.7,
        reviews: 160
    },
    {
        name: "Dra. Valeria Morales",
        faculty: "Comunicación",
        degree: "Comunicación Social",
        subject: "Teorías de la Comunicación",
        email: "valeria.morales@ud.edu.co",
        rating: 4.9,
        reviews: 180
    }
];

export async function POST() {
    try {
        const client = await getMongoClient();
        const db = client.db();

        // Clear existing teachers
        await db.collection("teachers").deleteMany({});

        // Insert new teachers
        const result = await db.collection("teachers").insertMany(sampleTeachers);

        return NextResponse.json({
            success: true,
            message: `Successfully inserted ${result.insertedCount} teachers`
        });
    } catch (error) {
        console.error('Error seeding teachers:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to seed teachers' },
            { status: 500 }
        );
    }
} 
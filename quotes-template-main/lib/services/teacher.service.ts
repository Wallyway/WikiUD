import { getMongoClient } from '../db'
import { buildAccentInsensitiveRegex } from '../string-utils'
import { Teacher, TeacherService, TeacherSearchParams } from '@/types/teacher'

export class TeacherServiceImpl implements TeacherService {
    private async getDb() {
        const client = await getMongoClient()
        return client.db()
    }

    async searchTeachers(params: TeacherSearchParams): Promise<Teacher[]> {
        const { name = '', faculty = '', page = 1, limit = 9 } = params
        const skip = (page - 1) * limit

        const db = await this.getDb()
        const query: any = {}

        if (name.trim()) {
            // Permitir búsqueda por palabras en cualquier orden
            const words = name.trim().split(/\s+/);
            query.$and = words.map(word => ({
                name: { $regex: buildAccentInsensitiveRegex(word), $options: 'i' }
            }));
        }

        if (faculty.trim()) {
            query.faculty = { $regex: buildAccentInsensitiveRegex(faculty), $options: 'i' }
        }

        // Optimizar la consulta con proyección para solo obtener los campos necesarios
        const teachers = await db.collection("teachers")
            .find(query, {
                projection: {
                    _id: 1,
                    name: 1,
                    faculty: 1,
                    degree: 1,
                    subject: 1,
                    email: 1,
                    rating: 1,
                    reviews: 1
                }
            })
            .skip(skip)
            .limit(limit)
            .toArray()

        // Transform MongoDB documents to Teacher objects
        return teachers.map(teacher => ({
            _id: teacher._id.toString(),
            name: teacher.name,
            faculty: teacher.faculty,
            degree: teacher.degree,
            subject: teacher.subject,
            email: teacher.email,
            rating: teacher.rating,
            reviews: teacher.reviews
        }))
    }

    // Método para obtener múltiples profesores por IDs (útil para batch operations)
    async getTeachersByIds(ids: string[]): Promise<Teacher[]> {
        if (ids.length === 0) return []

        const db = await this.getDb()
        const objectIds = ids.map(id => new (require('mongodb').ObjectId)(id))

        const teachers = await db.collection("teachers")
            .find({ _id: { $in: objectIds } }, {
                projection: {
                    _id: 1,
                    name: 1,
                    faculty: 1,
                    degree: 1,
                    subject: 1,
                    email: 1,
                    rating: 1,
                    reviews: 1
                }
            })
            .toArray()

        return teachers.map(teacher => ({
            _id: teacher._id.toString(),
            name: teacher.name,
            faculty: teacher.faculty,
            degree: teacher.degree,
            subject: teacher.subject,
            email: teacher.email,
            rating: teacher.rating,
            reviews: teacher.reviews
        }))
    }

    // Método para actualizar estadísticas de múltiples profesores en batch
    async updateTeachersStats(teacherIds: string[]): Promise<void> {
        if (teacherIds.length === 0) return

        const db = await this.getDb()
        const { ObjectId } = require('mongodb')

        // Obtener todos los comentarios para estos profesores en una sola consulta
        const objectIds = teacherIds.map(id => new ObjectId(id))
        const allComments = await db.collection('comments')
            .find({ teacherId: { $in: objectIds } })
            .toArray()

        // Agrupar comentarios por profesor
        const commentsByTeacher: Record<string, any[]> = allComments.reduce((acc: Record<string, any[]>, comment: any) => {
            const teacherId = comment.teacherId.toString()
            if (!acc[teacherId]) acc[teacherId] = []
            acc[teacherId].push(comment)
            return acc
        }, {})

        // Actualizar estadísticas de cada profesor
        const updateOperations = teacherIds.map(teacherId => {
            const comments = commentsByTeacher[teacherId] || []
            const reviews = comments.length
            const avgRating = reviews
                ? parseFloat((comments.reduce((a: number, c: any) => a + (c.rating || 0), 0) / reviews).toFixed(2))
                : 0

            return {
                updateOne: {
                    filter: { _id: new ObjectId(teacherId) },
                    update: { $set: { rating: avgRating, reviews } }
                }
            }
        })

        // Ejecutar todas las actualizaciones en una sola operación
        if (updateOperations.length > 0) {
            await db.collection('teachers').bulkWrite(updateOperations)
        }
    }
} 
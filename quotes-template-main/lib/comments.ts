import { getMongoClient } from '../lib/db'
import { ObjectId } from 'mongodb'

// CRUD operations for comments
export const createComment = async (userId: string, teacherId: string, content: string) => {
  const client = await getMongoClient()
  const db = client.db()
  const newComment = {
    userId,
    teacherId,
    content,
    likes: 0, // Initialize likes to 0
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const result = await db.collection("comments").insertOne(newComment)
  const insertedComment = await db.collection("comments").findOne({ _id: result.insertedId })
  return insertedComment
}

export const getProfessors = async (filters: { faculty?: string, degree?: string, name?: string, subject?: string }, skip: number = 0, limit: number = 10) => {
  const client = await getMongoClient()
  const db = client.db()
  const matchStage: any = {}

  if (filters.faculty) {
    matchStage['faculty'] = { $regex: filters.faculty, $options: 'i' }
  }
  if (filters.degree) {
    matchStage['degree'] = { $regex: filters.degree, $options: 'i' }
  }
  if (filters.name) {
    matchStage['name'] = { $regex: filters.name, $options: 'i' }
  }
  if (filters.subject) {
    matchStage['subject'] = { $regex: filters.subject, $options: 'i' }
  }

  const professors = await db.collection("teachers").find(matchStage).skip(skip).limit(limit).toArray()
  return professors
}

export const getComments = async (teacherId: string, skip: number = 0, limit: number = 10) => {
  const client = await getMongoClient()
  const db = client.db()
  const comments = await db.collection("comments").aggregate([
    { $match: { teacherId } },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        content: 1,
        likes: 1,
        createdAt: 1,
        updatedAt: 1,
        'user.name': 1,
        'user.image': 1
      }
    },
    { $skip: skip },
    { $limit: limit }
  ]).toArray()
  return comments
}

export const updateComment = async (userId: string, commentId: string, content: string) => {
  const client = await getMongoClient()
  const db = client.db()
  const comment = await db.collection("comments").findOne({ _id: new ObjectId(commentId) })

  if (comment?.userId !== userId) {
    throw new Error('You can only update your own comments')
  }

  const result = await db.collection("comments").updateOne(
    { _id: new ObjectId(commentId) },
    { $set: { content, updatedAt: new Date() } }
  )
  return result.modifiedCount > 0
}

export const deleteComment = async (userId: string, commentId: string) => {
  const client = await getMongoClient()
  const db = client.db()
  const comment = await db.collection("comments").findOne({ _id: new ObjectId(commentId) })

  if (comment?.userId !== userId) {
    throw new Error('You can only delete your own comments')
  }

  const result = await db.collection("comments").deleteOne({ _id: new ObjectId(commentId) })
  return result.deletedCount > 0
}
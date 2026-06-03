import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

let client
let db

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

export async function GET() {
  const db = await connectToMongo()

  await db.collection('leaderboard_stats').updateMany(
    {},
    {
      $set: {
        monthly: {
          admissions: 0,
          revenue: 0,
          points: 0
        }
      }
    }
  )

  return NextResponse.json({
    ok: true,
    message: 'Monthly leaderboard reset'
  })
}
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

export async function GET(request) {

  const secret = new URL(request.url).searchParams.get("secret")

  if (secret !== process.env.RESET_SECRET) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    )
  }
  const db = await connectToMongo()

  await db.collection('leaderboard_stats').updateMany(
    {},
    {
      $set: {
        weekly: {
          admissions: 0,
          revenue: 0,
          points: 0
        }
      }
    }
  )

  return NextResponse.json({
    ok: true,
    message: 'Weekly leaderboard reset'
  })
}
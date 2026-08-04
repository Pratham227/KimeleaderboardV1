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
      {
        ok: false,
        error: "Unauthorized"
      },
      {
        status: 401
      }
    )
  }

  const db = await connectToMongo()

  // ==========================
  // Find Quarterly Winner
  // ==========================

  const winner = await db
    .collection("leaderboard_stats")
    .find({})
    .sort({
      "quarterly.points": -1
    })
    .limit(1)
    .next()

  // ==========================
  // Award Triple Crown Trophy
  // ==========================

  if (winner && winner.email) {

    await db.collection("profile_achievements").updateOne(

      {
        email: winner.email.toLowerCase()
      },

      {
        $inc: {
          "trophies.tripleCrown.wins": 1
        },

        $set: {
          "trophies.tripleCrown.lastWon": new Date(),
          updatedAt: new Date()
        },

        $setOnInsert: {
          email: winner.email.toLowerCase(),

          trophies: {
            podiumTopper: {
              wins: 0,
              lastWon: null
            }
          },

          badges: {
            fastStarter: false,
            firestorm: false,
            consistencyStar: false,
            finisher: false
          }
        }
      },

      {
        upsert: true
      }

    )

  }

  // ==========================
  // Reset Quarterly Leaderboard
  // ==========================

  await db.collection("leaderboard_stats").updateMany(

    {},

    {
      $set: {
        quarterly: {
          admissions: 0,
          revenue: 0,
          points: 0
        }
      }

    }

  )

  return NextResponse.json({

    ok: true,

    winner: winner?.email || null,

    message: "Quarterly leaderboard reset successfully"

  })

}
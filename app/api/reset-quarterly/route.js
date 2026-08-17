import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

let client
let db


// =====================================================
// CONNECT TO MONGODB
// =====================================================

async function connectToMongo() {

  if (!client) {

    client = new MongoClient(
      process.env.MONGO_URL
    )

    await client.connect()

    db = client.db(
      process.env.DB_NAME
    )
  }

  return db
}


// =====================================================
// SEND NOTIFICATION TO EVERY COUNSELOR
// =====================================================

async function createNotificationForAll(
  db,
  title,
  message,
  type,
  redirect = "profile"
) {

  const counselors = await db
    .collection("leaderboard_stats")
    .find(
      {
        email: {
          $exists: true,
          $ne: ""
        }
      },
      {
        projection: {
          email: 1
        }
      }
    )
    .toArray()


  if (!counselors.length) {
    return
  }


  // Remove duplicate emails

  const uniqueEmails = [
    ...new Set(
      counselors
        .map(item =>
          item.email
            ?.trim()
            .toLowerCase()
        )
        .filter(Boolean)
    )
  ]


  if (!uniqueEmails.length) {
    return
  }


  const notifications =
    uniqueEmails.map(email => ({

      title,

      message,

      type,

      targetEmail: email,

      redirect,

      read: false,

      createdAt: new Date()

    }))


  await db
    .collection("notifications")
    .insertMany(
      notifications
    )
}


// =====================================================
// QUARTERLY RESET
// =====================================================

export async function GET(request) {

  try {

    // =================================================
    // SECURITY
    // =================================================

    const secret =
      new URL(request.url)
        .searchParams
        .get("secret")


    if (
      secret !==
      process.env.RESET_SECRET
    ) {

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


    const db =
      await connectToMongo()


    // =================================================
    // FIND QUARTERLY WINNER
    // =================================================

    const winner =
      await db
        .collection("leaderboard_stats")
        .find(
          {
            email: {
              $exists: true,
              $ne: ""
            }
          }
        )
        .sort({
          "quarterly.points": -1
        })
        .limit(1)
        .next()


    // =================================================
    // AWARD TRIPLE CROWN
    // =================================================

    if (
      winner &&
      winner.email
    ) {

      const winnerEmail =
        winner.email
          .trim()
          .toLowerCase()


      // -----------------------------------------------
      // Award Triple Crown Trophy
      // -----------------------------------------------

      await db
        .collection(
          "profile_achievements"
        )
        .updateOne(

          {
            email: winnerEmail
          },

          {

            $inc: {
              "trophies.tripleCrown.wins": 1
            },

            $set: {

              "trophies.tripleCrown.lastWon":
                new Date(),

              updatedAt:
                new Date()

            },

            $setOnInsert: {

              email:
                winnerEmail,

              trophies: {

                podiumTopper: {
                  wins: 0,
                  lastWon: null
                },

                tripleCrown: {
                  wins: 1,
                  lastWon: new Date()
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


      // -----------------------------------------------
      // Notify EVERY COUNSELOR
      // -----------------------------------------------

      await createNotificationForAll(

        db,

        "Triple Crown",

        `${winner.name || winner.email} became the Quarterly Champion and earned the Triple Crown Trophy.`,

        "triple-crown",

        "profile"

      )

    }


    // =================================================
    // RESET QUARTERLY LEADERBOARD
    // =================================================

    await db
      .collection(
        "leaderboard_stats"
      )
      .updateMany(

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


    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json({

      ok: true,

      winner:
        winner?.email || null,

      message:
        "Quarterly leaderboard reset successfully"

    })


  } catch (error) {

    console.error(
      "Quarterly reset error:",
      error
    )


    return NextResponse.json(

      {
        ok: false,
        error:
          "Quarterly reset failed"
      },

      {
        status: 500
      }

    )

  }

}
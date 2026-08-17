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

  // Get all counselor emails from leaderboard_stats
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
// MONTHLY RESET
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
    // FIND FINAL MONTHLY TOP 3
    // =================================================

    const topThree =
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
          "monthly.points": -1
        })
        .limit(3)
        .toArray()


    const winner =
      topThree[0]


    // =================================================
    // AWARD PODIUM TOPPER
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
      // Award trophy
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
              "trophies.podiumTopper.wins": 1
            },

            $set: {

              "trophies.podiumTopper.lastWon":
                new Date(),

              updatedAt:
                new Date()

            },

            $setOnInsert: {

              email:
                winnerEmail,

              trophies: {

                podiumTopper: {
                  wins: 1,
                  lastWon: new Date()
                },

                tripleCrown: {
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


      // -----------------------------------------------
      // Notify EVERY counselor
      // -----------------------------------------------

      await createNotificationForAll(

        db,

        "Podium Topper",

        `${winner.name || winner.email} received the Podium Topper Trophy for finishing #1 on the Monthly Leaderboard.`,

        "podium-topper",

        "profile"

      )

    }


    // =================================================
    // FINAL MONTHLY TOP 3
    // =================================================

    for (
      let i = 0;
      i < topThree.length;
      i++
    ) {

      const employee =
        topThree[i]


      if (
        !employee ||
        !employee.email
      ) {
        continue
      }


      await createNotificationForAll(

        db,

        "Monthly Leaderboard",

        `${employee.name || employee.email} finished #${i + 1} on the Monthly Leaderboard.`,

        "monthly-top3",

        "profile"

      )

    }


    // =================================================
    // RESET MONTHLY LEADERBOARD
    // =================================================

    await db
      .collection(
        "leaderboard_stats"
      )
      .updateMany(

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


    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json({

      ok: true,

      winner:
        winner?.email || null,

      topThree:
        topThree.map(
          (employee, index) => ({

            rank: index + 1,

            email:
              employee.email,

            name:
              employee.name || null

          })
        ),

      message:
        "Monthly leaderboard reset successfully"

    })


  } catch (error) {

    console.error(
      "Monthly reset error:",
      error
    )


    return NextResponse.json(

      {
        ok: false,
        error:
          "Monthly reset failed"
      },

      {
        status: 500
      }

    )

  }

}
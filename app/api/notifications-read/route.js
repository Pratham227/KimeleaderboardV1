import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

let client;
let db;

async function connectDB() {

  if (!client) {

    client = new MongoClient(process.env.MONGO_URL);

    await client.connect();

    db = client.db(process.env.DB_NAME);

  }

  return db;

}

export async function POST(request) {

  const body = await request.json()

  const db = await connectDB()

  await db.collection("notifications").updateMany(

    {

      targetEmail: body.email,

      read: false

    },

    {

      $set: {

        read: true

      }

    }

  )

  return NextResponse.json({

    success: true

  })

}



import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

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

// Get notifications for logged in user
export async function GET(request) {

  const email = new URL(request.url).searchParams.get("email")

  const db = await connectDB()

  const list = await db
    .collection("notifications")
    .find({
      targetEmail: email
    })
    .sort({
      createdAt: -1
    })
    .toArray()

  return NextResponse.json({
    success: true,
    notifications: list
  })

}

// Create notification
export async function POST(request) {

  const body = await request.json();

  const db = await connectDB();

  await db.collection("notifications").insertOne({
    title: body.title,
    message: body.message,
    type: body.type,
    targetEmail: body.targetEmail,
    section: body.section,
    read: false,
    createdAt: new Date()
  });

  return NextResponse.json({
    success: true
  });

}
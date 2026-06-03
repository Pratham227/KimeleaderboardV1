import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()

    const result = await db.collection('leaderboard_stats').updateMany(
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
      message: 'Quarterly leaderboard reset successfully',
      modifiedCount: result.modifiedCount
    })
  } catch (error) {
    console.error('Quarterly reset error:', error)

    return NextResponse.json(
      {
        ok: false,
        error: error.message
      },
      { status: 500 }
    )
  }
}
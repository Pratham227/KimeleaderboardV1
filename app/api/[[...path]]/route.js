import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import {
  EMPLOYEES_RAW,
  DEFAULT_PASSWORD,
  findEmployeeByEmail,
  categoryForEmployee,
  computeTenure
} from '@/lib/employees'

// MongoDB connection (lazy)
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

function handleCORS(response) {
  response.headers.set(
    'Access-Control-Allow-Origin',
    process.env.CORS_ORIGINS || '*'
  )
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  )
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, x-api-key'
  )
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// ---------------- AUTH HELPERS ----------------
const SALT = 'kime-salt-2026'

function hashPwd(email, password) {
  return crypto
    .createHash('sha256')
    .update(`${email.toLowerCase()}:${password}:${SALT}`)
    .digest('hex')
}

async function getStoredPasswordRecord(db, email) {
  return db
    .collection('user_passwords')
    .findOne({ email: email.toLowerCase() })
}

async function verifyPassword(db, email, password) {
  const record = await getStoredPasswordRecord(db, email)

  if (record && record.passwordHash) {
    return record.passwordHash === hashPwd(email, password)
  }

  // fallback default password
  return password === DEFAULT_PASSWORD
}

async function upsertPassword(db, email, password) {
  await db.collection('user_passwords').updateOne(
    { email: email.toLowerCase() },
    {
      $set: {
        email: email.toLowerCase(),
        passwordHash: hashPwd(email, password),
        updatedAt: new Date()
      }
    },
    { upsert: true }
  )
}

// ---------------- ROUTE HANDLER ----------------
async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()

    // ROOT
    if ((route === '/' || route === '/root') && method === 'GET') {
      return handleCORS(
        NextResponse.json({ message: 'KIME API Running Successfully' })
      )
    }

    // ---------------- LOGIN ----------------
    if (route === '/auth/login' && method === 'POST') {
      const body = await request.json().catch(() => ({}))

      const email = (body.email || '').trim().toLowerCase()
      const password = body.password || ''

      if (!email || !password) {
        return handleCORS(
          NextResponse.json(
            { ok: false, error: 'Email and password are required' },
            { status: 400 }
          )
        )
      }

      const employee = findEmployeeByEmail(email)

      if (!employee) {
        return handleCORS(
          NextResponse.json(
            { ok: false, error: 'No employee found with this email' },
            { status: 404 }
          )
        )
      }

      const ok = await verifyPassword(db, email, password)

      if (!ok) {
        return handleCORS(
          NextResponse.json(
            { ok: false, error: 'Incorrect password' },
            { status: 401 }
          )
        )
      }

      const token = uuidv4()

      await db.collection('sessions').insertOne({
        token,
        email,
        createdAt: new Date()
      }).catch(() => {})

      return handleCORS(
        NextResponse.json({
          ok: true,
          token,
          user: {
            name: employee.name,
            email: employee.email,
            branch: employee.branch,
            lead: employee.lead,
            designation: employee.designation,
            tenure: computeTenure(employee),
            role: employee.isAdmin
              ? 'Admin'
              : categoryForEmployee(employee),
            isAdmin: !!employee.isAdmin
          }
        })
      )
    }

    // ---------------- FORGOT PASSWORD ----------------
    if (route === '/auth/forgot-password' && method === 'POST') {
      const body = await request.json().catch(() => ({}))

      const email = (body.email || '').trim().toLowerCase()
      const oldPassword = body.oldPassword || ''
      const newPassword = body.newPassword || ''
      const confirmPassword = body.confirmPassword || ''

      if (!email || !oldPassword || !newPassword || !confirmPassword) {
        return handleCORS(
          NextResponse.json(
            { ok: false, error: 'All fields are required' },
            { status: 400 }
          )
        )
      }

      if (newPassword !== confirmPassword) {
        return handleCORS(
          NextResponse.json(
            { ok: false, error: 'Passwords do not match' },
            { status: 400 }
          )
        )
      }

      const employee = findEmployeeByEmail(email)

      if (!employee) {
        return handleCORS(
          NextResponse.json(
            { ok: false, error: 'No employee found with this email' },
            { status: 404 }
          )
        )
      }

      const ok = await verifyPassword(db, email, oldPassword)

      if (!ok) {
        return handleCORS(
          NextResponse.json(
            { ok: false, error: 'Old password incorrect' },
            { status: 401 }
          )
        )
      }

      await upsertPassword(db, email, newPassword)

      return handleCORS(
        NextResponse.json({
          ok: true,
          message: 'Password updated successfully'
        })
      )
    }

    // ---------------- EMPLOYEES ----------------
    if (route === '/employees' && method === 'GET') {
      const list = EMPLOYEES_RAW
        .filter(emp => !emp.isAdmin)
        .map(emp => ({
          ...emp,
          tenure: computeTenure(emp),
          role: categoryForEmployee(emp)
        }))

      return handleCORS(
        NextResponse.json({
          ok: true,
          employees: list
        })
      )
    }
    // ---------------- LEADERBOARD ----------------
    if (route === '/leaderboard' && method === 'GET') {

  // 1. Fetch live stats from MongoDB
      const stats = await db
        .collection('leaderboard_stats')
        .find({})
        .toArray()

  // 2. Convert DB rows into fast lookup map
      const statsMap = {}

      stats.forEach((row) => {
        statsMap[row.email.toLowerCase()] = row
      })

  // 3. Merge all employees with DB stats
      const merged = EMPLOYEES_RAW
       .filter(emp => !emp.isAdmin)
       .map((emp) => {

         const live = statsMap[emp.email.toLowerCase()] || {}

         const admissions = Number(live.admissions || 0)
         const revenue = Number(live.revenue || 0)

         const points =
          admissions * 100 +
          Math.floor(revenue / 1000)

         return {
          name: emp.name,
          email: emp.email,
          branch: emp.branch || '',
          lead: emp.lead || '',
          designation: emp.designation || '',
          admissions,
          revenue,
          points,
          role: categoryForEmployee(emp),
          tenure: computeTenure(emp),
          movement: 0,
          streak: 0,
          winRate: 0,
          initials: emp.name
            .split(' ')
            .map(x => x[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
         }
       })

  // 4. Sort by points
     merged.sort((a, b) => b.points - a.points)

  // 5. Add ranks
     const finalData = merged.map((item, index) => ({
       ...item,
       id: index + 1,
       rank: index + 1,
       displayRank: index + 1
     }))

     return handleCORS(
       NextResponse.json({
         ok: true,
        data: finalData
      })
    )
  }
   
    // ===================================================
    // SUPERLEAP WEBHOOK
    // POST /api/superleap/webhook
    // ===================================================
    if (route === '/superleap/webhook' && method === 'POST') {
      const apiKey = request.headers.get('x-api-key')

      if (apiKey !== process.env.SUPERLEAP_API_KEY) {
        return handleCORS(
          NextResponse.json(
            { ok: false, error: 'Unauthorized' },
            { status: 401 }
          )
        )
      }

      const body = await request.json().catch(() => ({}))

      const email = (body.email || '').trim().toLowerCase()
      const totalAdmissions = Math.max(0, Number(body.totalAdmissions || 0))
      const revenue = Math.max(0, Number(body.revenue || 0))

      if (!email) {
        return handleCORS(
          NextResponse.json(
            { ok: false, error: 'Email required' },
            { status: 400 }
          )
        )
      }

      const employee = findEmployeeByEmail(email)

      if (!employee) {
        return handleCORS(
          NextResponse.json(
            { ok: false, error: 'Employee not found' },
            { status: 404 }
          )
        )
      }

      // Points Formula
      // Add new values to previous values
      await db.collection('leaderboard_stats').updateOne(
        { email: email.toLowerCase() },
        {
          $inc: {
            admissions: totalAdmissions,
            revenue: revenue
          },
          $set: {
            email: email.toLowerCase(),
            name: employee.name,
            branch: employee.branch,
            lead: employee.lead,
           updatedAt: new Date()
         }
        },
      { upsert: true }
      )

// Get latest row
      const updated = await db.collection('leaderboard_stats').findOne({ email })

// Recalculate total points
      const points =
         Number(updated.admissions || 0) * 100 +
         Math.floor(Number(updated.revenue || 0) / 1000)

// Save points
      await db.collection('leaderboard_stats').updateOne(
        { email },
        {
          $set: { points }
        }
      )
       

      return handleCORS(
        NextResponse.json({
          ok: true,
          message: 'Leaderboard updated successfully',
          data: {
            email,
            admissions: updated.admissions,
            revenue: updated.revenue,
            points
          }
        })
      )
    }

    // ---------------- NOT FOUND ----------------
    return handleCORS(
      NextResponse.json(
        { error: `Route ${route} not found` },
        { status: 404 }
      )
    )
  } catch (error) {
    console.error('API Error:', error)

    return handleCORS(
      NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    )
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute


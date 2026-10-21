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


function getWeekNumber(date) {

  const temp = new Date(date)
  temp.setHours(0,0,0,0)
  temp.setDate(temp.getDate() + 4 - (temp.getDay() || 7))
  const yearStart = new Date(temp.getFullYear(),0,1)
  return Math.ceil((((temp - yearStart) / 86400000) + 1)/7)
}
function emptyPeriodStats() {
  return {
    admissions: 0,
    revenue: 0,
    points: 0,
  }
}

function getSeasonKey(date = new Date()) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  // April 1 to September 30
  if (month >= 4 && month <= 9) {
    return `${year}-04`
  }

  // October 1 to March 31
  if (month >= 10) {
    return `${year}-10`
  }

  return `${year - 1}-10`
}
function normalizeName(value = '') {
  return String(value).trim().toLowerCase().replace(/\s+/g, ' ')
}

function employeeIsVP(employee) {
  return String(employee?.teamRole || '').toUpperCase() === 'VP' ||
    String(employee?.designation || '').toUpperCase() === 'VP'
}

function employeeMatchesVertical(employee, vertical) {
  if (!vertical || vertical === 'ALL') return true

  if (employeeIsVP(employee)) {
    const teamVerticals = Array.isArray(employee.teamVerticals)
      ? employee.teamVerticals.map(v => String(v).trim().toUpperCase())
      : [String(employee.vertical || 'DLP').trim().toUpperCase()]

    return teamVerticals.includes(vertical)
  }

  return String(employee.vertical || 'DLP').trim().toUpperCase() === vertical
}

function reportsTo(employee, manager) {
  const managerName = normalizeName(employee?.managerName)
  const fullName = normalizeName(manager?.name)
  const firstName = fullName.split(' ')[0]

  return Boolean(
    managerName &&
    (managerName === fullName || managerName === firstName)
  )
}

function getEmployeePeriodStats(employee, statsMap, period, currentSeasonKey) {
  const live = statsMap[normalizeName(employee.email)] || {}
  let data = {}

  if (period.toLowerCase() === 'weekly') data = live.weekly || {}
  else if (period.toLowerCase() === 'monthly') data = live.monthly || {}
  else if (period.toLowerCase() === 'quarterly') data = live.quarterly || {}
  else if (period.toLowerCase() === 'season') {
    data = live.seasonKey === currentSeasonKey ? (live.season || {}) : {}
  }
  else if (period.toLowerCase() === 'lifetime') data = live.lifetime || {}
  else data = live.monthly || {}

  const admissions = Number(data.admissions || 0)
  const revenue = Number(data.revenue || 0)

  return {
    admissions,
    revenue,
    points: admissions * 100 + Math.floor(revenue / 1000),
  }
}

function getDescendants(manager, allEmployees) {
  const found = new Map()
  const queue = [manager]

  while (queue.length) {
    const parent = queue.shift()

    for (const employee of allEmployees) {
      const email = normalizeName(employee.email)

      if (email === normalizeName(manager.email) || found.has(email)) continue

      if (reportsTo(employee, parent)) {
        found.set(email, employee)
        queue.push(employee)
      }
    }
  }

  return [...found.values()]
}

function addStats(left, right) {
  return {
    admissions: left.admissions + right.admissions,
    revenue: left.revenue + right.revenue,
    points: left.points + right.points,
  }
}
async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}
async function createNotification(
  db,
  title,
  message,
  type,
  targetEmail,
  section = "profile"
) {
  await db.collection("notifications").insertOne({
    title,
    message,
    type,
    targetEmail,
    section,
    read: false,
    createdAt: new Date()
  })
}
async function createNotificationForAll(
  db,
  title,
  message,
  type,
  profileEmail,
  section = "profile"
) {
  const counselors = EMPLOYEES_RAW.filter(
    employee => !employee.isAdmin
  )

  if (!counselors.length) return

  const notifications = counselors.map(employee => ({
    title,
    message,
    type,
    targetEmail: employee.email.toLowerCase(),
    profileEmail: profileEmail
      ? profileEmail.toLowerCase()
      : null,
    section,
    read: false,
    createdAt: new Date()
  }))

  await db
    .collection("notifications")
    .insertMany(notifications)
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
            gender: employee.gender,
            lead: employee.lead,
            designation: employee.designation,
            vertical: employee.vertical || 'DLP',
            teamRole: employee.teamRole || '',
            managerName: employee.managerName || '',
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
      const { searchParams } = new URL(request.url)
      const period = searchParams.get('period') || 'Monthly'
      const requestedVertical = (
         searchParams.get('vertical') || 'ALL'
       ).trim().toUpperCase()

      const currentSeasonKey = getSeasonKey(new Date())
  // 1. Fetch live stats from MongoDB
      const stats = await db
        .collection('leaderboard_stats')
        .find({})
        .toArray() 
      const achievements = await db
       .collection("profile_achievements")
       .find({})
       .toArray()

      const achievementMap = {}

      achievements.forEach(item => {

        achievementMap[item.email.toLowerCase()] = item

      })
      

  // 2. Convert DB rows into fast lookup map
      const statsMap = {}

      stats.forEach((row) => {
        statsMap[row.email.toLowerCase()] = row
      })

  // 3. Merge all employees with DB stats
      const allEmployees = EMPLOYEES_RAW.filter(
        emp => !emp.isAdmin && emp.active !== false
      )

       const visibleEmployees = allEmployees.filter(
         emp => employeeMatchesVertical(emp, requestedVertical)
       )

       const merged = visibleEmployees.map(emp => {
         const ownStats = getEmployeePeriodStats(
           emp, statsMap, period, currentSeasonKey
          )

         const isManager =
           employeeIsVP(emp) ||
           ['ASSISTANT_MANAGER', 'SENIOR_MANAGER'].includes(
             String(emp.teamRole || '').toUpperCase()
            )

         const descendants = isManager
           ? getDescendants(emp, allEmployees).filter(member =>
              employeeMatchesVertical(
               member,
               requestedVertical === 'ALL' ? 'ALL' : requestedVertical
              )
             )
           : []

          const teamStats = descendants.reduce(
            (total, member) =>
              addStats(
               total,
               getEmployeePeriodStats(member, statsMap, period, currentSeasonKey)
              ),
               emptyPeriodStats()
           )

          const displayedStats = isManager
            ? addStats(ownStats, teamStats)
            : ownStats

          return {
             name: emp.name,
             email: emp.email,
             gender: emp.gender,
             branch: emp.branch || '',
             lead: emp.lead || '',
             designation: emp.designation || '',

             admissions: displayedStats.admissions,
             revenue: displayedStats.revenue,
             points: displayedStats.points,

             ownStats,
             teamStats: isManager ? teamStats : emptyPeriodStats(),

             role: categoryForEmployee(emp),
             tenure: computeTenure(emp),
             vertical: emp.vertical || 'DLP',
             teamVerticals: emp.teamVerticals || undefined,
             teamRole: emp.teamRole || '',
             managerName: emp.managerName || '',

             movement: 0,
             streak: 0,
             winRate: 0,

             initials: emp.name
               .split(' ')
               .map(x => x[0])
               .join('')
               .toUpperCase()
               .slice(0, 2),

            achievements:
              achievementMap[normalizeName(emp.email)] || {
                trophies: {},
                badges: {},
              },
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
   // ---------------- PROFILE ----------------
   if (route === '/profile' && method === 'GET') {

     const { searchParams } = new URL(request.url)

     const email = (searchParams.get('email') || '')
       .trim()
       .toLowerCase()

     if (!email) {
       return handleCORS(
         NextResponse.json(
           {
            ok: false,
            error: 'Email is required'
           },
          { status: 400 }
         )
       )
     }

  // Find employee
      const employee = findEmployeeByEmail(email)

      if (!employee) {
        return handleCORS(
          NextResponse.json(
            {
             ok: false,
             error: 'Counsellor not found'
            },
            { status: 404 }
          )
        )
      }

  // Get lifetime/stat data
      const stats = await db
        .collection('leaderboard_stats')
        .findOne({ email })
  
   // Calculate Lifetime Rank
  // ==========================

  const allLifetimeStats = await db
    .collection('leaderboard_stats')
    .find(
      {},
      {
        projection: {
          email: 1,
          'lifetime.points': 1
        }
      }
    )
    .toArray()


  const rankedLifetime = allLifetimeStats

    .map(item => ({
      email: item.email?.toLowerCase(),
      points: Number(
        item.lifetime?.points || 0
      )
    }))

    .sort(
      (a, b) => b.points - a.points
    )


  const lifetimeRank =
    rankedLifetime.findIndex(
      item => item.email === email
    ) + 1


  // Get achievement data
      const achievements = await db
       .collection('profile_achievements')
       .findOne({ email })

      const lifetime = stats?.lifetime || {
        admissions: 0,
        revenue: 0,
        points: 0
      }

      const admissionHistory = stats?.admissionHistory || []

      const profile = {
        name: employee.name,
        email: employee.email,
        gender: employee.gender,
        branch: employee.branch || '',
        lead: employee.lead || '',
        designation: employee.designation || '',

        role: categoryForEmployee(employee),
        tenure: computeTenure(employee),

        lifetime: {
          admissions: Number(lifetime.admissions || 0),
          revenue: Number(lifetime.revenue || 0),
          points: Number(lifetime.points || 0)
        },
        // Lifetime Global Rank

        rank: lifetimeRank > 0
          ? lifetimeRank
          : null,

        admissionHistory,

        achievements: achievements || {}
      }

      return handleCORS(
        NextResponse.json({
          ok: true,
          profile
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
      const now = new Date()

      const admissionDate = body.admissionDate
      const effectiveDate = admissionDate
      ? new Date(admissionDate)
      : now

      const isSameWeek = (d1, d2) => {
        const onejan = new Date(d1.getFullYear(), 0, 1)
        const week1 = Math.ceil((((d1 - onejan) / 86400000) + onejan.getDay() + 1) / 7)
        const week2 = Math.ceil((((d2 - onejan) / 86400000) + onejan.getDay() + 1) / 7)
        return week1 === week2 && d1.getFullYear() === d2.getFullYear()
      }

      const isSameMonth = (d1, d2) =>
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear()

      const getQuarter = d => Math.floor(d.getMonth() / 3)

      const isSameQuarter = (d1, d2) =>
        getQuarter(d1) === getQuarter(d2) &&
        d1.getFullYear() === d2.getFullYear()

      let existing = await db.collection('leaderboard_stats').findOne({ email })
      

      // ✅ STEP 1: SAFE INITIALIZATION
      if (!existing) {
        existing = { email }
      }

      existing.weekly = existing.weekly || { admissions: 0, revenue: 0, points: 0 }
      existing.monthly = existing.monthly || { admissions: 0, revenue: 0, points: 0 }
      existing.quarterly = existing.quarterly || { admissions: 0, revenue: 0, points: 0 }
      existing.lifetime = existing.lifetime || { admissions: 0, revenue: 0, points: 0}
      existing.season = existing.season || emptyPeriodStats()
      // Admission History
      existing.admissionHistory = existing.admissionHistory || []
        // 🔥 RESET LOGIC (ADD THIS BLOCK HERE)
      

     const currentWeek =
     `${effectiveDate.getFullYear()}-${getWeekNumber(effectiveDate)}`

     const currentMonth =
      `${effectiveDate.getFullYear()}-${effectiveDate.getMonth() + 1}`

     const currentQuarter =
      `${effectiveDate.getFullYear()}-${Math.floor(effectiveDate.getMonth()/3) + 1}`

     const currentSeason = getSeasonKey(effectiveDate)

// Initialize if missing
     if (!existing.weekKey) existing.weekKey = currentWeek
     if (!existing.monthKey) existing.monthKey = currentMonth
     if (!existing.quarterKey) existing.quarterKey = currentQuarter
     if (!existing.seasonKey) {
      existing.seasonKey = currentSeason
     }
// 🔥 RESET BASED ON PERIOD CHANGE (NOT TIME)
     if (existing.weekKey !== currentWeek) {
      existing.weekly = { admissions: 0, revenue: 0, points: 0 }
      existing.weekKey = currentWeek
     }

    if (existing.monthKey !== currentMonth) {
      existing.monthly = { admissions: 0, revenue: 0, points: 0 }
      existing.monthKey = currentMonth
    }

    // Only reset quarterly when NEW quarter starts
    if (!existing.quarterKey) {
      existing.quarterKey = currentQuarter
    }

// reset ONLY when quarter actually changes
    if (existing.quarterKey !== currentQuarter) {
      existing.quarterly = { admissions: 0, revenue: 0, points: 0 }
      existing.quarterKey = currentQuarter
    }
    if (existing.seasonKey !== currentSeason) {
      existing.season = emptyPeriodStats()
      existing.seasonKey = currentSeason
    }
    const oldTopThree = await db
      .collection('leaderboard_stats')
      .find(
        {
         email: {
           $exists: true,
           $ne: ''
         }
        },
       {
         projection: {
           email: 1,
           'monthly.points': 1
         }
       }
      )
      .sort({
       'monthly.points': -1
      })
      .limit(3)
      .toArray()

    const oldTopThreeEmails = oldTopThree
     .map(item =>
       item.email?.trim().toLowerCase()
      )
     .filter(Boolean)

    const wasAlreadyTopThree =
      oldTopThreeEmails.includes(email)


      
      

      

      existing.weekly.admissions += totalAdmissions
      existing.weekly.revenue += revenue

      existing.monthly.admissions += totalAdmissions
      existing.monthly.revenue += revenue

      existing.quarterly.admissions += totalAdmissions
      existing.quarterly.revenue += revenue

      existing.season.admissions += totalAdmissions
      existing.season.revenue += revenue 

      existing.lifetime.admissions += totalAdmissions
      existing.lifetime.revenue += revenue
      for (let i = 0; i < totalAdmissions; i++) {

        existing.admissionHistory.push({

         date: effectiveDate.toISOString(),

         revenue: revenue / Math.max(totalAdmissions, 1),

         createdAt: new Date()

        })

       }

      const calcPoints = (a, r) => Math.floor(r / 1000) + a * 100

      existing.weekly.points = calcPoints(existing.weekly.admissions, existing.weekly.revenue)
      existing.monthly.points = calcPoints(existing.monthly.admissions, existing.monthly.revenue)
      existing.quarterly.points = calcPoints(existing.quarterly.admissions, existing.quarterly.revenue)
      existing.season.points = calcPoints(
        existing.season.admissions,
        existing.season.revenue
      )
      existing.lifetime.points = calcPoints(existing.lifetime.admissions, existing.lifetime.revenue)
      existing.vertical = employee.vertical || 'DLP'
      existing.updatedAt = now

      await db.collection('leaderboard_stats').updateOne(
        { email: email},
        { $set: existing },
        { upsert: true }
      )
      const newTopThree = await db
        .collection('leaderboard_stats')
        .find(
          {
          email: {
            $exists: true,
            $ne: ''
          }
         },
         {
          projection: {
            email: 1,
            'monthly.points': 1
          }
         }
        )
        .sort({
          'monthly.points': -1
        })
        .limit(3)
        .toArray()


      const newRankIndex = newTopThree.findIndex(
        item =>
         item.email?.trim().toLowerCase() === email
       )


      const newRank =
        newRankIndex === -1
          ? null
          : newRankIndex + 1


// =====================================================
// COUNSELOR ENTERED MONTHLY TOP 3
// =====================================================

      if (
       !wasAlreadyTopThree &&
       newRank !== null &&
       newRank <= 3
      ) {

         await createNotificationForAll(

         db,

        "Monthly Top 3",

        `${employee.name} has entered the Top 3 on the Monthly Leaderboard at #${newRank}.`,

         "monthly-top3-entry",
         employee.email,

         "profile"

        )
      }
       
      const lifetimeAdmissions = existing.lifetime.admissions

      const admissionMilestones = [
        10,
        25,
        50,
        100,
        200
      ]

      for (const milestone of admissionMilestones) {

         if (lifetimeAdmissions >= milestone) {

           const alreadySent =
             await db.collection("notifications").findOne({

               targetEmail: email,

               type: "admission-club",

               message: {
                 $regex: `${milestone}`
              }

            })

            if (!alreadySent) {

              await createNotificationForAll(

                db,

                "🎖 Admission Club",

                `${employee.name} has entered the ${milestone} Admissions Club.`,

                "admission-club",

                
                email,
                "admission-club"

              )

            }

         }

       }
       const lifetimeRevenue = existing.lifetime.revenue

       const revenueMilestones = [
         1000000,   //10L
         2500000,   //25L
         5000000,   //50L
         10000000,  //1Cr
         20000000   //2Cr
        ]

       for (const milestone of revenueMilestones) {

         if (lifetimeRevenue >= milestone) {

          const alreadySent =
            await db.collection("notifications").findOne({

              targetEmail: email,

              type: "revenue-club",

              message: {
                $regex: `${milestone}`
              }

            })

          if (!alreadySent) {

            await createNotificationForAll(

            db,

            "Revenue Club",

            `${employee.name} entered the ₹${(milestone/100000).toFixed(0)}L Revenue Club.`,

            "revenue-club",

             
             email,
             "revenue-club"

             )

           }

          }

        }
       const profile =
       await db.collection("profile_achievements").findOne({
           email
       })

       if(profile){

          if (profile?.badges?.firestorm) {

            const alreadySent =
              await db.collection("notifications").findOne({
                 targetEmail: email,
                 type: "hall-glory",
                 message: {
                    $regex: "Firestorm Badge"
                  }
               })

          if (!alreadySent) {

             await createNotificationForAll(
               db,
               "Hall of Glory",
               `${employee.name} earned the Firestorm Badge.`,
                "hall-glory",
                email,
                "hall"
              )

           }

         } 

          if (profile?.badges?.fastStarter) {

            const alreadySent =
              await db.collection("notifications").findOne({
                targetEmail: email,
                type: "hall-glory",
                message: {
                     $regex: "Fast Starter Badge"
                 }
               })

            if (!alreadySent) {

              await createNotificationForAll(
                db,
                "Hall of Glory",
                `${employee.name} earned the Fast Starter Badge.`,
                "hall-glory",
                email,
                "hall"
             )

            }

          }

          if (profile?.badges?.finisher) {

            const alreadySent =
              await db.collection("notifications").findOne({
                targetEmail: email,
                type: "hall-glory",
                message: {
                   $regex: "Finisher Badge"
               }
              })

            if (!alreadySent) {

               await createNotificationForAll(
                  db,
                  "Hall of Glory",
                  `${employee.name} earned the Finisher Badge.`,
                  "hall-glory",
                  email,
                  "hall"
                )

            }

          }

         if (profile?.badges?.consistencyStar) {

           const alreadySent =
              await db.collection("notifications").findOne({
                targetEmail: email,
                type: "hall-glory",
                message: {
                  $regex: "Consistency Star Badge"
                }
               })

            if (!alreadySent) {

               await createNotificationForAll(
                  db,
                  "Hall of Glory",
                  `${employee.name} earned the Consistency Star Badge.`,
                  "hall-glory",
                  email,
                  "hall"
               )

             }

           }

      }
      return handleCORS(
        NextResponse.json({
          ok: true,
          message: 'Leaderboard updated successfully',
          data: {
            email,
            admissions: existing.monthly.admissions,
            revenue: existing.monthly.revenue,
            points: existing.monthly.points,
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


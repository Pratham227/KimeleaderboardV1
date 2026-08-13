'use client'

import { motion } from 'framer-motion'
import { Award } from 'lucide-react'

export default function TrophyCabinet({ lifetimeData }) {

  // =====================================================
  // ACHIEVEMENTS
  // =====================================================

  // Profile API normally returns:
  //
  // {
  //   lifetime: {...},
  //   achievements: {
  //     trophies: {...},
  //     badges: {...}
  //   }
  // }
  //
  // This fallback also supports achievements being nested
  // inside another profile object.
  // =====================================================

  const achievements =
    lifetimeData?.achievements ||
    lifetimeData?.profile?.achievements ||
    {
      trophies: {},
      badges: {}
    }

  const trophies = achievements?.trophies || {}
  const badges = achievements?.badges || {}

  const items = []


  // =====================================================
  // TROPHIES
  // =====================================================

  // Podium Topper
  if (Number(trophies?.podiumTopper?.wins || 0) > 0) {

    items.push({
      id: 'podium_topper',
      name: 'Podium Topper',
      image: '/trophies/podium-topper.png',
      type: 'trophy',
      wins: Number(
        trophies.podiumTopper.wins || 0
      )
    })

  }


  // Triple Crown
  if (Number(trophies?.tripleCrown?.wins || 0) > 0) {

    items.push({
      id: 'triple_crown',
      name: 'Triple Crown',
      image: '/trophies/triple-crown.png',
      type: 'trophy',
      wins: Number(
        trophies.tripleCrown.wins || 0
      )
    })

  }


  // =====================================================
  // BADGES
  // =====================================================

  // Fast Starter
  if (badges?.fastStarter === true) {

    items.push({
      id: 'fast_starter',
      name: 'Fast Starter',
      image: '/badges/fast-starter.png',
      type: 'badge'
    })

  }


  // Firestorm
  if (badges?.firestorm === true) {

    items.push({
      id: 'firestorm',
      name: 'Firestorm',
      image: '/badges/firestorm.png',
      type: 'badge'
    })

  }


  // Consistency Star
  if (badges?.consistencyStar === true) {

    items.push({
      id: 'consistency_star',
      name: 'Consistency Star',
      image: '/badges/consistency-star.png',
      type: 'badge'
    })

  }


  // Finisher
  if (badges?.finisher === true) {

    items.push({
      id: 'finisher',
      name: 'Finisher',
      image: '/badges/finisher.png',
      type: 'badge'
    })

  }


  return (

    <div className="glass-strong rounded-3xl border border-white/10 p-7">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center gap-3 mb-8">

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg">

          <Award
            size={30}
            className="text-white"
          />

        </div>


        <div>

          <h2 className="text-3xl font-black text-white">
            Hall of Glory
          </h2>

          <p className="text-white/50 text-sm">
            Trophies & Achievement Badges earned throughout your journey
          </p>

        </div>

      </div>


      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {items.length === 0 && (

        <div className="py-14 text-center">

          <Award
            size={70}
            className="mx-auto text-yellow-400/40 mb-5"
          />

          <h3 className="text-white text-xl font-bold">
            No Achievements Yet
          </h3>

          <p className="text-white/40 mt-2">
            Start climbing the leaderboard to unlock trophies and badges.
          </p>

        </div>

      )}


      {/* =====================================================
          ACHIEVEMENT CABINET
      ===================================================== */}

      {items.length > 0 && (

        <div className="flex flex-wrap gap-6">

          {items.map((item, index) => (

            <motion.div
              key={item.id}

              initial={{
                opacity: 0,
                scale: 0.9
              }}

              whileInView={{
                opacity: 1,
                scale: 1
              }}

              transition={{
                delay: index * 0.05
              }}

              whileHover={{
                y: -8,
                scale: 1.06
              }}

              className="relative w-[150px]"
            >

              <div
                className={`
                  relative
                  h-[200px]
                  rounded-3xl
                  overflow-hidden
                  border
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  bg-gradient-to-b

                  ${
                    item.type === 'trophy'
                      ? 'from-yellow-500/20 via-yellow-400/5 to-transparent border-yellow-500/40 hover:border-yellow-300 shadow-[0_0_35px_rgba(255,193,7,.25)]'
                      : 'from-fuchsia-500/15 via-blue-500/5 to-transparent border-fuchsia-500/30 hover:border-fuchsia-400 shadow-[0_0_30px_rgba(168,85,247,.25)]'
                  }
                `}
              >

                {/* Glow */}

                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />


                {/* Image */}

                <div className="flex justify-center mt-6">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-contain drop-shadow-[0_0_18px_rgba(255,255,255,.35)]"
                  />

                </div>


                {/* Name */}

                <div className="mt-5 px-3 text-center">

                  <h3 className="text-white font-bold text-sm leading-5">
                    {item.name}
                  </h3>

                </div>


                {/* Trophy Wins */}

                {item.type === 'trophy' &&
                  item.wins > 1 && (

                    <div className="absolute top-3 right-3">

                      <div className="px-2 py-1 rounded-full bg-yellow-400 text-black text-xs font-black">

                        ×{item.wins}

                      </div>

                    </div>

                  )}

              </div>

            </motion.div>

          ))}

        </div>

      )}


      {/* =====================================================
          HALL OF GLORY GUIDE
      ===================================================== */}

      <div className="mt-8 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/5 to-transparent px-6 py-4">

        <span className="font-display text-lg text-cyan-300 font-black uppercase">

          Hall of Glory Guide

        </span>


        <div className="mt-3 text-sm text-white/75 leading-8">


          <span className="text-yellow-400 font-bold">
            Podium Topper
          </span>

          — Awarded for finishing

          <span className="text-yellow-300 font-bold">
            {' '}#1 on the Monthly Leaderboard.
          </span>


          <br />


          <span className="text-yellow-400 font-bold">
            Triple Crown
          </span>

          — Awarded for becoming the

          <span className="text-yellow-300 font-bold">
            {' '}Quarterly Champion.
          </span>


          <br />


          <span className="text-fuchsia-400 font-bold">
            Fast Starter
          </span>

          — Highest admissions during the

          <span className="text-fuchsia-300 font-bold">
            {' '}first 7 days of the month.
          </span>


          <br />


          <span className="text-fuchsia-400 font-bold">
            Finisher
          </span>

          — Highest admissions during the

          <span className="text-fuchsia-300 font-bold">
            {' '}final 7 days of the month.
          </span>


          <br />


          <span className="text-fuchsia-400 font-bold">
            Consistency Star
          </span>

          — Maintain

          <span className="text-fuchsia-300 font-bold">
            {' '}at least 2 admissions every week.
          </span>


          <br />


          <span className="text-fuchsia-400 font-bold">
            Firestorm
          </span>

          — Close

          <span className="text-fuchsia-300 font-bold">
            {' '}5 admissions in a single day.
          </span>


        </div>

      </div>

    </div>

  )
}


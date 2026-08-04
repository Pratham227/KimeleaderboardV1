'use client'

import { motion } from 'framer-motion'
import { Award } from 'lucide-react'


export default function TrophyCabinet({ lifetimeData }) {

  const achievements =
    lifetimeData?.achievements || {
      trophies: {},
      badges: {}
    }

  const items = []
                       
  // ==========================
  // TROPHIES
  // ==========================

  if (achievements.trophies?.podiumTopper?.wins > 0) {
    items.push({
      id: 'podium_topper',
      name: 'Podium Topper',
      image: '/trophies/podium-topper.png',
      type: 'trophy',
      wins: achievements.trophies.podiumTopper.wins
    })
  }

  if (achievements.trophies?.tripleCrown?.wins > 0) {
    items.push({
      id: 'triple_crown',
      name: 'Triple Crown',
      image: '/trophies/triple-crown.png',
      type: 'trophy',
      wins: achievements.trophies.tripleCrown.wins
    })
  }

  // ==========================
  // BADGES
  // ==========================

  if (achievements.badges?.fastStarter) {
    items.push({
      id: 'fast_starter',
      name: 'Fast Starter',
      image: '/badges/fast-starter.png',
      type: 'badge'
    })           
  }

  if (achievements.badges?.firestorm) {
    items.push({
      id: 'firestorm',
      name: 'Firestorm',
      image: '/badges/firestorm.png',
      type: 'badge'
    })
  }

  if (achievements.badges?.consistencyStar) {
    items.push({
      id: 'consistency_star',
      name: 'Consistency Star',
      image: '/badges/consistency-star.png',
      type: 'badge'
    })
  }

  if (achievements.badges?.finisher) {
    items.push({
      id: 'finisher',
      name: 'Finisher',
      image: '/badges/finisher.png',
      type: 'badge'
    })
  }

  return (

    <div className="glass-strong rounded-3xl border border-white/10 p-7">

      {/* Header */}

      <div className="flex items-center gap-3 mb-8">

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg">

          <Award size={30} className="text-white" />

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

      {/* Empty */}

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

      {/* Cabinet */}

      {items.length > 0 && (

        <div className="flex flex-wrap gap-6">

          {items.map((item, index) => (

            <motion.div

              key={item.id}

              initial={{ opacity: 0, scale: .9 }}

              whileInView={{ opacity: 1, scale: 1 }}

              transition={{ delay: index * .05 }}

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

                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />

                <div className="flex justify-center mt-6">

                  <img

                    src={item.image}

                    alt={item.name}

                    className="w-24 h-24 object-contain drop-shadow-[0_0_18px_rgba(255,255,255,.35)]"

                  />

                </div>    

                <div className="mt-5 px-3 text-center">

                  <h3 className="text-white font-bold text-sm leading-5">

                    {item.name}

                  </h3>

                </div>

                {item.type === 'trophy' && item.wins > 1 && (

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

    </div>

  )

}


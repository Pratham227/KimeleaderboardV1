'use client'

import { motion } from 'framer-motion'
import { BadgeIndianRupee } from 'lucide-react'

const BADGES = [
  {
    milestone: 1000000, // ₹10L
    image: '/revenue/10l.png',
    label: '₹10L'
  },
  {
    milestone: 2500000, // ₹25L
    image: '/revenue/25l.png',
    label: '₹25L'
  },
  {
    milestone: 5000000, // ₹50L
    image: '/revenue/50l.png',
    label: '₹50L'
  },
  {
    milestone: 10000000, // ₹1Cr
    image: '/revenue/1cr.png',
    label: '₹1Cr'
  },
  {
    milestone: 20000000, // ₹2Cr
    image: '/revenue/2cr.png',
    label: '₹2Cr'
  }
]

export default function RevenueClub({ lifetimeData }) {

  // ==========================================
  // Get lifetime statistics
  //
  // API structure:
  //
  // lifetimeData.lifetime.revenue
  //
  // Also supports direct lifetimeData.revenue
  // ==========================================

  const lifetime =
    lifetimeData?.lifetime ||
    lifetimeData ||
    {}

  const totalRevenue =
    Number(lifetime.revenue || 0)


  // ==========================================
  // Find all earned revenue badges
  // ==========================================

  const earnedBadges = BADGES.filter(
    badge => totalRevenue >= badge.milestone
  )


  return (

    <div className="glass-strong rounded-3xl border border-emerald-500/20 p-6">


      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex items-center gap-3 mb-6">

        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">

          <BadgeIndianRupee
            className="text-white"
            size={24}
          />

        </div>


        <div>

          <h2 className="text-2xl font-black text-white">
            Revenue Club
          </h2>

          <p className="text-white/50 text-sm">
            Lifetime Revenue Milestones
          </p>

        </div>

      </div>


      {/* ==========================================
          NO BADGES
      ========================================== */}

      {earnedBadges.length === 0 ? (

        <div className="text-center py-10 text-white/40">

          No Revenue Milestones Yet

        </div>

      ) : (


        /* ==========================================
           EARNED BADGES
        ========================================== */

        <div className="flex flex-wrap gap-4">

          {earnedBadges.map((badge, index) => (

            <motion.div
              key={badge.milestone}

              initial={{
                opacity: 0,
                y: 20
              }}

              whileInView={{
                opacity: 1,
                y: 0
              }}

              transition={{
                delay: index * 0.05
              }}

              whileHover={{
                y: -6,
                scale: 1.05
              }}

              className="w-24"
            >

              <img
                src={badge.image}
                alt={badge.label}
                className="w-24 h-24 object-contain"
              />

              <div className="mt-2 text-center text-xs text-white">

                {badge.label}

              </div>

            </motion.div>

          ))}

        </div>

      )}

    </div>

  )
}
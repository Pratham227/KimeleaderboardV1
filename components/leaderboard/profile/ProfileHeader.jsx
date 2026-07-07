'use client'

import {
  Crown,
  Shield,
  Trophy,
  Star
} from 'lucide-react'

export default function ProfileHeader({
  currentUser,
  lifetimeData
}) {

  const isFemale =
    currentUser?.name?.toLowerCase().includes('isha') ||
    currentUser?.name?.toLowerCase().includes('shruti') ||
    currentUser?.name?.toLowerCase().includes('mansi')

  return (
    <div className="relative overflow-hidden rounded-3xl border border-fuchsia-500/20 bg-gradient-to-br from-[#0c0f2a] via-[#12081f] to-[#08142f] p-8">

      <div className="absolute top-0 right-0 w-72 h-72 bg-fuchsia-500/20 blur-[120px]" />

      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">

        {/* Avatar */}

        <div className="relative">

          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-fuchsia-500 via-violet-500 to-blue-500 p-1">

            <div className="w-full h-full rounded-full bg-[#05050f] flex items-center justify-center text-6xl">
              {isFemale ? '👩' : '👨'}
            </div>

          </div>

          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-bold">
            LEVEL {(lifetimeData?.admissions || 0) + 1}
          </div>

        </div>

        {/* User Info */}

        <div className="flex-1">

          <div className="flex items-center gap-3 flex-wrap">

            <h1 className="text-4xl font-black text-white">
              {currentUser?.name}
            </h1>

            <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500 text-amber-300 text-xs font-bold">
              {currentUser?.role}
            </div>

          </div>

          <p className="text-white/50 mt-2">
            {currentUser?.designation}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

            <div className="glass rounded-xl p-3">
              <div className="text-xs text-white/50">
                Global Rank
              </div>
              <div className="text-2xl font-black text-amber-300">
                #{lifetimeData?.rank || '-'}
              </div>
            </div>

            <div className="glass rounded-xl p-3">
              <div className="text-xs text-white/50">
                Lifetime Points
              </div>
              <div className="text-2xl font-black gradient-text-cyber">
                {lifetimeData?.points || 0}
              </div>
            </div>

            <div className="glass rounded-xl p-3">
              <div className="text-xs text-white/50">
                Admissions
              </div>
              <div className="text-2xl font-black text-emerald-400">
                {lifetimeData?.admissions || 0}
              </div>
            </div>

            <div className="glass rounded-xl p-3">
              <div className="text-xs text-white/50">
                Revenue
              </div>
              <div className="text-2xl font-black text-fuchsia-300">
                ₹{((lifetimeData?.revenue || 0)/100000).toFixed(1)}L
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}
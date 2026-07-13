'use client'

import AvatarFrame from './AvatarFrame'

export default function ProfileHeader({
  currentUser,
  lifetimeData
}) {

  const level = (lifetimeData?.admissions || 0) + 1

  return (
    <div className="relative overflow-hidden rounded-3xl border border-fuchsia-500/20 bg-gradient-to-br from-[#0c0f2a] via-[#12081f] to-[#08142f] p-8">

      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-fuchsia-500/20 blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/20 blur-[120px]" />

      <div className="relative z-10 grid lg:grid-cols-[280px_1fr] gap-10 items-center">

        {/* Avatar Section */}
        <div className="flex justify-center">

          <AvatarFrame
            gender={lifetimeData?.gender || currentUser?.gender}
            role={currentUser?.role}
            level={level}
          />

        </div>

        {/* Right Side */}
        <div>

          <div className="flex flex-wrap items-center gap-3">

            <h1 className="text-4xl md:text-5xl font-black text-white">
              {currentUser?.name}
            </h1>

            <div className="px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-black uppercase tracking-wider">
              {currentUser?.role}
            </div>

          </div>

          <p className="text-white/50 mt-3 text-lg">
            {currentUser?.designation}
          </p>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="glass rounded-2xl p-4 border border-white/10">
              <div className="text-xs text-white/50 uppercase tracking-wider">
                Global Rank
              </div>

              <div className="text-3xl font-black text-amber-300 mt-2">
                #{lifetimeData?.rank || '-'}
              </div>
            </div>

            <div className="glass rounded-2xl p-4 border border-white/10">
              <div className="text-xs text-white/50 uppercase tracking-wider">
                Lifetime Points
              </div>

              <div className="text-3xl font-black gradient-text-cyber mt-2">
                {lifetimeData?.points || 0}
              </div>
            </div>

            <div className="glass rounded-2xl p-4 border border-white/10">
              <div className="text-xs text-white/50 uppercase tracking-wider">
                Admissions
              </div>

              <div className="text-3xl font-black text-emerald-400 mt-2">
                {lifetimeData?.admissions || 0}
              </div>
            </div>

            <div className="glass rounded-2xl p-4 border border-white/10">
              <div className="text-xs text-white/50 uppercase tracking-wider">
                Revenue
              </div>

              <div className="text-3xl font-black text-fuchsia-300 mt-2">
                ₹{((lifetimeData?.revenue || 0) / 100000).toFixed(1)}L
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
} 






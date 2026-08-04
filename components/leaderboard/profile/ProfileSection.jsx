'use client'

import ProfileHeader from './ProfileHeader'
import LifetimeStats from './LifetimeStats'
import TrophyCabinet from './TrophyCabinet'
import AdmissionClub from './AdmissionClub'
import RevenueClub from './RevenueClub'
export default function ProfileSection({
  currentUser,
  lifetimeData,
  setTab
}) {
  return (
    <div className="space-y-6">

      <button
        onClick={() => setTab('leaderboard')}
        className="mb-6 px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition"
      >
        ← Back to Leaderboard
      </button>

      <ProfileHeader
        currentUser={currentUser}
        lifetimeData={lifetimeData}
      />

      <LifetimeStats
        lifetimeData={lifetimeData}
      />

      <TrophyCabinet
        lifetimeData={lifetimeData}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <AdmissionClub

          lifetimeData={lifetimeData}

         />

        <RevenueClub

            lifetimeData={lifetimeData}

        />

      </div>

    </div>
  )
}
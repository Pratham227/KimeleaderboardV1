'use client'

export default function TrophyCabinet({
  lifetimeData
}) {

  const trophies = [
    {
      name: 'Monthly Champion',
      icon: '🏆'
    },
    {
      name: 'Quarter King',
      icon: '👑'
    },
    {
      name: 'Revenue Beast',
      icon: '💎'
    },
    {
      name: 'Top Closer',
      icon: '⚡'
    },
    {
      name: 'Legend',
      icon: '🔥'
    },
    {
      name: 'Ballon d’Or',
      icon: '🥇'
    }
  ]

  return (
    <div className="glass-strong rounded-3xl p-6 border border-white/10">

      <h2 className="text-2xl font-black text-white mb-6">
        🏆 Trophy Cabinet
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">

        {trophies.map((trophy) => (
          <div
            key={trophy.name}
            className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-500/10 to-transparent p-5 text-center hover:scale-105 transition"
          >
            <div className="text-5xl">
              {trophy.icon}
            </div>

            <div className="text-xs text-white mt-3">
              {trophy.name}
            </div>
          </div>
        ))}

      </div>

    </div>
  )
}
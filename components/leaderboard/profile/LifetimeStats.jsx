'use client'

import {
  DollarSign,
  Trophy,
  Star,
  Users
} from 'lucide-react'

export default function LifetimeStats({
  lifetimeData
}) {

  const cards = [
    {
      title: 'Lifetime Revenue',
      value: `₹${((lifetimeData?.revenue || 0)/100000).toFixed(1)}L`,
      icon: DollarSign
    },
    {
      title: 'Lifetime Admissions',
      value: lifetimeData?.admissions || 0,
      icon: Users
    },
    {
      title: 'Lifetime Points',
      value: lifetimeData?.points || 0,
      icon: Star
    },
    {
      title: 'Global Rank',
      value: `#${lifetimeData?.rank || '-'}`,
      icon: Trophy
    }
  ]

  return (
    <div className="grid md:grid-cols-4 gap-5">

      {cards.map((card) => {

        const Icon = card.icon

        return (
          <div
            key={card.title}
            className="glass-strong rounded-2xl p-6 border border-white/10 hover:border-fuchsia-500/40 transition"
          >
            <Icon
              className="text-fuchsia-400 mb-4"
              size={24}
            />

            <div className="text-white/50 text-sm">
              {card.title}
            </div>

            <div className="text-3xl font-black text-white mt-2">
              {card.value}
            </div>

          </div>
        )
      })}

    </div>
  )
}
'use client'

import { motion } from 'framer-motion'
import { Medal } from 'lucide-react'

const BADGES = [
  {
    milestone: 1,
    image: '/admission/1.png',
    label: '1 Admission'
  },
  {
    milestone: 10,
    image: '/admission/10.png',
    label: '10 Admissions'
  },
  {
    milestone: 25,
    image: '/admission/25.png',
    label: '25 Admissions'
  },
  {
    milestone: 50,
    image: '/admission/50.png',
    label: '50 Admissions'
  },
  {
    milestone: 100,
    image: '/admission/100.png',
    label: '100 Admissions'
  },
  {
    milestone: 200,
    image: '/admission/200.png',
    label: '200 Admissions'
  }
]

export default function AdmissionClub({ lifetimeData }) {

  const totalAdmissions = lifetimeData?.admissions || 0

  const earnedBadges = BADGES.filter(
    badge => totalAdmissions >= badge.milestone
  )

  return (

    <div className="glass-strong rounded-3xl border border-cyan-500/20 p-6">

      <div className="flex items-center gap-3 mb-6">

        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">

          <Medal className="text-white" size={24}/>

        </div>

        <div>

          <h2 className="text-2xl font-black text-white">

            Admission Club

          </h2>

          <p className="text-white/50 text-sm">

            Lifetime Admission Milestones

          </p>

        </div>

      </div>

      {earnedBadges.length === 0 ? (

        <div className="text-center text-white/40 py-10">

          No Admission Milestones Yet

        </div>

      ) : (

        <div className="flex flex-wrap gap-4">

          {earnedBadges.map((badge,index)=>(

            <motion.div

              key={badge.milestone}

              initial={{opacity:0,y:20}}

              whileInView={{opacity:1,y:0}}

              transition={{delay:index*.05}}

              whileHover={{

                y:-6,

                scale:1.05

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
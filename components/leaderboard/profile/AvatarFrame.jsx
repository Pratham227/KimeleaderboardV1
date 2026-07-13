'use client'

import { Crown, Sparkles } from 'lucide-react'

export default function AvatarFrame({
  gender,
  role,
  level = 1
}) {

  const avatar =
    gender === 'female'
      ? '/avatars/female-avatar.png'
      : '/avatars/male-avatar.png'

  const roleColor =
    role === 'King'
      ? 'from-amber-400 via-yellow-500 to-orange-500'
      : role === 'Prince'
      ? 'from-fuchsia-500 via-violet-500 to-purple-600'
      : 'from-sky-400 via-blue-500 to-indigo-600'

  return (
    <div className="relative flex flex-col items-center">

      {/* Background Glow */}
      <div className="absolute w-60 h-60 rounded-full bg-fuchsia-500/20 blur-[100px]" />

      {/* Floating Particles */}
      <div className="absolute top-4 left-4">
        <Sparkles
          size={18}
          className="text-fuchsia-400 animate-pulse"
        />
      </div>

      <div className="absolute top-10 right-6">
        <Sparkles
          size={14}
          className="text-blue-400 animate-pulse"
        />
      </div>

      {/* Avatar Ring */}
      <div
        className={`relative w-52 h-52 rounded-full p-[5px] bg-gradient-to-r ${roleColor} shadow-[0_0_50px_rgba(168,85,247,0.5)]`}
      >

        {/* Crown */}
        {role === 'King' && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">

            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-xl">

              <Crown
                size={24}
                className="text-black"
              />

            </div>

          </div>
        )}

        {/* Inner Circle */}
        <div className="w-full h-full rounded-full bg-[#05050f] overflow-hidden">

          <img
            src={avatar}
            alt="avatar"
            className="w-full h-full object-cover"
          />

        </div>

      </div>

      {/* Role Badge */}
      <div className="absolute bottom-8">

        <div
          className={`px-5 py-2 rounded-full bg-gradient-to-r ${roleColor} text-white font-black text-sm shadow-xl`}
        >
          {role}
        </div>

      </div>

      {/* Level Badge */}
      <div className="absolute -bottom-4">

        <div className="px-6 py-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-sm shadow-xl">

          LEVEL {level}

        </div>

      </div>

    </div>
  )
}
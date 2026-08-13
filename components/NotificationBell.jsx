'use client'

import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NotificationBell({ currentUser }) {

  const router = useRouter()
  
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    loadNotifications()
  }, [])

  async function loadNotifications() {

    const res = await fetch(
      `/api/notifications?email=${currentUser?.email}`
    )

    const data = await res.json()

    setNotifications(data.notifications || [])

  }
  async function markAllRead() {

    await fetch("/api/notifications-read", {

      method: "POST",

      headers: {

         "Content-Type": "application/json"

       },

       body: JSON.stringify({

       email: currentUser.email

     })

    })

    setNotifications(prev =>

      prev.map(n => ({

        ...n,

        read: true

     }))

    )

  }

  async function openNotification(notification) {

    await fetch("/api/notifications-read",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        id:notification._id
      })
    })

    setOpen(false)

    router.push(
      `/profile?email=${notification.targetEmail}&section=${notification.section}`
    )

  }

  const unread = notifications.filter(n=>!n.read).length

  return (

    <div className="relative">

      <button

      onClick={async ()=>{

        const next = !open

        setOpen(next)

        if(next){

          await markAllRead()

        }

      }}

      className="relative p-2 rounded-xl glass hover:bg-white/10 transition"


      >

        <Bell
          size={16}
          className="text-white/80"
        />

        {unread>0 && (

          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 text-[10px] flex items-center justify-center font-bold text-white">

            {unread > 99 ? "99+" : unread}
            
          </span>

        )}

      </button>

      {open && (

        <div className="absolute right-0 mt-3 w-[360px] rounded-3xl border border-white/10 glass-strong backdrop-blur-xl overflow-hidden shadow-2xl z-50">

          <div className="px-5 py-4 border-b border-white/10">

            <h3 className="text-white font-bold text-lg">

              Notifications

            </h3>

          </div>

          <div className="max-h-[420px] overflow-y-auto">

            {notifications.length===0 && (

              <div className="p-8 text-center text-white/40">

                No Notifications

              </div>

            )}

            {notifications.map(notification=>(

              <button

                key={notification._id}

                onClick={()=>openNotification(notification)}

                className={`

                w-full

                text-left

                px-5

                py-4

                transition

                border-b

                border-white/5

                hover:bg-white/5

                ${!notification.read ? "bg-fuchsia-500/10" : ""}

                `}

              >

                <div className="font-semibold text-white">

                  {notification.title}

                </div>

                <div className="text-sm text-white/60 mt-1">

                  {notification.message}

                </div>

              </button>

            ))}

          </div>

        </div>

      )}

    </div>

  )

}
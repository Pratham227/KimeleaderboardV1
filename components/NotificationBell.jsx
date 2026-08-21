'use client'

import { useEffect, useState } from 'react'
import {
  Bell,
  Trophy,
  Medal,
  Crown,
  BadgeIndianRupee,
  Flame,
  Target,
  ChevronRight,
  CheckCheck,
  Sparkles
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NotificationBell({ currentUser }) {

  const router = useRouter()

  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  useEffect(() => {

    if (!currentUser?.email) return

    loadNotifications()

  }, [currentUser?.email])


  async function loadNotifications() {

    try {

      setLoading(true)

      const res = await fetch(
        `/api/notifications?email=${encodeURIComponent(
          currentUser?.email || ''
        )}`,
        {
          cache: 'no-store'
        }
      )

      const data = await res.json()

      setNotifications(data.notifications || [])

    } catch (error) {

      console.error(
        'Failed to load notifications:',
        error
      )

    } finally {

      setLoading(false)

    }

  }


  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  async function markAllRead() {

    if (!currentUser?.email) return

    try {

      await fetch(
        '/api/notifications-read',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: currentUser.email
          })
        }
      )

      setNotifications(prev =>
        prev.map(notification => ({
          ...notification,
          read: true
        }))
      )

    } catch (error) {

      console.error(
        'Failed to mark notifications as read:',
        error
      )

    }

  }


  // =====================================================
  // OPEN SINGLE NOTIFICATION
  // =====================================================

  async function openNotification(notification) {

    try {

      await fetch(
        '/api/notifications-read',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: notification._id
          })
        }
      )

    } catch (error) {

      console.error(
        'Failed to mark notification as read:',
        error
      )

    }


    // Update locally immediately

    setNotifications(prev =>
      prev.map(item =>
        item._id === notification._id
          ? {
              ...item,
              read: true
            }
          : item
      )
    )


    setOpen(false)


    // Support both your old and new notification structure

    const section =
      notification.section ||
      notification.redirect ||
      'profile'


    const profileEmail =
      notification.profileEmail ||
      notification.targetEmail


    if (!profileEmail) {

      router.push('/')

      return

    }


    router.push(
      `/?profileEmail=${encodeURIComponent(
        profileEmail
      )}&section=${encodeURIComponent(section)}`
    )

  }


  // =====================================================
  // UNREAD COUNT
  // =====================================================

  const unread =
    notifications.filter(
      notification => !notification.read
    ).length


  // =====================================================
  // NOTIFICATION TYPE
  // =====================================================

  function getNotificationMeta(notification) {

    const type =
      notification.type?.toLowerCase() || ''

    const title =
      notification.title?.toLowerCase() || ''

    const message =
      notification.message?.toLowerCase() || ''

   
    if (
      type.includes('revenue') ||
      title.includes('revenue') ||
      message.includes('revenue')
    ) {

      return {
        icon: BadgeIndianRupee,
        label: 'REVENUE CLUB',
        iconClass:
          'text-emerald-300',
        boxClass:
          'bg-emerald-500/10 border-emerald-400/20',
        glow:
          'shadow-[0_0_25px_rgba(16,185,129,0.12)]'
      }

    }


    if (
      type.includes('admission') ||
      title.includes('admission') ||
      message.includes('admission')
    ) {

      return {
        icon: Medal,
        label: 'ADMISSION CLUB',
        iconClass:
          'text-cyan-300',
        boxClass:
          'bg-cyan-500/10 border-cyan-400/20',
        glow:
          'shadow-[0_0_25px_rgba(34,211,238,0.12)]'
      }

    }


    if (
      type.includes('triple') ||
      title.includes('triple crown') ||
      message.includes('triple crown')
    ) {

      return {
        icon: Crown,
        label: 'TRIPLE CROWN',
        iconClass:
          'text-yellow-300',
        boxClass:
          'bg-yellow-500/10 border-yellow-400/20',
        glow:
          'shadow-[0_0_25px_rgba(250,204,21,0.14)]'
      }

    }


    if (
      type.includes('podium') ||
      type.includes('top3') ||
      title.includes('podium') ||
      title.includes('top 3') ||
      message.includes('top 3')
    ) {

      return {
        icon: Trophy,
        label: 'MONTHLY TOP 3',
        iconClass:
          'text-orange-300',
        boxClass:
          'bg-orange-500/10 border-orange-400/20',
        glow:
          'shadow-[0_0_25px_rgba(251,146,60,0.14)]'
      }

    }


    if (
      type.includes('hall') ||
      title.includes('hall of glory') ||
      message.includes('badge') ||
      message.includes('trophy')
    ) {

      return {
        icon: Trophy,
        label: 'HALL OF GLORY',
        iconClass:
          'text-fuchsia-300',
        boxClass:
          'bg-fuchsia-500/10 border-fuchsia-400/20',
        glow:
          'shadow-[0_0_25px_rgba(217,70,239,0.14)]'
      }

    }


    if (
      type.includes('fast') ||
      type.includes('firestorm') ||
      type.includes('finisher') ||
      type.includes('consistency')
    ) {

      return {
        icon: Flame,
        label: 'ACHIEVEMENT',
        iconClass:
          'text-pink-300',
        boxClass:
          'bg-pink-500/10 border-pink-400/20',
        glow:
          'shadow-[0_0_25px_rgba(236,72,153,0.14)]'
      }

    }


    return {
      icon: Sparkles,
      label: 'KIME UPDATE',
      iconClass:
        'text-violet-300',
      boxClass:
        'bg-violet-500/10 border-violet-400/20',
      glow:
        'shadow-[0_0_25px_rgba(139,92,246,0.12)]'
    }

  }


  // =====================================================
  // TIME FORMAT
  // =====================================================

  function formatTime(dateValue) {

    if (!dateValue) return ''

    const date =
      new Date(dateValue)

    if (Number.isNaN(date.getTime())) {
      return ''
    }

    const diff =
      Date.now() - date.getTime()


    const seconds =
      Math.floor(diff / 1000)

    if (seconds < 60) {
      return 'Just now'
    }


    const minutes =
      Math.floor(seconds / 60)

    if (minutes < 60) {
      return `${minutes}m ago`
    }


    const hours =
      Math.floor(minutes / 60)

    if (hours < 24) {
      return `${hours}h ago`
    }


    const days =
      Math.floor(hours / 24)

    if (days < 7) {
      return `${days}d ago`
    }


    return date.toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short'
      }
    )

  }


  return (

    <div className="relative">

      {/* =====================================================
          BELL BUTTON
      ===================================================== */}

      <button

        type="button"

        onClick={() =>
          setOpen(prev => !prev)
        }

        aria-label="Notifications"

        className={`
          group
          relative
          flex
          items-center
          justify-center
          w-11
          h-11
          rounded-xl
          border
          transition-all
          duration-300
          ${
            open
              ? 'bg-white/10 border-fuchsia-400/40 shadow-[0_0_22px_rgba(217,70,239,.18)]'
              : 'glass border-white/10 hover:bg-white/10 hover:border-white/20'
          }
        `}

      >

        <Bell

          size={18}

          className={`
            transition-all
            duration-300
            ${
              open
                ? 'text-fuchsia-300'
                : 'text-white/80 group-hover:text-white'
            }
          `}

        />


        {/* Unread indicator */}

        {unread > 0 && (

          <span
            className="
              absolute
              -top-1
              -right-1
              min-w-[18px]
              h-[18px]
              px-1
              rounded-full
              bg-gradient-to-br
              from-fuchsia-500
              to-pink-500
              text-white
              text-[9px]
              font-black
              flex
              items-center
              justify-center
              ring-2
              ring-[#05050f]
              shadow-[0_0_12px_rgba(217,70,239,.55)]
            "
          >

            {unread > 99
              ? '99+'
              : unread}

          </span>

        )}

      </button>


      {/* =====================================================
          NOTIFICATION PANEL
      ===================================================== */}

      {open && (

        <div
          className="
            absolute
            right-0
            top-full
            mt-3
            w-[390px]
            max-w-[calc(100vw-24px)]
            rounded-3xl
            border
            border-white/15
            bg-[#090b18]/95
            backdrop-blur-2xl
            shadow-[0_25px_80px_rgba(0,0,0,.55)]
            overflow-hidden
            z-[100]
          "
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <div
            className="
              relative
              px-5
              py-4
              border-b
              border-white/10
              bg-gradient-to-r
              from-fuchsia-500/10
              via-transparent
              to-cyan-500/10
            "
          >

            <div
              className="
                absolute
                top-0
                left-0
                right-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-fuchsia-400
                to-transparent
                opacity-70
              "
            />


            <div className="flex items-center justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <Bell
                    size={17}
                    className="text-fuchsia-300"
                  />

                  <h3
                    className="
                      text-white
                      font-black
                      text-lg
                    "
                  >
                    Notifications
                  </h3>

                </div>


                <p
                  className="
                    text-white/40
                    text-xs
                    mt-1
                  "
                >
                  Your latest KIME achievements
                </p>

              </div>


              {unread > 0 && (

                <div
                  className="
                    px-2.5
                    py-1
                    rounded-full
                    bg-fuchsia-500/10
                    border
                    border-fuchsia-400/20
                    text-fuchsia-300
                    text-[10px]
                    font-black
                    uppercase
                    tracking-wider
                  "
                >

                  {unread} New

                </div>

              )}

            </div>


            {/* Mark all read */}

            {unread > 0 && (

              <button
                type="button"
                onClick={markAllRead}
                className="
                  mt-3
                  flex
                  items-center
                  gap-1.5
                  text-[11px]
                  text-white/40
                  hover:text-white
                  transition
                "
              >

                <CheckCheck size={13} />

                Mark all as read

              </button>

            )}

          </div>


          {/* =================================================
              LIST
          ================================================= */}

          <div
            className="
              max-h-[500px]
              overflow-y-auto
              scrollbar-thin
              scrollbar-thumb-white/10
              scrollbar-track-transparent
            "
          >

            {loading ? (

              <div className="p-10 text-center">

                <div
                  className="
                    mx-auto
                    w-8
                    h-8
                    rounded-full
                    border-2
                    border-white/10
                    border-t-fuchsia-400
                    animate-spin
                  "
                />

                <p
                  className="
                    mt-3
                    text-xs
                    text-white/40
                  "
                >
                  Loading notifications...
                </p>

              </div>

            ) : notifications.length === 0 ? (

              <div
                className="
                  px-8
                  py-14
                  text-center
                "
              >

                <div
                  className="
                    mx-auto
                    w-16
                    h-16
                    rounded-2xl
                    bg-white/5
                    border
                    border-white/10
                    flex
                    items-center
                    justify-center
                  "
                >

                  <Bell
                    size={27}
                    className="text-white/25"
                  />

                </div>


                <h4
                  className="
                    text-white
                    font-bold
                    mt-5
                  "
                >
                  All caught up
                </h4>


                <p
                  className="
                    text-white/35
                    text-xs
                    mt-2
                    leading-5
                  "
                >
                  New achievements and leaderboard
                  events will appear here.
                </p>

              </div>

            ) : (

              <div>

                {notifications.map(
                  (notification) => {

                    const meta =
                      getNotificationMeta(
                        notification
                      )

                    const Icon =
                      meta.icon


                    return (

                      <button

                        key={notification._id}

                        type="button"

                        onClick={() =>
                          openNotification(
                            notification
                          )
                        }

                        className={`
                          group
                          relative
                          w-full
                          text-left
                          px-5
                          py-4
                          border-b
                          border-white/[0.06]
                          transition-all
                          duration-200
                          hover:bg-white/[0.05]
                          ${
                            !notification.read
                              ? 'bg-fuchsia-500/[0.055]'
                              : ''
                          }
                        `}
                      >

                        {/* Unread side indicator */}

                        {!notification.read && (

                          <div
                            className="
                              absolute
                              left-0
                              top-3
                              bottom-3
                              w-[2px]
                              rounded-r-full
                              bg-gradient-to-b
                              from-fuchsia-400
                              to-cyan-400
                              shadow-[0_0_10px_rgba(217,70,239,.7)]
                            "
                          />

                        )}


                        <div
                          className="
                            flex
                            gap-3
                            items-start
                          "
                        >

                          {/* Event icon */}

                          <div
                            className={`
                              flex
                              shrink-0
                              items-center
                              justify-center
                              w-11
                              h-11
                              rounded-xl
                              border
                              ${meta.boxClass}
                              ${meta.glow}
                              transition-transform
                              duration-200
                              group-hover:scale-105
                            `}
                          >

                            <Icon
                              size={19}
                              className={
                                meta.iconClass
                              }
                            />

                          </div>


                          {/* Content */}

                          <div
                            className="
                              min-w-0
                              flex-1
                            "
                          >

                            <div
                              className="
                                flex
                                items-center
                                justify-between
                                gap-2
                              "
                            >

                              <span
                                className={`
                                  text-[9px]
                                  font-black
                                  tracking-[0.18em]
                                  ${meta.iconClass}
                                `}
                              >
                                {meta.label}
                              </span>


                              {!notification.read && (

                                <span
                                  className="
                                    shrink-0
                                    px-1.5
                                    py-0.5
                                    rounded
                                    bg-fuchsia-500
                                    text-white
                                    text-[8px]
                                    font-black
                                    uppercase
                                  "
                                >
                                  New
                                </span>

                              )}

                            </div>


                            <h4
                              className="
                                text-white
                                font-bold
                                text-sm
                                mt-1.5
                                leading-5
                              "
                            >

                              {notification.title}

                            </h4>


                            <p
                              className="
                                text-white/55
                                text-xs
                                mt-1
                                leading-5
                                line-clamp-2
                              "
                            >

                              {notification.message}

                            </p>


                            <div
                              className="
                                flex
                                items-center
                                justify-between
                                mt-2
                              "
                            >

                              <span
                                className="
                                  text-[10px]
                                  text-white/30
                                "
                              >
                                {formatTime(
                                  notification.createdAt
                                )}
                              </span>


                              <span
                                className="
                                  flex
                                  items-center
                                  gap-1
                                  text-[10px]
                                  text-white/25
                                  group-hover:text-fuchsia-300
                                  transition
                                "
                              >

                                View profile

                                <ChevronRight
                                  size={12}
                                />

                              </span>

                            </div>

                          </div>

                        </div>

                      </button>

                    )

                  }
                )}

              </div>

            )}

          </div>

        </div>

      )}

    </div>

  )

}
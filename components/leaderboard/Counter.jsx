
'use client'
import { useEffect, useState } from 'react'

export default function Counter({ to = 0, duration = 1400, prefix = '', suffix = '', format = 'int' }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let raf
    const start = performance.now()
    const from = 0
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setVal(from + (to - from) * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, duration])

  const formatted = format === 'money'
    ? '₹' + Math.round(val).toLocaleString('en-IN')
    : format === 'compact'
      ? new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(Math.round(val))
      : Math.round(val).toLocaleString('en-IN')

  return <span>{prefix}{formatted}{suffix}</span>
}

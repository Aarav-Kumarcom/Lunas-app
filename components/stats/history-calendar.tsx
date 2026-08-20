'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useStore } from '@/lib/store'
import { toDateKey, todayKey } from '@/lib/date'
import { cn } from '@/lib/utils'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function HistoryCalendar() {
  const { netForDate } = useStore()
  const now = new Date()
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() })

  const first = new Date(view.year, view.month, 1)
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
  const leadingBlanks = first.getDay()
  const today = todayKey()

  const monthLabel = first.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })

  const cells: (string | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) =>
      toDateKey(new Date(view.year, view.month, i + 1)),
    ),
  ]

  function shift(delta: number) {
    setView((v) => {
      const m = v.month + delta
      const d = new Date(v.year, m, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold">{monthLabel}</h2>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label="Previous month"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="Next month"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {WEEKDAYS.map((d, i) => (
          <div
            key={i}
            className="pb-1 text-center text-[11px] font-semibold text-muted-foreground"
          >
            {d}
          </div>
        ))}
        {cells.map((key, i) => {
          if (!key) return <div key={`b-${i}`} />
          const net = netForDate(key)
          const day = Number(key.split('-')[2])
          const isToday = key === today
          const isFuture = key > today
          let tone = 'bg-secondary/50 text-muted-foreground'
          if (net > 0) tone = 'bg-positive/85 text-positive-foreground'
          else if (net < 0) tone = 'bg-destructive/85 text-white'
          else if (isFuture) tone = 'bg-transparent text-muted-foreground/40'
          return (
            <div
              key={key}
              title={`${key}: ${net > 0 ? '+' : ''}${net} coins`}
              className={cn(
                'flex aspect-square flex-col items-center justify-center rounded-lg text-xs font-semibold tabular-nums',
                tone,
                isToday && 'ring-2 ring-primary ring-offset-1 ring-offset-card',
              )}
            >
              <span>{day}</span>
              {net !== 0 && (
                <span className="text-[9px] font-bold opacity-90">
                  {net > 0 ? `+${net}` : net}
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded bg-positive/85" /> Positive
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded bg-destructive/85" /> Negative
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded bg-secondary" /> Neutral
        </span>
      </div>
    </section>
  )
}

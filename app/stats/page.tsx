'use client'

import { useMemo } from 'react'
import { Coins, Home, Flame, TriangleAlert, Sparkles, RotateCcw } from 'lucide-react'
import { useStore } from '@/lib/store'
import { dateKeyFromISO, addDays } from '@/lib/date'
import { HistoryCalendar } from '@/components/stats/history-calendar'

export default function StatsPage() {
  const { state, lifetimeEarned, streak, resetAll } = useStore()

  const stats = useMemo(() => {
    // house value = coins spent on rooms + furniture
    const houseValue = state.ledger
      .filter((e) => e.delta < 0 && !e.taskId)
      .reduce((s, e) => s - e.delta, 0)

    // best streak across all recorded days
    const dayNet = new Map<string, number>()
    for (const e of state.ledger) {
      if (!e.taskId) continue
      const k = dateKeyFromISO(e.createdAt)
      dayNet.set(k, (dayNet.get(k) ?? 0) + e.delta)
    }
    const days = Array.from(dayNet.keys()).sort()
    let best = 0
    let run = 0
    let prev: string | null = null
    for (const d of days) {
      const positive = (dayNet.get(d) ?? 0) > 0
      if (!positive) {
        run = 0
        prev = d
        continue
      }
      run = prev && addDays(prev, 1) === d ? run + 1 : 1
      best = Math.max(best, run)
      prev = d
    }

    // most common bad habit
    const badCounts = new Map<string, number>()
    for (const t of state.tasks) {
      if (t.type !== 'bad') continue
      badCounts.set(t.title, (badCounts.get(t.title) ?? 0) + 1)
    }
    let topBad = 'None yet'
    let topBadN = 0
    for (const [title, n] of badCounts) {
      if (n > topBadN) {
        topBad = title
        topBadN = n
      }
    }

    const placedCount = state.placedItems.length

    return { houseValue, best, topBad, topBadN, placedCount }
  }, [state])

  const cards = [
    {
      label: 'Coins earned (all time)',
      value: lifetimeEarned,
      sub: 'From completed goals',
      icon: Coins,
      tone: 'text-coin-foreground',
      bg: 'bg-coin/20',
    },
    {
      label: 'House value',
      value: stats.houseValue,
      sub: `${stats.placedCount} items placed`,
      icon: Home,
      tone: 'text-primary',
      bg: 'bg-primary/12',
    },
    {
      label: 'Current streak',
      value: streak,
      sub: `Best: ${stats.best} days`,
      icon: Flame,
      tone: 'text-accent-foreground',
      bg: 'bg-accent/25',
    },
    {
      label: 'Top slip-up',
      value: stats.topBadN,
      sub: stats.topBad,
      icon: TriangleAlert,
      tone: 'text-destructive',
      bg: 'bg-destructive/12',
    },
  ]

  function onReset() {
    if (
      confirm(
        'Reset all progress? This clears your goals, coins, and house. This cannot be undone.',
      )
    ) {
      resetAll()
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Stats & History</h1>
        <p className="text-sm text-muted-foreground">Your discipline over time</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => {
          const Icon = c.icon
          return (
            <div
              key={c.label}
              className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <span
                className={`flex size-9 items-center justify-center rounded-xl ${c.bg} ${c.tone}`}
              >
                <Icon className="size-5" />
              </span>
              <span className="font-display text-2xl font-bold tabular-nums leading-none">
                {c.value}
              </span>
              <span className="text-xs font-medium leading-tight">{c.label}</span>
              <span className="truncate text-[11px] text-muted-foreground">{c.sub}</span>
            </div>
          )
        })}
      </div>

      <HistoryCalendar />

      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <Sparkles className="size-5 shrink-0 text-primary" />
        <p className="flex-1 text-sm text-muted-foreground text-pretty">
          Keep every day net-positive to grow your streak and unlock new rooms faster.
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mx-auto flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
      >
        <RotateCcw className="size-3.5" /> Reset all progress
      </button>
    </div>
  )
}

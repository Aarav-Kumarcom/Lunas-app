'use client'

import { CheckCircle2, Circle, TriangleAlert, TrendingUp, TrendingDown } from 'lucide-react'
import type { Task } from '@/lib/types'
import { cn } from '@/lib/utils'

export function DaySummary({ tasks, net }: { tasks: Task[]; net: number }) {
  const good = tasks.filter((t) => t.type === 'good')
  const completed = good.filter((t) => t.status === 'done').length
  const pending = good.filter((t) => t.status === 'pending').length
  const badCount = tasks.filter((t) => t.type === 'bad').length

  const positive = net >= 0

  const stats = [
    { label: 'Completed', value: completed, icon: CheckCircle2, tone: 'text-positive' },
    { label: 'Remaining', value: pending, icon: Circle, tone: 'text-muted-foreground' },
    { label: 'Slip-ups', value: badCount, icon: TriangleAlert, tone: 'text-destructive' },
  ]

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold">Today&apos;s summary</h2>
        <div
          className={cn(
            'flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold tabular-nums',
            positive
              ? 'bg-positive/15 text-positive'
              : 'bg-destructive/15 text-destructive',
          )}
        >
          {positive ? (
            <TrendingUp className="size-4" />
          ) : (
            <TrendingDown className="size-4" />
          )}
          {net > 0 ? `+${net}` : net} today
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 rounded-xl bg-secondary/60 py-3"
            >
              <Icon className={cn('size-5', s.tone)} />
              <span className="text-lg font-bold tabular-nums">{s.value}</span>
              <span className="text-[11px] font-medium text-muted-foreground">
                {s.label}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

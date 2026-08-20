'use client'

import { useStore } from '@/lib/store'
import { todayKey, formatDay } from '@/lib/date'
import { TaskInput } from '@/components/today/task-input'
import { TaskRow } from '@/components/today/task-row'
import { SlipUpLogger } from '@/components/today/slip-up-logger'
import { DaySummary } from '@/components/today/day-summary'

export default function TodayPage() {
  const { tasksForDate, todayNet } = useStore()
  const today = todayKey()
  const tasks = tasksForDate(today)

  const goodTasks = tasks.filter((t) => t.type === 'good')
  const pending = goodTasks.filter((t) => t.status === 'pending')
  const done = goodTasks.filter((t) => t.status === 'done')
  const slipUps = tasks.filter((t) => t.type === 'bad')

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{formatDay(today)}</p>
        <h1 className="font-display text-2xl font-bold tracking-tight text-balance">
          What will you build today?
        </h1>
      </div>

      <TaskInput />

      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 px-4 py-10 text-center">
          <p className="font-display text-base font-semibold">No goals yet</p>
          <p className="mt-1 text-sm text-muted-foreground text-pretty">
            Add your first goal above. Each one you finish earns a coin toward your
            dream house.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {pending.length > 0 && (
            <section className="flex flex-col gap-2">
              <SectionLabel>To do · {pending.length}</SectionLabel>
              {pending.map((t) => (
                <TaskRow key={t.id} task={t} />
              ))}
            </section>
          )}

          {done.length > 0 && (
            <section className="flex flex-col gap-2">
              <SectionLabel>Done · {done.length}</SectionLabel>
              {done.map((t) => (
                <TaskRow key={t.id} task={t} />
              ))}
            </section>
          )}

          {slipUps.length > 0 && (
            <section className="flex flex-col gap-2">
              <SectionLabel>Slip-ups · {slipUps.length}</SectionLabel>
              {slipUps.map((t) => (
                <TaskRow key={t.id} task={t} />
              ))}
            </section>
          )}
        </div>
      )}

      <SlipUpLogger />

      <DaySummary tasks={tasks} net={todayNet} />
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </h2>
  )
}

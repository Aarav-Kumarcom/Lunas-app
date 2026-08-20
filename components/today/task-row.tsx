'use client'

import { useState } from 'react'
import { Check, Trash2, Lock, AlertTriangle } from 'lucide-react'
import type { Task } from '@/lib/types'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function TaskRow({ task }: { task: Task }) {
  const { toggleTask, removeTask, canUncheck } = useStore()
  const [floatKey, setFloatKey] = useState(0)
  const [confirmUncheck, setConfirmUncheck] = useState(false)

  const isBad = task.type === 'bad'
  const done = task.status === 'done'

  function onToggle() {
    if (isBad) return
    if (done) {
      if (!canUncheck(task.id)) return
      if (!confirmUncheck) {
        setConfirmUncheck(true)
        setTimeout(() => setConfirmUncheck(false), 2600)
        return
      }
      setConfirmUncheck(false)
      toggleTask(task.id)
      return
    }
    toggleTask(task.id)
    setFloatKey((k) => k + 1)
  }

  const lockedDone = done && !isBad && !canUncheck(task.id)

  return (
    <div
      className={cn(
        'group relative flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-3 shadow-sm transition-colors',
        isBad && 'border-destructive/30 bg-destructive/5',
        done && !isBad && 'bg-secondary/60',
      )}
    >
      {/* checkbox / status */}
      {isBad ? (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <AlertTriangle className="size-4" />
        </span>
      ) : (
        <button
          type="button"
          onClick={onToggle}
          disabled={lockedDone}
          aria-pressed={done}
          aria-label={done ? 'Mark as not done' : 'Mark as done'}
          className={cn(
            'relative flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-all',
            done
              ? 'border-positive bg-positive text-positive-foreground'
              : 'border-muted-foreground/40 hover:border-primary',
            lockedDone && 'cursor-not-allowed opacity-70',
            confirmUncheck && 'ring-2 ring-destructive/50',
          )}
        >
          {done && <Check className="size-4" />}
          {floatKey > 0 && done && (
            <span
              key={floatKey}
              className="animate-float-up pointer-events-none absolute left-1/2 top-0 text-sm font-bold text-positive"
            >
              +1
            </span>
          )}
        </button>
      )}

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'truncate text-[15px] leading-snug',
            done && !isBad && 'text-muted-foreground line-through',
            isBad && 'text-foreground',
          )}
        >
          {task.title}
        </p>
        {confirmUncheck && (
          <p className="mt-0.5 text-xs font-medium text-destructive">
            Tap again to uncheck and return the coin
          </p>
        )}
        {lockedDone && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Lock className="size-3" /> Locked in from a previous session
          </p>
        )}
      </div>

      <span
        className={cn(
          'shrink-0 text-sm font-bold tabular-nums',
          isBad ? 'text-destructive' : done ? 'text-positive' : 'text-muted-foreground',
        )}
      >
        {isBad ? task.pointsValue : done ? `+${task.pointsValue}` : `+${task.pointsValue}`}
      </span>

      {!done && !isBad && (
        <button
          type="button"
          onClick={() => removeTask(task.id)}
          aria-label="Delete goal"
          className="shrink-0 rounded-lg p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-secondary hover:text-destructive group-hover:opacity-100 max-sm:opacity-100"
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  )
}

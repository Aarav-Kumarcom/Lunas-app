'use client'

import { useState, type KeyboardEvent } from 'react'
import { AlertTriangle, ChevronDown } from 'lucide-react'
import { useStore } from '@/lib/store'
import { BAD_TASK_POINTS } from '@/lib/types'
import { cn } from '@/lib/utils'

const PRESETS = [
  'Skipped workout',
  'Doomscrolled',
  'Ate junk food',
  'Overslept',
  'Procrastinated',
  'Broke a promise to myself',
]

export function SlipUpLogger() {
  const { logBadTask } = useStore()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  function log(title: string) {
    if (!title.trim()) return
    logBadTask(title)
    setValue('')
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    if (e.key === 'Enter') {
      e.preventDefault()
      log(value)
    }
  }

  return (
    <div className="rounded-2xl border border-destructive/25 bg-destructive/5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <AlertTriangle className="size-4" />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-semibold text-foreground">
            Log a slip-up
          </span>
          <span className="block text-xs text-muted-foreground">
            Honesty keeps the streak real ({BAD_TASK_POINTS} coins each)
          </span>
        </span>
        <ChevronDown
          className={cn(
            'size-5 text-muted-foreground transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div className="border-t border-destructive/15 px-4 pb-4 pt-3">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => log(p)}
                className="rounded-full border border-destructive/30 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-destructive/10"
              >
                {p}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-background p-1.5">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Something else…"
              aria-label="Describe your slip-up"
              className="min-w-0 flex-1 bg-transparent px-2.5 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => log(value)}
              disabled={!value.trim()}
              className="shrink-0 rounded-lg bg-destructive px-3 py-1.5 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
            >
              Log
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, type KeyboardEvent } from 'react'
import { Plus } from 'lucide-react'
import { useStore } from '@/lib/store'

export function TaskInput() {
  const { addGoodTask } = useStore()
  const [value, setValue] = useState('')

  function submit() {
    if (!value.trim()) return
    addGoodTask(value)
    setValue('')
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    // Respect CJK IME composition and Safari's unreliable final event.
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-ring/40">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Add a goal for today…"
        aria-label="Add a goal for today"
        className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[15px] outline-none placeholder:text-muted-foreground"
      />
      <button
        type="button"
        onClick={submit}
        disabled={!value.trim()}
        aria-label="Add goal"
        className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
      >
        <Plus className="size-5" />
      </button>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Coins } from 'lucide-react'
import { useStore } from '@/lib/store'
import { getRoom } from '@/lib/catalog'
import { ItemIcon } from '@/components/item-icon'
import { RoomGrid } from '@/components/house/room-grid'
import { BuildPanel } from '@/components/house/build-panel'
import { cn } from '@/lib/utils'

export default function HousePage() {
  const { state, balance } = useStore()
  const [activeRoom, setActiveRoom] = useState('living')
  const [selectedInventoryItemId, setSelectedInventoryItemId] = useState<string | null>(
    null,
  )

  const rooms = state.unlockedRooms
    .map((id) => getRoom(id))
    .filter((r): r is NonNullable<typeof r> => !!r)

  // house value = total coins spent on unlocked rooms + placed items
  const houseValue = state.ledger
    .filter((e) => e.delta < 0 && !e.taskId)
    .reduce((s, e) => s - e.delta, 0)

  function switchRoom(id: string) {
    setActiveRoom(id)
    setSelectedInventoryItemId(null)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Your House</h1>
          <p className="text-sm text-muted-foreground">
            Spend coins to grow your dream home
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-medium text-muted-foreground">House value</span>
          <span className="flex items-center gap-1 font-display text-lg font-bold text-coin-foreground">
            <Coins className="size-4" /> {houseValue}
          </span>
        </div>
      </div>

      {/* room tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {rooms.map((r) => {
          const active = r.id === activeRoom
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => switchRoom(r.id)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors',
                active
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:bg-secondary',
              )}
            >
              <ItemIcon name={r.icon} size={16} />
              {r.name}
            </button>
          )
        })}
      </div>

      <RoomGrid
        room={activeRoom}
        selectedInventoryItemId={selectedInventoryItemId}
        onPlaced={() => setSelectedInventoryItemId(null)}
      />

      <div className="flex items-center justify-between rounded-xl bg-secondary/60 px-4 py-2.5">
        <span className="text-sm text-muted-foreground">Available to spend</span>
        <span className="flex items-center gap-1.5 font-bold tabular-nums text-coin-foreground">
          <Coins className="size-4" /> {balance}
        </span>
      </div>

      <BuildPanel
        activeRoom={activeRoom}
        selectedInventoryItemId={selectedInventoryItemId}
        setSelectedInventoryItemId={setSelectedInventoryItemId}
      />
    </div>
  )
}

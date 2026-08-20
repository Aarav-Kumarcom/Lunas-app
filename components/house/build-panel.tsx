'use client'

import { useMemo, useState } from 'react'
import { Coins, Lock } from 'lucide-react'
import { useStore } from '@/lib/store'
import { furnitureForRoom, getRoom, ROOMS } from '@/lib/catalog'
import type { HouseItem } from '@/lib/types'
import { ItemIcon } from '@/components/item-icon'
import { cn } from '@/lib/utils'

type Tab = 'shop' | 'inventory' | 'rooms'

interface Props {
  activeRoom: string
  selectedInventoryItemId: string | null
  setSelectedInventoryItemId: (id: string | null) => void
}

export function BuildPanel({
  activeRoom,
  selectedInventoryItemId,
  setSelectedInventoryItemId,
}: Props) {
  const { state, balance, lifetimeEarned, buyFurniture, buyRoom } = useStore()
  const [tab, setTab] = useState<Tab>('shop')

  const roomName = getRoom(activeRoom)?.name ?? 'Room'

  const inventory = useMemo(() => {
    const counts = new Map<string, number>()
    for (const id of state.ownedItemIds) counts.set(id, (counts.get(id) ?? 0) + 1)
    for (const p of state.placedItems)
      counts.set(p.houseItemId, (counts.get(p.houseItemId) ?? 0) - 1)
    return Array.from(counts.entries())
      .map(([id, n]) => ({ item: furnitureForRoom(activeRoom).find((f) => f.id === id), n }))
      .filter((e): e is { item: HouseItem; n: number } => !!e.item && e.n > 0)
  }, [state.ownedItemIds, state.placedItems, activeRoom])

  const lockedRooms = ROOMS.filter((r) => !state.unlockedRooms.includes(r.id))

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'shop', label: 'Furniture' },
    { id: 'inventory', label: 'Inventory', count: inventory.reduce((s, e) => s + e.n, 0) },
    { id: 'rooms', label: 'Rooms', count: lockedRooms.length },
  ]

  return (
    <section className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex gap-1 border-b border-border p-1.5">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-medium transition-colors',
              tab === t.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-secondary',
            )}
          >
            {t.label}
            {typeof t.count === 'number' && t.count > 0 && (
              <span
                className={cn(
                  'rounded-full px-1.5 text-xs tabular-nums',
                  tab === t.id ? 'bg-primary-foreground/25' : 'bg-secondary',
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="p-3">
        {tab === 'shop' && (
          <ShopGrid
            items={furnitureForRoom(activeRoom)}
            emptyLabel={`No items for the ${roomName} yet.`}
            renderAction={(item) => {
              const locked = lifetimeEarned < item.unlockRequirement
              const affordable = balance >= item.cost
              return (
                <ShopCard
                  item={item}
                  locked={locked}
                  affordable={affordable}
                  actionLabel="Buy"
                  onAction={() => buyFurniture(item.id)}
                />
              )
            }}
          />
        )}

        {tab === 'inventory' && (
          <>
            {inventory.length === 0 ? (
              <EmptyNote>
                Nothing to place in the {roomName}. Buy furniture from the Furniture tab.
              </EmptyNote>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {inventory.map(({ item, n }) => {
                  const selected = selectedInventoryItemId === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setSelectedInventoryItemId(selected ? null : item.id)
                      }
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-colors',
                        selected
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/40'
                          : 'border-border bg-background hover:bg-secondary/60',
                      )}
                    >
                      <span
                        className="flex size-11 items-center justify-center rounded-lg"
                        style={{ backgroundColor: item.color }}
                      >
                        <ItemIcon name={item.icon} className="size-6 text-white/90" />
                      </span>
                      <span className="text-xs font-medium leading-tight">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground">×{n}</span>
                    </button>
                  )
                })}
              </div>
            )}
            {selectedInventoryItemId && (
              <p className="mt-3 rounded-lg bg-primary/10 px-3 py-2 text-center text-xs font-medium text-primary">
                Now tap a tile in the room to place it.
              </p>
            )}
          </>
        )}

        {tab === 'rooms' && (
          <ShopGrid
            items={lockedRooms}
            emptyLabel="Every room is unlocked. Your estate is complete!"
            renderAction={(item) => {
              const locked = lifetimeEarned < item.unlockRequirement
              const affordable = balance >= item.cost
              return (
                <ShopCard
                  item={item}
                  locked={locked}
                  affordable={affordable}
                  actionLabel="Unlock"
                  onAction={() => buyRoom(item.id)}
                />
              )
            }}
          />
        )}
      </div>
    </section>
  )
}

function ShopGrid({
  items,
  emptyLabel,
  renderAction,
}: {
  items: HouseItem[]
  emptyLabel: string
  renderAction: (item: HouseItem) => React.ReactNode
}) {
  if (items.length === 0) return <EmptyNote>{emptyLabel}</EmptyNote>
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.id}>{renderAction(item)}</div>
      ))}
    </div>
  )
}

function ShopCard({
  item,
  locked,
  affordable,
  actionLabel,
  onAction,
}: {
  item: HouseItem
  locked: boolean
  affordable: boolean
  actionLabel: string
  onAction: () => void
}) {
  const disabled = locked || !affordable
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-2.5">
      <span
        className="flex size-11 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: item.color }}
      >
        <ItemIcon name={item.icon} className="size-6 text-white/90" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold leading-tight">{item.name}</p>
        {locked ? (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Lock className="size-3" /> Earn {item.unlockRequirement} lifetime coins
          </p>
        ) : (
          <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-coin-foreground">
            <Coins className="size-3" /> {item.cost} coins
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onAction}
        disabled={disabled}
        className={cn(
          'shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition-transform active:scale-95',
          disabled
            ? 'cursor-not-allowed bg-secondary text-muted-foreground'
            : 'bg-primary text-primary-foreground hover:scale-105',
        )}
      >
        {locked ? <Lock className="size-4" /> : !affordable ? 'Need coins' : actionLabel}
      </button>
    </div>
  )
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-2 py-6 text-center text-sm text-muted-foreground text-pretty">
      {children}
    </p>
  )
}

'use client'

import { useRef, useState, type PointerEvent } from 'react'
import { RotateCw, Hand } from 'lucide-react'
import { useStore } from '@/lib/store'
import { getItem, getRoom, ROOM_COLS, ROOM_ROWS } from '@/lib/catalog'
import { ItemIcon } from '@/components/item-icon'
import { cn } from '@/lib/utils'

interface Props {
  room: string
  selectedInventoryItemId: string | null
  onPlaced: () => void
}

export function RoomGrid({ room, selectedInventoryItemId, onPlaced }: Props) {
  const { state, placeItem, moveItem, rotateItem, pickUpItem } = useStore()
  const gridRef = useRef<HTMLDivElement>(null)
  const [selectedPlaced, setSelectedPlaced] = useState<string | null>(null)
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null)

  const roomDef = getRoom(room)
  const placed = state.placedItems.filter((p) => p.room === room)

  function cellFromPointer(clientX: number, clientY: number) {
    const el = gridRef.current
    if (!el) return { x: 0, y: 0 }
    const rect = el.getBoundingClientRect()
    const cw = rect.width / ROOM_COLS
    const ch = rect.height / ROOM_ROWS
    const x = Math.floor((clientX - rect.left) / cw)
    const y = Math.floor((clientY - rect.top) / ch)
    return { x, y }
  }

  function handleCellPlace(x: number, y: number) {
    if (!selectedInventoryItemId) return
    if (placeItem(selectedInventoryItemId, room, x, y)) {
      onPlaced()
    }
  }

  function onItemPointerDown(e: PointerEvent, id: string) {
    e.stopPropagation()
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    setSelectedPlaced(id)
    const cell = cellFromPointer(e.clientX, e.clientY)
    setDrag({ id, x: cell.x, y: cell.y })
  }

  function onItemPointerMove(e: PointerEvent) {
    if (!drag) return
    const cell = cellFromPointer(e.clientX, e.clientY)
    if (cell.x !== drag.x || cell.y !== drag.y) {
      setDrag({ ...drag, x: cell.x, y: cell.y })
    }
  }

  function onItemPointerUp(e: PointerEvent) {
    if (!drag) return
    const cell = cellFromPointer(e.clientX, e.clientY)
    moveItem(drag.id, cell.x, cell.y)
    setDrag(null)
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={gridRef}
        className="relative aspect-square w-full touch-none select-none overflow-hidden rounded-2xl border border-border shadow-inner"
        style={{ backgroundColor: 'color-mix(in oklab, var(--card), var(--secondary) 40%)' }}
        onPointerMove={onItemPointerMove}
        onPointerUp={onItemPointerUp}
        onClick={() => setSelectedPlaced(null)}
      >
        {/* grid cells */}
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${ROOM_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROOM_ROWS}, 1fr)`,
          }}
        >
          {Array.from({ length: ROOM_COLS * ROOM_ROWS }).map((_, i) => {
            const x = i % ROOM_COLS
            const y = Math.floor(i / ROOM_COLS)
            return (
              <button
                key={i}
                type="button"
                aria-label={`Cell ${x + 1}, ${y + 1}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleCellPlace(x, y)
                }}
                className={cn(
                  'border border-border/40 transition-colors',
                  selectedInventoryItemId && 'hover:bg-primary/15',
                )}
              />
            )
          })}
        </div>

        {/* placed items */}
        {placed.map((p) => {
          const item = getItem(p.houseItemId)
          if (!item) return null
          const rotated = p.rotation % 180 !== 0
          const w = rotated ? item.h : item.w
          const h = rotated ? item.w : item.h
          const isDragging = drag?.id === p.id
          const px = isDragging ? drag.x : p.x
          const py = isDragging ? drag.y : p.y
          const selected = selectedPlaced === p.id
          return (
            <div
              key={p.id}
              onPointerDown={(e) => onItemPointerDown(e, p.id)}
              className={cn(
                'absolute flex cursor-grab items-center justify-center rounded-xl p-1 shadow-sm transition-[box-shadow] active:cursor-grabbing',
                selected && 'z-10 ring-2 ring-primary',
                isDragging && 'opacity-90',
              )}
              style={{
                left: `${(px / ROOM_COLS) * 100}%`,
                top: `${(py / ROOM_ROWS) * 100}%`,
                width: `${(w / ROOM_COLS) * 100}%`,
                height: `${(h / ROOM_ROWS) * 100}%`,
                backgroundColor: item.color,
              }}
            >
              <ItemIcon
                name={item.icon}
                className="size-1/2 max-h-8 max-w-8 text-white/90 drop-shadow"
              />
            </div>
          )
        })}

        {placed.length === 0 && !selectedInventoryItemId && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center">
            <p className="text-sm text-muted-foreground text-pretty">
              {roomDef?.name} is empty. Buy furniture below, then tap a tile to place it.
            </p>
          </div>
        )}
      </div>

      {/* selected item toolbar */}
      {selectedPlaced && (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-sm">
          <span className="px-1 text-sm font-medium">
            {getItem(placed.find((p) => p.id === selectedPlaced)?.houseItemId ?? '')?.name}
          </span>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => rotateItem(selectedPlaced)}
              className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium hover:bg-secondary/70"
            >
              <RotateCw className="size-4" /> Rotate
            </button>
            <button
              type="button"
              onClick={() => {
                pickUpItem(selectedPlaced)
                setSelectedPlaced(null)
              }}
              className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium hover:bg-secondary/70"
            >
              <Hand className="size-4" /> Pick up
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

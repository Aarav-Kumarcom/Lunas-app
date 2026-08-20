"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import type { PlacedItem } from "@/components/room-3d"
import { Lock, Coins } from "lucide-react"

// Three.js needs the browser (no server-side rendering), so we
// load the 3D room dynamically with ssr disabled.
const Room3D = dynamic(() => import("@/components/room-3d").then((m) => m.Room3D), {
  ssr: false,
  loading: () => (
    <div className="flex h-[480px] w-full items-center justify-center rounded-2xl border border-border bg-card text-sm text-muted-foreground">
      Loading 3D room…
    </div>
  ),
})

type ShopItem = {
  id: string
  name: string
  icon: string
  cost: number
  type: PlacedItem["type"]
  position: [number, number, number]
  rotationY?: number
  color?: string
  locked?: boolean
  lockedHint?: string
}

const FURNITURE_ITEMS: ShopItem[] = [
  { id: "sofa", name: "Cozy Sofa", icon: "🛋️", cost: 12, type: "sofa", position: [-1.5, 0, -1.5] },
  { id: "armchair", name: "Armchair", icon: "💺", cost: 8, type: "armchair", position: [1.5, 0, -1.8] },
  { id: "tvStand", name: "TV Stand", icon: "📺", cost: 20, type: "tvStand", position: [0, 0, -2.8], locked: true, lockedHint: "Earn 20 lifetime coins" },
  { id: "coffeeTable", name: "Coffee Table", icon: "🪑", cost: 7, type: "coffeeTable", position: [-0.2, 0, -0.6] },
  { id: "floorLamp", name: "Floor Lamp", icon: "💡", cost: 5, type: "floorLamp", position: [-3, 0, -2.5] },
  { id: "rug", name: "Soft Rug", icon: "🧶", cost: 30, type: "rug", position: [0, 0, -1], locked: true, lockedHint: "Earn 30 lifetime coins" },
]

const VEHICLE_ITEMS: ShopItem[] = [
  { id: "car", name: "Car", icon: "🚗", cost: 50, type: "car", position: [2.5, 0, 1.5], rotationY: 0.4 },
  {
    id: "carUpgraded",
    name: "Upgrade Car",
    icon: "🏎️",
    cost: 100,
    type: "carUpgraded",
    position: [2.5, 0, 1.5],
    rotationY: 0.4,
    locked: true,
    lockedHint: "Buy the Car first",
  },
]

export default function HousePage() {
  const [coins, setCoins] = useState(25)
  const [owned, setOwned] = useState<Set<string>>(new Set())
  const [tab, setTab] = useState<"furniture" | "vehicles">("furniture")

  const allItems = [...FURNITURE_ITEMS, ...VEHICLE_ITEMS]
  const placedItems: PlacedItem[] = allItems
    .filter((item) => owned.has(item.id))
    .map(({ id, type, position, rotationY, color }) => ({ id, type, position, rotationY, color }))

  function buy(item: ShopItem) {
    if (owned.has(item.id) || item.locked || coins < item.cost) return
    // If buying the upgraded car, remove the base car model so they don't overlap
    if (item.id === "carUpgraded") {
      setOwned((prev) => {
        const next = new Set(prev)
        next.delete("car")
        next.add("carUpgraded")
        return next
      })
    } else {
      setOwned((prev) => new Set(prev).add(item.id))
    }
    setCoins((c) => c - item.cost)
  }

  const activeList = tab === "furniture" ? FURNITURE_ITEMS : VEHICLE_ITEMS

  return (
    <main className="mx-auto max-w-md px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">House</h1>
        <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm font-semibold text-foreground">
          <Coins className="h-4 w-4" />
          {coins}
        </div>
      </div>

      <Room3D items={placedItems} />

      <div className="mt-4 flex gap-2 rounded-full bg-muted p-1">
        <button
          onClick={() => setTab("furniture")}
          className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
            tab === "furniture" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          Furniture
        </button>
        <button
          onClick={() => setTab("vehicles")}
          className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
            tab === "vehicles" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          Vehicles
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {activeList.map((item) => {
          const isOwned = owned.has(item.id)
          const canAfford = coins >= item.cost
          const isLocked = item.locked && !isOwned

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-lg">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-card-foreground">{item.name}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  {isLocked ? item.lockedHint : `${item.cost} coins`}
                </p>
              </div>
              {isOwned ? (
                <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success-foreground">
                  Placed
                </span>
              ) : isLocked ? (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </span>
              ) : (
                <button
                  onClick={() => buy(item)}
                  disabled={!canAfford}
                  className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-40"
                >
                  {canAfford ? "Buy" : "Need coins"}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}

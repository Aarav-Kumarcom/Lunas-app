'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type {
  AppState,
  LedgerEntry,
  PlacedItem,
  Task,
} from './types'
import { BAD_TASK_POINTS, GOOD_TASK_POINTS } from './types'
import { getItem, getRoom, ROOM_COLS, ROOM_ROWS } from './catalog'
import { addDays, dateKeyFromISO, todayKey } from './date'

const STORAGE_KEY = 'lunars-project-state-v1'
const DEMO_USER_ID = 'demo-user'

function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

function initialState(): AppState {
  const now = new Date().toISOString()
  const today = todayKey()
  return {
    user: {
      id: DEMO_USER_ID,
      email: 'you@lunars.app',
      createdAt: now,
      dayStartTime: '00:00',
    },
    tasks: [
      {
        id: uid('task'),
        userId: DEMO_USER_ID,
        date: today,
        title: 'Drink a glass of water',
        type: 'good',
        pointsValue: GOOD_TASK_POINTS,
        completedAt: null,
        status: 'pending',
        createdAt: now,
      },
      {
        id: uid('task'),
        userId: DEMO_USER_ID,
        date: today,
        title: 'Read for 20 minutes',
        type: 'good',
        pointsValue: GOOD_TASK_POINTS,
        completedAt: null,
        status: 'pending',
        createdAt: now,
      },
    ],
    ledger: [],
    ownedItemIds: [],
    placedItems: [],
    unlockedRooms: ['living'],
  }
}

interface StoreContextValue {
  state: AppState
  // selectors
  balance: number
  lifetimeEarned: number
  todayNet: number
  streak: number
  netForDate: (dateKey: string) => number
  tasksForDate: (dateKey: string) => Task[]
  canUncheck: (taskId: string) => boolean
  isAffordable: (cost: number) => boolean
  // task actions
  addGoodTask: (title: string) => void
  logBadTask: (title: string) => void
  toggleTask: (taskId: string) => void
  removeTask: (taskId: string) => void
  // house actions
  buyRoom: (roomId: string) => boolean
  buyFurniture: (itemId: string) => boolean
  placeItem: (houseItemId: string, room: string, x: number, y: number) => boolean
  moveItem: (placedItemId: string, x: number, y: number) => boolean
  rotateItem: (placedItemId: string) => void
  pickUpItem: (placedItemId: string) => void
  resetAll: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState)
  const [hydrated, setHydrated] = useState(false)
  // Tasks completed during THIS browser session — only these may be unchecked.
  const sessionCompletions = useRef<Set<string>>(new Set())

  // Hydrate from localStorage on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as AppState
        setState({ ...initialState(), ...parsed })
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true)
  }, [])

  // Persist on change (after hydration).
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // storage full / unavailable — ignore
    }
  }, [state, hydrated])

  const value = useMemo<StoreContextValue>(() => {
    const balance = state.ledger.reduce((sum, e) => sum + e.delta, 0)
    const lifetimeEarned = state.ledger
      .filter((e) => e.delta > 0)
      .reduce((sum, e) => sum + e.delta, 0)

    const netForDate = (dateKey: string) =>
      state.ledger
        .filter((e) => dateKeyFromISO(e.createdAt) === dateKey && e.taskId)
        .reduce((sum, e) => sum + e.delta, 0)

    const tasksForDate = (dateKey: string) =>
      state.tasks
        .filter((t) => t.date === dateKey)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))

    const todayNet = netForDate(todayKey())

    // Streak: consecutive days (ending today or yesterday) with a net-positive day.
    let streak = 0
    let cursor = todayKey()
    if (netForDate(cursor) <= 0) cursor = addDays(cursor, -1)
    while (netForDate(cursor) > 0) {
      streak += 1
      cursor = addDays(cursor, -1)
    }

    const canUncheck = (taskId: string) => sessionCompletions.current.has(taskId)
    const isAffordable = (cost: number) => balance >= cost

    // ---- mutations ----
    const pushLedger = (
      prev: AppState,
      delta: number,
      reason: string,
      taskId: string | null,
    ): LedgerEntry => ({
      id: uid('led'),
      userId: prev.user.id,
      taskId,
      delta,
      createdAt: new Date().toISOString(),
      reason,
    })

    const addGoodTask = (title: string) => {
      const clean = title.trim()
      if (!clean) return
      setState((prev) => ({
        ...prev,
        tasks: [
          ...prev.tasks,
          {
            id: uid('task'),
            userId: prev.user.id,
            date: todayKey(),
            title: clean,
            type: 'good',
            pointsValue: GOOD_TASK_POINTS,
            completedAt: null,
            status: 'pending',
            createdAt: new Date().toISOString(),
          },
        ],
      }))
    }

    const logBadTask = (title: string) => {
      const clean = title.trim()
      if (!clean) return
      setState((prev) => {
        const taskId = uid('task')
        const now = new Date().toISOString()
        const task: Task = {
          id: taskId,
          userId: prev.user.id,
          date: todayKey(),
          title: clean,
          type: 'bad',
          pointsValue: BAD_TASK_POINTS,
          completedAt: now,
          status: 'done',
          createdAt: now,
        }
        return {
          ...prev,
          tasks: [...prev.tasks, task],
          ledger: [
            ...prev.ledger,
            pushLedger(prev, BAD_TASK_POINTS, `Slip-up: ${clean}`, taskId),
          ],
        }
      })
    }

    const toggleTask = (taskId: string) => {
      setState((prev) => {
        const task = prev.tasks.find((t) => t.id === taskId)
        if (!task || task.type === 'bad') return prev
        if (task.status === 'pending') {
          // complete it
          sessionCompletions.current.add(taskId)
          const now = new Date().toISOString()
          return {
            ...prev,
            tasks: prev.tasks.map((t) =>
              t.id === taskId ? { ...t, status: 'done', completedAt: now } : t,
            ),
            ledger: [
              ...prev.ledger,
              pushLedger(prev, GOOD_TASK_POINTS, `Completed: ${task.title}`, taskId),
            ],
          }
        }
        // uncheck — only allowed for this-session completions
        if (!sessionCompletions.current.has(taskId)) return prev
        sessionCompletions.current.delete(taskId)
        return {
          ...prev,
          tasks: prev.tasks.map((t) =>
            t.id === taskId ? { ...t, status: 'pending', completedAt: null } : t,
          ),
          ledger: prev.ledger.filter((e) => e.taskId !== taskId),
        }
      })
    }

    const removeTask = (taskId: string) => {
      setState((prev) => {
        const task = prev.tasks.find((t) => t.id === taskId)
        // Only allow removing pending good tasks (no points earned yet).
        if (!task || task.status === 'done') return prev
        return { ...prev, tasks: prev.tasks.filter((t) => t.id !== taskId) }
      })
    }

    const buyRoom = (roomId: string): boolean => {
      const room = getRoom(roomId)
      if (!room) return false
      if (state.unlockedRooms.includes(roomId)) return false
      if (lifetimeEarned < room.unlockRequirement) return false
      if (balance < room.cost) return false
      setState((prev) => ({
        ...prev,
        unlockedRooms: [...prev.unlockedRooms, roomId],
        ledger:
          room.cost > 0
            ? [...prev.ledger, pushLedger(prev, -room.cost, `Unlocked ${room.name}`, null)]
            : prev.ledger,
      }))
      return true
    }

    const buyFurniture = (itemId: string): boolean => {
      const item = getItem(itemId)
      if (!item) return false
      if (lifetimeEarned < item.unlockRequirement) return false
      if (balance < item.cost) return false
      setState((prev) => ({
        ...prev,
        ownedItemIds: [...prev.ownedItemIds, itemId],
        ledger: [...prev.ledger, pushLedger(prev, -item.cost, `Bought ${item.name}`, null)],
      }))
      return true
    }

    // Check a footprint fits within a room grid and doesn't overlap.
    const fits = (
      prev: AppState,
      itemId: string,
      room: string,
      x: number,
      y: number,
      rotation: number,
      ignorePlacedId?: string,
    ): boolean => {
      const item = getItem(itemId)
      if (!item) return false
      const w = rotation % 180 === 0 ? item.w : item.h
      const h = rotation % 180 === 0 ? item.h : item.w
      if (x < 0 || y < 0 || x + w > ROOM_COLS || y + h > ROOM_ROWS) return false
      for (const p of prev.placedItems) {
        if (p.room !== room) continue
        if (p.id === ignorePlacedId) continue
        const pItem = getItem(p.houseItemId)
        if (!pItem) continue
        const pw = p.rotation % 180 === 0 ? pItem.w : pItem.h
        const ph = p.rotation % 180 === 0 ? pItem.h : pItem.w
        const overlap =
          x < p.x + pw && x + w > p.x && y < p.y + ph && y + h > p.y
        if (overlap) return false
      }
      return true
    }

    const placeItem = (
      houseItemId: string,
      room: string,
      x: number,
      y: number,
    ): boolean => {
      let ok = false
      setState((prev) => {
        // must own an unplaced instance
        const owned = prev.ownedItemIds.filter((id) => id === houseItemId).length
        const placed = prev.placedItems.filter((p) => p.houseItemId === houseItemId).length
        if (placed >= owned) return prev
        if (!fits(prev, houseItemId, room, x, y, 0)) return prev
        ok = true
        const p: PlacedItem = {
          id: uid('placed'),
          userId: prev.user.id,
          houseItemId,
          room,
          x,
          y,
          rotation: 0,
          placedAt: new Date().toISOString(),
        }
        return { ...prev, placedItems: [...prev.placedItems, p] }
      })
      return ok
    }

    const moveItem = (placedItemId: string, x: number, y: number): boolean => {
      let ok = false
      setState((prev) => {
        const p = prev.placedItems.find((i) => i.id === placedItemId)
        if (!p) return prev
        if (!fits(prev, p.houseItemId, p.room, x, y, p.rotation, placedItemId)) return prev
        ok = true
        return {
          ...prev,
          placedItems: prev.placedItems.map((i) =>
            i.id === placedItemId ? { ...i, x, y } : i,
          ),
        }
      })
      return ok
    }

    const rotateItem = (placedItemId: string) => {
      setState((prev) => {
        const p = prev.placedItems.find((i) => i.id === placedItemId)
        if (!p) return prev
        const next = (p.rotation + 90) % 360
        if (!fits(prev, p.houseItemId, p.room, p.x, p.y, next, placedItemId)) return prev
        return {
          ...prev,
          placedItems: prev.placedItems.map((i) =>
            i.id === placedItemId ? { ...i, rotation: next } : i,
          ),
        }
      })
    }

    const pickUpItem = (placedItemId: string) => {
      setState((prev) => ({
        ...prev,
        placedItems: prev.placedItems.filter((i) => i.id !== placedItemId),
      }))
    }

    const resetAll = () => {
      sessionCompletions.current = new Set()
      setState(initialState())
    }

    return {
      state,
      balance,
      lifetimeEarned,
      todayNet,
      streak,
      netForDate,
      tasksForDate,
      canUncheck,
      isAffordable,
      addGoodTask,
      logBadTask,
      toggleTask,
      removeTask,
      buyRoom,
      buyFurniture,
      placeItem,
      moveItem,
      rotateItem,
      pickUpItem,
      resetAll,
    }
  }, [state])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

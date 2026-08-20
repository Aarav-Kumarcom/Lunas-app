// Data model for LunarsProject.
// These types mirror the intended Postgres schema (Neon) so the local store
// can be swapped for real DB queries later with minimal changes.

export const GOOD_TASK_POINTS = 1
export const BAD_TASK_POINTS = -3

export type TaskType = 'good' | 'bad'
export type TaskStatus = 'pending' | 'done'

// tasks: id, user_id, date, title, type, points_value, completed_at, status
export interface Task {
  id: string
  userId: string
  date: string // YYYY-MM-DD (the "day" this task belongs to)
  title: string
  type: TaskType
  pointsValue: number
  completedAt: string | null // ISO timestamp
  status: TaskStatus
  createdAt: string
}

// point_ledger: id, user_id, task_id (nullable), delta, created_at, reason
export interface LedgerEntry {
  id: string
  userId: string
  taskId: string | null
  delta: number
  createdAt: string
  reason: string
}

export type HouseCategory = 'room' | 'furniture' | 'decor'

// house_items: id, name, category, cost, unlock_requirement
export interface HouseItem {
  id: string
  name: string
  category: HouseCategory
  cost: number
  // For furniture/decor: which room type it belongs in.
  room?: string
  // total lifetime points required before this can even be purchased
  unlockRequirement: number
  // grid footprint in cells
  w: number
  h: number
  // visual identity
  color: string
  icon: string
}

// user_house_items: id, user_id, house_item_id, room, x, y, rotation, placed_at
export interface PlacedItem {
  id: string
  userId: string
  houseItemId: string
  room: string
  x: number
  y: number
  rotation: number
  placedAt: string
}

// users: id, email, created_at, day_start_time
export interface User {
  id: string
  email: string
  createdAt: string
  dayStartTime: string // "HH:MM", reserved for future settings
}

export interface AppState {
  user: User
  tasks: Task[]
  ledger: LedgerEntry[]
  // ids of purchased/unlocked house items (from catalog)
  ownedItemIds: string[]
  placedItems: PlacedItem[]
  // unlocked room ids the user can view/build in
  unlockedRooms: string[]
}

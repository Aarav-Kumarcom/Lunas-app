import type { HouseItem } from './types'

// The grid dimensions for every room (cells)
export const ROOM_COLS = 6
export const ROOM_ROWS = 6

// Room definitions. "living" is the starter room, free and always unlocked.
export const ROOMS: HouseItem[] = [
  { id: 'living', name: 'Living Room', category: 'room', cost: 0, unlockRequirement: 0, w: 1, h: 1, color: '#8fb4d9', icon: 'Sofa' },
  { id: 'kitchen', name: 'Kitchen', category: 'room', cost: 40, unlockRequirement: 40, w: 1, h: 1, color: '#d9c68f', icon: 'CookingPot' },
  { id: 'bedroom', name: 'Bedroom', category: 'room', cost: 60, unlockRequirement: 70, w: 1, h: 1, color: '#9a8fd9', icon: 'BedDouble' },
  { id: 'bathroom', name: 'Bathroom', category: 'room', cost: 50, unlockRequirement: 110, w: 1, h: 1, color: '#8fd9cf', icon: 'Bath' },
  { id: 'study', name: 'Study', category: 'room', cost: 90, unlockRequirement: 180, w: 1, h: 1, color: '#b5835a', icon: 'BookOpen' },
  { id: 'garden', name: 'Garden', category: 'room', cost: 80, unlockRequirement: 260, w: 1, h: 1, color: '#8ba888', icon: 'Sprout' },
]

// Furniture & decor. `room` ties an item to a room type.
export const FURNITURE: HouseItem[] = [
  // Living room
  { id: 'sofa', name: 'Cozy Sofa', category: 'furniture', room: 'living', cost: 12, unlockRequirement: 0, w: 2, h: 1, color: '#8fb4d9', icon: 'Sofa' },
  { id: 'armchair', name: 'Armchair', category: 'furniture', room: 'living', cost: 8, unlockRequirement: 0, w: 1, h: 1, color: '#7fa3c9', icon: 'Armchair' },
  { id: 'tv', name: 'TV Stand', category: 'furniture', room: 'living', cost: 14, unlockRequirement: 20, w: 2, h: 1, color: '#5a5f6e', icon: 'Tv' },
  { id: 'coffee-table', name: 'Coffee Table', category: 'furniture', room: 'living', cost: 7, unlockRequirement: 0, w: 1, h: 1, color: '#b5835a', icon: 'Table' },
  { id: 'floor-lamp', name: 'Floor Lamp', category: 'decor', room: 'living', cost: 5, unlockRequirement: 0, w: 1, h: 1, color: '#d9c68f', icon: 'Lamp' },
  { id: 'rug', name: 'Soft Rug', category: 'decor', room: 'living', cost: 6, unlockRequirement: 30, w: 2, h: 2, color: '#d99a9a', icon: 'Frame' },

  // Kitchen
  { id: 'fridge', name: 'Refrigerator', category: 'furniture', room: 'kitchen', cost: 12, unlockRequirement: 40, w: 1, h: 1, color: '#8fb4d9', icon: 'Refrigerator' },
  { id: 'stove', name: 'Stove', category: 'furniture', room: 'kitchen', cost: 11, unlockRequirement: 40, w: 1, h: 1, color: '#5a5f6e', icon: 'CookingPot' },
  { id: 'counter', name: 'Counter', category: 'furniture', room: 'kitchen', cost: 9, unlockRequirement: 40, w: 2, h: 1, color: '#b5835a', icon: 'Utensils' },
  { id: 'dining', name: 'Dining Table', category: 'furniture', room: 'kitchen', cost: 13, unlockRequirement: 55, w: 2, h: 2, color: '#d9c68f', icon: 'Table' },

  // Bedroom
  { id: 'bed', name: 'Double Bed', category: 'furniture', room: 'bedroom', cost: 15, unlockRequirement: 70, w: 2, h: 2, color: '#9a8fd9', icon: 'BedDouble' },
  { id: 'nightstand', name: 'Nightstand', category: 'furniture', room: 'bedroom', cost: 6, unlockRequirement: 70, w: 1, h: 1, color: '#b5835a', icon: 'Lamp' },
  { id: 'wardrobe', name: 'Wardrobe', category: 'furniture', room: 'bedroom', cost: 12, unlockRequirement: 80, w: 1, h: 2, color: '#8a7ac9', icon: 'DoorClosed' },
  { id: 'plant-bed', name: 'Potted Plant', category: 'decor', room: 'bedroom', cost: 5, unlockRequirement: 70, w: 1, h: 1, color: '#8ba888', icon: 'Flower2' },

  // Bathroom
  { id: 'bathtub', name: 'Bathtub', category: 'furniture', room: 'bathroom', cost: 14, unlockRequirement: 110, w: 2, h: 1, color: '#8fd9cf', icon: 'Bath' },
  { id: 'sink', name: 'Sink', category: 'furniture', room: 'bathroom', cost: 7, unlockRequirement: 110, w: 1, h: 1, color: '#7fc9bf', icon: 'Droplets' },
  { id: 'toilet', name: 'Toilet', category: 'furniture', room: 'bathroom', cost: 8, unlockRequirement: 110, w: 1, h: 1, color: '#a9cfc9', icon: 'CircleDot' },

  // Study
  { id: 'desk', name: 'Desk', category: 'furniture', room: 'study', cost: 12, unlockRequirement: 180, w: 2, h: 1, color: '#b5835a', icon: 'Monitor' },
  { id: 'bookshelf', name: 'Bookshelf', category: 'furniture', room: 'study', cost: 11, unlockRequirement: 180, w: 1, h: 2, color: '#a5734a', icon: 'BookOpen' },
  { id: 'office-chair', name: 'Office Chair', category: 'furniture', room: 'study', cost: 7, unlockRequirement: 180, w: 1, h: 1, color: '#5a5f6e', icon: 'Armchair' },

  // Garden
  { id: 'tree', name: 'Tree', category: 'decor', room: 'garden', cost: 10, unlockRequirement: 260, w: 2, h: 2, color: '#6f9a6c', icon: 'TreePine' },
  { id: 'bench', name: 'Garden Bench', category: 'furniture', room: 'garden', cost: 8, unlockRequirement: 260, w: 2, h: 1, color: '#b5835a', icon: 'Armchair' },
  { id: 'flowerbed', name: 'Flower Bed', category: 'decor', room: 'garden', cost: 6, unlockRequirement: 260, w: 2, h: 1, color: '#d99a9a', icon: 'Flower2' },
  { id: 'fountain', name: 'Fountain', category: 'decor', room: 'garden', cost: 16, unlockRequirement: 300, w: 2, h: 2, color: '#8fb4d9', icon: 'Droplets' },
]

export const ALL_ITEMS: HouseItem[] = [...ROOMS, ...FURNITURE]

export function getItem(id: string): HouseItem | undefined {
  return ALL_ITEMS.find((i) => i.id === id)
}

export function getRoom(id: string): HouseItem | undefined {
  return ROOMS.find((r) => r.id === id)
}

export function furnitureForRoom(roomId: string): HouseItem[] {
  return FURNITURE.filter((f) => f.room === roomId)
}

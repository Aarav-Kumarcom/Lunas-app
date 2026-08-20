'use client'

import {
  Sofa,
  Armchair,
  Tv,
  Lamp,
  BookOpen,
  BedDouble,
  Bath,
  CookingPot,
  Utensils,
  Table,
  Refrigerator,
  DoorClosed,
  Flower2,
  Droplets,
  CircleDot,
  Monitor,
  TreePine,
  Sprout,
  Frame,
  Box,
  type LucideIcon,
} from 'lucide-react'

const MAP: Record<string, LucideIcon> = {
  Sofa,
  Armchair,
  Tv,
  Lamp,
  BookOpen,
  BedDouble,
  Bath,
  CookingPot,
  Utensils,
  Table,
  Refrigerator,
  DoorClosed,
  Flower2,
  Droplets,
  CircleDot,
  Monitor,
  TreePine,
  Sprout,
  Frame,
}

export function ItemIcon({
  name,
  className,
  size,
}: {
  name: string
  className?: string
  size?: number
}) {
  const Icon = MAP[name] ?? Box
  return <Icon className={className} size={size} aria-hidden="true" />
}

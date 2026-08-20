'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ListChecks, Home, BarChart3, Coins, Flame, Moon } from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/', label: 'Today', icon: ListChecks },
  { href: '/house', label: 'House', icon: Home },
  { href: '/stats', label: 'Stats', icon: BarChart3 },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { balance, streak } = useStore()

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Moon className="size-4" />
            </span>
            <span className="font-display text-lg font-bold leading-none tracking-tight">
              Lunars
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5"
              title="Current streak"
            >
              <Flame
                className={cn(
                  'size-4',
                  streak > 0 ? 'text-accent' : 'text-muted-foreground',
                )}
              />
              <span className="text-sm font-semibold tabular-nums">{streak}</span>
            </div>
            <div
              className="flex items-center gap-1.5 rounded-full bg-coin/20 px-3 py-1.5 ring-1 ring-coin/40"
              title="Coin balance"
            >
              <Coins className="size-4 text-coin-foreground" />
              <span className="text-sm font-bold tabular-nums text-coin-foreground">
                {balance}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 pb-28 pt-4">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-2xl items-stretch justify-around px-2 py-2">
          {NAV.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-xs font-medium transition-colors',
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex items-center justify-center rounded-full px-4 py-1 transition-colors',
                    active ? 'bg-primary/12' : 'bg-transparent',
                  )}
                >
                  <Icon className="size-5" />
                </span>
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

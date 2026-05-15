import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type CategoryTileProps = {
  icon: LucideIcon
  title: string
  items: number
  isActive?: boolean
  onClick?: () => void
  className?: string
}

export function CategoryTile({
  icon: Icon,
  title,
  items,
  isActive = false,
  onClick,
  className,
}: CategoryTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-4 text-left transition hover:border-primary/50 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive && "border-primary bg-primary/10 text-primary",
        className
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground",
          isActive && "bg-primary text-primary-foreground"
        )}
      >
        <Icon className="size-4" />
      </span>

      <div>
        <h3 className="text-2xl leading-tight font-semibold">{title}</h3>
        <p className="text-lg text-muted-foreground">{items} itens</p>
      </div>
    </button>
  )
}

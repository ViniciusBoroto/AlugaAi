import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type CategoryTileProps = {
  icon: LucideIcon
  title: string
  items: number
  index?: number
  isActive?: boolean
  onClick?: () => void
  className?: string
}

export function CategoryTile({
  icon: Icon,
  title,
  items,
  index = 0,
  isActive = false,
  onClick,
  className,
}: CategoryTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      style={{ animationDelay: `${index * 70}ms` }}
      className={cn(
        "flex min-h-0 animate-in items-center gap-4 rounded-lg border border-transparent px-3 py-3 text-left transition duration-300 fade-in slide-in-from-bottom-2 hover:bg-muted/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        isActive && "border-border bg-card text-foreground shadow-sm",
        className
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors duration-300",
          isActive && "bg-primary text-primary-foreground"
        )}
      >
        <Icon className="size-4" />
      </span>

      <div className="min-w-0">
        <h3 className="text-base leading-tight font-medium">{title}</h3>
        <p
          className={cn(
            "mt-1 text-sm text-muted-foreground",
            isActive && "text-foreground/70"
          )}
        >
          {items} itens
        </p>
      </div>
    </button>
  )
}

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
        "flex items-center gap-3 rounded-[1.6rem] border border-white/60 bg-card/85 px-4 py-4 text-left shadow-[0_14px_34px_rgba(112,70,44,0.1)] transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-white/10",
        isActive && "border-primary bg-primary text-primary-foreground",
        className
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground",
          isActive && "bg-primary-foreground text-primary"
        )}
      >
        <Icon className="size-4" />
      </span>

      <div>
        <h3 className="text-2xl leading-tight font-semibold">{title}</h3>
        <p
          className={cn(
            "text-lg text-muted-foreground",
            isActive && "text-primary-foreground/80"
          )}
        >
          {items} itens
        </p>
      </div>
    </button>
  )
}

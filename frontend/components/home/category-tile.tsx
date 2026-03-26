import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type CategoryTileProps = {
  icon: LucideIcon
  title: string
  items: number
  className?: string
}

export function CategoryTile({
  icon: Icon,
  title,
  items,
  className,
}: CategoryTileProps) {
  return (
    <article
      className={cn(
        "flex items-center gap-4 rounded-2xl border border-border bg-card px-4 py-5",
        className
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Icon className="size-5" />
      </span>

      <div>
        <h3 className="text-2xl leading-tight font-semibold">{title}</h3>
        <p className="text-lg text-muted-foreground">{items} itens</p>
      </div>
    </article>
  )
}

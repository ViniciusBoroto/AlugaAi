"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AuthRouteButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "onClick"
> & {
  href: string
}

export function AuthRouteButton({
  href,
  className,
  children,
  ...props
}: AuthRouteButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleNavigate() {
    startTransition(() => {
      router.push(href)
    })
  }

  return (
    <Button
      {...props}
      className={cn(className)}
      disabled={props.disabled || isPending}
      onClick={handleNavigate}
    >
      {children}
    </Button>
  )
}

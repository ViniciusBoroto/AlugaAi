import { cn } from "@/lib/utils"

type ImmersivePageShellProps = {
  children: React.ReactNode
  className?: string
  contentClassName?: string
}

const glowColumns = [
  "left-[4%] top-[34%] h-[54%] w-[18%] bg-[linear-gradient(180deg,rgba(88,51,181,0.06),rgba(124,58,237,0.32),rgba(192,132,252,0.5))]",
  "left-[20%] top-[18%] h-[70%] w-[16%] bg-[linear-gradient(180deg,rgba(109,40,217,0.08),rgba(109,40,217,0.34),rgba(168,85,247,0.56))]",
  "left-[32%] top-[6%] h-[84%] w-[18%] bg-[linear-gradient(180deg,rgba(91,33,182,0.1),rgba(91,33,182,0.4),rgba(139,92,246,0.62))]",
  "left-[48%] top-[10%] h-[80%] w-[18%] bg-[linear-gradient(180deg,rgba(76,29,149,0.08),rgba(91,33,182,0.36),rgba(124,58,237,0.58))]",
  "left-[65%] top-[16%] h-[74%] w-[17%] bg-[linear-gradient(180deg,rgba(91,33,182,0.06),rgba(109,40,217,0.3),rgba(147,51,234,0.5))]",
  "left-[81%] top-[36%] h-[52%] w-[14%] bg-[linear-gradient(180deg,rgba(67,56,202,0.06),rgba(91,33,182,0.24),rgba(139,92,246,0.46))]",
]

export function ImmersivePageShell({
  children,
  className,
  contentClassName,
}: ImmersivePageShellProps) {
  return (
    <main
      className={cn(
        "relative isolate min-h-svh overflow-hidden bg-[#09090f] text-white",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(76,29,149,0.42),transparent_22%),radial-gradient(circle_at_50%_76%,rgba(168,85,247,0.32),transparent_34%),linear-gradient(180deg,#0a0911_0%,#0b0a12_36%,#12101a_72%,#6d28d9_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[36%] bg-[radial-gradient(circle_at_50%_100%,rgba(192,132,252,0.4),transparent_58%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_18%,transparent_82%,rgba(255,255,255,0.02))]" />

      <div className="absolute inset-[5%] rounded-[2.5rem] border border-white/8 bg-black/12" />

      {glowColumns.map((columnClassName) => (
        <div
          key={columnClassName}
          className={cn(
            "absolute rounded-[2rem] blur-3xl md:blur-[80px]",
            columnClassName
          )}
        />
      ))}

      <div className="absolute inset-x-[8%] bottom-[-8%] h-[28%] rounded-full bg-[radial-gradient(circle,rgba(196,113,255,0.8),rgba(124,58,237,0.22)_48%,transparent_72%)] blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(8,8,12,0.92))]" />

      <div
        className={cn(
          "relative z-10 flex min-h-svh items-center justify-center px-5 py-10 md:px-8",
          contentClassName
        )}
      >
        {children}
      </div>
    </main>
  )
}

import { Plus_Jakarta_Sans, Syne } from "next/font/google"
import { Wrench } from "lucide-react"

import { LoginHeroLottie } from "@/components/login-hero-lottie"
import { cn } from "@/lib/utils"

const authDisplay = Syne({
  subsets: ["latin"],
  variable: "--font-auth-display",
})

const authBody = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-auth-body",
})

type AuthShellProps = {
  eyebrow: string
  title: string
  description: string
  heroTitle: string
  heroDescription?: string
  children: React.ReactNode
}

export function AuthShell({
  eyebrow,
  title,
  description,
  heroTitle,
  heroDescription,
  children,
}: AuthShellProps) {
  return (
    <main
      className={cn(
        authDisplay.variable,
        authBody.variable,
        "relative min-h-svh overflow-hidden bg-[#09050f] text-white"
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(150,92,255,0.18),transparent_18%),radial-gradient(circle_at_78%_22%,rgba(111,73,255,0.12),transparent_18%),radial-gradient(circle_at_60%_82%,rgba(198,140,255,0.1),transparent_20%),linear-gradient(180deg,#0a0611_0%,#12091a_40%,#171022_100%)] dark:bg-[radial-gradient(circle_at_18%_16%,rgba(174,118,255,0.2),transparent_18%),radial-gradient(circle_at_78%_22%,rgba(121,86,255,0.14),transparent_18%),radial-gradient(circle_at_60%_82%,rgba(198,140,255,0.12),transparent_20%),linear-gradient(180deg,#09050f_0%,#100817_42%,#15101e_100%)]" />
      <div className="absolute top-24 -left-12 h-56 w-56 rounded-full bg-fuchsia-500/8 blur-3xl" />
      <div className="absolute right-[-4rem] bottom-[-5rem] h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10 grid min-h-svh w-full lg:grid-cols-[1.12fr_0.88fr]">
        <section className="relative min-h-[42svh] overflow-hidden bg-[#f5f1fb] text-slate-900 dark:bg-[#f1ebfb]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(173,140,255,0.18),transparent_18%),radial-gradient(circle_at_76%_64%,rgba(129,89,255,0.14),transparent_14%),linear-gradient(180deg,#faf7ff_0%,#f1ebfb_100%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(173,140,255,0.2),transparent_18%),radial-gradient(circle_at_76%_64%,rgba(129,89,255,0.16),transparent_14%),linear-gradient(180deg,#f5f0ff_0%,#ece2fb_100%)]" />
          <div className="absolute top-0 -right-[14%] h-full w-[46%] rounded-l-[46%] bg-[linear-gradient(180deg,#251735_0%,#2d1840_100%)]" />

          <div className="absolute top-7 left-7 flex items-center gap-3 sm:top-10 sm:left-10">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#231530] text-violet-100 shadow-[0_14px_36px_rgba(58,27,90,0.22)]">
              <Wrench className="size-5" />
            </div>
            <div className="font-[var(--font-auth-display)] text-[#1e1430]">
              <p className="text-lg font-semibold tracking-[0.14em]">ALUGAAI</p>
            </div>
          </div>

          <div className="relative flex h-full min-h-[42svh] flex-col justify-between px-7 pt-28 pb-8 sm:px-10 sm:pt-32 lg:min-h-svh lg:px-14 lg:pb-12">
            <div className="max-w-xl">
              <h1 className="max-w-lg text-4xl leading-[0.95] font-[var(--font-auth-display)] font-semibold tracking-[-0.04em] text-[#1a1226] sm:text-5xl lg:text-6xl">
                {heroTitle}
              </h1>
              {heroDescription ? (
                <p className="mt-4 max-w-md text-sm leading-6 font-[var(--font-auth-body)] text-[#544a68] sm:text-base">
                  {heroDescription}
                </p>
              ) : null}
            </div>

            <div className="relative mt-6 flex flex-1 items-center justify-center pt-2 lg:pt-4">
              <div className="absolute inset-x-[10%] bottom-12 h-24 rounded-full bg-violet-400/20 blur-3xl" />
              <div className="relative aspect-square w-full max-w-[520px] sm:max-w-[620px]">
                <LoginHeroLottie />
              </div>
            </div>
          </div>
        </section>

        <section className="relative flex min-h-[58svh] items-center bg-[linear-gradient(180deg,#140d1f_0%,#100a18_100%)] px-7 py-10 sm:px-10 lg:min-h-svh lg:px-14 dark:bg-[linear-gradient(180deg,#120a1c_0%,#0f0817_100%)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(144,91,255,0.14),transparent_18%),radial-gradient(circle_at_100%_100%,rgba(93,54,201,0.12),transparent_24%)]" />
          <div className="relative mx-auto w-full max-w-md">
            <div className="mb-10">
              <p className="text-xs font-[var(--font-auth-body)] font-semibold tracking-[0.24em] text-violet-200/62 uppercase">
                {eyebrow}
              </p>
              <h2 className="mt-3 text-4xl font-[var(--font-auth-display)] font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                {title}
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-6 font-[var(--font-auth-body)] text-violet-100/66 sm:text-base">
                {description}
              </p>
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  )
}

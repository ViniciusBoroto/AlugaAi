"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import Navbar from "@/components/navbar"

export function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <main className="min-h-svh bg-background">
      <Navbar />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-border bg-card px-6 py-6 shadow-sm">
          <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
            Checkout
          </p>
          <h1 className="mt-3 text-4xl font-[var(--font-display)] font-semibold tracking-[-0.04em]">
            Escolha a melhor data para seguir com a locação.
          </h1>
          <p className="mt-1 text-muted-foreground">
            Escolha uma data para continuar.
          </p>
        </div>
        <section className="w-fit rounded-xl border border-border bg-card p-4 shadow-sm">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg border border-border bg-background"
            captionLayout="dropdown"
          />
        </section>
      </div>
    </main>
  )
}

export default CalendarDemo

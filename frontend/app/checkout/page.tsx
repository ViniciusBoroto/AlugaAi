"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import Navbar from "@/components/navbar"

export function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <main className="min-h-svh">
      <Navbar />
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
          <p className="mt-1 text-muted-foreground">
            Escolha uma data para continuar.
          </p>
        </div>
        <section className="w-fit rounded-[2rem] border border-white/60 bg-card/90 p-4 shadow-[0_18px_46px_rgba(112,70,44,0.12)] dark:border-white/10">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-[1.5rem] border bg-background/60"
            captionLayout="dropdown"
          />
        </section>
      </div>
    </main>
  )
}

export default CalendarDemo

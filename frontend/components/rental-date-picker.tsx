"use client"

import { useMemo, useState } from "react"
import { CalendarDays, CheckCircle2 } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

type RentalDatePickerProps = {
  pricePerDay: number
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
})

function formatDate(date?: Date) {
  return date ? dateFormatter.format(date) : "Selecione"
}

function getRentalDays(range?: DateRange) {
  if (!range?.from) {
    return 0
  }

  const endDate = range.to ?? range.from
  const millisecondsInDay = 1000 * 60 * 60 * 24

  return (
    Math.round((endDate.getTime() - range.from.getTime()) / millisecondsInDay) +
    1
  )
}

export function RentalDatePicker({
  pricePerDay,
}: RentalDatePickerProps) {
  const [range, setRange] = useState<DateRange | undefined>()
  const [confirmationMessage, setConfirmationMessage] = useState("")

  const today = useMemo(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }, [])

  const rentalDays = getRentalDays(range)
  const total = rentalDays * pricePerDay
  const canConfirm = Boolean(range?.from)

  function handleConfirm() {
    if (!range?.from) {
      return
    }

    const returnDate = range.to ?? range.from

    setConfirmationMessage(
      `Alugado para o periodo de ${formatDate(range.from)} ate ${formatDate(returnDate)}.`
    )
  }

  return (
    <section className="rounded-xl border border-[#FDEE44]/70 bg-zinc-900/95 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-zinc-400">Preco por dia</p>
          <p className="mt-1 text-3xl leading-none font-semibold">
            {currencyFormatter.format(pricePerDay)}
            <span className="ml-1 text-sm font-medium text-zinc-300">/dia</span>
          </p>
        </div>
        <CalendarDays className="size-5 text-[#FDEE44]" />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.8fr] lg:items-start">
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-2">
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            disabled={{ before: today }}
            numberOfMonths={1}
            weekStartsOn={0}
            captionLayout="label"
            className="dark mx-auto w-full max-w-sm bg-transparent text-zinc-100 [--cell-size:2.45rem]"
            classNames={{
              root: "w-full",
              month: "w-full",
              table: "w-full",
              caption_label: "text-sm font-semibold text-zinc-100",
              weekday: "text-xs text-zinc-500",
              today: "rounded-md bg-zinc-800 text-zinc-100",
              outside: "text-zinc-700",
              disabled: "text-zinc-700 opacity-40",
              range_start: "bg-[#FDEE44]/20",
              range_middle: "bg-[#FDEE44]/10 text-zinc-100",
              range_end: "bg-[#FDEE44]/20",
            }}
            formatters={{
              formatCaption: (date) =>
                date.toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                }),
              formatWeekdayName: (date) =>
                date
                  .toLocaleDateString("pt-BR", { weekday: "short" })
                  .replace(".", ""),
            }}
          />
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
          <h2 className="text-base font-semibold text-zinc-100">
            Periodo do aluguel
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3">
              <p className="text-xs text-zinc-500">Retirada</p>
              <p className="mt-1 text-sm font-semibold text-zinc-100">
                {formatDate(range?.from)}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3">
              <p className="text-xs text-zinc-500">Devolucao</p>
              <p className="mt-1 text-sm font-semibold text-zinc-100">
                {formatDate(range?.to ?? range?.from)}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-[#FDEE44]/25 bg-[#FDEE44]/10 p-3">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-zinc-300">
                {rentalDays || 0} {rentalDays === 1 ? "dia" : "dias"}
              </span>
              <span className="font-semibold text-zinc-100">
                {currencyFormatter.format(total)}
              </span>
            </div>
          </div>

          <Button
            size="lg"
            className="mt-4 h-11 w-full rounded-lg bg-[#FDEE44] text-sm font-semibold text-zinc-950 hover:bg-[#F6E542]"
            disabled={!canConfirm}
            onClick={handleConfirm}
          >
            <CheckCircle2 className="size-4" />
            {canConfirm ? "Alugar Agora" : "Escolha uma data"}
          </Button>

          {confirmationMessage ? (
            <div
              role="status"
              aria-live="polite"
              className="mt-3 rounded-lg border border-emerald-400/40 bg-emerald-400/10 p-3 text-sm font-medium text-emerald-200"
            >
              {confirmationMessage}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

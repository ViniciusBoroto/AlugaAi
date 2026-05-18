"use client"

import { useMemo, useState } from "react"
import { CalendarDays, CheckCircle2 } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { createRent, getRenters } from "@/lib/domain-api"
import { useAuth } from "@/hooks/use-auth"

type RentalDatePickerProps = {
  productId: string
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

function sameEmail(left: string, right: string) {
  return left.trim().toLowerCase() === right.trim().toLowerCase()
}

export function RentalDatePicker({
  productId,
  pricePerDay,
}: RentalDatePickerProps) {
  const { user } = useAuth()
  const [range, setRange] = useState<DateRange | undefined>()
  const [confirmationMessage, setConfirmationMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const today = useMemo(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }, [])

  const rentalDays = getRentalDays(range)
  const total = rentalDays * pricePerDay
  const canConfirm = Boolean(range?.from)

  async function handleConfirm() {
    if (!range?.from) {
      return
    }

    if (!user) {
      setErrorMessage("Entre como cliente para concluir o aluguel.")
      return
    }

    if (user.role !== "Renter") {
      setErrorMessage("Contas de loja nao podem alugar produtos.")
      return
    }

    const returnDate = range.to ?? range.from

    setIsSubmitting(true)
    setErrorMessage("")
    setConfirmationMessage("")

    try {
      const renters = await getRenters()
      const renter = renters.find((item) => sameEmail(item.email, user.email))

      if (!renter) {
        setErrorMessage("Perfil de cliente nao encontrado para esta conta.")
        return
      }

      await createRent({
        rentalDate: range.from.toISOString(),
        returnDate: returnDate.toISOString(),
        productId,
        renterId: renter.id,
      })

      setConfirmationMessage(
        `Alugado para o periodo de ${formatDate(range.from)} ate ${formatDate(returnDate)}.`
      )
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Nao foi possivel criar o aluguel."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="rounded-xl border bg-card p-4 text-card-foreground sm:p-5">
      <div className="flex items-start justify-between gap-3 border-b pb-4">
        <div>
          <p className="text-sm font-medium">Escolha o periodo</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {currencyFormatter.format(pricePerDay)}
            <span className="ml-1">por dia</span>
          </p>
        </div>
        <CalendarDays className="size-5 text-primary" />
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border bg-background p-2">
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          disabled={{ before: today }}
          numberOfMonths={1}
          weekStartsOn={0}
          captionLayout="label"
          className="mx-auto w-full max-w-sm bg-transparent [--cell-size:2.35rem]"
          classNames={{
            root: "w-full",
            month: "w-full",
            table: "w-full",
            caption_label: "text-sm font-semibold text-foreground",
            weekday: "text-xs text-muted-foreground",
            today: "rounded bg-muted text-foreground",
            outside: "text-muted-foreground/50",
            disabled: "text-muted-foreground/40 opacity-50",
            range_start: "rounded bg-primary/25 text-foreground",
            range_middle: "bg-primary/15 text-foreground",
            range_end: "rounded bg-primary/25 text-foreground",
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

      <div className="mt-4">
        <h2 className="text-sm font-semibold">Resumo</h2>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-lg border bg-background p-3">
            <p className="text-xs text-muted-foreground">Retirada</p>
            <p className="mt-1 text-sm font-semibold">
              {formatDate(range?.from)}
            </p>
          </div>
          <div className="rounded-lg border bg-background p-3">
            <p className="text-xs text-muted-foreground">Devolucao</p>
            <p className="mt-1 text-sm font-semibold">
              {formatDate(range?.to ?? range?.from)}
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-primary/25 bg-primary/10 p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">
              {rentalDays || 0} {rentalDays === 1 ? "dia" : "dias"}
            </span>
            <span className="text-lg font-semibold">
              {currencyFormatter.format(total)}
            </span>
          </div>
        </div>

        <Button
          size="lg"
          className="mt-3 h-11 w-full rounded-lg"
          disabled={!canConfirm || isSubmitting}
          onClick={handleConfirm}
        >
          <CheckCircle2 className="size-4" />
          {isSubmitting
            ? "Confirmando..."
            : canConfirm
              ? "Confirmar aluguel"
              : "Selecione uma data"}
        </Button>

        {errorMessage ? (
          <div
            role="alert"
            className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm font-medium text-destructive"
          >
            {errorMessage}
          </div>
        ) : null}

        {confirmationMessage ? (
          <div
            role="status"
            aria-live="polite"
            className="mt-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm font-medium text-emerald-700 dark:text-emerald-200"
          >
            {confirmationMessage}
          </div>
        ) : null}
      </div>
    </section>
  )
}

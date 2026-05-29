"use client"

import { useMemo, useState } from "react"
import { CalendarDays, CheckCircle2, Store as StoreIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { createRent } from "@/lib/domain-api"
import { useAuth } from "@/hooks/use-auth"

type RentalDatePickerProps = {
  productId: string
  pricePerDay: number
  productTitle: string
  categoryName?: string
  storeName?: string
  pickupLabel?: string
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
  productId,
  pricePerDay,
  productTitle,
  categoryName,
  storeName,
  pickupLabel,
}: RentalDatePickerProps) {
  const { user } = useAuth()
  const [range, setRange] = useState<DateRange | undefined>()
  const [confirmationMessage, setConfirmationMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const today = useMemo(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }, [])

  const rentalDays = getRentalDays(range)
  const total = rentalDays * pricePerDay
  const isStoreUser = user?.role === "Store"
  const canConfirm = Boolean(range?.from)
  const selectedReturnDate = range?.to ?? range?.from

  function handleSelect(nextRange: DateRange | undefined) {
    setRange(nextRange)
    setErrorMessage("")
    setConfirmationMessage("")
  }

  async function handleConfirm() {
    if (!range?.from) {
      return
    }

    if (!user) {
      setErrorMessage("Entre com uma conta de cliente para concluir o aluguel.")
      return
    }

    if (user.role !== "Renter") {
      setErrorMessage("Contas de loja nao podem alugar produtos.")
      return
    }

    if (!user.renterId) {
      setErrorMessage("Perfil de cliente não encontrado para esta conta.")
      return
    }

    const returnDate = range.to ?? range.from

    setIsSubmitting(true)
    setErrorMessage("")
    setConfirmationMessage("")
    setShowConfirmation(false)

    try {
      await createRent({
        rentalDate: range.from.toISOString(),
        returnDate: returnDate.toISOString(),
        productId,
        renterId: user.renterId,
      })

      setConfirmationMessage(
        `Locação confirmada para o período de ${formatDate(range.from)} até ${formatDate(returnDate)}.`
      )
      setShowConfirmation(true)
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Não foi possível criar o aluguel."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="overflow-hidden rounded-[1.6rem] border border-border/80 bg-card text-card-foreground shadow-[0_18px_42px_rgba(15,23,42,0.08)] dark:shadow-[0_20px_44px_rgba(0,0,0,0.24)]">
      <div className="border-b border-border/80 bg-[linear-gradient(180deg,rgba(124,58,237,0.08)_0%,rgba(124,58,237,0.02)_100%)] px-5 pt-5 pb-5 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Reserva
            </p>
            <h2 className="mt-2 text-[1.85rem] font-semibold tracking-[-0.04em] text-foreground">
              {currencyFormatter.format(pricePerDay)}
              <span className="ml-2 text-base font-medium text-muted-foreground">
                / dia
              </span>
            </h2>
          </div>
          <div className="rounded-2xl bg-primary/12 p-2.5 text-primary">
            <CalendarDays className="size-5" />
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-base font-semibold text-foreground">
          {productTitle}
        </p>

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {categoryName ? (
            <span className="rounded-full border border-border/80 bg-card px-3 py-1 text-muted-foreground">
              {categoryName}
            </span>
          ) : null}
          {storeName ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1 text-muted-foreground">
              <StoreIcon className="size-3.5" />
              {storeName}
            </span>
          ) : null}
        </div>

        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Selecione retirada e devolução para ver o valor total estimado antes
          de confirmar.
        </p>

        {pickupLabel ? (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Retirada em {pickupLabel}.
          </p>
        ) : null}
      </div>

      <div className="px-5 pt-5 sm:px-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Escolha o período
            </p>
            <p className="text-sm text-muted-foreground">
              Datas a partir de hoje.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.15rem] border border-border/80 bg-background p-2.5">
          <Calendar
            mode="range"
            selected={range}
            onSelect={handleSelect}
            disabled={{ before: today }}
            numberOfMonths={1}
            weekStartsOn={0}
            captionLayout="label"
            className="mx-auto w-full max-w-sm bg-transparent [--cell-size:2.45rem]"
            classNames={{
              root: "w-full",
              month: "w-full",
              table: "w-full",
              caption_label: "text-sm font-semibold text-foreground",
              weekday:
                "text-[0.72rem] font-medium uppercase tracking-[0.14em] text-muted-foreground",
              today:
                "rounded-md bg-sky-500/10 font-semibold text-sky-700 dark:text-sky-300",
              outside: "text-muted-foreground/45",
              disabled: "text-muted-foreground/30 opacity-50",
              range_start: "rounded-md bg-primary text-primary-foreground",
              range_middle: "bg-primary/12 text-foreground",
              range_end: "rounded-md bg-primary text-primary-foreground",
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
      </div>

      <div className="space-y-4 px-5 py-5 sm:px-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border/80 bg-muted/35 p-4">
            <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Retirada
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {formatDate(range?.from)}
            </p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-muted/35 p-4">
            <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Devolução
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {formatDate(selectedReturnDate)}
            </p>
          </div>
        </div>

        <div className="rounded-[1.15rem] border border-border/80 bg-card p-4">
          <div className="mb-3">
            <p className="text-sm font-semibold text-foreground">
              Resumo da locação
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 border-b border-border pb-3 text-sm">
            <span className="text-muted-foreground">Valor por dia</span>
            <span className="font-semibold text-foreground">
              {currencyFormatter.format(pricePerDay)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 border-b border-border py-3 text-sm">
            <span className="text-muted-foreground">Período</span>
            <span className="font-semibold text-foreground">
              {rentalDays > 0
                ? `${rentalDays} ${rentalDays === 1 ? "dia" : "dias"}`
                : "Selecione"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 pt-3">
            <span className="text-sm font-medium text-foreground">
              Total estimado do período
            </span>
            <span className="text-xl font-semibold tracking-[-0.02em] text-foreground">
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
            className="rounded-2xl border border-destructive/35 bg-destructive/8 p-3 text-sm font-medium text-destructive"
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

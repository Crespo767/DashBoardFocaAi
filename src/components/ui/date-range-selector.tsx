import { useState } from "react";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangeSelectorProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[260px] justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value?.from ? (
            value.to ? (
              <>
                {format(value.from, "dd/MM/yy", { locale: ptBR })} -{" "}
                {format(value.to, "dd/MM/yy", { locale: ptBR })}
              </>
            ) : (
              format(value.from, "dd/MM/yy", { locale: ptBR })
            )
          ) : (
            <span>Selecione o período</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={value?.from}
          selected={{ from: value.from, to: value.to }}
          onSelect={(range) => {
            if (range?.from && range?.to) {
              onChange({ from: range.from, to: range.to });
              setOpen(false);
            } else if (range?.from) {
              onChange({ from: range.from, to: range.from });
            }
          }}
          numberOfMonths={2}
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
}

export function getDefaultDateRange(days: number = 7): DateRange {
  return {
    from: subDays(new Date(), days),
    to: new Date(),
  };
}

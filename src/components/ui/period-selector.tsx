import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type PeriodOption = "7" | "14" | "30" | "90";

interface PeriodSelectorProps {
  value: PeriodOption;
  onChange: (value: PeriodOption) => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as PeriodOption)}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Período" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="7">7 dias</SelectItem>
        <SelectItem value="14">14 dias</SelectItem>
        <SelectItem value="30">30 dias</SelectItem>
        <SelectItem value="90">90 dias</SelectItem>
      </SelectContent>
    </Select>
  );
}

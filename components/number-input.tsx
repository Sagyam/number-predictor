"use client";

import { Input } from "@/components/ui/input";

export type NumberInputProps = {
  value: string;
  onChange: (value: number) => void;
  placeholder: string;
};

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <Input
      type="number"
      value={value}
      min={0.0}
      max={99}
      step={0.01}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const num = parseFloat(e.target.value);
        if (!isNaN(num)) {
          onChange(num);
        }
      }}
      placeholder={placeholder}
      className="w-full input-xl"
    />
  );
};

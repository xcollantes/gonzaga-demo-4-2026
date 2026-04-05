"use client";

import * as React from "react";
import Datepicker from "tailwind-datepicker-react";
import { cn } from "@/lib/utils";

export type DatePickerProps = {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
};

export function DatePicker({
  date,
  onDateChange,
  className,
  disabled = false,
  placeholder = "Pick a date",
}: DatePickerProps) {
  const [show, setShow] = React.useState(false);

  const handleChange = (selectedDate: Date) => {
    onDateChange?.(selectedDate);
  };

  const handleClose = (state: boolean) => {
    setShow(state);
  };

  const options = {
    title: "Select Date",
    autoHide: true,
    todayBtn: false,
    clearBtn: true,
    clearBtnText: "Clear",
    maxDate: new Date(),
    minDate: new Date("1900-01-01"),
    theme: {
      background: "bg-foreground",
      todayBtn: "",
      clearBtn: "",
      icons: "",
      text: "",
      disabledText: "text-gray-400",
      input: `bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
      inputIcon: "",
      selected: "",
    },
    datepickerClassNames: "top-12",
    defaultDate: date || undefined,
    language: "en",
    inputPlaceholderProp: placeholder,
  };

  return (
    <div className={cn("flex w-full", className)}>
      <Datepicker
        options={options}
        onChange={handleChange}
        show={show}
        setShow={handleClose}
      />
    </div>
  );
}